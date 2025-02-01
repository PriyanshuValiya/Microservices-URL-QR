import dotenv from "dotenv";
import express from "express";
import QRCode from "qrcode";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import supabase from "./utils/supabase.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

app.post("/generateQR", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const uid = uuidv4();
    const qrBuffer = await QRCode.toBuffer(url);

    const { data, error } = await supabase.storage
      .from("qr_codes")
      .upload(`${uid}.png`, qrBuffer, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true, 
      });

    if (error) throw error;

    const qrUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/qr_codes/${uid}.png`;

    await supabase
      .from("qr_codes")
      .insert([{ short_id: uid, qr_url: qrUrl }]);

    res.json({ qrUrl });
  } catch (error) {
    console.error("Error in /generateQR:", error);
    res.status(500).json({ error: "QR code generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`QR Code Generator Service running on http://localhost:${PORT}`);
});
