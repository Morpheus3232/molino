import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { calculateCoupleCompatibility } from "@/lib/engines/coupleEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";

export type WorkerRequest =
  | {
      id: string;
      type: "CALCULATE_PROFILE";
      payload: { name: string; birthDate: string };
    }
  | {
      id: string;
      type: "CALCULATE_COUPLE";
      payload: {
        profileA: ReturnType<typeof calculateUserProfile>;
        profileB: ReturnType<typeof calculateUserProfile>;
      };
    }
  | {
      id: string;
      type: "CALCULATE_DAILY";
      payload: {
        profile: ReturnType<typeof calculateUserProfile>;
        targetDateIso?: string;
      };
    };

export type WorkerResponse = {
  id: string;
  success: boolean;
  data?: any;
  error?: string;
};

// Pure worker handler for browsers that support Web Workers
if (typeof self !== "undefined" && typeof (self as any).addEventListener === "function") {
  self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
    const { id, type, payload } = event.data;

    try {
      if (type === "CALCULATE_PROFILE") {
        const profile = calculateUserProfile(payload.name, payload.birthDate);
        self.postMessage({ id, success: true, data: profile } satisfies WorkerResponse);
      } else if (type === "CALCULATE_COUPLE") {
        const result = calculateCoupleCompatibility(payload.profileA, payload.profileB);
        self.postMessage({ id, success: true, data: result } satisfies WorkerResponse);
      } else if (type === "CALCULATE_DAILY") {
        const date = payload.targetDateIso ? new Date(payload.targetDateIso) : new Date();
        const daily = calculateDailyEnergy(payload.profile, date);
        self.postMessage({ id, success: true, data: daily } satisfies WorkerResponse);
      } else {
        self.postMessage({
          id,
          success: false,
          error: `Tipo de cálculo desconocido: ${(type as any)}`,
        } satisfies WorkerResponse);
      }
    } catch (err: any) {
      self.postMessage({
        id,
        success: false,
        error: err?.message || "Error procesando el cálculo en Web Worker",
      } satisfies WorkerResponse);
    }
  });
}
