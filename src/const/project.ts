import clsx from "clsx";
import { twMerge } from "tw-merge";

type ProjectRole =
  | {
      id: 1;
      name: "ADMIN";
    }
  | {
      id: 2;
      name: "USER";
    };

export const ROLE: ProjectRole[] = [
  {
    id: 1,
    name: "ADMIN",
  },
  {
    id: 2,
    name: "USER",
  },
];

export const cn = (...args: any) => {
  return twMerge(clsx(args));
};

export const USER_DATA = "gri-user-profile";
