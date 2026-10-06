const $ = (s) => document.querySelector(s);
const logoMarks = document.querySelectorAll("[data-logo-mark]");
const logoFrames = ["[>_]", "$ _", "# _", "~/", "./", "&&", "||", "|_", ">>", "</>"];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let logoFrame = 0,
  logoTimer;
function syncLogoMotion() {
  clearInterval(logoTimer);
  if (reducedMotion.matches) return;
  logoTimer = setInterval(() => {
    logoFrame = (logoFrame + 1) % logoFrames.length;
    logoMarks.forEach((mark) => (mark.textContent = logoFrames[logoFrame]));
  }, 500);
}
syncLogoMotion();
reducedMotion.addEventListener("change", syncLogoMotion);

const menu = $("#menu"),
  nav = $("#nav");
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
  menu.textContent = open ? "Close" : "Menu";
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "Menu";
  }),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "Menu";
    menu.focus();
  }
});
const labs = [
  [
    "OWASP Juice Shop",
    "Web application security",
    "https://owasp.org/www-project-juice-shop/",
  ],
  ["DVWA", "Vulnerability practice", "https://github.com/digininja/DVWA"],
  [
    "Metasploitable 2",
    "Infrastructure security lab",
    "https://docs.rapid7.com/metasploit/metasploitable-2/",
  ],
  [
    "Hack The Box",
    "Hands-on security challenges",
    "https://www.hackthebox.com/",
  ],
  [
    "PortSwigger Academy",
    "Web security labs",
    "https://portswigger.net/web-security",
  ],
];
function selectTab(key) {
  if (!["web", "recon", "notes"].includes(key)) return;
  document.querySelectorAll("[data-tab]").forEach((b) => {
    const selected = b.dataset.tab === key;
    b.setAttribute("aria-selected", selected);
    b.tabIndex = selected ? 0 : -1;
  });
  const panel = $("#lab-panel");
  panel.setAttribute("aria-labelledby", "tab-" + key);
  panel.replaceChildren();
  if (key === "web") {
    labs.forEach(([title, desc, url], i) => {
      const row = document.createElement("article");
      row.className = "lab-row";
      const n = document.createElement("span");
      n.textContent = "0" + (i + 1);
      const h = document.createElement("h3");
      h.textContent = title;
      const p = document.createElement("p");
      p.textContent = desc;
      const a = document.createElement("a");
      a.textContent = "Platform";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", "Visit " + title);
      row.append(n, h, p, a);
      panel.append(row);
    });
  } else {
    const box = document.createElement("article");
    box.className = "lab-detail";
    const title = document.createElement("h3"),
      p = document.createElement("p"),
      tag = document.createElement("span");
    tag.className = "tag";
    if (key === "recon") {
      title.textContent = "Enumeration practice";
      p.textContent =
        "Building methodical habits around asset discovery, service enumeration, attack-surface mapping, and evidence collection.";
      tag.textContent = "RECONNAISSANCE / CHALLENGE";
    } else {
      title.textContent = "Security write-ups";
      p.textContent =
        "Short explanations of attack logic, vulnerability impact, and practical defensive takeaways. Research and documentation are part of my ongoing learning practice.";
      tag.textContent = "RESEARCH / DOCUMENTATION";
    }
    box.append(title, p, tag);
    panel.append(box);
  }
}
document.querySelectorAll("[data-tab]").forEach((b, i) => {
  b.addEventListener("click", () => selectTab(b.dataset.tab));
  b.addEventListener("keydown", (e) => {
    const tabs = [...document.querySelectorAll("[data-tab]")];
    let n;
    if (e.key === "ArrowRight") n = (i + 1) % 3;
    else if (e.key === "ArrowLeft") n = (i + 2) % 3;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = 2;
    else return;
    e.preventDefault();
    selectTab(tabs[n].dataset.tab);
    tabs[n].focus();
  });
});
selectTab("web");
const replies = {
  help: "Available commands:\n  whoami      Read my profile\n  skills      Explore my capabilities\n  tools       See my toolkit\n  labs        View practice environments\n  experience  Read my experience\n  education   Read my education\n  contact     Find my contact details\n  clear       Clear this terminal",
  whoami:
    "MD. Fatin Estiakh Aditto\nJunior Penetration Tester · Byte Capsule (Intern)\nFocused on web application security, vulnerability assessment, reconnaissance, and practical security reporting.",
  skills:
    "WEB: Web pentesting, OWASP Top 10 fundamentals, authentication and access control, HTTP analysis.\nNETWORK: Asset discovery, enumeration, TCP/IP, attack-surface mapping.\nWORKFLOW: Kali Linux, Bash, basic Python, evidence collection, reporting.",
  tools:
    "Kali Linux · Nmap · Burp Suite · SQLmap\nMetasploit · Nessus · Acunetix\nBuilding hands-on experience in labs and supervised security work.",
  labs: "OWASP Juice Shop · DVWA · Metasploitable 2\nHack The Box · PortSwigger Web Security Academy\nPersonal learning environments, not client engagements.",
  experience:
    "Junior Penetration Tester — Byte Capsule\nCurrent internship focused on practical pentesting, web security, vulnerability assessment, reconnaissance, and technical reporting.\nOngoing: Security labs and CTF practice.",
  education:
    "Diploma in Computer Science\nRangpur Polytechnic Institute\nFoundation: systems, networking, and technical problem-solving.",
  contact:
    "Email: pentester.fe.aditto@gmail.com\nPhone: +880 1824470860\nLinkedIn: linkedin.com/in/fe-aditto/\nGitHub: github.com/fe-aditto",
};
const commandHistory = [];
let historyIndex = 0;
function runCommand(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;
  commandHistory.push(raw);
  if (commandHistory.length > 50) commandHistory.shift();
  historyIndex = commandHistory.length;
  const out = $("#output");
  if (command === "clear") {
    out.replaceChildren();
    return;
  }
  const prompt = document.createElement("p");
  prompt.className = "green";
  prompt.textContent = "visitor@aditto:~$ " + raw;
  const reply = document.createElement("p");
  reply.textContent =
    replies[command] ||
    `Command not found: ${raw}\nType 'help' to see the portfolio commands.`;
  out.append(prompt, reply);
  while (out.children.length > 40) out.firstElementChild.remove();
  $("#terminal-scroll").scrollTop = $("#terminal-scroll").scrollHeight;
}
$("#terminal-form").addEventListener("submit", (e) => {
  e.preventDefault();
  runCommand($("#command").value);
  $("#command").value = "";
  $("#command").focus();
});
document.querySelectorAll("[data-command]").forEach((b) =>
  b.addEventListener("click", () => {
    runCommand(b.dataset.command);
    $("#command").focus({ preventScroll: true });
  }),
);
$("#copy-email").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("pentester.fe.aditto@gmail.com");
    $("#copy-status").textContent = "Email address copied.";
    $("#copy-email").textContent = "Copied";
  } catch {
    $("#copy-status").textContent =
      "Select the email address to copy it, or click it to open your email app.";
  }
});

// Terminal navigation mirrors familiar shell keyboard controls.
$("#command").addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    historyIndex = Math.max(
      0,
      Math.min(
        commandHistory.length,
        historyIndex + (e.key === "ArrowUp" ? -1 : 1),
      ),
    );
    e.target.value = commandHistory[historyIndex] || "";
  } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
    e.preventDefault();
    $("#output").replaceChildren();
  }
});
// Keep navigation in sync with the section in view.
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      nav.querySelectorAll("a").forEach((link) => {
        if (link.hash === "#" + visible.target.id)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -45% 0px", threshold: [0, 0.15, 0.4] },
  );
  [
    "home",
    "about",
    "skills",
    "labs",
    "terminal",
    "learning",
    "contact",
  ].forEach((id) => sectionObserver.observe(document.getElementById(id)));
}
// Progressive enhancement: the portfolio remains usable if WebGL cannot load.
import("./scene.js").catch(() => {
  const view = $("#network");
  view.classList.add("network-unavailable");
  view.textContent = "Explore the profile, skills, and labs below.";
  ["motion", "rotate", "reset-view"].forEach(
    (id) => (document.getElementById(id).disabled = true),
  );
});
