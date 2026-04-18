export default async function handler(req, res) {
  try {
    const url = "https://firebasestorage.googleapis.com/v0/b/play-integrity-2adpr7x4a8xhyex.firebasestorage.app/o/surat_penugasan_internal_M.%20Putra%20Ramadhani_162023023.pdf.pdf?alt=media&token=6821921c-b615-4b63-9b24-f895ccf67741";

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