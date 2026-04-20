export default async function handler(req, res) {
  try {
    const { link } = req.query;

    if (!link) {
      return res.status(400).send("Link tidak ada");
    }

    const response = await fetch(link);

    if (!response.ok) {
      return res.status(500).send("Gagal ambil file");
    }

    const contentType = response.headers.get("content-type") || "";

    // 🔥 FILTER HANYA PDF & JPG
    if (
      !contentType.includes("pdf") &&
      !contentType.includes("jpeg") &&
      !contentType.includes("jpg")
    ) {
      return res.status(400).send("Hanya support PDF & JPG");
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Disposition", "inline");

    res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
}
