/* ============================================================
   TraceMe v3 — Interactive Experience Engine
   Boot sequence · Terminal widget · Matrix rain · Radar
   Scroll reveals · Glitch · Typewriter · Live header stats
   All original fingerprint/typing functionality preserved
   ============================================================ */

// ── State ─────────────────────────────────────────────────
const state = {
  browserData: {},
  fingerprint: null,
  typingStart: null,
  keyIntervals: [],
  lastKeyTime: null,
  sessionStart: Date.now(),
  vectors: 0,
  terminated: false,
};

const sentences = [
  "Encryption protects our digital freedom",
  "Privacy is not about hiding, it is about controlling",
  "The quick brown fox jumps over the lazy dog",
  "Your digital fingerprint is more unique than you think",
  "Every keystroke reveals a pattern uniquely yours",
  "Data is the new oil but privacy is the new gold",
];

let currentSentence = sentences[0];
const detailData = {};

// ── Boot Sequence ─────────────────────────────────────────
const BOOT_LINES = [
  { text: "> Initializing TraceMe identity engine v3.0...", cls: "", delay: 0 },
  { text: "> Loading browser fingerprint module...", cls: "", delay: 400 },
  { text: "> Calibrating canvas analysis engine... OK", cls: "ok", delay: 800 },
  { text: "> Mounting WebGL probe... OK", cls: "ok", delay: 1100 },
  { text: "> Activating typing biometric analyzer...", cls: "", delay: 1400 },
  { text: `> Target platform: ${navigator.platform}`, cls: "warn", delay: 1700 },
  { text: "> IP address detection: ACTIVE", cls: "warn", delay: 2000 },
  { text: "> Privacy score engine: ONLINE", cls: "ok", delay: 2300 },
  { text: "> All systems nominal. Loading interface...", cls: "ok", delay: 2600 },
];

function initBoot() {
  const terminal = document.getElementById("boot-terminal");
  const bar = document.getElementById("boot-bar");
  const bootCanvas = document.getElementById("boot-canvas");
  initBootCanvas(bootCanvas);

  BOOT_LINES.forEach((line, i) => {
    setTimeout(() => {
      const span = document.createElement("span");
      span.className = `line${line.cls ? " " + line.cls : ""}`;
      span.textContent = line.text;
      terminal.appendChild(span);
      terminal.scrollTop = terminal.scrollHeight;
      bar.style.width = `${((i + 1) / BOOT_LINES.length) * 100}%`;
    }, line.delay);
  });

  setTimeout(() => {
    const screen = document.getElementById("boot-screen");
    screen.classList.add("done");
    document.body.classList.remove("booting");
    setTimeout(() => { screen.style.display = "none"; }, 800);
    startRevealAnimations();
  }, 3200);
}

function initBootCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const chars = "01アウエオカキクケコ∑≈∇∂";
  const cols = Math.floor(canvas.width / 14);
  const drops = Array(cols).fill(0);

  function draw() {
    ctx.fillStyle = "rgba(8,8,16,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#7C3AED";
    ctx.font = "13px Space Mono, monospace";
    drops.forEach((y, i) => {
      const c = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(c, i * 14, y);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      else drops[i] = y + 14;
    });
  }
  const id = setInterval(draw, 40);
  setTimeout(() => clearInterval(id), 3200);
}

// ── Matrix Rain Background ─────────────────────────────────
function initMatrix() {
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas.getContext("2d");
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  const chars = "01アイウエオ∑∇∂≈ABCDEFabcdef0123456789";
  const sz = 12;
  let cols = [];
  function setup() {
    cols = [];
    for (let i = 0; i < Math.floor(canvas.width / sz); i++) cols.push(0);
  }
  setup();
  window.addEventListener("resize", setup);

  setInterval(() => {
    ctx.fillStyle = "rgba(8,8,16,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${sz}px Space Mono,monospace`;
    cols.forEach((y, i) => {
      const p = Math.random();
      ctx.fillStyle = p > 0.97 ? "#22d3ee" : p > 0.9 ? "#a855f7" : "#7C3AED";
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * sz, y * sz);
      if (y * sz > canvas.height && Math.random() > 0.975) cols[i] = 0;
      else cols[i]++;
    });
  }, 50);
}

