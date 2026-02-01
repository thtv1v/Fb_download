<?php
/**
 * =========================================================
 * PROXY SERVER
 * ---------------------------------------------------------
 * - Chống CORS
 * - Giả lập API / scrape
 * - Không lộ API key
 * =========================================================
 */

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$input = json_decode(file_get_contents("php://input"), true);
$url = $input["target"] ?? "";
$mode = $input["mode"] ?? "api";

if (!$url || !str_starts_with($url, "http")) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid URL"]);
  exit;
}

// delay nhẹ chống spam
usleep(300000);

// MOCK DATA (demo an toàn)
$data = [
  "title" => "Facebook Video Demo",
  "thumbnail" => "https://via.placeholder.com/480x270.png",
  "duration" => 95,
  "qualities" => [
    [
      "label" => "SD",
      "width" => 640,
      "url" => "https://example.com/video_sd.mp4"
    ],
    [
      "label" => "HD",
      "width" => 720,
      "url" => "https://example.com/video_hd.mp4"
    ],
    [
      "label" => "FullHD",
      "width" => 1080,
      "url" => "https://example.com/video_fhd.mp4"
    ]
  ]
];

echo json_encode($data);
