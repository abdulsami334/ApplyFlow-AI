import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outDir = path.join(root, "docs", "linkedin-assets");
const svgDir = path.join(outDir, "svg");
const pngDir = path.join(outDir, "png");

const W = 1920;
const H = 1080;

const theme = {
  bg: "#070b1a",
  bg2: "#0c1230",
  panel: "#111936",
  panel2: "#151f45",
  stroke: "#30406f",
  text: "#f8fbff",
  muted: "#aebce0",
  blue: "#38bdf8",
  indigo: "#6366f1",
  purple: "#a855f7",
  green: "#34d399",
  yellow: "#fbbf24",
  red: "#fb7185",
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function lines(text, max = 46) {
  const words = text.split(/\s+/);
  const result = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      result.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) result.push(line);
  return result;
}

function textBlock(text, x, y, opts = {}) {
  const {
    size = 38,
    weight = 500,
    fill = theme.text,
    max = 48,
    lineHeight = Math.round(size * 1.28),
    anchor = "start",
    opacity = 1,
  } = opts;
  return lines(text, max)
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lineHeight}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${opacity}">${esc(line)}</text>`,
    )
    .join("\n");
}

function chip(text, x, y, color = theme.blue, width) {
  const w = width ?? Math.max(150, text.length * 20 + 44);
  return `
    <rect x="${x}" y="${y}" width="${w}" height="62" rx="31" fill="${color}" opacity="0.13" stroke="${color}" stroke-width="2"/>
    <text x="${x + w / 2}" y="${y + 40}" text-anchor="middle" font-size="28" font-weight="700" fill="${theme.text}">${esc(text)}</text>`;
}

function panel(x, y, w, h, rx = 32) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${theme.panel}" stroke="${theme.stroke}" stroke-width="2"/>`;
}

function node(label, x, y, w = 330, h = 82, color = theme.blue, sub = "") {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="${theme.panel2}" stroke="${color}" stroke-width="2.5"/>
    <circle cx="${x + 38}" cy="${y + h / 2}" r="12" fill="${color}"/>
    <text x="${x + 68}" y="${y + (sub ? 38 : h / 2 + 11)}" font-size="28" font-weight="750" fill="${theme.text}">${esc(label)}</text>
    ${sub ? `<text x="${x + 68}" y="${y + 67}" font-size="20" fill="${theme.muted}">${esc(sub)}</text>` : ""}`;
}

function arrow(x1, y1, x2, y2, color = theme.blue) {
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${color}" stroke-width="5" stroke-linecap="round" marker-end="url(#arrow)"/>`;
}

function header(title, kicker = "APPLYFLOW AI CASE STUDY") {
  return `
    <text x="110" y="92" font-size="24" font-weight="800" fill="${theme.blue}" letter-spacing="4">${esc(kicker)}</text>
    <text x="110" y="158" font-size="56" font-weight="850" fill="${theme.text}">${esc(title)}</text>`;
}

function footer(n) {
  return `
    <text x="110" y="1010" font-size="22" fill="${theme.muted}">ASP.NET Core | Next.js | PostgreSQL | Playwright | Jira</text>
    <text x="1810" y="1010" text-anchor="end" font-size="24" font-weight="800" fill="${theme.muted}">${String(n).padStart(2, "0")}/14</text>`;
}

function shell(content, n, title = "") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1920" y2="1080">
      <stop stop-color="${theme.bg}"/>
      <stop offset="0.55" stop-color="${theme.bg2}"/>
      <stop offset="1" stop-color="#111032"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1480 180) rotate(145) scale(620 420)">
      <stop stop-color="${theme.purple}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${theme.purple}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(330 900) rotate(-25) scale(620 360)">
      <stop stop-color="${theme.blue}" stop-opacity="0.24"/>
      <stop offset="1" stop-color="${theme.blue}" stop-opacity="0"/>
    </radialGradient>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <path d="M2,2 L10,6 L2,10 Z" fill="${theme.blue}"/>
    </marker>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>
  <g font-family="Inter, Segoe UI, Arial, sans-serif">
    ${content}
    ${n ? footer(n) : ""}
  </g>
  ${title ? `<title>${esc(title)}</title>` : ""}
