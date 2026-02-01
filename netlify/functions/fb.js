import fetch from "node-fetch";

const APIS = [
  url => `https://fdownloader.net/api/ajaxSearch?query=${url}`,
  url => `https://snapvideo.io/api/ajaxSearch?query=${url}`
];

export const handler = async (event) => {
  const url = event.queryStringParameters?.url;

  if (!url || !/^https?:\/\//i.test(url)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, message: "Link không hợp lệ" })
    };
  }

  for (const api of APIS) {
    try {
      const r = await fetch(api(encodeURIComponent(url)));
      const j = await r.json();

      if (j?.data && Array.isArray(j.medias)) {
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
