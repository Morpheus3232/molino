"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/ui/LoadingState";

export default function PortalPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/explore");
  }, [router]);

  return <LoadingState message="Redirigiendo..." fullScreen />;
}
