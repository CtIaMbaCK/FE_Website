"use client";

import Icon from "@/components/icons";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://frettiest-ariella-unnationally.ngrok-free.dev/api/v1";
const WS_BASE_URL = API_BASE_URL.replace("/api/v1", "");

interface UserProfile {
  fullName?: string;
  organizationName?: string;
  avatarUrl?: string;
}

interface OtherUser {
  id: string;
  role: string;
  profile?: UserProfile;
}

interface SearchUser {
  id: string;
  role: string;
  profile?: UserProfile;
}

interface LastMessage {
  content: string;
  createdAt: string;
  isRead: boolean;
  senderId: string;
}

interface Conversation {
  id: string;
  otherUser: OtherUser;
  lastMessage?: LastMessage;
  lastMessageAt?: string;
  createdAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Connect socket
    const socket = io(`${WS_BASE_URL}/chat`, {
      auth: { token },
      transports: ["websocket", "polling"], // Fallback to polling nếu WS fail
      extraHeaders: {
        "ngrok-skip-browser-warning": "true",
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socket.on("new_message", (message: Message) => {
      console.log("📩 New message:", message);

      // Nếu message thuộc conversation đang mở
      if (
        selectedConversation &&
        message.conversationId === selectedConversation.id
      ) {
        setMessages((prev) => [...prev, message]);
        // Mark as read
        socket.emit("mark_conversation_read", {
          conversationId: message.conversationId,
        });
      }

      // Update conversation list real-time
      setConversations((prevConvs) => {
        return prevConvs.map((conv) => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: {
                content: message.content,
                createdAt: message.createdAt,
                isRead: message.isRead,
                senderId: message.senderId,
              },
              lastMessageAt: message.createdAt,
            };
          }
          return conv;
        }).sort((a, b) => {
          // Sort theo thời gian mới nhất
          const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return timeB - timeA;
        });
      });

      loadUnreadCount();
    });

