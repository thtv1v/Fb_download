const $ = i => document.getElementById(i);
const API = "/.netlify/functions/fb";

$('fetch').onclick = async () => {
  const btn = $('fetch');
  btn.classList.add('loading');
  btn.disabled = true;

  $('toast').textContent = '';
  $('result').classList.add('hide');
  $('progressBox').classList.remove('hide');
  $('progress').style.width = '10%';

  const url = $('url').value.trim();
  if (!url) return fail("Chưa nhập link");

  try {
    fakeProgress();

    const r = await fetch(`${API}?url=${encodeURIComponent(url)}`);
    const j = await r.json();

    if (!j.success) return fail(j.message);

    $('thumb').src = j.thumbnail;
    $('title').textContent = j.title;
    $('duration').textContent = j.duration || '';

    $('qualities').innerHTML = '';
    j.sources.forEach(v => {
      const b = document.createElement('button');
      b.textContent = v.quality;
      b.onclick = () => location.href = v.url;
      $('qualities').appendChild(b);
    });

    $('progress').style.width = '100%';
    $('result').classList.remove('hide');
  } catch {
    fail("Không kết nối được server");
  }

  btn.classList.remove('loading');
  btn.disabled = false;
};

function fakeProgress(){
  let p = 10;
  const i = setInterval(()=>{
    if(p>=85) return clearInterval(i);
    p+=10;
    $('progress').style.width = p+'%';
  },200);
}

function fail(msg){
  $('toast').textContent = msg;
  $('progressBox').classList.add('hide');
  $('fetch').classList.remove('loading');
  $('fetch').disabled = false;
}    $('title').textContent = data.title || 'Facebook Video';
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
