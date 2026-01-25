'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMe, logout } from '@/services/auth.service';
import { getAllPublicPosts, CommunicationPost } from '@/services/communication.service';
import { getTopVolunteersGlobal, TopVolunteer } from '@/services/statistics.service';

interface UserProfile {
  volunteerProfile?: {
    fullName: string;
  };
  beneficiaryProfile?: {
    fullName: string;
  };
}

interface User {
  id: string;
  phoneNumber: string;
  role: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<CommunicationPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [topVolunteers, setTopVolunteers] = useState<TopVolunteer[]>([]);
  const [volunteersLoading, setVolunteersLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Lấy profile từ server (cookie sẽ tự động gửi)
        const profile = await getMe();
        setUserProfile(profile);
        // Set user from profile data
        setUser({
          id: profile.id,
          phoneNumber: profile.phoneNumber,
          role: profile.role,
        });
      } catch (error) {
        console.error('Lỗi khi lấy profile:', error);
        // User not logged in, that's fine
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setPostsLoading(true);
        const response = await getAllPublicPosts({ page: 1, limit: 3 });
        setPosts(response.data || []);
      } catch (error) {
        console.error('Lỗi khi tải bài viết:', error);
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const loadTopVolunteers = async () => {
      try {
        setVolunteersLoading(true);
        const data = await getTopVolunteersGlobal(3);
        setTopVolunteers(data);
      } catch (error) {
        console.error('Lỗi khi tải top tình nguyện viên:', error);
      } finally {
        setVolunteersLoading(false);
      }
    };

    loadTopVolunteers();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const getUserDisplayName = () => {
    if (userProfile?.volunteerProfile?.fullName) {
      return userProfile.volunteerProfile.fullName;
    }
    if (userProfile?.beneficiaryProfile?.fullName) {
      return userProfile.beneficiaryProfile.fullName;
    }
    
    return user?.phoneNumber || 'Người dùng';
  };

  return (
    <div className="bg-white text-gray-800 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="page-wrapper">

        {/* BEGIN: MainHeader */}
        <header className="py-6 flex justify-between items-center">
          {/* Logo Container */}
          <div className="flex items-center space-x-2" data-purpose="logo">
            <div className="w-8 h-8 bg-brand-teal-500 rounded-lg"></div>
            <span className="text-2xl font-bold">
              Better<span className="text-brand-teal-500">US</span>
            </span>
          </div>

          {/* User Info or Login Button */}
          {loading ? (
            <div className="text-gray-500">Đang tải...</div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Xin chào, <span className="font-semibold">{getUserDisplayName()}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              className="bg-brand-teal-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-brand-teal-600 transition-colors"
              href="/login"
            >
              Đăng nhập
            </Link>
          )}
        </header>
        {/* END: MainHeader */}

        {/* BEGIN: MainContent */}
        <main className="py-12">
          
          {/* BEGIN: OverviewSection */}
          <section className="mb-16" id="overview">
            <h2 className="text-3xl font-bold mb-8">Thống kê Tổng quan</h2>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Stat Card 1 */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-left shadow-sm" data-purpose="stat-card">
                <p className="text-gray-600 mb-2">Tổng số Tình nguyện viên</p>
                <p className="text-4xl font-bold text-gray-900">1,234</p>
              </div>
              {/* Stat Card 2 */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-left shadow-sm" data-purpose="stat-card">
                <p className="text-gray-600 mb-2">Số trường hợp đang hỗ trợ</p>
                <p className="text-4xl font-bold text-gray-900">56</p>
              </div>
              {/* Stat Card 3 */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-left shadow-sm" data-purpose="stat-card">
                <p className="text-gray-600 mb-2">Sự kiện sắp tới</p>
                <p className="text-4xl font-bold text-gray-900">8</p>
              </div>
              {/* Stat Card 4 */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-left shadow-sm" data-purpose="stat-card">
                <p className="text-gray-600 mb-2">Số người đã được giúp đỡ</p>
                <p className="text-4xl font-bold text-gray-900">5,678</p>
              </div>
            </div>
          </section>
          {/* END: OverviewSection */}

          {/* BEGIN: NewsSection */}
          <section className="mb-16" id="news">
            <h2 className="text-3xl font-bold mb-8 text-[#008080]">Tin tức & Cập nhật</h2>
            {/* News Grid */}
            {postsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Đang tải bài viết...</p>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <p className="text-gray-600">Chưa có bài viết nào được đăng tải.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col" data-purpose="news-card">
                    {post.coverImage && (
                      <img
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        src={post.coverImage}
                      />
                    )}
                    {!post.coverImage && (
                      <div className="w-full h-48 bg-linear-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                        <svg className="w-16 h-16 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-6 grow flex flex-col">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 grow line-clamp-3">
                        {post.content}
                      </p>
                      {post.organization?.organizationProfiles?.organizationName && (
                        <p className="text-xs text-gray-500 mb-3 border-t-2 border-[#008080] py-2">
                          {post.organization.organizationProfiles.organizationName}
                        </p>
                      )}
                      <Link
                        className="mt-auto w-full text-center bg-[#008080] text-white text-brand-teal-600 font-semibold py-3 rounded-lg hover:bg-[#8EC7C7] hover:text-[#008080] transition-colors"
                        href={`/posts/${post.id}`}
                      >
                        Đọc thêm
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          {/* END: NewsSection */}

          {/* BEGIN: VolunteerSection */}
          <section id="volunteers">
            <h2 className="text-3xl font-bold mb-8 text-[#008080]">Vinh danh Tình nguyện viên tiêu biểu</h2>
            {/* Volunteer List Container */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {volunteersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                      <div className="absolute inset-0 w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Đang tải...</p>
                  </div>
                </div>
              ) : topVolunteers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có dữ liệu tình nguyện viên</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {topVolunteers.map((volunteer, index) => (
                    <li key={volunteer.userId} className="flex items-center justify-between py-4">
                      <div className="flex items-center space-x-4">
                        {volunteer.avatarUrl ? (
                          <img
                            alt={volunteer.fullName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            src={volunteer.avatarUrl}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-600 font-bold text-lg">
                              {volunteer.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{volunteer.fullName}</p>
                          <p className="text-sm text-gray-500">{volunteer.points} điểm</p>
                          {volunteer.organizationName && (
                            <p className="text-xs text-gray-400">{volunteer.organizationName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Lời cảm ơn</p>
                          <p className="text-sm font-semibold text-gray-700">{volunteer.totalThanks}</p>
                        </div>
                        <svg
                          className={index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-700"}
                          fill="none"
                          height="28"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="28"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                          <path d="M4 22h16"></path>
                          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                        </svg>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
          {/* END: VolunteerSection */}
        </main>
        {/* END: MainContent */}

        {/* BEGIN: MainFooter */}
        <footer className="py-12 mt-16 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-10 text-gray-600">
            {/* Phone Contact */}
            <div className="flex items-center space-x-3">
              <svg
                className="text-brand-teal-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <div>
                <p className="text-sm">Điện thoại</p>
                <a className="font-semibold hover:underline" href="tel:0123456789">
                  0123 456 789
                </a>
              </div>
            </div>
            {/* Email Contact */}
            <div className="flex items-center space-x-3">
              <svg
                className="text-brand-teal-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect height="16" rx="2" width="20" x="2" y="4"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <div>
                <p className="text-sm">Email</p>
                <a className="font-semibold hover:underline" href="mailto:support@example.com">
                  support@example.com
                </a>
              </div>
            </div>
          </div>
        </footer>
        {/* END: MainFooter */}
      </div>
    </div>
  );
}