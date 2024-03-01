import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MantineProvider, createTheme } from "@mantine/core";
const inter = Inter({ subsets: ["latin"] });
import { Notifications } from "@mantine/notifications";

import "../styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

export const metadata: Metadata = {
  title: "GRI Monitor Application",
  description: "GRI APP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