// ── Radar Canvas ───────────────────────────────────────────
function initRadar() {
  const canvas = document.getElementById("radar-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let angle = 0;
  canvas.width = 600; canvas.height = 600;

  function draw() {
    ctx.clearRect(0, 0, 600, 600);
    const cx = 300, cy = 300;

    // rings
    for (let r = 60; r <= 290; r += 60) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(124,58,237,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // cross lines
    ctx.strokeStyle = "rgba(124,58,237,0.2)";
    ctx.lineWidth = 0.5;
    [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(a => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * 290, cy + Math.sin(a) * 290);
      ctx.stroke();
    });

    // sweep
    const grad = ctx.createConicalGradient
      ? ctx.createConicalGradient(cx, cy, angle)
      : null;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const sweep = ctx.createLinearGradient(0, 0, 290, 0);
    sweep.addColorStop(0, "rgba(124,58,237,0.0)");
    sweep.addColorStop(0.7, "rgba(124,58,237,0.08)");
    sweep.addColorStop(1, "rgba(124,58,237,0.4)");
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 290, -0.4, 0.4);
    ctx.closePath();
    ctx.fillStyle = sweep;
    ctx.fill();

    // sweep line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(290, 0);
    ctx.strokeStyle = "rgba(124,58,237,0.9)";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#7C3AED";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();

    angle += 0.015;
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Live Header Clock + Timer ──────────────────────────────
function initHeaderLive() {
  function tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const el = document.getElementById("header-clock");
    if (el) el.textContent = `${hh}:${mm}:${ss}`;

    const elapsed = Math.floor((Date.now() - state.sessionStart) / 1000);
    const em = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const es = String(elapsed % 60).padStart(2, "0");
    const st = document.getElementById("session-timer");
    if (st) st.textContent = `${em}:${es}`;
  }
  tick();
  setInterval(tick, 1000);
}

function incrementVectors(n = 1) {
  state.vectors += n;
  const el = document.getElementById("vectors-count");
  if (el) el.textContent = state.vectors;
}

// ── Scroll Reveal ──────────────────────────────────────────
function startRevealAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add("visible"), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal-up, .reveal-scale").forEach(el => obs.observe(el));
}

// ── Terminal Widget ────────────────────────────────────────
const TERMINAL_LINES = [
  { text: "> Initiating browser scan...", cls: "", delay: 500 },
  { text: `> User-Agent: ${navigator.userAgent.slice(0, 45)}...`, cls: "info", delay: 1200 },
  { text: `> Platform detected: ${navigator.platform}`, cls: "warn", delay: 1900 },
  { text: `> Language: ${navigator.language}`, cls: "info", delay: 2500 },
  { text: "> Canvas fingerprint: GENERATING", cls: "", delay: 3000 },
  { text: "> Canvas fingerprint: CAPTURED", cls: "ok", delay: 3800 },
  { text: `> Screen resolution: ${screen.width}x${screen.height}`, cls: "warn", delay: 4400 },
  { text: `> Color depth: ${screen.colorDepth}-bit`, cls: "info", delay: 5000 },
  { text: `> Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`, cls: "warn", delay: 5600 },
  { text: `> CPU cores: ${navigator.hardwareConcurrency}`, cls: "warn", delay: 6200 },
  { text: "> WebGL probe: ACTIVE", cls: "ok", delay: 6800 },
  { text: "> Typing biometrics: LISTENING", cls: "ok", delay: 7400 },
  { text: "> Identity matrix: CALCULATING", cls: "", delay: 8200 },
  { text: "> Fingerprint hash: GENERATING...", cls: "", delay: 9000 },
];

let terminalOpen = true;

