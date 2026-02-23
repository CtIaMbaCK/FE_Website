"use client";

import Icon from "@/components/icons";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { MdSearch, MdSend, MdChatBubbleOutline, MdClose } from "react-icons/md";
import Breadcrumb from "@/components/Breadcrumb";

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
        // Kiểm tra xem conversation đã tồn tại chưa
        const existingConv = prevConvs.find((c) => c.id === message.conversationId);

        if (existingConv) {
          // Update conversation hiện có
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
        } else {
          // Conversation mới - reload danh sách để lấy đầy đủ thông tin
          loadConversations();
          return prevConvs;
        }
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
      VOLUNTEER: { text: "TNV", color: "bg-teal-500" },
      BENEFICIARY: { text: "NCGĐ", color: "bg-orange-500" },
      ORGANIZATION: { text: "TCXH", color: "bg-blue-500" },
    };
    return (
      badges[role as keyof typeof badges] || {
        text: "USER",
        color: "bg-slate-500",
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
    <div className="flex flex-col gap-6 font-sans pb-4 h-[calc(100vh-4rem)]">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center w-fit shrink-0">
        <Breadcrumb
          items={[
            { label: "Tin nhắn" },
          ]}
        />
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Conversations List */}
        <div className="w-80 md:w-96 bg-white/80 backdrop-blur-xl border border-slate-100 shadow-sm rounded-[2rem] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-100/60 bg-slate-50/30">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tin nhắn</h2>
             {unreadCount > 0 && (
               <span className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full shadow-sm">
                 {unreadCount} mới
               </span>
             )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm người dùng..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl outline-none text-sm transition-all"
            />
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            {searchTerm && (
               <button onClick={() => { setSearchTerm(""); setShowSearchResults(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-md">
                 <MdClose className="text-slate-400 w-4 h-4" />
               </button>
            )}
          </div>
        </div>

        {/* Search Results or Conversations List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {showSearchResults ? (
            // Search Results
            <>
              <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Kết quả tìm kiếm {isSearching && "(đang tìm...)"}
                </h3>
              </div>
              {searchResults.length === 0 && !isSearching ? (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm font-medium">Không tìm thấy người dùng</p>
                </div>
              ) : (
                searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleCreateConversation(user.id)}
                    className="w-full p-4 px-6 border-b border-slate-50 hover:bg-teal-50/50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-4 w-full">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-[#008080] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm group-hover:shadow transition-all">
                        {getDisplayName(user)[0]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">
                          {getDisplayName(user)}
                        </h3>
                        <span
                          className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${getRoleBadge(user.role).color} text-white`}
                        >
                          {getRoleBadge(user.role).text}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </>
          ) : (
            // Conversations List
            <>
              {conversations.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                    <MdChatBubbleOutline className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="font-medium">Chưa có cuộc hội thoại nào</p>
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
                      className={`w-full p-4 px-6 border-b border-slate-50 hover:bg-slate-50/80 transition-all text-left group ${
                        selectedConversation?.id === conv.id ? "bg-teal-50/50 border-l-4 border-l-teal-500" : "border-l-4 border-l-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600 flex items-center justify-center font-black text-xl flex-shrink-0 shadow-sm relative">
                          {getDisplayName(conv.otherUser)[0]}
                          {isUnread && (
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`truncate ${isUnread ? "font-black text-slate-900" : "font-bold text-slate-700"}`}
                            >
                              {getDisplayName(conv.otherUser)}
                            </h3>
                            <span
                              className={`text-[11px] whitespace-nowrap ml-2 shrink-0 ${isUnread ? "text-teal-600 font-bold" : "text-slate-400 font-medium"}`}
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

                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-[2px] text-[10px] font-bold uppercase tracking-wider rounded ${getRoleBadge(conv.otherUser.role).color} text-white`}
                            >
                              {getRoleBadge(conv.otherUser.role).text}
                            </span>
                          </div>

                          {conv.lastMessage && (
                            <p
                              className={`text-sm truncate pr-2 ${isUnread ? "font-bold text-slate-800" : "font-medium text-slate-500"}`}
                            >
                              {conv.lastMessage.senderId !== conv.otherUser.id ? "Bạn: " : ""}{conv.lastMessage.content}
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
      <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-xl border border-slate-100 shadow-sm rounded-[2rem] overflow-hidden relative">
        {selectedConversation ? (
          <>
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-teal-50 rounded-full opacity-50 blur-3xl pointer-events-none -z-10"></div>

            {/* Header */}
            <div className="p-4 px-8 border-b border-slate-100/60 bg-white/50 backdrop-blur flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-[#008080] text-white flex items-center justify-center font-black text-xl shadow-md">
                  {getDisplayName(selectedConversation.otherUser)[0]}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-800 tracking-tight">
                    {getDisplayName(selectedConversation.otherUser)}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md ${getRoleBadge(selectedConversation.otherUser.role).color} text-white`}
                    >
                      {getRoleBadge(selectedConversation.otherUser.role).text}
                    </span>
                    {isTyping && (
                      <span className="text-xs text-teal-600 font-bold animate-pulse">
                        đang nhập...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.map((msg, index) => {
                const isMe = msg.senderId !== selectedConversation.otherUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} group relative`}
                  >
                    <div
                      className={`max-w-[85%] lg:max-w-[70%] px-5 py-3 rounded-2xl shadow-sm relative ${
                        isMe
                          ? "bg-gradient-to-br from-[#008080] to-teal-500 text-white rounded-br-sm"
                          : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                      <div
                        className={`text-[11px] mt-1.5 font-bold flex items-center gap-1 ${isMe ? "text-teal-100/80 justify-end" : "text-slate-400"}`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input */}
            <div className="p-4 px-6 border-t border-slate-100/60 bg-white/50 backdrop-blur z-10 shrink-0">
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-teal-100 focus-within:border-teal-400 transition-all">
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
                  placeholder="Soạn tin nhắn..."
                  className="flex-1 bg-transparent px-5 py-2.5 outline-none text-slate-700 text-sm placeholder:text-slate-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="w-11 h-11 shrink-0 bg-gradient-to-br from-[#008080] to-teal-400 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                >
                  <MdSend className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/30">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6 relative group">
              {/* <div className="absolute inset-0 bg-teal-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div> */}
              <MdChatBubbleOutline className="w-12 h-12 text-teal-500 relative z-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-700 tracking-tight mb-2">Bắt đầu trò chuyện</h2>
            <p className="text-sm font-medium text-slate-500 max-w-sm">
              Nhấn vào một hội thoại từ danh sách bên trái hoặc dùng ô tìm kiếm để bắt đầu nhắn tin!
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
