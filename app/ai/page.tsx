"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AIPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/explore");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted" role="status">Redirigiendo...</div>
    </div>
  );
}
