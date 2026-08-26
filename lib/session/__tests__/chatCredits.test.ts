import { describe, it, expect, beforeEach } from "vitest";
import {
  getChatCredits,
  spendChatCredit,
  addChatCredits,
  resetChatCredits,
  INITIAL_PREMIUM_QUESTIONS,
  RELOAD_PACK_QUESTIONS,
  LOW_CREDITS_THRESHOLD,
} from "../chatCredits";

describe("chatCredits", () => {
  const birthDate = "1990-05-15";
  const name = "Sofia";

  beforeEach(() => {
    localStorage.clear();
  });

  it("returns initial 50 questions for a fresh profile", () => {
    const status = getChatCredits(birthDate, name);
    expect(status.total).toBe(INITIAL_PREMIUM_QUESTIONS);
    expect(status.used).toBe(0);
    expect(status.remaining).toBe(50);
    expect(status.isLow).toBe(false);
    expect(status.isExhausted).toBe(false);
  });

  it("decrements remaining credits when spendChatCredit is called", () => {
    const result1 = spendChatCredit(birthDate, name);
    expect(result1.success).toBe(true);
    expect(result1.status.used).toBe(1);
    expect(result1.status.remaining).toBe(49);

    const result2 = spendChatCredit(birthDate, name);
    expect(result2.success).toBe(true);
    expect(result2.status.used).toBe(2);
    expect(result2.status.remaining).toBe(48);
  });

  it("identifies low credits when remaining < LOW_CREDITS_THRESHOLD", () => {
    // Set state where 47 questions have been used (3 remaining)
    for (let i = 0; i < 47; i++) {
      spendChatCredit(birthDate, name);
    }
    const status = getChatCredits(birthDate, name);
    expect(status.remaining).toBe(3);
    expect(status.isLow).toBe(true);
    expect(status.isExhausted).toBe(false);
  });

  it("blocks usage when exhausted and returns failure", () => {
    for (let i = 0; i < INITIAL_PREMIUM_QUESTIONS; i++) {
      spendChatCredit(birthDate, name);
    }
    const status = getChatCredits(birthDate, name);
    expect(status.remaining).toBe(0);
    expect(status.isLow).toBe(false);
    expect(status.isExhausted).toBe(true);

    const failResult = spendChatCredit(birthDate, name);
    expect(failResult.success).toBe(false);
    expect(failResult.status.remaining).toBe(0);
    expect(failResult.status.isExhausted).toBe(true);
  });

  it("adds reload credits correctly (+28 questions)", () => {
    // Exhaust first
    for (let i = 0; i < INITIAL_PREMIUM_QUESTIONS; i++) {
      spendChatCredit(birthDate, name);
    }
    expect(getChatCredits(birthDate, name).remaining).toBe(0);

    const reloadStatus = addChatCredits(birthDate, name, RELOAD_PACK_QUESTIONS);
    expect(reloadStatus.total).toBe(50 + 28);
    expect(reloadStatus.used).toBe(50);
    expect(reloadStatus.remaining).toBe(28);
    expect(reloadStatus.isExhausted).toBe(false);
    expect(reloadStatus.lastReloadedAt).toBeDefined();

    // Now we can use credits again
    const useAfterReload = spendChatCredit(birthDate, name);
    expect(useAfterReload.success).toBe(true);
    expect(useAfterReload.status.remaining).toBe(27);
  });

  it("resets credits correctly", () => {
    spendChatCredit(birthDate, name);
    expect(getChatCredits(birthDate, name).used).toBe(1);
    resetChatCredits(birthDate, name);
    expect(getChatCredits(birthDate, name).used).toBe(0);
  });
});

