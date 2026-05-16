"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, KanbanSquare, FileText } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/opportunities", label: "Opportunities", icon: KanbanSquare },
  { href: "/quotes", label: "Quotes", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
      <Link href="/" className="mb-8">
        <h1 className="text-lg font-bold text-gray-900">DClaw Sales</h1>
        <p className="text-xs text-gray-500 mt-0.5">Sales Pipeline OS</p>
      </Link>
      <nav className="space-y-0.5 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="text-xs text-gray-400 pt-4 border-t border-gray-100">
        v1.0.0-beta
      </div>
    </aside>
  );
}
