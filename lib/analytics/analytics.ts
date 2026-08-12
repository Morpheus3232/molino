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

class Analytics {
  private events: AnalyticsEvent[] = [];
  private userId: string | null = null;

  constructor() {
    this.loadFromStorage();
    this.setUserId();
    this.trackReturnVisit();
  }

  private setUserId() {
    if (typeof window === "undefined") return;
    let userId = localStorage.getItem("molino-analytics-user-id");
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem("molino-analytics-user-id", userId);
    }
    this.userId = userId;
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("molino-analytics-events");
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("molino-analytics-events", JSON.stringify(this.events));
    } catch (error) {
      console.error("Error saving analytics:", error);
    }
  }

  /**
   * Check if this is a return visit (second visit within 24h).
   * Tracks once per calendar day. Uses localStorage to persist the last visit date.
   * "return_visit" = the user visited the site on a different day than their last visit.
   */
  trackReturnVisit() {
    if (typeof window === "undefined") return;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

if (!lastVisit) {
      // First visit ever — just record the date, no event
      localStorage.setItem(LAST_VISIT_KEY, today);
      return;
    }

    if (lastVisit !== today) {
      // Different day = return visit!
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

    // Always update to today
    localStorage.setItem(LAST_VISIT_KEY, today);
  }

  track(event: Omit<AnalyticsEvent, "timestamp" | "userId">) {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      userId: this.userId || undefined,
    };

    this.events.push(fullEvent);
    this.saveToStorage();
    if (process.env.NODE_ENV !== "production") {
      console.log("📊 Analytics:", fullEvent);
    }

    return fullEvent;
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
    this.saveToStorage();
  }

  trackPageView(page: string) {
    this.track({ type: "page_view", data: { page } });
  }

  trackProfileCreated(profile: any) {
    this.track({
      type: "profile_created",
      data: {
        // Datos simbólicos removidos — solo métrica de que se creó un perfil
        hasNumerology: !!profile.lifePath,
        hasAstrology: !!profile.sunSign,
        hasChineseZodiac: !!profile.chineseZodiac,
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
      data: { queryLength: query.length },
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

  trackCheckoutStarted(currencyId: string, paymentMethod: "mercadopago" | "paypal" = "mercadopago") {
    this.track({
      type: "checkout_started",
      data: { currencyId, paymentMethod, amount: currencyId === "USD" ? 8 : 8100 },
    });
  }

  trackPaymentApproved(paymentId: string, paymentMethod: "mercadopago" | "paypal" = "mercadopago") {
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