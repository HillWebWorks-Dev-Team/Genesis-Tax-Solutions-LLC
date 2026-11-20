"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingModal } from "@/components/ui/LoadingModal";

type GlobalLoadingContextValue = {
  isLoading: boolean;
  show: (label?: string) => void;
  hide: () => void;
};

const GlobalLoadingContext = createContext<GlobalLoadingContextValue | null>(
  null,
);

function isInternalHref(href: string) {
  if (!href || href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      return new URL(href).origin === window.location.origin;
    } catch {
      return false;
    }
  }
  return href.startsWith("/");
}

function sameDestination(href: string, pathname: string, search: string) {
  try {
    const url = new URL(href, window.location.origin);
    return url.pathname === pathname && url.search === search;
  } catch {
    return false;
  }
}

export function GlobalLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString()
    ? `?${searchParams.toString()}`
    : "";
  const [isLoading, setIsLoading] = useState(false);
  const [label, setLabel] = useState("Loading");

  const show = useCallback((nextLabel = "Loading") => {
    setLabel(nextLabel);
    setIsLoading(true);
  }, []);

  const hide = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }
      if (!isInternalHref(href)) return;
      if (sameDestination(href, pathname, search)) return;

      setLabel("Loading");
      setIsLoading(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, search]);

  const value = useMemo(
    () => ({ isLoading, show, hide }),
    [hide, isLoading, show],
  );

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
      {isLoading ? <LoadingModal label={label} /> : null}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error("useGlobalLoading must be used within GlobalLoadingProvider");
  }
  return context;
}
