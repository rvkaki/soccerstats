import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenName(name: string) {
  const first = name.split(" ")[0];
  const last = name.split(" ").at(-1);
  return `${first[0]}. ${last}`;
}
