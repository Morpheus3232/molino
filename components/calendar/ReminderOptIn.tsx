"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  saveReminderPreference,
  getReminderPreference,
  requestNotificationPermission,
  clearReminderPreference,
} from "@/lib/calendar/reminder";

interface ReminderOptInProps {
  birthDate?: string;
  onDismiss?: () => void;
}

/**
 * Lightweight reminder opt-in banner.
 * Shows if: notifications available, not yet opted in, and user has a birth date.
 * Uses localStorage for preference persistence.
 */
export default function ReminderOptIn({ birthDate, onDismiss }: ReminderOptInProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show if: notifications supported, not already opted in, and have birth date
    if (!("Notification" in window) || !birthDate) {
      setVisible(false);
      return;
    }

    const existing = getReminderPreference();
    if (existing) {
      setVisible(false);
      return;
    }

    setVisible(true);
  }, [birthDate]);

  const handleOptIn = async () => {
    if (!birthDate) return;
    setLoading(true);

    try {
      const permission = await requestNotificationPermission();
      if (permission === "granted") {
        saveReminderPreference(birthDate, true);
        setVisible(false);
        if (onDismiss) onDismiss();
      }
    } catch (err) {
      console.error("[ReminderOptIn] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    // Save preference as disabled so we don't show this again
    if (birthDate) {
      saveReminderPreference(birthDate, false);
    }
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card border border-accent/20 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground mb-1">
              Recordatorio de tu día numerológico
            </h3>
            <p className="text-xs text-muted leading-snug">
              Recibí una notificación cuando sea tu día numerológico (sin cuenta, sin datos guardados).
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-muted hover:text-foreground transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant="accent"
            onClick={handleOptIn}
            disabled={loading}
            className="text-xs"
          >
            {loading ? "Activando..." : "Activar"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="text-xs"
          >
            Ahora no
          </Button>
        </div>
      </div>
    </div>
  );
}
