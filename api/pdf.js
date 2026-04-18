export default async function handler(req, res) {
  try {

    let { link } = req.query;

    if (!link) {
      return res.status(400).json({ error: "Link tidak ada" });
    }

    link = decodeURIComponent(link);

    let bucket, filePath;

    /* =========================
       🔥 FORMAT 1 (FULL URL)
    ========================= */
    if (link.includes("/v0/b/")) {

      const match = link.match(/\/b\/(.*?)\/o\/(.*?)\?/);

      if (!match) {
        return res.status(400).json({ error: "Format link Firebase tidak valid" });
      }

      bucket = match[1];
      filePath = decodeURIComponent(match[2]);

    }

    /* =========================
       🔥 FORMAT 2 (SHORT LINK)
    ========================= */
    else if (link.includes(".firebasestorage.app/o/")) {

      const match = link.match(/^(.*?)\/o\/(.*)$/);

      if (!match) {
        return res.status(400).json({ error: "Format short link tidak valid" });
      }

      bucket = match[1];
      filePath = decodeURIComponent(match[2]);

    }

    else {
      return res.status(400).json({ error: "Format link tidak dikenali" });
    }

    /* =========================
       🔥 BUILD URL FINAL
    ========================= */
    const finalUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filePath)}?alt=media`;

    console.log("FINAL URL:", finalUrl);

    /* =========================
       FETCH PDF
    ========================= */
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
