import express from "express";
import httpProxy from "express-http-proxy";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(
  "/tinyurl",
  httpProxy("http://localhost:3001", {
    proxyReqPathResolver: (req) => "/tinyurl",
    proxyReqBodyDecorator: (body, req) => {
      return JSON.stringify(body);
    },
    proxyReqOptDecorator: (options, req) => {
      options.headers["Content-Type"] = "application/json";
      return options;
    },
    userResDecorator: async (proxyRes, proxyResData, req, res) => {
      return proxyResData;
    },
  })
);

app.use(
  "/generateQR",
  httpProxy("http://localhost:3002", {
    proxyReqPathResolver: (req) => "/generateQR",
    proxyReqBodyDecorator: (body, req) => {
      return JSON.stringify(body);
    },
    proxyReqOptDecorator: (options, req) => {
      options.headers["Content-Type"] = "application/json";
      return options;
    },
    userResDecorator: async (proxyRes, proxyResData, req, res) => {
      return proxyResData;
    },
  })
);

app.get("/", (req, res) => {
  res.json({ message: "API Gateway is running!" });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
