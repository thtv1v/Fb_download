/**
 * =========================================================
 * API ENGINE
 * ---------------------------------------------------------
 * - Gộp API + scrape
 * - Fallback tự động
 * - Chuẩn hoá dữ liệu
 * =========================================================
 */

const ApiEngine = (() => {
  "use strict";

  const PROXY = "/server/proxy.php";
  const MAX_WIDTH = 1028;

  async function request(url, mode) {
    const res = await fetch(PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: url, mode })
    });

    if (!res.ok) throw "Proxy lỗi";
    return res.json();
  }

  async function requestByApi(url) {
    return request(url, "api");
  }

  async function requestByScrape(url) {
    return request(url, "scrape");
  }

  async function fallbackAuto(url) {
    try {
      return await requestByApi(url);
    } catch {
      return await requestByScrape(url);
    }
  }

  function parseVideoData(raw) {
    return {
      title: raw.title || "Unknown",
      thumbnail: raw.thumbnail || "",
      duration: raw.duration || 0,
      qualities: raw.qualities || []
    };
  }

  function filterResolution(data) {
    data.qualities = data.qualities.filter(q => q.width < MAX_WIDTH);
    return data;
  }

  function validate(data) {
    if (!data.qualities.length) {
      throw "Không có quality phù hợp (<1028px)";
    }
  }

  async function process(url) {
    const raw = await fallbackAuto(url);
    let data = parseVideoData(raw);
    data = filterResolution(data);
    validate(data);
    return data;
  }

  return { process };

})();
