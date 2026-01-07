import React from 'react';
import Image from 'next/image'; // Khuyên dùng component Image của Next.js

export default function HomePage() {
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
          {/* Login Button */}
          <a
            className="bg-brand-teal-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-brand-teal-600 transition-colors"
            href="#"
          >
            Đăng nhập
          </a>
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
            <h2 className="text-3xl font-bold mb-8">Tin tức & Cập nhật</h2>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* News Card 1 */}
              <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col" data-purpose="news-card">
                <img
                  alt="Community cleanup event"
                  className="w-full h-48 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9WvQb48aj-hY99IRnWHu0iojjpUdXIxLg0oMXFegkW9MOLwXnj-aVc65L5xpFiNNslcSmtVAc94K-qnoTMG5sKlDbp3_EOtEJt92Vbe8md_VgZYM70VCo4b56EiS4qsX7kqWql0nxKJVb9ToSxzBGXOC7QnQ3HlxUZMyJZAxqwjooyALbB0XFt94THmFzqJM47Bg7mlrB8QTEYuMo9bmeQSqpqc4lYxZHjcRNjyDoL92687iJ0eQtRaQHk0Go49DvzRQ7zhx_MlgN"
                />
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-2">Chiến dịch Dọn dẹp Cộng đồng thành công</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    Tóm tắt ngắn gọn về chiến dịch dọn dẹp cộng đồng thành công được tổ chức vào cuối tuần trước.
                  </p>
                  <a
                    className="mt-auto w-full text-center bg-brand-teal-50 text-brand-teal-600 font-semibold py-3 rounded-lg hover:bg-teal-100 transition-colors"
                    href="#"
                  >
                    Đọc thêm
                  </a>
                </div>
              </article>
              {/* News Card 2 */}
              <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col" data-purpose="news-card">
                <img
                  alt="Charity Gala"
                  className="w-full h-48 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA-9DrkzjZpUrVAGI3TZ6F6ZYrRJrQHV6b3GkNxPjAjLubbKnpO-N492AYU-UDcJQYtIg5fUpaCRuPStsWXiuLpEPTGp1Y3W7UJZ1SQt1PkW6YC6eqtc6RtAM62JyNBwwgpVGwYfIRgEL4z1mub3PBTpeADtMrOGOfTMBdo70DPnNZi3vczfhxAOw-bU6ZBPzr7ZQlqGgjpnt-T5c-BdP4wyQr4gJ5k-EpdTg1fdSpeuRPb8yjje9wAGallfoOPgpYVH6KccHXZdF4"
                />
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-2">Thông báo Dạ tiệc Từ thiện Thường niên</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    Chi tiết về dạ tiệc từ thiện thường niên sắp tới nhằm gây quỹ cho các sáng kiến mới của chúng tôi.
                  </p>
                  <a
                    className="mt-auto w-full text-center bg-brand-teal-50 text-brand-teal-600 font-semibold py-3 rounded-lg hover:bg-teal-100 transition-colors"
                    href="#"
                  >
                    Đọc thêm
                  </a>
                </div>
              </article>
              {/* News Card 3 */}
              <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col" data-purpose="news-card">
                <img
                  alt="Handshake partnership"
                  className="w-full h-48 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDht--DYZmcIwldLZdNWeIkAsWuiXa6fZA5TCYSa4ovgNVzwE7fsgcVE4cAyXH8UzeOExUUPBB0SBZpDWva7pxYNWRG5k_fD1wxNcfOrqKVhFYPnRpQ9kJ9j2QQr_2T1AQYHQjv1vA6oFYB_CP8QJSvN1Gb--IOBc_6AqYDGBoOS1alfV2eBvEZWA7hmMW_sNliCG2N77k94Ld8SG39O63BsOx287BuINuZoAT64-cn3dUo99XO14iR4yDQ78Tslyhq7oVH5zGEgDq5"
                />
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-2">Hợp tác mới với các Mái ấm Địa phương</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    Chúng tôi rất vui mừng thông báo về mối quan hệ đối tác mới sẽ mở rộng phạm vi và tác động của chúng tôi.
                  </p>
                  <a
                    className="mt-auto w-full text-center bg-brand-teal-50 text-brand-teal-600 font-semibold py-3 rounded-lg hover:bg-teal-100 transition-colors"
                    href="#"
                  >
                    Đọc thêm
                  </a>
                </div>
              </article>
            </div>
          </section>
          {/* END: NewsSection */}

          {/* BEGIN: VolunteerSection */}
          <section id="volunteers">
            <h2 className="text-3xl font-bold mb-8">Vinh danh Tình nguyện viên tiêu biểu</h2>
            {/* Volunteer List Container */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <ul className="divide-y divide-gray-200">
                {/* Volunteer Item 1 */}
                <li className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHokO0H2M6i1PL6kcE2cHbD5OiYjtmIKmHIvNK-0FLBEAIz6gPy2jeJqjxgllWipgdIrizH_7XwDiDgUXma9C4152LHg9CiLo7ygT6CpWJR_75sAb9_Y_Vg_z3V39TTOMIh-P5c7BaGi246NB5aKXtmVAfggsfZPPKcn_-0TytI2eJy0vBZjguqH33RvbdENSPIMj1mEbFPRkFRLxtKdrsbnwRRHBCImXuHAGI64Ab3CgS-DZQIa_Gw2XHQW5QfuhE0wL0yNEqmtcP"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Nguyễn Thị An</p>
                      <p className="text-sm text-gray-500">120 giờ đóng góp</p>
                    </div>
                  </div>
                  <svg
                    className="text-yellow-500"
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
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                </li>
                {/* Volunteer Item 2 */}
                <li className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCghwwkF7GPzsBO0Wno82HG7aHOxlyvmUPwp6tyuogeMMuQR9AQUrwaTVr29aMHdRWQNIG--L4L4HKhS68mYyZK2wN-5TLaAsTtlP8ekGrT0yPaMgjYEQsasDOjilgXCReey3wZqK0HGWuZOQvipbPrjtkdI1M2j-d-oCX2Q7hnsBmY6OfAPf8ld8asEp44Yogx8d8jOhTvl_0-652YudyBhfg1NpdbgCTfvECUeEyN5db2DKgnot2pdMvMNiM146jWLmWSEnm8Pz5X"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Trần Văn Bình</p>
                      <p className="text-sm text-gray-500">95 giờ đóng góp</p>
                    </div>
                  </div>
                  <svg
                    className="text-gray-400"
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
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                </li>
                {/* Volunteer Item 3 */}
                <li className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5PYYeUJM17ycL4sAJTYVP2jt1WSm9aEHVuajpUOcHdjrOwLlKL6VOit7W8b9b9GNweNBic1C8d9Nd3z8MyecQ080Xu8eVkRbsp3JGE21giqFdvyHxgh8AIy-4w94vv06ezDqsovmEdYnjKvTSLVtWWiQv6oUHPA0MyHoXEbEuApvdY97mxe-XkHSTvlwCNcftpMf1qBhrAmjCUufDhykMxrJ6KGrah497XqUc5fCZ-IBPy68RkpdaWxQir2mMbIqKlARga5c1j0Ee"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Lê Minh Châu</p>
                      <p className="text-sm text-gray-500">88 giờ đóng góp</p>
                    </div>
                  </div>
                  <svg
                    className="text-amber-700"
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
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                </li>
              </ul>
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