</svg>`;
}

function flow(items, x, y, gap, w = 380, colors = [theme.blue, theme.indigo, theme.purple]) {
  return items
    .map((item, i) => {
      const yy = y + i * gap;
      const color = colors[i % colors.length];
      return `${node(item.title, x, yy, w, 76, color, item.sub ?? "")}${i < items.length - 1 ? arrow(x + w / 2, yy + 84, x + w / 2, yy + gap - 12, color) : ""}`;
    })
    .join("\n");
}

function cover() {
  const chips = [
    [".NET", 220, 742, theme.blue],
    ["Next.js", 405, 742, theme.indigo],
    ["PostgreSQL", 635, 742, theme.purple],
    ["AI", 940, 742, theme.green],
    ["Playwright", 1085, 742, theme.blue],
    ["Jira", 1378, 742, theme.indigo],
  ];
  return shell(`
    <text x="140" y="165" font-size="28" font-weight="800" fill="${theme.blue}" letter-spacing="5">LEGACY MODERNIZATION CASE STUDY</text>
    <text x="140" y="350" font-size="126" font-weight="900" fill="${theme.text}">ApplyFlow AI</text>
    <text x="146" y="445" font-size="48" font-weight="500" fill="${theme.muted}">From Legacy C++ Console Application to a Modern</text>
    <text x="146" y="507" font-size="48" font-weight="500" fill="${theme.muted}">AI-Powered Full Stack Platform</text>
    <rect x="134" y="610" width="980" height="5" rx="2.5" fill="url(#accent)"/>
    ${chips.map(([t, x, y, c]) => chip(t, x, y, c)).join("\n")}
    <g filter="url(#shadow)">
      <rect x="1280" y="260" width="440" height="330" rx="42" fill="${theme.panel}" stroke="${theme.stroke}" stroke-width="2"/>
      <text x="1500" y="375" text-anchor="middle" font-size="28" font-weight="700" fill="${theme.muted}">Architecture</text>
      <text x="1500" y="455" text-anchor="middle" font-size="78" font-weight="900" fill="${theme.blue}">API</text>
      <text x="1500" y="520" text-anchor="middle" font-size="30" font-weight="700" fill="${theme.text}">Web + Data + Tests</text>
    </g>
    <defs><linearGradient id="accent" x1="0" y1="0" x2="980" y2="0"><stop stop-color="${theme.blue}"/><stop offset="0.5" stop-color="${theme.indigo}"/><stop offset="1" stop-color="${theme.purple}"/></linearGradient></defs>
  `, 1, "Cover Image");
}

function problem() {
  return shell(`
    ${header("Why Modernization Was Needed")}
    ${flow([
      { title: "Legacy C++ Console" },
      { title: "Flat File Storage" },
      { title: "Manual Tracking" },
      { title: "No Authentication" },
      { title: "No Dashboard" },
      { title: "Hard to Scale" },
    ], 160, 240, 115, 430)}
    ${panel(820, 270, 860, 470)}
    <text x="890" y="350" font-size="42" font-weight="850" fill="${theme.text}">Core Problems</text>
    ${[
      "Data lived outside a relational model",
      "No user-level access control",
      "No visual workflow or analytics layer",
      "Hard to validate, test, and extend",
      "Migration was required before AI-style features could be credible",
    ].map((t, i) => `<text x="910" y="${430 + i * 68}" font-size="32" fill="${theme.muted}"><tspan fill="${theme.red}" font-weight="800">-</tspan> ${esc(t)}</text>`).join("\n")}
  `, 2, "Problem Statement");
}

function architecture() {
  const left = [
    { title: "Next.js Frontend", sub: "React, TypeScript, Tailwind" },
    { title: "REST APIs", sub: "Axios service modules" },
    { title: "ASP.NET Core Web API", sub: ".NET 10 backend" },
    { title: "Controllers", sub: "Auth, Applications, Dashboard, Resumes" },
  ];
  const right = [
    { title: "Services", sub: "Business logic + user scoping" },
    { title: "DTOs", sub: "Request/response contracts" },
    { title: "Entity Framework Core", sub: "Migrations + DbContext" },
    { title: "PostgreSQL", sub: "Relational persistence" },
  ];
  return shell(`
    ${header("Modern Architecture")}
    ${flow(left, 160, 255, 150, 560)}
    ${flow(right, 1050, 255, 150, 560, [theme.purple, theme.indigo, theme.blue])}
    ${arrow(720, 632, 1050, 632, theme.green)}
    <text x="885" y="602" text-anchor="middle" font-size="24" font-weight="800" fill="${theme.green}">clean service boundary</text>
  `, 3, "Modern Architecture Diagram");
}

function migration() {
  return shell(`
    ${header("Legacy Modernization Flow")}
    ${flow([
      { title: "Legacy C++" },
      { title: "File-Based Storage" },
      { title: "Migration Pipeline", sub: "PowerShell import script" },
      { title: "Validation", sub: "row format, status, dates" },
      { title: "Normalization", sub: "users + applications" },
      { title: "PostgreSQL" },
    ], 160, 230, 118, 480)}
    ${panel(820, 300, 850, 390)}
    <text x="890" y="380" font-size="46" font-weight="900" fill="${theme.text}">Modern Web Platform</text>
    <text x="890" y="455" font-size="32" fill="${theme.muted}">Authenticated APIs, EF Core models, dashboard analytics, resume library, and browser workflows.</text>
    <rect x="890" y="555" width="450" height="76" rx="24" fill="${theme.green}" opacity="0.15" stroke="${theme.green}" stroke-width="2"/>
    <text x="1115" y="604" text-anchor="middle" font-size="32" font-weight="850" fill="${theme.green}">No Data Loss Goal</text>
  `, 4, "Legacy Modernization Flow");
}

function aiWorkflow() {
  return shell(`
    ${header("Resume Match Workflow", "CURRENT IMPLEMENTATION")}
    ${flow([
      { title: "Resume Upload", sub: "PDF, DOC, DOCX, TXT accepted" },
      { title: "Text Extraction", sub: "implemented for text/plain" },
      { title: "Keyword Extraction", sub: "regex + stop-word filtering" },
      { title: "Job Description", sub: "stored per application" },
      { title: "Match Score", sub: "matched / detected keywords" },
      { title: "ATS-style Match %", sub: "deterministic scoring" },
    ], 160, 220, 120, 560)}
    ${panel(870, 280, 780, 430)}
    <text x="940" y="365" font-size="42" font-weight="850" fill="${theme.text}">What the user sees</text>
    <text x="940" y="445" font-size="34" fill="${theme.muted}">Matched keywords</text>
    <text x="940" y="505" font-size="34" fill="${theme.muted}">Missing keywords</text>
    <text x="940" y="565" font-size="34" fill="${theme.muted}">Resume suggestions</text>
    <text x="940" y="625" font-size="34" fill="${theme.muted}">Warning when text extraction is unavailable</text>
  `, 5, "AI Workflow");
}

function appWorkflow() {
  const items = ["User Login", "Dashboard", "Create Application", "Upload Resume", "Add Job Description", "Match Analysis", "Kanban Tracking", "Interview", "Offer / Rejection"];
  return shell(`
    ${header("Application Workflow")}
    ${items.map((t, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 150 + col * 570;
      const y = 260 + row * 210;
      const color = [theme.blue, theme.indigo, theme.purple][col];
      return `${node(t, x, y, 420, 98, color)}${col < 2 ? arrow(x + 420, y + 49, x + 540, y + 49, color) : row < 2 ? arrow(x + 210, y + 106, x + 210, y + 190, color) : ""}`;
    }).join("\n")}
  `, 6, "Application Workflow");
}

function dashboard() {
  const cards = [
    ["Total", "128"],
    ["Applied", "42"],
    ["Interview", "18"],
    ["Offers", "4"],
  ];
  return shell(`
    ${header("Dashboard Showcase")}
    ${panel(150, 230, 1620, 650)}
    <text x="220" y="310" font-size="42" font-weight="850" fill="${theme.text}">Pipeline Overview</text>
    <text x="220" y="358" font-size="26" fill="${theme.muted}">Application statistics, status distribution, and monthly activity</text>
    ${cards.map(([a, b], i) => {
      const x = 220 + i * 370;
      return `<rect x="${x}" y="420" width="310" height="150" rx="28" fill="${theme.bg2}" stroke="${theme.stroke}" stroke-width="2"/>
      <text x="${x + 34}" y="475" font-size="26" fill="${theme.muted}">${a}</text>
      <text x="${x + 34}" y="540" font-size="58" font-weight="900" fill="${i === 2 ? theme.purple : theme.blue}">${b}</text>`;
    }).join("\n")}
    <rect x="220" y="640" width="670" height="160" rx="28" fill="${theme.bg2}" stroke="${theme.stroke}" stroke-width="2"/>
    ${[90, 130, 65, 150, 105, 175].map((h, i) => `<rect x="${270 + i * 90}" y="${780 - h}" width="44" height="${h}" rx="12" fill="${[theme.blue, theme.indigo, theme.purple][i % 3]}"/>`).join("\n")}
    <rect x="960" y="640" width="690" height="160" rx="28" fill="${theme.bg2}" stroke="${theme.stroke}" stroke-width="2"/>
    ${["Applied", "Screening", "Interview", "Offer"].map((t, i) => `<text x="1018" y="${700 + i * 34}" font-size="24" fill="${theme.muted}">${esc(t)}</text><rect x="1190" y="${682 + i * 34}" width="${260 - i * 38}" height="18" rx="9" fill="${[theme.blue, theme.indigo, theme.purple, theme.green][i]}"/>`).join("\n")}
  `, 7, "Dashboard Showcase");
}

function kanban() {
  const cols = ["Applied", "Screening", "Interview", "Offer", "Rejected", "Withdrawn"];
  return shell(`
    ${header("Kanban Board")}
    <text x="112" y="215" font-size="28" fill="${theme.muted}">Actual implementation uses: Applied, Screening, Interview, Offer, Rejected, Withdrawn</text>
    ${cols.map((c, i) => {
      const x = 115 + i * 290;
      return `<rect x="${x}" y="285" width="250" height="520" rx="26" fill="${theme.panel}" stroke="${theme.stroke}" stroke-width="2"/>
        <text x="${x + 28}" y="345" font-size="28" font-weight="850" fill="${theme.text}">${c}</text>
        ${[0, 1, 2].slice(0, i === 5 ? 1 : i === 4 ? 2 : 3).map((_, j) => `<rect x="${x + 24}" y="${390 + j * 125}" width="202" height="92" rx="18" fill="${theme.bg2}" stroke="${[theme.blue, theme.indigo, theme.purple][(i + j) % 3]}" stroke-width="2"/><text x="${x + 48}" y="${430 + j * 125}" font-size="20" font-weight="700" fill="${theme.text}">Company ${j + 1}</text><text x="${x + 48}" y="${462 + j * 125}" font-size="17" fill="${theme.muted}">Backend Role</text>`).join("\n")}
      `;
    }).join("\n")}
  `, 8, "Kanban Board");
}

function resumeAnalysis() {
  return shell(`
    ${header("Resume Analysis Screen")}
    ${panel(150, 230, 1620, 650)}
    <rect x="230" y="310" width="430" height="460" rx="30" fill="${theme.bg2}" stroke="${theme.stroke}" stroke-width="2"/>
    <text x="280" y="375" font-size="34" font-weight="850" fill="${theme.text}">Resume Upload</text>
    <text x="280" y="435" font-size="26" fill="${theme.muted}">software-engineer.pdf</text>
    <text x="280" y="490" font-size="24" fill="${theme.muted}">PDF / DOC / DOCX / TXT</text>
    <rect x="745" y="310" width="430" height="460" rx="30" fill="${theme.bg2}" stroke="${theme.stroke}" stroke-width="2"/>
    <text x="795" y="375" font-size="34" font-weight="850" fill="${theme.text}">Job Description</text>
    ${["React", "TypeScript", "API", "PostgreSQL"].map((t, i) => chip(t, 795, 425 + i * 72, [theme.blue, theme.indigo, theme.purple, theme.green][i], 250)).join("\n")}
    <rect x="1260" y="310" width="430" height="460" rx="30" fill="${theme.bg2}" stroke="${theme.stroke}" stroke-width="2"/>
    <text x="1310" y="375" font-size="34" font-weight="850" fill="${theme.text}">Match Result</text>
    <text x="1310" y="480" font-size="90" font-weight="900" fill="${theme.green}">75%</text>
    <text x="1310" y="555" font-size="26" fill="${theme.muted}">Matched: react, api, postgresql</text>
    <text x="1310" y="605" font-size="26" fill="${theme.muted}">Missing: typescript</text>
    <text x="1310" y="660" font-size="24" fill="${theme.muted}">Suggestion generated from missing keywords</text>
  `, 9, "Resume Analysis Screen");
}

function testing() {
  const items = ["Agile Sprint Workflow", "Jira Planning", "Playwright Automation", "xUnit Tests", "MCP Assisted Development", "EF Core Migrations", "GitHub"];
  return shell(`
    ${header("Testing & Engineering")}
    ${panel(150, 250, 760, 560)}
    <text x="220" y="335" font-size="44" font-weight="900" fill="${theme.text}">Validation Pipeline</text>
    ${items.map((t, i) => `<text x="230" y="${410 + i * 55}" font-size="30" fill="${theme.muted}"><tspan fill="${theme.green}" font-weight="900">✓</tspan> ${esc(t)}</text>`).join("\n")}
    ${panel(1030, 250, 630, 560)}
    <text x="1345" y="405" text-anchor="middle" font-size="118" font-weight="950" fill="${theme.green}">21/21</text>
    <text x="1345" y="465" text-anchor="middle" font-size="34" font-weight="850" fill="${theme.text}">QA Report: Tests Passing</text>
    <text x="1345" y="530" text-anchor="middle" font-size="26" fill="${theme.muted}">Backend + Playwright validation</text>
    <text x="1345" y="590" text-anchor="middle" font-size="24" fill="${theme.muted}">Current backend suite also verifies xUnit coverage</text>
  `, 10, "Testing and Engineering");
}

function challenge() {
  return shell(`
    ${header("Biggest Challenge")}
    <text x="110" y="230" font-size="42" font-weight="850" fill="${theme.text}">Migrating legacy data without losing a single record</text>
    ${flow([
      { title: "Legacy File", sub: "email|company|position|date|status|notes" },
      { title: "Migration Script", sub: "PowerShell pipeline" },
      { title: "Validation", sub: "format and required fields" },
      { title: "Normalization", sub: "status, dates, emails" },
      { title: "PostgreSQL", sub: "Users + Applications" },
    ], 150, 315, 115, 560)}
    ${panel(880, 360, 750, 330)}
    <text x="955" y="450" font-size="54" font-weight="900" fill="${theme.green}">Data Integrity Goal</text>
    <text x="955" y="530" font-size="32" fill="${theme.muted}">Preserve every parsed row, normalize it, and emit migrated row count.</text>
    <text x="955" y="615" font-size="28" fill="${theme.muted}">Grounded in scripts/migrate-legacy-applications.ps1</text>
  `, 11, "Biggest Engineering Challenge");
}

function roadmap() {
  const items = ["ATS Improvements", "LLM Resume Review", "Cover Letter Generator", "Interview Assistant", "Smart Job Recommendations"];
  return shell(`
    ${header("Future Roadmap")}
    <text x="112" y="220" font-size="30" fill="${theme.muted}">Roadmap items from README/backlog, separated from current implementation.</text>
    ${items.map((t, i) => {
      const x = 170 + i * 335;
      return `<circle cx="${x}" cy="520" r="70" fill="${theme.panel2}" stroke="${[theme.blue, theme.indigo, theme.purple, theme.green, theme.yellow][i]}" stroke-width="4"/>
      <text x="${x}" y="533" text-anchor="middle" font-size="38" font-weight="900" fill="${theme.text}">${i + 1}</text>
      ${textBlock(t, x, 675, { size: 27, weight: 800, anchor: "middle", max: 16, lineHeight: 34 })}
      ${i < items.length - 1 ? arrow(x + 80, 520, x + 250, 520, [theme.blue, theme.indigo, theme.purple, theme.green][i]) : ""}`;
    }).join("\n")}
  `, 12, "Future Roadmap");
}

function banner() {
  return shell(`
    <text x="140" y="265" font-size="110" font-weight="950" fill="${theme.text}">ApplyFlow AI</text>
    <text x="145" y="355" font-size="42" font-weight="750" fill="${theme.muted}">Legacy Modernization | Backend Engineering | AI Integration</text>
    <rect x="145" y="455" width="1180" height="6" rx="3" fill="${theme.blue}"/>
    <text x="145" y="570" font-size="36" fill="${theme.muted}">ASP.NET Core Web API + PostgreSQL + Next.js</text>
    <text x="145" y="640" font-size="36" fill="${theme.muted}">Authentication, dashboards, workflows, testing, and migration automation</text>
  `, 13, "Repository Banner");
}

function thumbnail() {
  return shell(`
    <text x="150" y="220" font-size="34" font-weight="850" fill="${theme.blue}" letter-spacing="5">PROJECT CASE STUDY</text>
    <text x="150" y="390" font-size="112" font-weight="950" fill="${theme.text}">ApplyFlow AI</text>
    ${textBlock("Legacy C++ to Full-Stack Web Platform", 155, 480, { size: 48, fill: theme.muted, max: 42 })}
    ${chip(".NET", 155, 670, theme.blue)}
    ${chip("Next.js", 340, 670, theme.indigo)}
    ${chip("PostgreSQL", 575, 670, theme.purple)}
    ${chip("Playwright", 890, 670, theme.green)}
    <rect x="1270" y="300" width="430" height="430" rx="60" fill="${theme.panel}" stroke="${theme.stroke}" stroke-width="2"/>
    <text x="1485" y="490" text-anchor="middle" font-size="94" font-weight="950" fill="${theme.blue}">API</text>
    <text x="1485" y="565" text-anchor="middle" font-size="32" font-weight="800" fill="${theme.text}">Modernization</text>
  `, 14, "LinkedIn Thumbnail");
}

const slides = [
  ["01-cover-image", cover()],
  ["02-problem-statement", problem()],
  ["03-modern-architecture", architecture()],
  ["04-legacy-modernization-flow", migration()],
  ["05-resume-match-workflow", aiWorkflow()],
  ["06-application-workflow", appWorkflow()],
  ["07-dashboard-showcase", dashboard()],
  ["08-kanban-board", kanban()],
  ["09-resume-analysis-screen", resumeAnalysis()],
  ["10-testing-engineering", testing()],
  ["11-biggest-engineering-challenge", challenge()],
  ["12-future-roadmap", roadmap()],
  ["13-repository-banner", banner()],
  ["14-linkedin-thumbnail", thumbnail()],
];

const index = `# ApplyFlow AI LinkedIn Carousel Assets

