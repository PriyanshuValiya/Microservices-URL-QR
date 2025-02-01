import express from "express";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import cors from "cors";
import supabase from "./utils/supabase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.post("/tinyurl", async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: "URL is required" });

    const shortId = nanoid(6);

    const { data, error } = await supabase.from("urls_table").insert([
      {
        owner: "PriyanshuValiya",
        org_url: longUrl,
        short_url: shortId,
      },
    ]);

    if (error) throw error;

    res.json({ shortUrl: `http://localhost:${PORT}/${shortId}` });
  } catch (error) {
    console.error("Error in /tinyurl:", error);
    res.status(500).json({ error: error.message });
  }
});

// app.get("/:tinyId", async (req, res) => {
//   try {
//     const { tinyId } = req.params;

//     const { data, error } = await supabase
//       .from("urls_table")
//       .select("org_url")
//       .eq("short_url", tinyId)
//       .single();

//     if (error || !data) return res.status(404).json({ message: "Short URL not found" });

//     res.redirect(data.org_url);
//   } catch (error) {
//     console.error("Error in /:tinyId redirect:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

app.listen(PORT, () => {
  console.log(`URL Shortener Service running on http://localhost:${PORT}`);
});
