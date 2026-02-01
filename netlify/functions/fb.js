import fetch from "node-fetch";

const SOURCES = [
  url => `https://fdownloader.net/api/ajaxSearch?query=${url}`,
  url => `https://snapvideo.io/api/ajaxSearch?query=${url}`,
  url => `https://getfvid.com/api/ajaxSearch?query=${url}`
];

export const handler = async (event) => {
  const url = event.queryStringParameters?.url;
  if (!url) return res(false,"Thiếu link");

  for (const api of SOURCES) {
    try {
      const ctrl = new AbortController();
      setTimeout(()=>ctrl.abort(),7000);

      const r = await fetch(api(encodeURIComponent(url)),{signal:ctrl.signal});
      const j = await r.json();

      if (j?.medias?.length) {
        return ok({
          success:true,
          title:j.title,
          thumbnail:j.thumbnail,
          duration:j.duration,
          sources:j.medias.map(m=>({
            quality:m.quality,
            url:m.url
          }))
        });
      }
    } catch {}
  }

  return res(false,"Video riêng tư / FB chặn / link lỗi");
};

const ok = body => ({
  statusCode:200,
  headers:{ "Access-Control-Allow-Origin":"*" },
  body:JSON.stringify(body)
});

const res = (s,m)=>ok({success:s,message:m});      }
    } catch (e) {
      console.error("API error:", e.message);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: false,
      message: "Không lấy được video (riêng tư hoặc link lỗi)"
    })
  };
};
