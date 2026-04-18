export default async function handler(req, res) {
  try {

    let { link } = req.query;

    if (!link) {
      return res.status(400).json({ error: "Link tidak ada" });
    }

    link = decodeURIComponent(link);

    /* =========================
       🔥 AMBIL BAGIAN PENTING
    ========================= */

    // ambil setelah "/b/"
    const match = link.match(/\/b\/(.*?)\/o\/(.*?)\?/);

    if (!match) {
      return res.status(400).json({ error: "Format link tidak valid" });
    }

    const bucket = match[1]; // play-integrity-2adpr7x4a8xhyex.firebasestorage.app
    const filePath = match[2]; // surat_penugasan_internal...

    // decode nama file
    const decodedPath = decodeURIComponent(filePath);

    /* =========================
       🔥 BANGUN ULANG URL
    ========================= */

    const cleanUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(decodedPath)}?alt=media`;

    console.log("CLEAN URL:", cleanUrl);

    /* =========================
       FETCH PDF
    ========================= */

    const response = await fetch(cleanUrl);

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
