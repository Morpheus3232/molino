"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/lib/auth/userService";

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-card-border hover:bg-foreground/5 transition-colors"
      >
        <span className="text-sm font-medium text-foreground">{user.name}</span>
        <span className="text-lg">👤</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-72 bg-card rounded-2xl shadow-xl border border-card-border p-4 z-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
              <span className="text-2xl">👤</span>
            </div>

            {user.birthDate && (
              <p className="text-sm text-muted mt-2">📅 {user.birthDate}</p>
            )}

            <div className="mt-3 pt-3 border-t border-card-border">
              <p className="text-xs text-muted">Comparaciones guardadas: {user.savedComparisons.length}</p>
              <p className="text-xs text-muted">Favoritos: {user.savedEntities.length}</p>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="mt-3 w-full py-2 text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
