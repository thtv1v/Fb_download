const $ = id => document.getElementById(id);
const FB_REGEX = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\//i;

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

$('fetch').onclick = async () => {
  const url = $('url').value.trim();
  $('error').textContent = '';

  if (!FB_REGEX.test(url)) {
    $('error').textContent = 'Link Facebook không hợp lệ';
    $('url').classList.add('shake');
    setTimeout(() => $('url').classList.remove('shake'), 300);
    return;
  }

  $('fetch').disabled = true;
  $('overlay').classList.remove('hide');
  $('progressBox').classList.add('hide');
  $('result').classList.add('hide');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`/api/fb?url=${encodeURIComponent(url)}`, {
      signal: controller.signal
    });
    const data = await res.json();

    if (!data.success) {
      $('error').textContent = data.message;
      return;
    }

    $('thumb').src = data.thumbnail;
    $('title').textContent = data.title || 'Facebook Video';
    $('duration').textContent = data.duration || '';
    $('qualities').innerHTML = '';

    data.sources.forEach(v => {
      const b = document.createElement('button');
      b.textContent = `Tải ${v.quality}`;
      b.onclick = () => download(v.url, v.quality);
      $('qualities').appendChild(b);
    });

    $('result').classList.remove('hide');
    $('result').classList.add('fade-up');
    toast('✔ Lấy video thành công');
  } catch (e) {
    $('error').textContent =
      e.name === 'AbortError'
        ? '⏳ Kết nối quá lâu'
        : '⚠️ Lỗi mạng';
  } finally {
    clearTimeout(timeout);
    $('fetch').disabled = false;
    $('overlay').classList.add('hide');
  }
};

function download(url, q) {
  $('progressBox').classList.remove('hide');
  $('progress').style.width = '30%';

  const a = document.createElement('a');
  a.href = url;
  a.download = `fb_${q}.mp4`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => $('progress').style.width = '100%', 400);
  toast(`⬇ Đang tải ${q}`);
      }    if (xhr.status === 200) {
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
