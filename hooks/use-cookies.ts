"use client";

export function useCookies() {
  const get = (name: string) => {
    if (typeof window === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const set = (
    name: string,
    value: string,
    options: { days?: number; path?: string } = {}
  ) => {
    if (typeof window === "undefined") return;

    const { days = 7, path = "/" } = options;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=${path}; SameSite=Lax${
      window.location.protocol === "https:" ? "; Secure" : ""
    }`;
  };

  const remove = (name: string, path = "/") => {
    if (typeof window === "undefined") return;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax${
      window.location.protocol === "https:" ? "; Secure" : ""
    }`;
  };

  return { get, set, remove };
}
