import Link from 'next/link';

export default function Sidebar() {
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
        <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">BetterUS</h2>
      </div>

      <nav className="flex flex-col flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {/* Active Link Example */}
          <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white" href="/">
            <span className="material-symbols-outlined">dashboard</span>
            <p className="text-sm font-medium leading-normal">Dashboard</p>
          </Link>
          
          <Link className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors duration-200" href="/needy">
            <span className="material-symbols-outlined">support_agent</span>
            <p className="text-sm font-medium leading-normal">Quản lý Người cần giúp đỡ</p>
          </Link>

          <Link className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors duration-200" href="/volunteers">
            <span className="material-symbols-outlined">group</span>
            <p className="text-sm font-medium leading-normal">Quản lý Tình nguyện viên</p>
          </Link>
          
          {/* Các link khác tương tự... */}
        </div>
      </nav>
    </aside>
  );
}