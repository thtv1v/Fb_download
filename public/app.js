const $ = id => document.getElementById(id);

const FB_REGEX = /facebook\.com|fb\.watch/;

$('fetch').onclick = async () => {
  $('error').textContent = '';
  $('result').classList.add('hide');

  const url = $('url').value.trim();
  if (!FB_REGEX.test(url)) {
    $('error').textContent = 'Link Facebook không hợp lệ';
    return;
  }

  const res = await fetch(`/api/fb?url=${encodeURIComponent(url)}`);
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
    b.textContent = v.quality;
    b.onclick = () => download(v.url, v.quality);
    $('qualities').appendChild(b);
  });

  $('result').classList.remove('hide');
};

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
