"use client";
import { usePathname } from "next/navigation";
import { DEFAULT_ROUTE } from "@/const/route";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import React from "react";
import Link from "next/link";
import { cn } from "@/const/project";

import { Logout } from "@/action/auth";

export default function SideBar() {
  const pathname = usePathname();
  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {DEFAULT_ROUTE.map(({ href, icon: Icon, label }, index) => {
            return (
              <li key={`${href}-${index}`}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 group",
                    pathname.includes(href) && "bg-gray-200 hover:bg-gray-200"
                  )}
                >
                  <Icon className={"h-5 w-5"} />
                  <span className="ms-3">{label}</span>
                </Link>
              </li>
            );
          })}
          <li
            onClick={async () => await Logout()}
            className="fixed bottom-10 cursor-pointer w-full space-x-3 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 group"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
