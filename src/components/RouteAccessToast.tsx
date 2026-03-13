"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function RouteAccessToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const shownRef = useRef<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    const key = `${pathname}?${searchParams.toString()}`;

    if (error === "forbidden-role" && shownRef.current !== key) {
      shownRef.current = key;
      toast.error("Access denied: only admin can access dashboard pages.");

      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname);
    }
  }, [pathname, router, searchParams]);

  return null;
}
