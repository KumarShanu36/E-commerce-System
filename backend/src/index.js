import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import userRoutes from "./routes/user.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FreshCart Core API</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #09090b;
                color: #f4f4f5;
                font-family: 'Outfit', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                overflow: hidden;
                position: relative;
            }
            .bg-glow {
                position: absolute;
                width: 400px;
                height: 400px;
                background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 70%);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
            }
            .container {
                text-align: center;
                z-index: 2;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(12px);
                padding: 3rem;
                border-radius: 2.5rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                max-width: 400px;
                width: 100%;
            }
            h1 {
                font-size: 2.5rem;
                font-weight: 800;
                margin: 0 0 0.5rem 0;
                letter-spacing: -0.05em;
            }
            .highlight {
                color: #10b981;
            }
            .subtitle {
                color: #a1a1aa;
                font-size: 0.95rem;
                margin-bottom: 2rem;
                font-weight: 400;
            }
            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                background: rgba(16, 185, 129, 0.08);
                color: #34d399;
                padding: 0.6rem 1.2rem;
                border-radius: 9999px;
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                border: 1px solid rgba(16, 185, 129, 0.15);
                margin-bottom: 1.5rem;
            }
            .status-dot {
                width: 8px;
                height: 8px;
                background-color: #10b981;
                border-radius: 50%;
                display: inline-block;
                box-shadow: 0 0 10px #10b981;
                animation: pulse 2s infinite;
            }
            .endpoints {
                text-align: left;
                background: rgba(0, 0, 0, 0.2);
                padding: 1.5rem;
                border-radius: 1.5rem;
                border: 1px solid rgba(255, 255, 255, 0.02);
            }
            .endpoints h3 {
                margin-top: 0;
                font-size: 0.8rem;
                text-transform: uppercase;
                color: #71717a;
                letter-spacing: 0.08em;
                margin-bottom: 1rem;
            }
            .endpoint-item {
                display: flex;
                justify-content: space-between;
                font-size: 0.85rem;
                font-family: monospace;
                padding: 0.4rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.02);
            }
            .endpoint-item:last-child {
                border-bottom: none;
            }
            .endpoint-path {
                color: #a1a1aa;
            }
            .endpoint-method {
                color: #10b981;
                font-weight: bold;
            }
            @keyframes pulse {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
        </style>
    </head>
    <body>
        <div class="bg-glow"></div>
        <div class="container">
            <div class="status-badge">
                <span class="status-dot"></span>
                Operational
            </div>
            <h1>FreshCart <span class="highlight">Core</span></h1>
            <p class="subtitle">API Services & Database Coordinator.</p>
            <div class="endpoints">
                <h3>System Gateways</h3>
                <div class="endpoint-item">
                    <span class="endpoint-path">/api/v1/health</span>
                    <span class="endpoint-method">GET</span>
                </div>
                <div class="endpoint-item">
                    <span class="endpoint-path">/api/v1/settings</span>
                    <span class="endpoint-method">GET</span>
                </div>
                <div class="endpoint-item">
                    <span class="endpoint-path">/api/v1/products</span>
                    <span class="endpoint-method">GET</span>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.use("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/settings", settingsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
