"use client";

import { useState, useEffect, useCallback } from "react";
import type { JournalEntry, JournalFilter } from "@/types/journal";

const DB_NAME = "molino_journal_db";
const DB_VERSION = 1;
const STORE_NAME = "entries";
const LOCAL_STORAGE_KEY = "molino_journal_entries";

function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      resolve(null);
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("date", "date", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function loadFromLocalStorage(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(entries: JournalEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

async function fetchAllFromIDB(db: IDBDatabase): Promise<JournalEntry[]> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

async function putToIDB(db: IDBDatabase, entry: JournalEntry): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(entry);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

async function deleteFromIDB(db: IDBDatabase, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load: tries IndexedDB first, falls back to localStorage
  const loadEntries = useCallback(async () => {
    setLoading(true);
    const db = await openDB();

    if (db) {
      try {
        const dbEntries = await fetchAllFromIDB(db);
        if (dbEntries.length > 0) {
          // Sort desc by date / createdAt
          dbEntries.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setEntries(dbEntries);
          saveToLocalStorage(dbEntries);
          setLoading(false);
          return;
        }
      } catch {}
    }

    // Fallback to localStorage
    const local = loadFromLocalStorage();
    local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setEntries(local);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Add entry
  const addEntry = useCallback(
    async (
      data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
    ): Promise<JournalEntry> => {
      const now = new Date().toISOString();
      const newEntry: JournalEntry = {
        ...data,
        id: `journal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: now,
      };

      const updated = [newEntry, ...entries];
      setEntries(updated);
      saveToLocalStorage(updated);

      const db = await openDB();
      if (db) {
        try {
          await putToIDB(db, newEntry);
        } catch (err) {
          console.warn("[Journal] Failed to persist to IndexedDB:", err);
        }
      }

      return newEntry;
    },
    [entries]
  );

  // Update entry
  const updateEntry = useCallback(
    async (id: string, updates: Partial<Omit<JournalEntry, "id" | "createdAt">>): Promise<void> => {
      const target = entries.find((e) => e.id === id);
      if (!target) return;

      const updatedEntry: JournalEntry = {
        ...target,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const updatedList = entries.map((e) => (e.id === id ? updatedEntry : e));
      setEntries(updatedList);
      saveToLocalStorage(updatedList);

      const db = await openDB();
      if (db) {
        try {
          await putToIDB(db, updatedEntry);
        } catch (err) {
          console.warn("[Journal] Failed to update in IndexedDB:", err);
        }
      }
    },
    [entries]
  );

  // Delete entry
  const deleteEntry = useCallback(
    async (id: string): Promise<void> => {
      const updatedList = entries.filter((e) => e.id !== id);
      setEntries(updatedList);
      saveToLocalStorage(updatedList);

      const db = await openDB();
      if (db) {
        try {
          await deleteFromIDB(db, id);
        } catch (err) {
          console.warn("[Journal] Failed to delete from IndexedDB:", err);
        }
      }
    },
    [entries]
  );

  // Filter helper
  const filterEntries = useCallback(
    (filter: JournalFilter): JournalEntry[] => {
      return entries.filter((entry) => {
        if (filter.mood && entry.mood !== filter.mood) return false;
        if (filter.tag && !entry.tags.includes(filter.tag)) return false;
        if (filter.startDate && entry.date < filter.startDate) return false;
        if (filter.endDate && entry.date > filter.endDate) return false;
        if (filter.searchQuery && filter.searchQuery.trim()) {
          const q = filter.searchQuery.toLowerCase().trim();
          const matchContent = entry.content.toLowerCase().includes(q);
          const matchTags = entry.tags.some((t) => t.toLowerCase().includes(q));
          const matchTheme = entry.cycleContext.dayEnergy?.theme?.toLowerCase().includes(q);
          if (!matchContent && !matchTags && !matchTheme) return false;
        }
        return true;
      });
    },
    [entries]
  );

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    filterEntries,
    refresh: loadEntries,
  };
}
