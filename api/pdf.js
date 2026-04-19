export default async function handler(req, res) {
  try {
    const raw = req.url.split("link=")[1];

    if (!raw) {
      return res.status(400).json({ error: "Link tidak ada" });
    }

    // decode URL Firebase
    const url = decodeURIComponent(raw);

    if (!url.startsWith("http")) {
      return res.status(400).json({ error: "URL tidak valid" });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Gagal fetch file",
      });
    }

    const buffer = await response.arrayBuffer();

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
