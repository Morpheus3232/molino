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

class Analytics {
  private events: AnalyticsEvent[] = [];
  private userId: string | null = null;

  private static readonly LAST_VISIT_KEY = "molino-analytics-last-visit";
  private static readonly RETURN_COUNTED_KEY = "molino-analytics-return-counted";

  constructor() {
    this.loadFromStorage();
    this.setUserId();
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
      aiQueries: this.getEventsByType("ai_query").length,
      decisions: this.getEventsByType("decision_made").length,
      returnVisits: this.getEventsByType("return_visit").length,
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
        lifePath: profile.lifePath,
        archetype: profile.archetype,
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

  /**
   * Registra el último instante de visita. Se llama en cada carga de la app
   * para poder comparar la próxima visita contra un "retorno".
   */
  updateLastVisit() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(Analytics.LAST_VISIT_KEY, String(Date.now()));
    } catch {
      // sin almacenamiento disponible → no trackeamos retornos
    }
  }

  /**
   * Dispara `return_visit` una sola vez por sesión de pestaña, solo si es una
   * vuelta real: el usuario ya vino antes (hay usuario + última visita) y la
   * última visita supera la ventana `periodMs` (por defecto 24 h). Nunca en el
   * primer contacto, y no en cada page view.
   */
  trackReturnVisit(periodMs = 24 * 60 * 60 * 1000): boolean {
    if (typeof window === "undefined") return false;
    try {
      if (window.sessionStorage.getItem(Analytics.RETURN_COUNTED_KEY)) return false;
      const lastRaw = window.localStorage.getItem(Analytics.LAST_VISIT_KEY);
      if (!lastRaw) return false;
      const last = Number(lastRaw);
      if (Number.isNaN(last)) return false;
      const now = Date.now();
      if (now - last < periodMs) return false;
      this.track({ type: "return_visit" });
      window.sessionStorage.setItem(Analytics.RETURN_COUNTED_KEY, "1");
      return true;
    } catch {
      return false;
    }
  }
}

export const analytics = new Analytics();