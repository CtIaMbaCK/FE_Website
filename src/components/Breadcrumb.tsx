"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const homeHref = isAdminRoute ? "/admin/dashboard" : "/socialorg/dashboard";

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
      <Link
        href={homeHref}
        className="flex items-center hover:text-[#008080] transition-colors"
      >
        <Home className="w-[18px] h-[18px]" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[#008080] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#008080] font-bold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
