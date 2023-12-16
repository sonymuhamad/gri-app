import {
  UsersIcon,
  SquaresPlusIcon,
  ClipboardIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

type Routes = {
  href: string;
  icon: any;
  label: string;
};

export const DEFAULT_ROUTE: Routes[] = [
  {
    href: "/admin/dashboard",
    icon: SquaresPlusIcon,
    label: "Dashboard",
  },
  {
    href: "/admin/user",
    icon: UsersIcon,
    label: "User",
  },
  {
    href: "/admin/proyek",
    icon: ClipboardIcon,
    label: "Proyek",
  },
  {
    href: "/admin/report",
    icon: DocumentCheckIcon,
    label: "Laporan Harian",
  },
];