Generated from the repository implementation and documentation.

## Accuracy notes

- Resume/job matching is implemented as deterministic keyword extraction and match scoring in \`ApplicationMatchService.cs\`; this asset set does not claim TF-IDF is implemented.
- The QA slide uses the documented QA report value: 21/21 tests passing. The current backend suite also contains xUnit tests for auth, applications, dashboard, resumes, and match analysis.
- Migration slides are based on \`scripts/migrate-legacy-applications.ps1\`, which imports pipe-delimited legacy rows, normalizes fields, creates users through the API, and inserts applications into PostgreSQL.
- Roadmap features are marked as future roadmap, not current implementation.

## Files

${slides.map(([name], i) => `- \`svg/${name}.svg\` and \`png/${name}.png\` - slide ${i + 1}`).join("\n")}

## Theme

Dark enterprise style, blue/purple accents, 16:9 ratio, 1920x1080.
`;

const archMermaid = `# Modern Architecture

\`\`\`mermaid
flowchart TD
  A[Next.js Frontend] --> B[REST APIs]
  B --> C[ASP.NET Core Web API]
  C --> D[Controllers]
  D --> E[Services]
  E --> F[DTOs]
  F --> G[Entity Framework Core]
  G --> H[(PostgreSQL)]
\`\`\`
`;

