"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { UserProfile } from "@/types/user";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { calculateCoupleCompatibility, type CoupleCompatibilityResult } from "@/lib/engines/coupleEngine";
import { calculateDailyEnergy, type DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import type { WorkerRequest, WorkerResponse } from "@/lib/workers/calculationWorker";

export function useAsyncCalculation() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<string, { resolve: (data: any) => void; reject: (err: any) => void }>>(new Map());

  // Initialize Worker on mount if supported
  useEffect(() => {
    const pending = pendingRequests.current;
    if (typeof window !== "undefined" && typeof Worker !== "undefined") {
      try {
        const worker = new Worker(new URL("../workers/calculationWorker.ts", import.meta.url), {
          type: "module",
        });

        worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
          const { id, success, data, error: workerErr } = event.data;
          const request = pending.get(id);
          if (request) {
            pending.delete(id);
            if (pending.size === 0) {
              setIsCalculating(false);
            }
            if (success) {
              request.resolve(data);
            } else {
              setError(workerErr || "Error en el cálculo");
              request.reject(new Error(workerErr || "Error en cálculo"));
            }
          }
        };

        worker.onerror = (err) => {
          console.warn("[CalculationWorker] Worker error fallback:", err);
          pending.forEach(({ reject }) => reject(err));
          pending.clear();
          setIsCalculating(false);
        };

        workerRef.current = worker;
      } catch {
        workerRef.current = null;
      }
    }

    return () => {
      const worker = workerRef.current;
      if (worker) {
        worker.terminate();
        workerRef.current = null;
      }
      pending.clear();
    };
  }, []);

  const dispatchToWorkerOrSync = useCallback(
    <T>(
      request: Omit<WorkerRequest, "id">,
      syncFallback: () => T
    ): Promise<T> => {
      setIsCalculating(true);
      setError(null);

      const id = `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      if (workerRef.current) {
        return new Promise<T>((resolve, reject) => {
          pendingRequests.current.set(id, { resolve, reject });
          try {
            workerRef.current!.postMessage({ id, ...request } as WorkerRequest);
          } catch {
            pendingRequests.current.delete(id);
            if (pendingRequests.current.size === 0) setIsCalculating(false);
            try {
              const res = syncFallback();
              resolve(res);
            } catch (fallbackErr: any) {
              setError(fallbackErr?.message || "Error en cálculo");
              reject(fallbackErr);
            }
          }
        });
      }

      // Synchronous fallback (SSR, Vitest, unsupported environments)
      return new Promise<T>((resolve, reject) => {
        try {
          if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            (window as any).requestIdleCallback(() => {
              try {
                const res = syncFallback();
                setIsCalculating(false);
                resolve(res);
              } catch (err: any) {
                setIsCalculating(false);
                setError(err?.message || "Error al calcular");
                reject(err);
              }
            });
          } else {
            setTimeout(() => {
              try {
                const res = syncFallback();
                setIsCalculating(false);
                resolve(res);
              } catch (err: any) {
                setIsCalculating(false);
                setError(err?.message || "Error al calcular");
                reject(err);
              }
            }, 0);
          }
        } catch (err: any) {
          setIsCalculating(false);
          setError(err?.message || "Error al calcular");
          reject(err);
        }
      });
    },
    []
  );

  const calculateProfileAsync = useCallback(
    async (name: string, birthDate: string): Promise<UserProfile> => {
      return dispatchToWorkerOrSync<UserProfile>(
        { type: "CALCULATE_PROFILE", payload: { name, birthDate } },
        () => calculateUserProfile(name, birthDate)
      );
    },
    [dispatchToWorkerOrSync]
  );

  const calculateCoupleAsync = useCallback(
    async (profileA: UserProfile, profileB: UserProfile): Promise<CoupleCompatibilityResult> => {
      return dispatchToWorkerOrSync<CoupleCompatibilityResult>(
        { type: "CALCULATE_COUPLE", payload: { profileA, profileB } },
        () => calculateCoupleCompatibility(profileA, profileB)
      );
    },
    [dispatchToWorkerOrSync]
  );

  const calculateDailyAsync = useCallback(
    async (profile: UserProfile, targetDate = new Date()): Promise<DailyEnergyResult> => {
      return dispatchToWorkerOrSync<DailyEnergyResult>(
        { type: "CALCULATE_DAILY", payload: { profile, targetDateIso: targetDate.toISOString() } },
        () => calculateDailyEnergy(profile, targetDate)
      );
    },
    [dispatchToWorkerOrSync]
  );

  return {
    isCalculating,
    error,
    calculateProfileAsync,
    calculateCoupleAsync,
    calculateCoupleCompatibilityAsync: calculateCoupleAsync,
    calculateDailyAsync,
  };
}
