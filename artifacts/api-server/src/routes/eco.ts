import { Router, type IRouter, type Request, type Response } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const RAG_PORT = process.env.RAG_PORT || "6000";
const RAG_BASE_URL = `http://localhost:${RAG_PORT}`;

const router: IRouter = Router();

const ragProxy = createProxyMiddleware({
  target: RAG_BASE_URL,
  changeOrigin: true,
  timeout: 300000,
  proxyTimeout: 300000,
  on: {
    proxyReq: fixRequestBody,
    error: (err, req, res) => {
      const r = req as Request;
      const s = res as Response;
      r.log?.error({ err }, "RAG proxy error");
      if (!s.headersSent) {
        s.status(503).json({
          error: "EcoSentinels RAG service unavailable",
          detail: "The Python AI service is unavailable or timed out.",
        });
      }
    },
  },
});

router.use("/eco", ragProxy);

export default router;