async function exportPngs() {
  let chromium;
  try {
    ({ chromium } = await import(pathToFileURL(path.join(root, "applyflow-frontend", "node_modules", "playwright", "index.mjs")).href));
  } catch {
    try {
      ({ chromium } = await import(pathToFileURL(path.join(root, "applyflow-frontend", "node_modules", "@playwright", "test", "index.mjs")).href));
    } catch {
      return false;
    }
  }

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const [name] of slides) {
    const file = path.join(svgDir, `${name}.svg`);
    await page.goto(pathToFileURL(file).href);
    await page.screenshot({ path: path.join(pngDir, `${name}.png`), fullPage: false });
  }
  await browser.close();
  return true;
}

await mkdir(svgDir, { recursive: true });
await mkdir(pngDir, { recursive: true });
await writeFile(path.join(outDir, "README.md"), index, "utf8");
await writeFile(path.join(outDir, "modern-architecture.mmd.md"), archMermaid, "utf8");

for (const [name, svg] of slides) {
  await writeFile(path.join(svgDir, `${name}.svg`), svg, "utf8");
}

const pngExported = await exportPngs();
await writeFile(
  path.join(outDir, "EXPORT_STATUS.txt"),
  pngExported
    ? "PNG exports completed using Playwright/Chrome.\n"
    : "SVG assets were generated. PNG export was skipped because Playwright/Chrome was unavailable.\n",
  "utf8",
);

console.log(`Generated ${slides.length} SVG assets in ${svgDir}`);
console.log(pngExported ? `Generated PNG exports in ${pngDir}` : "PNG export skipped.");