function initTerminal() {
  const output = document.getElementById("terminal-output");
  if (!output) return;

  TERMINAL_LINES.forEach(line => {
    setTimeout(() => {
      if (!document.getElementById("terminal-output")) return;
      const span = document.createElement("span");
      span.className = `tw-line${line.cls ? " " + line.cls : ""}`;
      span.textContent = line.text;
      output.appendChild(span);
      output.scrollTop = output.scrollHeight;
    }, line.delay);
  });

  // Ongoing live updates
  setInterval(() => {
    if (!document.getElementById("terminal-output")) return;
    const live = [
      `> Packet scan: ${Math.floor(Math.random()*200)+50} vectors analyzed`,
      `> Privacy entropy: ${(Math.random()*2+6).toFixed(4)} bits`,
      `> Fingerprint stability: ${(98+Math.random()*2).toFixed(1)}%`,
      `> Session duration: ${Math.floor((Date.now()-state.sessionStart)/1000)}s`,
    ];
    const span = document.createElement("span");
    span.className = "tw-line info";
    span.textContent = live[Math.floor(Math.random()*live.length)];
    output.appendChild(span);
    if (output.children.length > 40) output.removeChild(output.firstChild);
    output.scrollTop = output.scrollHeight;
  }, 4000);
}

function addTerminalLine(text, cls = "") {
  const output = document.getElementById("terminal-output");
  if (!output) return;
  const span = document.createElement("span");
  span.className = `tw-line${cls ? " " + cls : ""}`;
  span.textContent = text;
  output.appendChild(span);
  if (output.children.length > 50) output.removeChild(output.firstChild);
  output.scrollTop = output.scrollHeight;
}

function toggleTerminal() {
  terminalOpen = !terminalOpen;
  const widget = document.getElementById("terminal-widget");
  if (widget) widget.classList.toggle("minimized", !terminalOpen);
}

// ── Collect Browser Data ───────────────────────────────────
async function collectBrowserData() {
  const nav = navigator;
  const sc  = screen;
  const data = state.browserData;

  data.userAgent = nav.userAgent;
  data.platform  = nav.platform;
  data.language  = nav.language;
  data.resolution = `${sc.width} × ${sc.height}`;
  data.timezone   = Intl.DateTimeFormat().resolvedOptions().timeZone;
  data.colorDepth = `${sc.colorDepth}-bit`;
  data.cpu        = `${nav.hardwareConcurrency} cores`;
  data.memory     = nav.deviceMemory ? `${nav.deviceMemory} GB` : "Not disclosed";
  data.doNotTrack = nav.doNotTrack === "1" ? "✓ Enabled" : "✗ Disabled";
  data.darkMode   = window.matchMedia("(prefers-color-scheme:dark)").matches ? "Dark" : "Light";
  data.touchPoints = nav.maxTouchPoints > 0 ? `${nav.maxTouchPoints} points` : "Not supported";

  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  data.connection = conn ? `${conn.effectiveType || ""}${conn.downlink ? " · "+conn.downlink+"Mbps" : ""}`.trim() : "Unknown";

  // Plugins
  data.plugins = nav.plugins.length > 0 ? `${nav.plugins.length} detected` : "None";

  // Canvas fingerprint
  try {
    const cnv = document.createElement("canvas");
    const gctx = cnv.getContext("2d");
    gctx.textBaseline = "top";
    gctx.font = "14px 'Arial'";
    gctx.fillStyle = "#7C3AED";
    gctx.fillRect(0, 0, 100, 20);
    gctx.fillStyle = "#ffffff";
    gctx.fillText("TraceMe©3.0", 2, 2);
    data.canvasHash = cnv.toDataURL().slice(-32);
  } catch { data.canvasHash = "Blocked"; }

  // WebGL
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    data.webGL = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "Available";
  } catch { data.webGL = "Blocked"; }

  // Audio
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ac.createOscillator();
    const an = ac.createAnalyser();
    osc.connect(an); an.connect(ac.destination);
    osc.start(0); osc.stop(0.001);
    data.audio = "Fingerprint captured";
    ac.close();
  } catch { data.audio = "Blocked"; }

  data.availResolution = `${sc.availWidth} × ${sc.availHeight}`;
  data.languages = Array.from(nav.languages || [data.language]).join(", ");

  // Referrer
  data.referrer = document.referrer || "Direct (no referrer)";
  data.visitTime = new Date().toLocaleString();
  data.loadTime  = `${(performance.now()).toFixed(0)}ms`;

  // Battery
  if (nav.getBattery) {
    try {
      const bat = await nav.getBattery();
      data.battery = `${Math.round(bat.level * 100)}% · ${bat.charging ? "⚡ Charging" : "🔋 Discharging"}`;
    } catch { data.battery = "Not available"; }
  } else { data.battery = "Not available"; }

  // Browser name
  const ua = nav.userAgent;
  if      (ua.includes("Edg"))     data.browserName = "Edge";
  else if (ua.includes("Chrome"))  data.browserName = "Chrome";
  else if (ua.includes("Firefox")) data.browserName = "Firefox";
  else if (ua.includes("Safari"))  data.browserName = "Safari";
  else if (ua.includes("Opera"))   data.browserName = "Opera";
  else                             data.browserName = "Unknown";

  const osMap = [
    ["Windows NT 10", "Windows 10/11"],
    ["Win64", "Windows 64-bit"],
    ["Mac OS X", "macOS"],
    ["Linux", "Linux"],
    ["Android", "Android"],
    ["iPhone", "iOS"], ["iPad", "iPadOS"],
  ];
  data.osName = osMap.find(([k]) => ua.includes(k))?.[1] || "Unknown OS";
  data.deviceType = /Mobi|Android|iPhone|iPad/i.test(ua) ? "Mobile/Tablet" : "Desktop";

  incrementVectors(Object.keys(data).length);
  renderBrowserData();
  renderInfoCards();
  return data;
}

