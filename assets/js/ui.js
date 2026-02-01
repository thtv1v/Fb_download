/**
 * =========================================================
 * UI MODULE
 * ---------------------------------------------------------
 * - Render giao diện
 * - Progress bar
 * - Toast thông báo
 * - Hiển thị video + quality
 * =========================================================
 */

const UI = (() => {
  "use strict";

  /* ===================== DOM ===================== */
  const progressBox = document.getElementById("progressBox");
  const progressBar = document.getElementById("progressBar");
  const toastBox = document.getElementById("toast");
  const resultBox = document.getElementById("result");

  /* ===================== TOAST ===================== */

  function toast(msg) {
    if (!msg) {
      toastBox.style.display = "none";
      toastBox.textContent = "";
      return;
    }
    toastBox.textContent = msg;
    toastBox.style.display = "block";

    setTimeout(() => {
      toastBox.style.display = "none";
    }, 3000);
  }

  /* ===================== PROGRESS ===================== */

  function showProgress() {
    progressBox.style.display = "block";
    updateProgress(0);
  }

  function hideProgress() {
    progressBox.style.display = "none";
    updateProgress(0);
  }

  function updateProgress(percent) {
    progressBar.style.width = percent + "%";
    progressBar.textContent = percent + "%";
  }

  /* ===================== RENDER VIDEO ===================== */

  function clearResult() {
    resultBox.innerHTML = "";
  }

  function renderVideo(data) {
    clearResult();

    const title = document.createElement("h3");
    title.textContent = data.title;

    const thumb = document.createElement("img");
    thumb.src = data.thumbnail;
    thumb.className = "thumbnail";

    const duration = document.createElement("p");
    duration.textContent = "Duration: " + data.duration + "s";

    const list = document.createElement("div");
    list.className = "quality-list";

    data.qualities.forEach(q => {
      const btn = document.createElement("a");
      btn.href = q.url;
      btn.textContent = q.label + " (" + q.width + "px)";
      btn.className = "download-btn";
      btn.target = "_blank";
      list.appendChild(btn);
    });

    resultBox.appendChild(title);
    resultBox.appendChild(thumb);
    resultBox.appendChild(duration);
    resultBox.appendChild(list);
  }

  /* ===================== EXPORT ===================== */
  return {
    toast,
    showProgress,
    hideProgress,
    updateProgress,
    renderVideo
  };

})();
