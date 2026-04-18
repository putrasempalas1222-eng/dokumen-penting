export default async function handler(req, res) {

  const { link } = req.query;

  // 🔥 REDIRECT KE VIEWER JIKA DIBUKA DI BROWSER
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res.redirect(`/?link=${encodeURIComponent(link)}`);
  }

  try {

    if (!link) {
      return res.status(400).json({ error: "Link tidak ada" });
    }

    let decoded = decodeURIComponent(link);

    let bucket, filePath;

    /* =========================
       FORMAT SHORT
       contoh:
       play-integrity...app/o/file.pdf
    ========================= */
    if (decoded.includes(".firebasestorage.app/o/")) {

      const match = decoded.match(/^(.*?)\/o\/(.*)$/);

      if (!match) {
        return res.status(400).json({ error: "Format short link tidak valid" });
      }

      bucket = match[1];
      filePath = match[2];
    }

    /* =========================
       FORMAT FULL FIREBASE
    ========================= */
    else if (decoded.includes("/v0/b/")) {

      const match = decoded.match(/\/b\/(.*?)\/o\/(.*?)\?/);

      if (!match) {
        return res.status(400).json({ error: "Format Firebase tidak valid" });
      }

      bucket = match[1];
      filePath = decodeURIComponent(match[2]);
    }

    else {
      return res.status(400).json({ error: "Format link tidak dikenali" });
    }

    /* =========================
       BUILD URL FINAL
    ========================= */
    const finalUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filePath)}?alt=media`;

    const response = await fetch(finalUrl);

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