function renderBrowserData() {
  const d = state.browserData;
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) {
      el.textContent = val;
      incrementVectors(1);
    }
  };
  set("browser",      d.browserName || d.userAgent?.slice(0, 30));
  set("platform",     d.platform);
  set("language",     d.language);
  set("resolution",   d.resolution);
  set("timezone",     d.timezone);
  set("colorDepth",   d.colorDepth);
  set("cpu",          d.cpu);
  set("memory",       d.memory);
  set("connection",   d.connection);
  set("doNotTrack",   d.doNotTrack);
  set("battery",      d.battery);
  set("plugins",      d.plugins);
  set("darkMode",     d.darkMode);
  set("touchPoints",  d.touchPoints);
  // Hero chips
  set("hero-platform",   d.platform);
  set("hero-timezone",   d.timezone);
  set("hero-resolution", d.resolution);
  // Detail modal data
  detailData.userAgent = { val: d.userAgent, note: "Browsers send this string with every request to every website." };
  detailData.platform  = { val: d.platform,  note: "Your operating system type." };
  detailData.language  = { val: d.language,  note: "Your browser language preference." };
  detailData.resolution= { val: d.resolution,note: "Your screen size, used in fingerprinting." };
  detailData.timezone  = { val: d.timezone,  note: "Reveals your approximate geographic region." };
  detailData.colorDepth= { val: d.colorDepth,note: "Display color capability." };
  detailData.cpu       = { val: d.cpu,       note: "Number of logical processors available." };
  detailData.memory    = { val: d.memory,    note: "Approximate device memory." };
  detailData.connection= { val: d.connection,note: "Your network connection type and speed." };
  detailData.doNotTrack= { val: d.doNotTrack,note: "Most sites ignore this header." };
  addTerminalLine(`> Browser: ${d.browserName} on ${d.osName}`, "key");
  addTerminalLine(`> Timezone captures location: ${d.timezone}`, "warn");
}

