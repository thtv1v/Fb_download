import fetch from "node-fetch";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

const APIS = [
  url => `https://fdownloader.net/api/ajaxSearch?query=${url}`,
  url => `https://snapvideo.io/api/ajaxSearch?query=${url}`
];

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  const url = event.queryStringParameters?.url;
  if (!url) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: false, message: "Thiếu link" })
    };
  }

  for (const api of APIS) {
    try {
      const r = await fetch(api(encodeURIComponent(url)), {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      const j = await r.json();

      if (j?.medias?.length) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            title: j.title || "",
            thumbnail: j.thumbnail || "",
            sources: j.medias.filter(m => m.url).map(m => ({
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
    headers,
    body: JSON.stringify({ success: false, message: "API lỗi / link riêng tư" })
  };
};
