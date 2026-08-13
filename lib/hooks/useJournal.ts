"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
    // 1. Inmediatamente cargar lo que haya en localStorage para evitar UI flash
    const local = loadFromLocalStorage();
    if (local.length > 0) {
      local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setEntries(local);
    }

    const db = await openDB();
    if (db) {
      try {
        const dbEntries = await fetchAllFromIDB(db);
        if (dbEntries.length > 0) {
          dbEntries.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setEntries(dbEntries);
          saveToLocalStorage(dbEntries);
          setLoading(false);
          return;
        } else if (local.length > 0) {
          // Si IDB está vacío pero localStorage tiene datos, migrar a IDB
          for (const item of local) {
            await putToIDB(db, item);
          }
        }
      } catch {}
    }

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

  // Export entries as JSON string
  const exportEntriesJSON = useCallback((): string => {
    return JSON.stringify(
      {
        version: "molino.journal.v1",
        exportedAt: new Date().toISOString(),
        entriesCount: entries.length,
        entries,
      },
      null,
      2
    );
  }, [entries]);

  // Import entries from JSON string
  const importEntriesJSON = useCallback(
    async (rawJSON: string): Promise<{ success: boolean; count: number; error?: string }> => {
      try {
        const parsed = JSON.parse(rawJSON);
        const importedList: JournalEntry[] = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.entries)
          ? parsed.entries
          : [];

        if (importedList.length === 0) {
          return { success: false, count: 0, error: "No se encontraron entradas válidas en el archivo." };
        }

        // Merge without duplicates by ID
        const existingIds = new Set(entries.map((e) => e.id));
        const newItems = importedList.filter((item) => item && item.id && item.content && !existingIds.has(item.id));
        const merged = [...newItems, ...entries];
        merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setEntries(merged);
        saveToLocalStorage(merged);

        const db = await openDB();
        if (db) {
          for (const item of newItems) {
            try {
              await putToIDB(db, item);
            } catch {}
          }
        }

        return { success: true, count: newItems.length };
      } catch (err: any) {
        return { success: false, count: 0, error: err?.message || "Archivo JSON inválido." };
      }
    },
    [entries]
  );

  // Storage size in KB
  const storageSizeKB = useMemo(() => {
    try {
      const json = JSON.stringify(entries);
      return (new Blob([json]).size / 1024).toFixed(1);
    } catch {
      return "0.0";
    }
  }, [entries]);

  return {
    entries,
    loading,
    storageSizeKB,
    addEntry,
    updateEntry,
    deleteEntry,
    filterEntries,
    exportEntriesJSON,
    importEntriesJSON,
    refresh: loadEntries,
  };
}
