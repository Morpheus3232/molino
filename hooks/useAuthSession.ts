"use client";

import { useState, useEffect } from "react";
import { getSession, AuthSession } from "@/lib/auth/userService";

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
  }, []);

  return { session, loading, refreshSession: () => getSession().then(setSession) };
}
