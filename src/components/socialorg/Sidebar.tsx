'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 2. Import hook lấy đường dẫn

export default function Sidebar() {
  const pathname = usePathname(); // 3. Lấy đường dẫn hiện tại (ví dụ: /sosicalorg/dashboard)

  // 4. Định nghĩa danh sách menu tại đây cho gọn
  const menuItems = [
    { 
      name: 'Dashboard', 
      href: '/socialorg/dashboard', 
      icon: 'dashboard' 
    },
    { 
      name: 'Quản lý Người cần giúp đỡ', 
      href: '/socialorg/bficiary', 
      icon: 'account_child_invert' 
    },
    { 
      name: 'Quản lý Tình nguyện viên', 
      href: '/socialorg/volunteers', 
      icon: 'group' 
    },
    // { 
    //   name: 'Quản lý hoạt động', 
    //   href: '/socialorg/requests', 
    //   icon: 'volunteer_activism' 
    // },
    { 
      name: 'Khen thưởng Tình nguyện viên', 
      href: '/socialorg/appreciation', 
      icon: 'military_tech' 
    },
    { 
      name: 'Quản lý Chiến dịch - sự kiện', 
      href: '/socialorg/events', 
      icon: 'campaign' 
    },
    { 
      name: 'Quản lý Truyền thông', 
      href: '/socialorg/blogs', 
      icon: 'perm_media' 
    },
    { 
      name: 'Thống kê', 
      href: '/socialorg/analysis', 
      icon: 'bar_chart' 
    },
    // Thêm phần tử cho sidebar...
  ];

  return (
    <aside className="flex w-64 flex-col bg-white text-gray-800 border-r border-gray-200 h-screen sticky top-0">
      <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-gray-200">
        <div className="text-primary size-7">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_6_535)">
              <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd" />
            </g>
            <defs>
              <clipPath id="clip0_6_535">
                <rect fill="white" height="48" width="48" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <Link href={"/socialorg/dashboard"}>
        <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">BetterUS</h2>
        </Link>
      </div>

      <nav className="flex flex-col flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {/* 5. Dùng vòng lặp map để render menu */}
          {menuItems.map((item) => {
            // Kiểm tra xem link này có đang active không
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary text-white' // Style khi đang Active
                    : 'text-gray-500 hover:bg-primary/10 hover:text-primary' // Style khi bình thường
                }`}
              >
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>
                <p className="text-sm font-medium leading-normal">
                  {item.name}
                </p>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}