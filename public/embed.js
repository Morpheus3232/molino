/**
 * Molino Embed — async embeddable widget for third-party sites.
 *
 * Drop this single script tag on any page and it injects a styled iframe
 * pointing at https://molino.app/embed. No dependencies, no cookies, no
 * tracking: everything stays inside the iframe and is computed client-side.
 *
 * Usage:
 *   <script async src="https://molino.app/embed.js"
 *           data-molino-theme="dark" data-molino-compact="false"></script>
 *
 * Or programmatically:
 *   <div id="molino-widget" data-molino-theme="dark"></div>
 *   <script async src="https://molino.app/embed.js"></script>
 */
(function () {
  if (typeof window === "undefined") return;

  // Default config, overridable via data-* attributes on the script or a
  // target element.
  var CONFIG = {
    theme: "dark",
    compact: false,
    height: 440,
    origin: "https://molino.app",
  };

  var script = document.currentScript;
  var target = null;

  function readConfig(attrs) {
    if (!attrs) return;
    if (attrs["data-molino-theme"]) CONFIG.theme = attrs["data-molino-theme"];
    if (attrs["data-molino-compact"] === "true") CONFIG.compact = true;
    if (attrs["data-molino-height"]) {
      var h = parseInt(attrs["data-molino-height"], 10);
      if (!isNaN(h) && h > 200) CONFIG.height = h;
    }
    if (attrs["data-molino-origin"]) CONFIG.origin = attrs["data-molino-origin"];
  }

  function buildIframe() {
    var params = [];
    if (CONFIG.theme !== "dark") params.push("theme=" + encodeURIComponent(CONFIG.theme));
    if (CONFIG.compact) params.push("compact=true");
    var query = params.length ? "?" + params.join("&") : "";

    var iframe = document.createElement("iframe");
    iframe.src = CONFIG.origin + "/embed" + query;
    iframe.width = "100%";
    iframe.height = CONFIG.compact ? "320" : String(CONFIG.height);
    iframe.style.border = "none";
    iframe.style.borderRadius = "20px";
    iframe.style.overflow = "hidden";
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("title", "Molino — Calculadora de Mapa Personal");
    return iframe;
  }

  function mount() {
    if (target) {
      target.appendChild(buildIframe());
    } else if (document.getElementById("molino-widget")) {
      document.getElementById("molino-widget").appendChild(buildIframe());
    } else if (script && script.parentNode) {
      var placeholder = document.createElement("div");
      placeholder.appendChild(buildIframe());
      script.parentNode.insertBefore(placeholder, script);
    }
  }

  // Read config from the script tag if present.
  if (script) readConfig(script.attributes);
  // Also allow a placeholder element to override.
  if (document.getElementById("molino-widget")) {
    readConfig(document.getElementById("molino-widget").attributes);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();