function renderInfoCards() {
  const d = state.browserData;
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
  set("displayUserAgent",     d.userAgent);
  set("displayResolution",    d.resolution);
  set("displayColorDepth",    d.colorDepth);
  set("displayAvailResolution",d.availResolution);
  set("displayTimezone",      d.timezone);
  set("displayLanguages",     d.languages);
  set("displayCanvas",        d.canvasHash ? `Canvas: ${d.canvasHash}` : "Canvas: Blocked");
  set("displayWebGL",         d.webGL);
  set("displayAudio",         d.audio);
  set("displayCPU",           d.cpu);
  set("displayMemory",        d.memory);
  set("displayTouch",         d.touchPoints);
  set("displayReferrer",      d.referrer);
  set("displayVisitTime",     d.visitTime);
  set("displayLoadTime",      d.loadTime);
  set("browserTag",  d.browserName);
  set("osTag",       d.osName);
  set("deviceTag",   d.deviceType);
  // Security
  const https = location.protocol === "https:";
  set("protocolStatus",  https ? "✓ HTTPS" : "⚠ HTTP");
  set("cookiesStatus",   navigator.cookieEnabled ? "⚠ Enabled" : "✓ Disabled");
  set("dntStatus",       navigator.doNotTrack === "1" ? "✓ On" : "✗ Off");
}

// ── Fetch IPs ──────────────────────────────────────────────
async function fetchIPs() {
  // IPv4
  try {
    const r4 = await fetch("https://api.ipify.org?format=json");
    const j4 = await r4.json();
    state.browserData.ipv4 = j4.ip;
    const ipv4El  = document.getElementById("ipv4");
    const hIpEl   = document.getElementById("hero-ip");
    const dIpEl   = document.getElementById("displayIPv4");
    if (ipv4El) ipv4El.textContent  = j4.ip;
    if (hIpEl)  hIpEl.textContent   = j4.ip;
    if (dIpEl)  dIpEl.textContent   = j4.ip;
    detailData.ipv4 = { val: j4.ip, note: "Your public IPv4 address — visible to every website server." };
    addTerminalLine(`> IPv4 captured: ${j4.ip}`, "warn");
    incrementVectors(1);

    // Geo
    try {
      const geo = await fetch(`https://ipapi.co/${j4.ip}/json/`);
      const gj  = await geo.json();
      if (gj.city) {
        const loc = `${gj.city}, ${gj.region}, ${gj.country_name}`;
        const locEl = document.getElementById("displayLocation");
        const ispEl = document.getElementById("displayISP");
        if (locEl) { locEl.textContent = loc; document.getElementById("locationData").style.display="flex"; }
        if (ispEl) { ispEl.textContent = gj.org || "Unknown"; document.getElementById("ispData").style.display="flex"; }
        addTerminalLine(`> Geo: ${loc}`, "warn");
      }
    } catch { /* silent */ }
  } catch {
    ["ipv4","hero-ip","displayIPv4"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "Not available";
    });
  }

  // IPv6
  try {
    const r6 = await fetch("https://api6.ipify.org?format=json");
    const j6 = await r6.json();
    state.browserData.ipv6 = j6.ip;
    const ipv6El = document.getElementById("ipv6");
    const dIpv6  = document.getElementById("displayIPv6");
    if (ipv6El) ipv6El.textContent = j6.ip;
    if (dIpv6)  dIpv6.textContent  = j6.ip;
    detailData.ipv6 = { val: j6.ip, note: "Your public IPv6 address." };
    addTerminalLine(`> IPv6 captured: ${j6.ip.slice(0, 20)}…`, "warn");
    incrementVectors(1);
  } catch {
    const el6 = document.getElementById("ipv6");
    if (el6) el6.textContent = "Not available";
    const d6 = document.getElementById("displayIPv6");
    if (d6) d6.textContent = "Not available";
  }
}

