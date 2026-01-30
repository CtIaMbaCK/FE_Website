'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPublicPosts, CommunicationPost } from '@/services/communication.service';
import { getTopVolunteersGlobal, TopVolunteer } from '@/services/statistics.service';

export default function HomePage() {
  const [posts, setPosts] = useState<CommunicationPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [topVolunteers, setTopVolunteers] = useState<TopVolunteer[]>([]);
  const [volunteersLoading, setVolunteersLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Kết nối <span className="text-teal-600">Yêu thương</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nền tảng kết nối tình nguyện viên và người cần giúp đỡ, tạo nên sự thay đổi tích cực cho cộng đồng
          </p>
        </section>

        {/* Stats Section - Minimalist */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="text-center p-6 rounded-lg bg-white border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-3xl font-bold text-teal-600 mb-2">1,234</p>
              <p className="text-sm text-gray-600">Tình nguyện viên</p>
            </div>
            {/* Stat 2 */}
            <div className="text-center p-6 rounded-lg bg-white border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-3xl font-bold text-teal-600 mb-2">56</p>
              <p className="text-sm text-gray-600">Đang hỗ trợ</p>
            </div>
            {/* Stat 3 */}
            <div className="text-center p-6 rounded-lg bg-white border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-3xl font-bold text-teal-600 mb-2">8</p>
              <p className="text-sm text-gray-600">Sự kiện</p>
            </div>
            {/* Stat 4 */}
            <div className="text-center p-6 rounded-lg bg-white border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-3xl font-bold text-teal-600 mb-2">5,678</p>
              <p className="text-sm text-gray-600">Đã giúp đỡ</p>
            </div>
          </div>
        </section>

        {/* News Section - Minimalist */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Tin tức</h2>
            
          </div>

          {postsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500">Đang tải...</p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-gray-500">Chưa có bài viết nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
                >
                  {/* Image */}
                  {post.coverImage ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={post.coverImage}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-linear-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                      <svg className="w-16 h-16 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    {post.organization?.organizationProfiles?.organizationName && (
                      <p className="text-xs text-gray-400 mb-3 border-t border-gray-100 pt-3">
                        {post.organization.organizationProfiles.organizationName}
                      </p>
                    )}
                    <Link
                      className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
                      href={`/posts/${post.id}`}
                    >
                      Đọc thêm
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Top Volunteers Section - Minimalist */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Tình nguyện viên tiêu biểu</h2>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            {volunteersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500">Đang tải...</p>
                </div>
              </div>
            ) : topVolunteers.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Chưa có dữ liệu</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {topVolunteers.map((volunteer, index) => (
                  <div key={volunteer.userId} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {index + 1}
                      </div>

                      {/* Avatar */}
                      {volunteer.avatarUrl ? (
                        <img
                          alt={volunteer.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                          src={volunteer.avatarUrl}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                          <span className="text-teal-700 font-semibold text-lg">
                            {volunteer.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Info */}
                      <div>
                        <p className="font-semibold text-gray-900">{volunteer.fullName}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{volunteer.points} điểm</span>
                          {volunteer.totalThanks > 0 && (
                            <>
                              <span>•</span>
                              <span>{volunteer.totalThanks} lời cảm ơn</span>
                            </>
                          )}
                        </div>
                        {volunteer.organizationName && (
                          <p className="text-xs text-gray-400 mt-0.5">{volunteer.organizationName}</p>
                        )}
                      </div>
                    </div>

                    {/* Trophy Icon */}
                    <svg
                      className={`w-6 h-6 ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        'text-amber-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer - Minimalist */}
        <footer className="mt-20 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a className="hover:text-teal-600 transition-colors" href="tel:0123456789">
                0123 456 789
              </a>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a className="hover:text-teal-600 transition-colors" href="mailto:support@example.com">
                support@example.com
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
