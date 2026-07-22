"use client";

type EventType =
  | "page_view"
  | "profile_created"
  | "onboarding_completed"
  | "feature_used"
  | "ai_query"
  | "decision_made"
  | "export_profile";

interface AnalyticsEvent {
  type: EventType;
  data?: Record<string, any>;
  timestamp: string;
  userId?: string;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private userId: string | null = null;

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
    console.log("📊 Analytics:", fullEvent);
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
        lifePathNumber: profile.lifePathNumber,
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
}

export const analytics = new Analytics();