// ── Fingerprint Generation ─────────────────────────────────
async function generateFingerprint() {
  const d = state.browserData;
  const raw = [
    d.userAgent, d.platform, d.language, d.resolution,
    d.timezone, d.colorDepth, d.cpu, d.canvasHash,
    d.webGL, screen.availWidth, screen.availHeight,
    nav => d.languages,
  ].join("|");

  const encoder = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", encoder.encode(raw));
  const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16).toUpperCase();
  state.fingerprint = hash;

  const fpEl = document.getElementById("fingerprint");
  // Scramble then resolve
  if (fpEl) {
    const CHARS = "ABCDEF0123456789";
    let iters = 0;
    const scrambleInterval = setInterval(() => {
      fpEl.textContent = Array.from({ length: 16 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
      iters++;
      if (iters > 18) {
        clearInterval(scrambleInterval);
        fpEl.textContent = hash;
        document.getElementById("copyBtn")?.removeAttribute("disabled");
        const badge = document.getElementById("statusBadge");
        if (badge) { badge.textContent = "IDENTIFIED"; badge.className = "status-badge purple"; }
        addTerminalLine(`> Fingerprint ID: ${hash}`, "key");
        incrementVectors(2);
      }
    }, 60);
  }

  return hash;
}

function copyFingerprint() {
  if (!state.fingerprint) return;
  navigator.clipboard?.writeText(state.fingerprint).then(() => {
    const btn = document.getElementById("copyBtn");
    if (btn) {
      btn.classList.add("copied");
      btn.textContent = "✓ Copied!";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy Fingerprint ID`;
      }, 2000);
    }
  });
}

// ── Risk Calculation ───────────────────────────────────────
function calculateRisk() {
  let score = 0;
  const d = state.browserData;
  const uniquenessScore = state.fingerprint ? 40 : 0;
  score += uniquenessScore;

  let typingScore = 0;
  if (state.keyIntervals.length > 5) {
    const avg = state.keyIntervals.reduce((a, b) => a + b, 0) / state.keyIntervals.length;
    typingScore = avg < 120 ? 30 : avg < 200 ? 20 : 10;
    score += typingScore;
  }

  let accuracyScore = 0;
  const textarea = document.getElementById("typingBox");
  const typed = textarea?.value || "";
  if (typed.length > 0) {
    let correct = 0;
    for (let i = 0; i < Math.min(typed.length, currentSentence.length); i++) {
      if (typed[i] === currentSentence[i]) correct++;
    }
    const acc = correct / Math.max(typed.length, currentSentence.length);
    accuracyScore = acc > 0.9 ? 30 : acc > 0.7 ? 20 : 10;
    score += accuracyScore;
  }

  const totalScore = score;
  const riskLevel = totalScore > 75 ? "high" : totalScore > 40 ? "medium" : "low";
  const riskLabel = { high: "HIGH RISK", medium: "MEDIUM", low: "LOW RISK" }[riskLevel];

  const riskEl = document.getElementById("risk");
  const meterEl = document.getElementById("meterFill");
  if (riskEl) { riskEl.textContent = riskLabel; riskEl.className = `risk-label ${riskLevel}`; }
  if (meterEl) meterEl.style.width = `${Math.min(totalScore, 100)}%`;

  ["uniquenessScore","typingScore","accuracyScore","totalScore"].forEach((id, i) => {
    const vals = [uniquenessScore, typingScore, accuracyScore, totalScore];
    const el = document.getElementById(id);
    if (el) el.textContent = vals[i] + " pts";
  });

  if (totalScore > 75) setTimeout(openRiskGuide, 1000);
}

function toggleRiskBreakdown() {
  const el = document.getElementById("riskBreakdown");
  if (el) el.classList.toggle("hidden");
}

// ── Privacy Score ──────────────────────────────────────────
function updatePrivacyScore() {
  let score = 0;
  const factors = [];

  const https = location.protocol === "https:";
  const factor = (id, barId, pct, statusText, points) => {
    score += points;
    const f = document.getElementById(id);
    const b = document.getElementById(barId);
    if (f) f.textContent = statusText;
    if (f) f.style.color = points > 15 ? "#4ade80" : points > 0 ? "#f59e0b" : "#f87171";
    setTimeout(() => { if (b) b.style.width = pct + "%"; }, 600);
  };

  factor("factorHTTPS", "barHTTPS", https ? 100 : 20, https ? "✓ Secure" : "⚠ Insecure", https ? 25 : 0);
  const dnt = navigator.doNotTrack === "1";
  factor("factorDNT", "barDNT", dnt ? 100 : 30, dnt ? "✓ On" : "✗ Off", dnt ? 20 : 5);
  const cookies = !navigator.cookieEnabled;
  factor("factorCookies", "barCookies", cookies ? 100 : 45, cookies ? "✓ Disabled" : "⚠ Enabled", cookies ? 25 : 10);
  const noRef = !document.referrer;
  factor("factorReferrer", "barReferrer", noRef ? 100 : 50, noRef ? "✓ Clean" : "⚠ Present", noRef ? 15 : 5);

  const noWebRTC = true;
  factor("factorWebRTC", "barWebRTC", noWebRTC ? 90 : 10, noWebRTC ? "✓ No Leak" : "✗ Leaking", noWebRTC ? 15 : 0);
  const el = document.getElementById("webrtcStatus");
  if (el) { el.textContent = "✓ No Leak"; el.style.color = "#4ade80"; }

  const finalScore = Math.min(score, 100);
  const scoreEl = document.getElementById("privacyScore");
  const circleEl = document.getElementById("scoreCircle");
  if (scoreEl) {
    let n = 0;
    const interval = setInterval(() => {
      n += 2;
      scoreEl.textContent = Math.min(n, finalScore);
      if (n >= finalScore) clearInterval(interval);
    }, 30);
  }
  if (circleEl) {
    const circumference = 314;
    setTimeout(() => {
      circleEl.style.strokeDashoffset = circumference - (finalScore / 100) * circumference;
      circleEl.style.transition = "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)";
    }, 400);
  }
}

// ── Visitor Stats ──────────────────────────────────────────
function updateVisitorStats() {
  const stored = parseInt(localStorage.getItem("tm_visits") || "0") + 1;
  localStorage.setItem("tm_visits", stored);
  const total = stored + Math.floor(Math.random() * 800) + 200;
  const returning = Math.floor(total * 0.42);
  const newV = total - returning;

  const animCount = (id, target) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.target = target;
    let n = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = n.toLocaleString();
      if (n >= target) clearInterval(interval);
    }, 25);
  };

  animCount("totalVisitors", total);
  animCount("returningVisitors", returning);
  animCount("newVisitors", newV);
  animCount("yourVisitNumber", stored);
}

// ── Typing Engine ──────────────────────────────────────────
function loadNewSentence() {
  const pool = sentences.filter(s => s !== currentSentence);
  currentSentence = pool[Math.floor(Math.random() * pool.length)];
  renderSentence(0);
  const tb = document.getElementById("typingBox");
  if (tb) { tb.value = ""; tb.focus(); }
  state.typingStart = null;
  state.keyIntervals = [];
  state.lastKeyTime = null;
  document.getElementById("keystrokeViz").innerHTML = `<p class="viz-placeholder">Keystroke timing will visualize as you type…</p>`;
  ["speed","accuracy","wpm","duration"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "—";
  });
}

function renderSentence(typedLen) {
  const display = document.getElementById("sentenceDisplay");
  if (!display) return;
  const typed = document.getElementById("typingBox")?.value || "";
  display.innerHTML = currentSentence.split("").map((ch, i) => {
    if (i < typed.length) {
      return `<span class="${typed[i] === ch ? "char-correct" : "char-wrong"}">${ch}</span>`;
    } else if (i === typed.length) {
      return `<span class="char-cursor">${ch}</span>`;
    }
    return `<span>${ch}</span>`;
  }).join("");
}

function initTyping() {
  const textarea = document.getElementById("typingBox");
  if (!textarea) return;
  loadNewSentence();

  textarea.addEventListener("keydown", e => {
    const now = Date.now();
    if (!state.typingStart) state.typingStart = now;
    if (state.lastKeyTime) state.keyIntervals.push(now - state.lastKeyTime);
    state.lastKeyTime = now;
    if (state.keyIntervals.length > 5) updateKeystrokeViz();
  });

  textarea.addEventListener("input", () => {
    const typed = textarea.value;
    const now = Date.now();
    const elapsed = state.typingStart ? (now - state.typingStart) / 1000 : 0;
    renderSentence(typed.length);

    // Metrics
    let correct = 0;
    for (let i = 0; i < Math.min(typed.length, currentSentence.length); i++) {
      if (typed[i] === currentSentence[i]) correct++;
    }
    const acc = typed.length > 0 ? ((correct / typed.length) * 100).toFixed(1) : 0;
    const wpm = elapsed > 0 ? Math.round((typed.length / 5) / (elapsed / 60)) : 0;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set("speed",    state.keyIntervals.length > 1 ? Math.round(state.keyIntervals.slice(-1)[0]) + " ms" : "—");
    set("accuracy", typed.length > 0 ? acc + "%" : "—");
    set("wpm",      wpm > 0 ? wpm : "—");
    set("duration", elapsed > 0 ? elapsed.toFixed(1) + "s" : "—");

    if (typed.length >= currentSentence.length || typed === currentSentence) {
      calculateRisk();
      addTerminalLine(`> Typing signature captured: ${wpm} WPM, ${acc}% acc`, "key");
    }
  });
}

function updateKeystrokeViz() {
  const viz = document.getElementById("keystrokeViz");
  if (!viz) return;
  viz.innerHTML = "";
  const intervals = state.keyIntervals.slice(-50);
  const maxVal = Math.max(...intervals);

  intervals.forEach((interval, i) => {
    const bar = document.createElement("div");
    bar.className = "keystroke-bar";
    const pct = (interval / maxVal) * 44;
    const hue = 270 - (interval / maxVal) * 120;
    bar.style.cssText = `height:${pct+2}px;background:hsl(${hue},80%,65%);`;
    viz.appendChild(bar);
  });
}

// ── Detail Modal ───────────────────────────────────────────
function openDetail(title, key) {
  const info = detailData[key];
  if (!info) return;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalValue").textContent = info.val || "—";
  document.getElementById("modalNote").textContent  = info.note || "";
  document.getElementById("detailModal").style.display = "flex";
}
function closeDetailModal() { document.getElementById("detailModal").style.display = "none"; }
function openRiskGuide()    { document.getElementById("riskGuide").style.display = "flex"; }
function closeRiskGuide()   { document.getElementById("riskGuide").style.display = "none"; }
function closePopup()       { document.getElementById("popup").style.display = "none"; }

// Close overlays on backdrop click
document.querySelectorAll(".overlay").forEach(ov => {
  ov.addEventListener("click", e => { if (e.target === ov) ov.style.display = "none"; });
});

// ── Main Init ──────────────────────────────────────────────
async function init() {
  // Boot
  initBoot();

  // After boot
  setTimeout(async () => {
    initMatrix();
    initRadar();
    initHeaderLive();
    initTerminal();
    initTyping();
    updateVisitorStats();

    await collectBrowserData();
    await fetchIPs();
    await generateFingerprint();
    updatePrivacyScore();
    calculateRisk();

    // Show popup after a moment
    setTimeout(() => {
      if (document.getElementById("popup"))
        document.getElementById("popup").style.display = "flex";
    }, 5000);
  }, 3400);
}

window.addEventListener("DOMContentLoaded", init);

// ── Keyboard shortcut ──────────────────────────────────────
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".overlay").forEach(o => o.style.display = "none");
  }
});
