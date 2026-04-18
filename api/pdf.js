export default async function handler(req, res) {
  try {
    const url = "https://firebasestorage.googleapis.com/v0/b/play-integrity-2adpr7x4a8xhyex.firebasestorage.app/o/227634-teknologi-dan-kehidupan-masyarakat-7686df94.pdf?alt=media&token=da984a72-0294-46bb-b1ec-257620094ac4";

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).send("Gagal ambil PDF");
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Access-Control-Allow-Origin", "*"); // 🔥 bypass CORS

    res.send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
}
