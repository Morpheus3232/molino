/**
 * Global loading signal so the header logo's windmill can spin during real
 * processing moments (payment verification, generating the map) instead of
 * being a purely ornamental animation unrelated to actual app state.
 * Refcounted: multiple concurrent callers only stop the spin once all of
 * them are done.
 */
const EVENT = "molino-loading";
let activeCount = 0;

function dispatch(loading: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<boolean>(EVENT, { detail: loading }));
}

export function startLoading() {
  activeCount += 1;
  if (activeCount === 1) dispatch(true);
}

export function stopLoading() {
  activeCount = Math.max(0, activeCount - 1);
  if (activeCount === 0) dispatch(false);
}

export function subscribeLoading(callback: (loading: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => callback((e as CustomEvent<boolean>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
