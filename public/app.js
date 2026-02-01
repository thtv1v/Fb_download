const api = "/.netlify/functions/function";

document.getElementById("fetch").onclick = async () => {
  const url = document.getElementById("url").value.trim();
  if (!url) return alert("Nhập link");

  const r = await fetch(`${api}?url=${encodeURIComponent(url)}`);
  const j = await r.json();

  if (!j.success) return alert(j.message);

  const div = document.getElementById("result");
  div.innerHTML = "";

  j.sources.forEach(s => {
    const b = document.createElement("button");
    b.innerText = "Tải " + s.quality;
    b.onclick = () => downloadWithProgress(s.url);
    div.appendChild(b);
  });
};

function downloadWithProgress(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";

  xhr.onprogress = e => {
    if (e.lengthComputable) {
      const p = Math.floor((e.loaded / e.total) * 100);
      document.getElementById("progress").style.width = p + "%";
      document.getElementById("progressText").innerText = p + "%";
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(xhr.response);
      a.download = "video.mp4";
      a.click();
      document.getElementById("progressText").innerText = "Hoàn thành";
    }
  };

  xhr.onerror = () => {
    document.getElementById("progressText").innerText = "Lỗi tải";
  };

  xhr.send();
}
function download(url, q) {
  $('progressBox').classList.remove('hide');
  const a = document.createElement('a');
  a.href = url;
  a.download = `fb_${q}.mp4`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => $('progress').style.width = '100%', 500);
      }
