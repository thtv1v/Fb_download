import fetch from "node-fetch";

const APIS = [
  url => `https://fdownloader.net/api/ajaxSearch?query=${url}`,
  url => `https://snapvideo.io/api/ajaxSearch?query=${url}`
];

export const handler = async (event) => {
  const url = event.queryStringParameters?.url;

  if (!url) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, message: "Thiếu link" })
    };
  }

  for (const api of APIS) {
    try {
      const r = await fetch(api(encodeURIComponent(url)));
      const j = await r.json();

      if (j?.data) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            title: j.title,
            thumbnail: j.thumbnail,
            duration: j.duration,
            sources: j.medias.map(m => ({
              quality: m.quality,
              url: m.url
            }))
          })
        };
      }
    } catch {}
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: false, message: "Video riêng tư hoặc link lỗi" })
  };
};