    socket.on("message_sent", (message: Message) => {
      console.log("✅ Message sent:", message);
      // Update temp message với message thật
      setMessages((prev) =>
        prev.map((msg) => (msg.id === "temp" ? message : msg)),
      );

      // Update conversation list với tin nhắn mới gửi
      setConversations((prevConvs) => {
        return prevConvs.map((conv) => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: {
                content: message.content,
                createdAt: message.createdAt,
                isRead: message.isRead,
                senderId: message.senderId,
              },
              lastMessageAt: message.createdAt,
            };
          }
          return conv;
        }).sort((a, b) => {
          // Sort theo thời gian mới nhất
          const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return timeB - timeA;
        });
      });
    });

    socket.on(
      "user_typing",
      (data: { conversationId: string; userId: string; isTyping: boolean }) => {
        if (
          selectedConversation &&
          data.conversationId === selectedConversation.id
        ) {
          setIsTyping(data.isTyping);
        }
      },
    );

    socket.on("error", (data: { message: string }) => {
      console.error("Socket error:", data.message);
      alert(data.message);
    });

    socketRef.current = socket;

    // Load initial data
    loadConversations();
    loadUnreadCount();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Load conversations
  const loadConversations = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Load conversations error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/chat/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Load unread count error:", error);
    }
  };

  // Load messages
  const loadMessages = async (conversationId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/chat/messages?conversationId=${conversationId}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data);

        // Mark as read
        socketRef.current?.emit("mark_conversation_read", {
          conversationId,
        });

        loadUnreadCount();
      }
    } catch (error) {
      console.error("Load messages error:", error);
    }
  };

  // Select conversation
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);
    loadMessages(conversation.id);
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const content = messageInput.trim();
    setMessageInput("");

    // Optimistic update
    const tempMessage: Message = {
      id: "temp",
      conversationId: selectedConversation.id,
      senderId: "me",
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    // Send via socket
    socketRef.current?.emit("send_message", {
      conversationId: selectedConversation.id,
      content,
    });

    // Stop typing
    socketRef.current?.emit("typing", {
      conversationId: selectedConversation.id,
      isTyping: false,
    });
  };

  // Handle typing
  const handleTyping = () => {
    if (!selectedConversation) return;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing = true
    socketRef.current?.emit("typing", {
      conversationId: selectedConversation.id,
      isTyping: true,
    });

    // Set timeout to send typing = false
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", {
        conversationId: selectedConversation.id,
        isTyping: false,
      });
    }, 2000);
  };

  // Get display name
  const getDisplayName = (user: OtherUser | undefined) => {
    if (!user) return "User";
    if (user.role === "VOLUNTEER" || user.role === "BENEFICIARY") {
      return user.profile?.fullName || "User";
    } else if (user.role === "ORGANIZATION") {
      return user.profile?.organizationName || "Tổ chức";
    }
    return "User";
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    const badges = {
      VOLUNTEER: { text: "TNV", color: "bg-green-500" },
      BENEFICIARY: { text: "NCGĐ", color: "bg-orange-500" },
      ORGANIZATION: { text: "TCXH", color: "bg-blue-500" },
    };
    return (
      badges[role as keyof typeof badges] || {
        text: "USER",
        color: "bg-gray-500",
      }
    );
  };

  // Search users
  const handleSearch = async (term: string) => {
    setSearchTerm(term);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!term.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `${API_BASE_URL}/chat/search-users?q=${encodeURIComponent(term)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          // Sort theo role: ADMIN → ORGANIZATION → VOLUNTEER → BENEFICIARY
          const roleOrder = { ADMIN: 1, ORGANIZATION: 2, VOLUNTEER: 3, BENEFICIARY: 4 };
          const sortedData = data.sort((a: SearchUser, b: SearchUser) => {
            return (roleOrder[a.role as keyof typeof roleOrder] || 99) -
                   (roleOrder[b.role as keyof typeof roleOrder] || 99);
          });
          setSearchResults(sortedData);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  // Create conversation with searched user
  const handleCreateConversation = async (userId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ targetUserId: userId }),
      });

      if (response.ok) {
        const conversation = await response.json();

        // Clear search
        setSearchTerm("");
        setSearchResults([]);
        setShowSearchResults(false);

        // Reload conversations and select the new one
        await loadConversations();
        handleSelectConversation(conversation);
      }
    } catch (error) {
      console.error("Create conversation error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-50">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 ">
          <h2 className="text-xl font-bold text-gray-800">Tin nhắn</h2>
          {unreadCount > 0 && (
            <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
              {unreadCount} chưa đọc
            </span>
          )}

          {/* Search Box */}
          <div className="mt-3 relative ">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm người dùng..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {/* <Icon icon='search'/> */}
          </div>
        </div>

        {/* Search Results or Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {showSearchResults ? (
            // Search Results
            <>
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">
                  Kết quả tìm kiếm {isSearching && "(đang tìm...)"}
                </h3>
              </div>
              {searchResults.length === 0 && !isSearching ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-sm">Không tìm thấy người dùng</p>
                </div>
              ) : (
                searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleCreateConversation(user.id)}
                    className="w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {getDisplayName(user)[0]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {getDisplayName(user)}
                        </h3>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${getRoleBadge(user.role).color} text-white`}
                        >
                          {getRoleBadge(user.role).text}
                        </span>
                      </div>

                      {/* Arrow */}
                      <svg
                        className="w-5 h-5 text-gray-400 mt-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                ))
              )}
            </>
          ) : (
            // Conversations List
            <>
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>Chưa có cuộc hội thoại nào</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  // Tin nhắn chưa đọc từ người khác (không phải admin gửi)
                  const isUnread =
                    conv.lastMessage &&
                    !conv.lastMessage.isRead &&
                    conv.lastMessage.senderId === conv.otherUser.id;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition text-left ${
                        selectedConversation?.id === conv.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                          {getDisplayName(conv.otherUser)[0]}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`font-semibold truncate ${isUnread ? "font-bold" : ""}`}
                            >
                              {getDisplayName(conv.otherUser)}
                            </h3>
                            <span
                              className={`text-xs ${isUnread ? "text-primary font-bold" : "text-gray-500"}`}
                            >
                              {conv.lastMessageAt
                                ? new Date(
                                    conv.lastMessageAt,
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 text-xs rounded ${getRoleBadge(conv.otherUser.role).color} text-white`}
                            >
                              {getRoleBadge(conv.otherUser.role).text}
                            </span>
                            {isUnread && (
                              <span className="w-2 h-2 bg-primary rounded-full"></span>
                            )}
                          </div>

                          {conv.lastMessage && (
                            <p
                              className={`text-sm truncate mt-1 ${isUnread ? "font-semibold text-gray-900" : "text-gray-600"}`}
                            >
                              {conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {getDisplayName(selectedConversation.otherUser)[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {getDisplayName(selectedConversation.otherUser)}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${getRoleBadge(selectedConversation.otherUser.role).color} text-white`}
                  >
                    {getRoleBadge(selectedConversation.otherUser.role).text}
                  </span>
                  {isTyping && (
                    <span className="ml-2 text-sm text-gray-500 italic">
                      đang nhập...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isMe = msg.senderId !== selectedConversation.otherUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl ${
                        isMe
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-600"}`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Gửi
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg">Chọn một cuộc hội thoại để bắt đầu chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
