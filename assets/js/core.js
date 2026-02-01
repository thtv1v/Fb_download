/**
 * =========================================================
 * CORE CONTROLLER
 * ---------------------------------------------------------
 * - Validate link
 * - Điều phối API Engine
 * - Kết nối UI
 * =========================================================
 */

(function Core() {
  "use strict";

  const input = document.getElementById("videoUrl");
  const btn = document.getElementById("analyzeBtn");

  let busy = false;

  function validUrl(url) {
    if (!url) return false;
    if (!url.startsWith("http")) return false;
    if (!url.includes("facebook")) return false;
    return true;
  }

  async function handle() {
    if (busy) return;

    const url = input.value.trim();
    if (!validUrl(url)) {
      UI.toast("Link Facebook không hợp lệ");
      return;
    }

    busy = true;
    btn.disabled = true;

    UI.toast("");
    UI.showProgress();
    UI.updateProgress(20);

    try {
      const data = await ApiEngine.process(url);
      UI.updateProgress(80);
      UI.renderVideo(data);
      UI.updateProgress(100);
      UI.toast("Xong");
    } catch (e) {
      UI.toast(e);
    } finally {
      setTimeout(() => {
        UI.hideProgress();
        btn.disabled = false;
        busy = false;
      }, 300);
    }
  }

  btn.addEventListener("click", handle);

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") handle();
  });

})();
