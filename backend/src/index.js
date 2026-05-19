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
        <title>FreshCart Core Engine</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg-color: #030303;
                --card-bg: rgba(10, 10, 10, 0.7);
                --border-color: rgba(255, 255, 255, 0.08);
                --text-primary: #f4f4f5;
                --text-secondary: #a1a1aa;
                --accent: #10b981;
                --accent-glow: rgba(16, 185, 129, 0.15);
            }
            body {
                background-color: var(--bg-color);
                color: var(--text-primary);
                font-family: 'Plus Jakarta Sans', sans-serif;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                overflow-x: hidden;
                position: relative;
            }
            .bg-glow-1 {
                position: absolute;
                width: 600px;
                height: 600px;
                background: radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
                top: -10%;
                right: -10%;
                z-index: 0;
            }
            .bg-glow-2 {
                position: absolute;
                width: 600px;
                height: 600px;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 70%);
                bottom: -10%;
                left: -10%;
                z-index: 0;
            }
            .wrapper {
                max-width: 1000px;
                width: 100%;
                padding: 2rem;
                z-index: 10;
                display: grid;
                grid-template-columns: 1.2fr 1.8fr;
                gap: 2.5rem;
            }
            @media (max-width: 768px) {
                .wrapper {
                    grid-template-columns: 1fr;
                }
            }
            .panel-left {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .logo-section {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 2rem;
            }
            .logo-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, var(--accent), #6366f1);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 1.2rem;
                color: #000;
            }
            .logo-text {
                font-size: 1.5rem;
                font-weight: 800;
                letter-spacing: -0.04em;
            }
            .logo-tag {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border-color);
                padding: 0.2rem 0.5rem;
                border-radius: 6px;
                font-size: 0.7rem;
                font-weight: 700;
                color: var(--text-secondary);
            }
            h1 {
                font-size: 3rem;
                font-weight: 800;
                letter-spacing: -0.05em;
                margin: 0 0 1rem 0;
                line-height: 1.1;
            }
            h1 span {
                background: linear-gradient(120deg, var(--accent), #6366f1);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .desc {
                color: var(--text-secondary);
                font-size: 1.05rem;
                line-height: 1.6;
                margin-bottom: 2.5rem;
            }
            .tech-badges {
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
                margin-bottom: 2.5rem;
            }
            .tech-badge {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--border-color);
                padding: 0.5rem 1rem;
                border-radius: 10px;
                font-size: 0.8rem;
                font-weight: 600;
                color: var(--text-secondary);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .status-card {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            }
            .status-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .status-dot-pulse {
                width: 12px;
                height: 12px;
                background-color: var(--accent);
                border-radius: 50%;
                position: relative;
            }
            .status-dot-pulse::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: var(--accent);
                animation: pulse-ring 1.5s infinite;
            }
            .status-label {
                font-weight: 700;
                font-size: 1rem;
            }
            .status-sub {
                color: var(--text-secondary);
                font-size: 0.8rem;
                margin-top: 0.2rem;
            }
            .panel-right {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                backdrop-filter: blur(20px);
                border-radius: 32px;
                padding: 2.5rem;
                box-shadow: 0 30px 60px rgba(0,0,0,0.6);
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            .section-title {
                font-size: 1.1rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: var(--text-secondary);
                margin: 0;
            }
            .gateway-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .gateway-item {
                background: rgba(255, 255, 255, 0.01);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 1rem 1.25rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: all 0.3s;
            }
            .gateway-item:hover {
                border-color: rgba(16, 185, 129, 0.3);
                background: rgba(16, 185, 129, 0.01);
            }
            .gateway-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .method-badge {
                font-size: 0.75rem;
                font-weight: 800;
                padding: 0.25rem 0.6rem;
                border-radius: 6px;
                font-family: 'JetBrains Mono', monospace;
            }
            .method-get {
                background: rgba(16, 185, 129, 0.1);
                color: #34d399;
                border: 1px solid rgba(16, 185, 129, 0.2);
            }
            .gateway-path {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.9rem;
                color: var(--text-primary);
            }
            .test-btn {
                background: rgba(255,255,255,0.05);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                padding: 0.5rem 1rem;
                border-radius: 10px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .test-btn:hover {
                background: var(--accent);
                color: #000;
                border-color: var(--accent);
                box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
            }
            .response-section {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .console-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .console-title {
                font-size: 0.8rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: var(--text-secondary);
            }
            .console-status {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.8rem;
                font-weight: bold;
                color: var(--accent);
            }
            .console-body {
                background: #020202;
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 1.5rem;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                color: #34d399;
                min-height: 120px;
                max-height: 250px;
                overflow-y: auto;
                white-space: pre-wrap;
                box-shadow: inset 0 4px 12px rgba(0,0,0,0.5);
            }
            .console-placeholder {
                color: #52525b;
                font-style: italic;
            }
            @keyframes pulse-ring {
                0% { transform: scale(0.33); opacity: 1; }
                80%, 100% { transform: scale(2.2); opacity: 0; }
            }
        </style>
    </head>
    <body>
        <div class="bg-glow-1"></div>
        <div class="bg-glow-2"></div>
        <div class="wrapper">
            <div class="panel-left">
                <div class="logo-section">
                    <div class="logo-icon">F</div>
                    <div class="logo-text">FRESHCART</div>
                    <div class="logo-tag">CORE</div>
                </div>
                <h1>The Heart of <span>Freshness</span>.</h1>
                <p class="desc">A high-performance full-stack API engine orchestrating inventories, security authorization protocols, locations, and transaction services.</p>
                
                <div class="tech-badges">
                    <div class="tech-badge">🟢 Node.js</div>
                    <div class="tech-badge">⚡ Express</div>
                    <div class="tech-badge">🔷 Prisma ORM</div>
                    <div class="tech-badge">🍃 MongoDB</div>
                </div>

                <div class="status-card">
                    <div class="status-info">
                        <div class="status-dot-pulse"></div>
                        <div>
                            <div class="status-label">API Status</div>
                            <div class="status-sub">Operational & Accepting Queries</div>
                        </div>
                    </div>
                    <div style="font-size: 0.8rem; font-weight: bold; opacity: 0.6; font-family: monospace;">v1.0.0</div>
                </div>
            </div>

            <div class="panel-right">
                <div>
                    <h2 class="section-title">Interactive API Gateways</h2>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem; margin-bottom: 1.5rem;">Click 'Test Gateway' to execute live request and inspect database payloads.</p>
                    <div class="gateway-list">
                        <div class="gateway-item">
                            <div class="gateway-info">
                                <span class="method-badge method-get">GET</span>
                                <span class="gateway-path">/api/v1/health</span>
                            </div>
                            <button class="test-btn" onclick="testEndpoint('/api/v1/health')">Test Gateway</button>
                        </div>
                        <div class="gateway-item">
                            <div class="gateway-info">
                                <span class="method-badge method-get">GET</span>
                                <span class="gateway-path">/api/v1/settings</span>
                            </div>
                            <button class="test-btn" onclick="testEndpoint('/api/v1/settings')">Test Gateway</button>
                        </div>
                        <div class="gateway-item">
                            <div class="gateway-info">
                                <span class="method-badge method-get">GET</span>
                                <span class="gateway-path">/api/v1/products</span>
                            </div>
                            <button class="test-btn" onclick="testEndpoint('/api/v1/products')">Test Gateway</button>
                        </div>
                    </div>
                </div>

                <div class="response-section">
                    <div class="console-header">
                        <span class="console-title">Live Payload Console</span>
                        <span class="console-status" id="console-status">READY</span>
                    </div>
                    <div class="console-body" id="console-body">
                        <span class="console-placeholder">// Dynamic JSON responses will output here...</span>
                    </div>
                </div>
            </div>
        </div>

        <script>
            async function testEndpoint(path) {
                const consoleBody = document.getElementById('console-body');
                const consoleStatus = document.getElementById('console-status');
                
                consoleBody.innerHTML = '// Requesting payload from ' + path + '...';
                consoleStatus.innerHTML = 'PENDING';
                consoleStatus.style.color = '#6366f1';
                
                try {
                    const start = performance.now();
                    const res = await fetch(path);
                    const duration = Math.round(performance.now() - start);
                    
                    if (res.ok) {
                        const data = await res.json();
                        consoleBody.innerHTML = JSON.stringify(data, null, 2);
                        consoleStatus.innerHTML = '200 OK (' + duration + 'ms)';
                        consoleStatus.style.color = '#34d399';
                    } else {
                        consoleBody.innerHTML = '// Error: ' + res.status + ' ' + res.statusText;
                        consoleStatus.innerHTML = res.status + ' ERROR';
                        consoleStatus.style.color = '#f43f5e';
                    }
                } catch (err) {
                    consoleBody.innerHTML = '// Client-side Fetch Error:\\n' + err.message;
                    consoleStatus.innerHTML = 'CONNECTION REFUSED';
                    consoleStatus.style.color = '#f43f5e';
                }
            }
        </script>
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
