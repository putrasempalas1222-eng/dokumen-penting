export default async function handler(req, res) {

  const { link } = req.query;

  // redirect ke viewer kalau dibuka di browser
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res.redirect(`/?link=${encodeURIComponent(link)}`);
  }

  try {

    if (!link) {
      return res.status(400).json({ error: "Link tidak ada" });
    }

    const url = decodeURIComponent(link);

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({
        error: "Gagal fetch file",
        status: response.status
      });
    }

    const buffer = await response.arrayBuffer();

    // 🔥 ambil content type asli
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
