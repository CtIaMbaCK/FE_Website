import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeHeader() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 h-16 px-6 z-10">
      
      {/* LEFT: Logo + Brand */}
      <Link
        href="/"
        className="flex items-center gap-3 hover:opacity-80 transition"
      >
        {/* LOGO – giống hệt Sidebar */}
        <div className="text-primary size-7">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_6_535)">
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0_6_535">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* TEXT */}
        <h1 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">
          BetterUS
        </h1>
      </Link>

      {/* RIGHT: Button */}
      <Button asChild className="text-white">
        <Link href="/login">
          Đăng nhập
        </Link>
      </Button>

    </header>
  );
}
