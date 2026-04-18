export default async function handler(req, res) {
  try {
    // ambil parameter link
    const { link } = req.query;

    // fallback kalau tidak ada link → pakai default
    const defaultUrl = "";

    const url = link ? decodeURIComponent(link) : defaultUrl;

    // 🔒 VALIDASI (opsional tapi disarankan)
    if (!url.includes("firebasestorage.googleapis.com")) {
      return res.status(403).json({
        error: "Hanya link Firebase yang diizinkan"
      });
    }

    // fetch PDF dari Firebase
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({
        error: "Gagal mengambil PDF",
        status: response.status
      });
    }

    // ambil data sebagai buffer
    const buffer = await response.arrayBuffer();

    // header penting
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Access-Control-Allow-Origin", "*"); // bypass CORS
    res.setHeader("Cache-Control", "public, max-age=86400"); // cache 1 hari

    // kirim ke client
    res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
