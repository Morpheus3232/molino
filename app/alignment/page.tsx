"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/ui/LoadingState";

export default function AlignmentPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile");
  }, [router]);

  return <LoadingState message="Redirigiendo..." fullScreen />;
}
