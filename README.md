# CatalystOzwell
Catalyst Ozwell MARK 3
3.4 UPDATE *******
catalystozwell/
│
├── github-pages/                  # Frontend (GitHub Pages)
│   ├── index.html                 # Main HTML file
│   ├── styles.css                 # Styling
│   ├── app.js                     # Frontend logic (API calls to ai.catalystozwell.com)
│   └── config.js                  # Configuration (API endpoints, keys)
│
├── cloudflare/                    # Cloudflare Tunnel + Backend
│   ├── cloudflared.exe            # Cloudflare Tunnel binary (Windows)
│   ├── tunnel-config.yml          # Tunnel configuration
│   └── run-tunnel.bat             # Script to start the tunnel
│
├── lm-studio/                     # LM Studio Local Server
│   ├── lm-studio.exe              # LM Studio binary (if needed)
│   ├── models/                    # Model storage (symlink to N:\lm-studio-models)
│   └── start-lm-studio.bat        # Script to start LM Studio
│
├── backend/                       # (Optional) Backend API (if not using LM Studio directly)
│   ├── server.py                  # FastAPI/Flask server (if needed)
│   ├── requirements.txt           # Python dependencies
│   └── Dockerfile                 # (Optional) Containerization
│
├── scripts/                       # Helper scripts
│   ├── deploy-gh-pages.bat        # Deploy GitHub Pages
│   ├── verify-setup.bat           # Verify all components
│   └── monitor-resources.bat      # Monitor GPU/CPU/RAM usage
│
└── README.md                      # Setup instructions



****
3.3 update
catalyst-ozwell/
├── index.html          # Main website (2,100+ lines)
├── styles.css          # All styling (6 themes: 3 Modern + 3 Art Deco)
├── app.js              # All functionality (AI agents, data loading)
├── config.js           # API configuration (add to .gitignore)
└── .gitignore          # Security
-----



┌─────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                            │
└─────────────────────────────┬───────────────────────────────────────┘
                                │
                                ▼ (HTTPS)
┌─────────────────────────────────────────────────────────────────────┐
│                    GitHub Pages: catalystozwell.com                  │
│  ┌─────────────┐    ┌─────────────┐    ┌───────────────────────────┐  │
│  │  index.html │    │  styles.css │    │      app.js + config.js    │  │
│  └─────────────┘    └─────────────┘    └───────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                                │ (API Calls to ai.catalystozwell.com)
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Cloudflare Tunnel (ai.catalystozwell.com)          │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  Tunnel ID: [YOUR_TUNNEL_UUID]                                    ││
│  │  Route: ai.catalystozwell.com → localhost:1234                   ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────┬───────────────────────────────────────┘
                                │
                                ▼ (Local Network)
┌─────────────────────────────────────────────────────────────────────┐
│                         LM STUDIO LOCAL SERVER                        │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  Port: 1234                                                       ││
│  │  Model: mistral-7b-instruct-v0.3                                 ││
│  │  Path: N:\lm-studio-models\lmstudio-community\mistral-7b...   ││
│  │  GPU: RTX 3070 (8GB VRAM) - FULLY UTILIZED                       ││
│  │  CPU: Intel i7-11370H - OPTIMIZED                               ││
│  │  RAM: 16GB - ALLOCATED FOR 4 CONCURRENT USERS                    ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
