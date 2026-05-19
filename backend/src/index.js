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
        <title>FreshCart Engine | Portfolio & API Gateways</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg-color: #050507;
                --card-bg: rgba(15, 15, 20, 0.6);
                --border-color: rgba(255, 255, 255, 0.05);
                --text-primary: #f4f4f5;
                --text-secondary: #a1a1aa;
                --accent: #10b981;
                --accent-glow: rgba(16, 185, 129, 0.15);
                --indigo: #6366f1;
            }
            body {
                background-color: var(--bg-color);
                color: var(--text-primary);
                font-family: 'Plus Jakarta Sans', sans-serif;
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow-x: hidden;
                position: relative;
            }
            .bg-glow-1 {
                position: absolute;
                width: 800px;
                height: 800px;
                background: radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, transparent 70%);
                top: -20%;
                right: -10%;
                z-index: 0;
            }
            .bg-glow-2 {
                position: absolute;
                width: 800px;
                height: 800px;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%);
                bottom: -20%;
                left: -10%;
                z-index: 0;
            }
            .container {
                max-width: 1100px;
                width: 100%;
                margin: 3rem auto;
                padding: 0 2rem;
                z-index: 10;
                display: grid;
                grid-template-columns: 1fr 1.2fr;
                gap: 3rem;
            }
            @media (max-width: 900px) {
                .container {
                    grid-template-columns: 1fr;
                    margin: 1.5rem auto;
                }
            }
            .panel-left {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .badge-row {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
            }
            .status-badge {
                background: rgba(16, 185, 129, 0.08);
                border: 1px solid rgba(16, 185, 129, 0.2);
                color: var(--accent);
                padding: 0.35rem 0.75rem;
                border-radius: 999px;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .status-dot {
                width: 6px;
                height: 6px;
                background-color: var(--accent);
                border-radius: 50%;
                display: inline-block;
                box-shadow: 0 0 8px var(--accent);
                animation: pulse 2s infinite;
            }
            .version-badge {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border-color);
                color: var(--text-secondary);
                padding: 0.35rem 0.75rem;
                border-radius: 999px;
                font-size: 0.75rem;
                font-weight: 700;
            }
            h1 {
                font-size: 3.2rem;
                font-weight: 800;
                letter-spacing: -0.05em;
                line-height: 1.1;
                margin: 0 0 1.5rem 0;
            }
            h1 span {
                background: linear-gradient(135deg, var(--accent) 0%, var(--indigo) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .hero-desc {
                color: var(--text-secondary);
                font-size: 1.05rem;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .architecture-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 2.5rem;
            }
            .arch-card {
                background: rgba(255, 255, 255, 0.01);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 1rem;
            }
            .arch-title {
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }
            .arch-value {
                font-size: 0.95rem;
                font-weight: 600;
                color: var(--text-primary);
            }
            .profile-card {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(99, 102, 241, 0.02) 100%);
                border: 1px solid var(--border-color);
                border-radius: 24px;
                padding: 1.5rem;
                display: flex;
                align-items: center;
                gap: 1.25rem;
                margin-top: auto;
            }
            .profile-avatar {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, var(--accent), var(--indigo));
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 1.25rem;
                color: #000;
            }
            .profile-details h3 {
                margin: 0;
                font-size: 1.05rem;
                font-weight: 700;
            }
            .profile-details p {
                margin: 0.2rem 0 0.5rem 0;
                font-size: 0.8rem;
                color: var(--text-secondary);
            }
            .profile-links {
                display: flex;
                gap: 0.75rem;
            }
            .profile-link {
                font-size: 0.75rem;
                color: var(--accent);
                text-decoration: none;
                font-weight: 600;
            }
            .profile-link:hover {
                text-decoration: underline;
            }
            .panel-right {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                backdrop-filter: blur(24px);
                border-radius: 32px;
                padding: 2.5rem;
                box-shadow: 0 30px 60px rgba(0,0,0,0.6);
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            .section-header {
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 1.25rem;
            }
            .section-title {
                font-size: 1.1rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: var(--text-secondary);
                margin: 0;
            }
            .section-subtitle {
                font-size: 0.85rem;
                color: var(--text-secondary);
                margin: 0.35rem 0 0 0;
            }
            .recruiter-links {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            @media (max-width: 500px) {
                .recruiter-links {
                    grid-template-columns: 1fr;
                }
            }
            .action-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 1.25rem;
                text-decoration: none;
                color: inherit;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                min-height: 100px;
                transition: all 0.25s;
                position: relative;
            }
            .action-card:hover {
                border-color: rgba(99, 102, 241, 0.4);
                background: rgba(99, 102, 241, 0.02);
                transform: translateY(-2px);
            }
            .action-card-header {
                font-size: 0.75rem;
                font-weight: 700;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
            .status-indicator {
                font-size: 0.65rem;
                font-weight: 700;
                color: var(--text-secondary);
                display: flex;
                align-items: center;
                gap: 0.35rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .indicator-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                display: inline-block;
            }
            .dot-gray { background-color: #71717a; }
            .dot-green { background-color: #10b981; box-shadow: 0 0 8px #10b981; }
            .dot-amber { background-color: #fbbf24; box-shadow: 0 0 8px #fbbf24; }

            .action-card-title {
                font-size: 1.1rem;
                font-weight: 700;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .action-card-arrow {
                color: var(--accent);
                font-weight: bold;
            }
            .gateway-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .gateway-item {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid var(--border-color);
                border-radius: 14px;
                padding: 0.75rem 1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .gateway-path-box {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .method-badge {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.7rem;
                font-weight: 800;
                padding: 0.2rem 0.5rem;
                border-radius: 4px;
                border: 1px solid rgba(16, 185, 129, 0.2);
                background: rgba(16, 185, 129, 0.08);
                color: var(--accent);
            }
            .gateway-path {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                color: var(--text-primary);
            }
            .test-btn {
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                padding: 0.4rem 0.8rem;
                border-radius: 8px;
                font-size: 0.75rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .test-btn:hover {
                background: var(--accent);
                color: #000;
                border-color: var(--accent);
                box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
            }
            .api-custom-input {
                display: flex;
                align-items: center;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid var(--border-color);
                border-radius: 14px;
                padding: 0.5rem 0.75rem;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
            }
            .api-custom-input .method-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.75rem;
                font-weight: 800;
                color: var(--accent);
                background: rgba(16, 185, 129, 0.08);
                padding: 0.25rem 0.5rem;
                border-radius: 6px;
                border: 1px solid rgba(16, 185, 129, 0.15);
            }
            .api-custom-input input {
                flex: 1;
                background: transparent;
                border: none;
                color: var(--text-primary);
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                outline: none;
            }
            .api-custom-input .send-btn {
                background: var(--accent);
                color: #000;
                border: none;
                padding: 0.45rem 1rem;
                border-radius: 8px;
                font-size: 0.75rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
            }
            .api-custom-input .send-btn:hover {
                box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
                opacity: 0.9;
            }
            .console-section {
                background: #020203;
                border: 1px solid var(--border-color);
                border-radius: 18px;
                padding: 1.25rem;
                box-shadow: inset 0 4px 16px rgba(0, 0, 0, 0.6);
            }
            .console-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.75rem;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--text-secondary);
                gap: 1rem;
            }
            .console-status-box {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .console-status {
                font-family: 'JetBrains Mono', monospace;
                color: var(--accent);
            }
            .copy-btn {
                background: transparent;
                border: 1px solid var(--border-color);
                color: var(--text-secondary);
                padding: 0.25rem 0.5rem;
                border-radius: 6px;
                font-size: 0.65rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .copy-btn:hover {
                color: var(--text-primary);
                border-color: rgba(255, 255, 255, 0.15);
            }
            .console-body {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.8rem;
                color: #34d399;
                max-height: 180px;
                overflow-y: auto;
                white-space: pre-wrap;
            }
            .console-placeholder {
                color: #4b5563;
                font-style: italic;
            }
            @keyframes pulse {
                0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
                70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
        </style>
    </head>
    <body>
        <div class="bg-glow-1"></div>
        <div class="bg-glow-2"></div>
        <div class="container">
            <div class="panel-left">
                <div>
                    <div class="badge-row">
                        <span class="status-badge">
                            <span class="status-dot"></span>
                            Live System
                        </span>
                        <span class="version-badge">v1.2.0-stable</span>
                    </div>
                    <h1>FreshCart <span>Engine</span></h1>
                    <p class="hero-desc">An enterprise-grade, high-concurrency micro-monolithic backend engine powering a modular e-commerce ecosystem. Built with optimal routing, strict database schema guarantees, and latency mitigation strategies.</p>
                    
                    <div class="architecture-grid">
                        <div class="arch-card">
                            <div class="arch-title">Core Runtime</div>
                            <div class="arch-value">Node.js (Express)</div>
                        </div>
                        <div class="arch-card">
                            <div class="arch-title">Data Storage</div>
                            <div class="arch-value">MongoDB Cluster</div>
                        </div>
                        <div class="arch-card">
                            <div class="arch-title">ORM Layer</div>
                            <div class="arch-value">Prisma (Schema-Safe)</div>
                        </div>
                        <div class="arch-card">
                            <div class="arch-title">Deployment</div>
                            <div class="arch-value">Render Web Service</div>
                        </div>
                    </div>
                </div>

                <div class="profile-card">
                    <div class="profile-avatar">KS</div>
                    <div class="profile-details">
                        <h3>Kumar Shanu</h3>
                        <p>Full Stack Engineer & System Architect</p>
                        <div class="profile-links">
                            <a href="mailto:kumarshanu90848@gmail.com" class="profile-link">Email</a>
                            <a href="https://github.com/KumarShanu36" target="_blank" class="profile-link">GitHub</a>
                            <a href="https://www.linkedin.com/in/kumar-shanu36/" target="_blank" class="profile-link">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel-right">
                <div class="section-header">
                    <h2 class="section-title">Ecosystem Navigation</h2>
                    <p class="section-subtitle">Access user-facing and admin interfaces deployed live.</p>
                </div>
                
                <div class="recruiter-links">
                    <a href="https://freshcart-store.onrender.com" target="_blank" class="action-card">
                        <span class="action-card-header">
                            <span>Storefront App</span>
                            <span class="status-indicator" id="store-status">
                                <span class="indicator-dot dot-gray"></span> Checking...
                            </span>
                        </span>
                        <span class="action-card-title">Launch Client <span class="action-card-arrow">→</span></span>
                    </a>
                    <a href="https://freshcart-admin.onrender.com" target="_blank" class="action-card">
                        <span class="action-card-header">
                            <span>Admin Console</span>
                            <span class="status-indicator" id="admin-status">
                                <span class="indicator-dot dot-gray"></span> Checking...
                            </span>
                        </span>
                        <span class="action-card-title">Launch Portal <span class="action-card-arrow">→</span></span>
                    </a>
                </div>

                <div class="section-header">
                    <h2 class="section-title">Live Sandbox Gateways</h2>
                    <p class="section-subtitle">Execute and inspect live server responses and latency metrics.</p>
                </div>

                <div class="api-custom-input">
                    <span class="method-label">GET</span>
                    <input type="text" id="api-path-input" value="/api/v1/health" />
                    <button class="send-btn" onclick="triggerCustomFetch()">Send Request</button>
                </div>

                <div class="gateway-list">
                    <div class="gateway-item">
                        <div class="gateway-path-box">
                            <span class="method-badge">GET</span>
                            <span class="gateway-path">/api/v1/health</span>
                        </div>
                        <button class="test-btn" onclick="selectRoute('/api/v1/health')">Quick Test</button>
                    </div>
                    <div class="gateway-item">
                        <div class="gateway-path-box">
                            <span class="method-badge">GET</span>
                            <span class="gateway-path">/api/v1/settings</span>
                        </div>
                        <button class="test-btn" onclick="selectRoute('/api/v1/settings')">Quick Test</button>
                    </div>
                    <div class="gateway-item">
                        <div class="gateway-path-box">
                            <span class="method-badge">GET</span>
                            <span class="gateway-path">/api/v1/products</span>
                        </div>
                        <button class="test-btn" onclick="selectRoute('/api/v1/products')">Quick Test</button>
                    </div>
                </div>

                <div class="console-section">
                    <div class="console-header">
                        <span>Terminal Payload Stream</span>
                        <div class="console-status-box">
                            <button class="copy-btn" onclick="copyConsolePayload()">Copy Response</button>
                            <span class="console-status" id="console-status">Ready</span>
                        </div>
                    </div>
                    <div class="console-body" id="console-body">
                        <span class="console-placeholder">// Console initialized. Select a gateway path to trigger API fetch...</span>
                    </div>
                </div>
            </div>
        </div>

        <script>
            let currentPayload = null;

            function selectRoute(path) {
                document.getElementById('api-path-input').value = path;
                triggerCustomFetch();
            }

            async function triggerCustomFetch() {
                const path = document.getElementById('api-path-input').value;
                const consoleBody = document.getElementById('console-body');
                const consoleStatus = document.getElementById('console-status');
                
                consoleBody.innerHTML = '// Requesting live pipeline telemetry from ' + path + '...';
                consoleStatus.innerHTML = 'Connecting...';
                consoleStatus.style.color = '#6366f1';
                currentPayload = null;
                
                try {
                    const start = performance.now();
                    const res = await fetch(path);
                    const duration = Math.round(performance.now() - start);
                    
                    if (res.ok) {
                        const data = await res.json();
                        currentPayload = data;
                        consoleBody.innerHTML = JSON.stringify(data, null, 2);
                        consoleStatus.innerHTML = '200 OK (' + duration + 'ms)';
                        consoleStatus.style.color = '#34d399';
                    } else {
                        consoleBody.innerHTML = '// Response Error: ' + res.status + ' ' + res.statusText;
                        consoleStatus.innerHTML = res.status + ' Error';
                        consoleStatus.style.color = '#f43f5e';
                    }
                } catch (err) {
                    consoleBody.innerHTML = '// Connection Failed:\\n' + err.message;
                    consoleStatus.innerHTML = 'Connection Refused';
                    consoleStatus.style.color = '#f43f5e';
                }
            }

            function copyConsolePayload() {
                if (!currentPayload) {
                    alert('No payload to copy. Run a request first!');
                    return;
                }
                navigator.clipboard.writeText(JSON.stringify(currentPayload, null, 2));
                const copyBtn = document.querySelector('.copy-btn');
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'Copied!';
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                }, 1500);
            }

            async function checkServiceStatus(url, elementId) {
                const indicator = document.getElementById(elementId);
                try {
                    // Use standard fetch. Render will reply with html page or 200/302 response.
                    const res = await fetch(url, { mode: 'no-cors' });
                    indicator.innerHTML = '<span class="indicator-dot dot-green"></span> Online';
                    indicator.style.color = '#34d399';
                } catch (e) {
                    indicator.innerHTML = '<span class="indicator-dot dot-amber"></span> Standby';
                    indicator.style.color = '#fbbf24';
                }
            }

            // Trigger status check for deployments
            checkServiceStatus('https://freshcart-store.onrender.com', 'store-status');
            checkServiceStatus('https://freshcart-admin.onrender.com', 'admin-status');
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
