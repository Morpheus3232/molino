"use client";

type EventType =
  | "page_view"
  | "profile_created"
  | "onboarding_completed"
  | "feature_used"
  | "ai_query"
  | "decision_made"
  | "export_profile"
  | "affinity_date_entered"
  | "affinity_result_viewed"
  | "affinity_shared"
  | "affinity_profile_cta_clicked"
  | "affinity_recommendation_clicked"
  | "affinity_save_clicked"
  | "paywall_viewed"
  | "checkout_started"
  | "payment_approved"
  | "premium_unlocked"
  | "cognitive_lift"
  | "return_visit";

interface AnalyticsEvent {
  type: EventType;
  data?: Record<string, any>;
  timestamp: string;
  userId?: string;
}

const LAST_VISIT_KEY = "molino-analytics-last-visit";
const EVENTS_STORAGE_KEY = "molino-analytics-events";
const MAX_EVENTS = 200;

class Analytics {
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.loadFromStorage();
    this.trackReturnVisit();
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.events = parsed.slice(-MAX_EVENTS);
        }
      }
    } catch {
      // Storage might be disabled, full, or blocked in private browsing
      this.events = [];
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      // Handle QuotaExceededError or restricted storage:
      // Trim to last 50 events and retry once, or silently degrade
      try {
        this.events = this.events.slice(-50);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(this.events));
      } catch {
        // Silently continue in-memory only without throwing
      }
    }
  }

  /**
   * Check if this is a return visit (second visit within 24h).
   * Tracks once per calendar day. Uses localStorage safely.
   */
  trackReturnVisit() {
    if (typeof window === "undefined") return;

    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

      if (!lastVisit) {
        localStorage.setItem(LAST_VISIT_KEY, today);
        return;
      }

      if (lastVisit !== today) {
        const daysSinceLastVisit = Math.floor(
          (new Date(today).getTime() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24)
        );
        this.track({
          type: "return_visit",
          data: {
            daysSinceLastVisit,
            previousVisit: lastVisit,
          },
        });
      }

      localStorage.setItem(LAST_VISIT_KEY, today);
    } catch {
      // Storage unavailable / private mode
    }
  }

  track(event: Omit<AnalyticsEvent, "timestamp" | "userId">) {
    try {
      const fullEvent: AnalyticsEvent = {
        ...event,
        timestamp: new Date().toISOString(),
      };

      this.events.push(fullEvent);
      if (this.events.length > MAX_EVENTS) {
        this.events = this.events.slice(-MAX_EVENTS);
      }

      this.saveToStorage();

      if (process.env.NODE_ENV !== "production") {
        // console.log("📊 Analytics:", fullEvent) — debug removed in production;
      }

      return fullEvent;
    } catch {
      // Analytics must NEVER crash any application feature
      return {
        ...event,
        timestamp: new Date().toISOString(),
      };
    }
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  getEventsByType(type: EventType): AnalyticsEvent[] {
    return this.events.filter((e) => e.type === type);
  }

  getStats() {
    const stats = {
      totalEvents: this.events.length,
      pageViews: this.getEventsByType("page_view").length,
      profileCreated: this.getEventsByType("profile_created").length,
      returnVisits: this.getEventsByType("return_visit").length,
      aiQueries: this.getEventsByType("ai_query").length,
      decisions: this.getEventsByType("decision_made").length,
      features: {} as Record<string, number>,
    };

    this.events
      .filter((e) => e.type === "feature_used")
      .forEach((e) => {
        const feature = e.data?.feature || "unknown";
        stats.features[feature] = (stats.features[feature] || 0) + 1;
      });

    return stats;
  }

  clearEvents() {
    this.events = [];
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(EVENTS_STORAGE_KEY);
      } catch {}
    }
  }

  trackPageView(page: string) {
    this.track({ type: "page_view", data: { page } });
  }

  trackProfileCreated(profile: any) {
    this.track({
      type: "profile_created",
      data: {
        hasNumerology: !!profile?.lifePath,
        hasAstrology: !!profile?.sunSign,
        hasChineseZodiac: !!profile?.chineseZodiac,
      },
    });
  }

  trackOnboardingCompleted(step: number) {
    this.track({
      type: "onboarding_completed",
      data: { totalSteps: step },
    });
  }

  trackFeatureUsed(feature: string) {
    this.track({
      type: "feature_used",
      data: { feature },
    });
  }

  trackAIQuery(query: string) {
    this.track({
      type: "ai_query",
      data: { queryLength: query?.length ?? 0 },
    });
  }

  trackDecisionMade(decision: any) {
    this.track({
      type: "decision_made",
      data: { decision },
    });
  }

  trackAffinityDateEntered(entityType: string) {
    this.track({
      type: "affinity_date_entered",
      data: { entityType },
    });
  }

  trackAffinityResultViewed(entityType: string, score: number, tier: string) {
    this.track({
      type: "affinity_result_viewed",
      data: { entityType, score, tier },
    });
  }

  trackAffinityShared(entityType: string, method: "share" | "clipboard") {
    this.track({
      type: "affinity_shared",
      data: { entityType, method },
    });
  }

  trackAffinityProfileCtaClicked(entityType: string) {
    this.track({
      type: "affinity_profile_cta_clicked",
      data: { entityType },
    });
  }

  trackAffinityRecommendationClicked(entityType: string, sourceEntity: string, targetEntity: string, position: number) {
    this.track({
      type: "affinity_recommendation_clicked",
      data: { entityType, sourceEntity, targetEntity, position },
    });
  }

  trackAffinitySaveClicked(entityType: string, entityId: string, score: number, tier: string) {
    this.track({
      type: "affinity_save_clicked",
      data: { entityType, entityId, score, tier },
    });
  }

  trackPaywallViewed(section?: string) {
    this.track({
      type: "paywall_viewed",
      data: { section },
    });
  }

  trackCheckoutStarted(
    currencyId: string,
    paymentMethod: "mercadopago" | "bitcoin" = "mercadopago",
  ) {
    this.track({
      type: "checkout_started",
      data: { currencyId, paymentMethod, amount: currencyId === "USD" ? 8 : 8100 },
    });
  }

  trackPaymentApproved(paymentId: string, paymentMethod: "mercadopago" = "mercadopago") {
    this.track({
      type: "payment_approved",
      data: { paymentId, paymentMethod },
    });
  }

  trackPremiumUnlocked() {
    this.track({
      type: "premium_unlocked",
    });
  }
}

export const analytics = new Analytics();