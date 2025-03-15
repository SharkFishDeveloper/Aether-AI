"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const CleanRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());
    if (params.has("installation_id") || params.has("setup_action")) {
      params.delete("installation_id");
      params.delete("setup_action");

      router.replace(pathname + (params.toString() ? `?${params.toString()}` : ""), { scroll: false });
    }
  }, [pathname, searchParams, router]);

  return null; // This component only modifies the URL
};

export default CleanRedirect;
