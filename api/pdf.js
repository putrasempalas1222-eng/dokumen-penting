export default async function handler(req, res) {

  const { link } = req.query;

  // 🔥 REDIRECT KE VIEWER
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res.redirect(`/?link=${encodeURIComponent(link)}`);
  }

  try {

    if (!link) {
      return res.status(400).json({ error: "Link tidak ada" });
    }

    const url = decodeURIComponent(link);

    // 🔒 optional: validasi hanya firebase
    if (!url.includes("firebasestorage.googleapis.com")) {
      return res.status(403).json({ error: "Hanya Firebase diizinkan" });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({
        error: "Gagal fetch PDF",
        status: response.status
      });
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
