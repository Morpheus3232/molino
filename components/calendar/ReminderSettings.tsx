"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  getReminderPreference,
  saveReminderPreference,
  clearReminderPreference,
  requestNotificationPermission,
} from "@/lib/calendar/reminder";

/**
 * Settings card for users to manage calendar reminders.
 * Shows current status and toggle to enable/disable.
 */
export default function ReminderSettings() {
  const [pref, setPref] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = getReminderPreference();
    setPref(existing);
  }, []);

  const handleToggle = async () => {
    if (!pref) return;
    setLoading(true);

    try {
      if (pref.enabled) {
        // Disable reminders
        clearReminderPreference();
        setPref(null);
      } else {
        // Enable reminders
        const permission = await requestNotificationPermission();
        if (permission === "granted") {
          saveReminderPreference(pref.birthDate, true);
          setPref({ ...pref, enabled: true });
        }
      }
    } catch (err) {
      console.error("[ReminderSettings] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!pref) return null;

  return (
    <Card padding="lg" className="border-accent/10">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {pref.enabled ? (
            <Bell className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          ) : (
            <BellOff className="w-5 h-5 text-muted mt-0.5 flex-shrink-0" />
          )}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-1">
              Reminders de día numerológico
            </h3>
            <p className="text-xs text-muted leading-snug">
              {pref.enabled
                ? "Recibirás una notificación en tu día numerológico."
                : "Los reminders están desactivados."}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant={pref.enabled ? "ghost" : "accent"}
          onClick={handleToggle}
          disabled={loading}
          className="ml-2 flex-shrink-0"
        >
          {loading ? "..." : pref.enabled ? "Desactivar" : "Activar"}
        </Button>
      </div>
    </Card>
  );
}
