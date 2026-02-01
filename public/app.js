const $ = id => document.getElementById(id);
const FB_REGEX = /facebook\.com|fb\.watch/;

const API_ENDPOINT = "/.netlify/functions/fb";

$('fetch').onclick = async () => {
  const btn = $('fetch');
  btn.disabled = true;
  btn.classList.add('loading');

  $('error').textContent = '';
  $('result').classList.add('hide');
  $('progress').style.width = '0%';
  $('progressBox').classList.add('hide');

  const url = $('url').value.trim();
  if (!FB_REGEX.test(url)) {
    showError('Link Facebook không hợp lệ');
    resetBtn();
    return;
  }

  try {
    showProgress();

    const res = await fetch(`${API_ENDPOINT}?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error("API lỗi");

    const data = await res.json();
    if (!data.success) {
      showError(data.message);
      resetBtn();
      return;
    }

    $('thumb').src = data.thumbnail;
    $('title').textContent = data.title || 'Facebook Video';
    $('duration').textContent = data.duration || '';
    $('qualities').innerHTML = '';

    data.sources.forEach(v => {
      const b = document.createElement('button');
      b.textContent = v.quality;
      b.onclick = () => download(v.url, v.quality);
      $('qualities').appendChild(b);
    });

    $('result').classList.remove('hide');
    finishProgress();
  } catch (e) {
    showError('Không kết nối được server');
  }

  resetBtn();
};

function download(url, q) {
  const a = document.createElement('a');
  a.href = url;
  a.download = `fb_${q}.mp4`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function showProgress() {
  $('progressBox').classList.remove('hide');
  let w = 10;
  const i = setInterval(() => {
    if (w >= 80) return clearInterval(i);
    w += 10;
    $('progress').style.width = w + '%';
  }, 200);
}

function finishProgress() {
  $('progress').style.width = '100%';
}

function showError(msg) {
  $('error').textContent = msg;
}

function resetBtn() {
  $('fetch').disabled = false;
  $('fetch').classList.remove('loading');
}
