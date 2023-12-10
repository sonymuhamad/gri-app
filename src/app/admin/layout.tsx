import { ReactNode } from "react";
import type { Metadata } from "next";

import SideBar from "@/app/admin/_components/sidebar";
export const metadata: Metadata = {
  title: "GRI Admin",
  description: "GRI Admin Site",
};
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex"}>
      <SideBar />
      <main className={"ml-72 mt-6 w-full mr-16"}>{children}</main>
    </div>
  );
}
