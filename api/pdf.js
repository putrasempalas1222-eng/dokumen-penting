export default async function handler(req, res) {
  try {
    const { link } = req.query;

    if (!link) {
      return res.status(400).json({ error: "Link tidak ada" });
    }

    // 🔥 decode sekali saja
    const url = decodeURIComponent(link);

    // 🔥 validasi url
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

    // 🔥 ambil tipe file
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");

    // 🔥 penting untuk PDF / image agar bisa dibuka inline
    res.setHeader("Content-Disposition", "inline");

    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}
