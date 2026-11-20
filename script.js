document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initHeader();
  initNavToggle();
  initThemeToggle();
  initScrollProgress();
  initReveal();
  initActiveNav();
  initTypewriter();
  initTilt();
  initAiNetwork();
});

function initThemeToggle() {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;

  const apply = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    button.setAttribute(
      "aria-label",
      theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
    );
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  };

  apply(document.documentElement.getAttribute("data-theme") || "light");

  button.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    apply(current === "dark" ? "light" : "dark");
  });
}

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
}

function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${pct}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

function initActiveNav() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll(".nav a")];
  if (!sections.length || !links.length) return;

  const map = new Map(links.map((a) => [a.getAttribute("href"), a]));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) => link.classList.remove("is-active"));
        map.get(id)?.classList.add("is-active");
      });
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initTypewriter() {
  const el = document.getElementById("tagline");
  if (!el) return;

  const fullText = el.textContent.trim();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = fullText;
    return;
  }

  el.textContent = "";
  el.classList.add("is-visible");

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  el.appendChild(cursor);

  let i = 0;
  const speed = 28;

  const tick = () => {
    if (i < fullText.length) {
      el.insertBefore(document.createTextNode(fullText[i]), cursor);
      i += 1;
      setTimeout(tick, speed);
    } else {
      setTimeout(() => cursor.remove(), 1800);
    }
  };

  setTimeout(tick, 700);
}

function initTilt() {
  const cards = document.querySelectorAll("[data-tilt]");
  if (!cards.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotX = ((y - rect.height / 2) / rect.height) * -6;
      const rotY = ((x - rect.width / 2) / rect.width) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initAiNetwork() {
  const canvas = document.getElementById("ai-network");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let nodes = [];
  let pulses = [];
  let width = 0;
  let height = 0;
  let raf = 0;
  let running = true;
  let colors = getNetworkColors();

  function getNetworkColors() {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    return dark
      ? {
          line: "rgba(74, 166, 138, 0.16)",
          node: "rgba(74, 166, 138, 0.55)",
          core: "rgba(224, 146, 94, 0.7)",
          pulse: "rgba(95, 196, 162, 0.85)",
        }
      : {
          line: "rgba(47, 111, 94, 0.14)",
          node: "rgba(47, 111, 94, 0.4)",
          core: "rgba(196, 120, 74, 0.55)",
          pulse: "rgba(61, 143, 120, 0.75)",
        };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const count = width < 700 ? 28 : width < 1100 ? 42 : 58;
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.2 + Math.random() * 2.2,
      hub: Math.random() > 0.86,
    }));
    pulses = [];
  }

  function spawnPulse(a, b) {
    if (pulses.length > 18) return;
    pulses.push({
      x: a.x,
      y: a.y,
      tx: b.x,
      ty: b.y,
      t: 0,
      speed: 0.008 + Math.random() * 0.01,
    });
  }

  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    const linkDist = width < 700 ? 110 : 150;

    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          const alpha = 1 - dist / linkDist;
          ctx.strokeStyle = colors.line;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = a.hub || b.hub ? 1.2 : 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          if (Math.random() < 0.0015 * alpha) spawnPulse(a, b);
        }
      }
    }
    ctx.globalAlpha = 1;

    for (const node of nodes) {
      ctx.beginPath();
      ctx.fillStyle = node.hub ? colors.core : colors.node;
      ctx.arc(node.x, node.y, node.hub ? node.r + 1.4 : node.r, 0, Math.PI * 2);
      ctx.fill();
      if (node.hub) {
        ctx.beginPath();
        ctx.strokeStyle = colors.pulse;
        ctx.globalAlpha = 0.35;
        ctx.arc(node.x, node.y, node.r + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    pulses = pulses.filter((p) => {
      p.t += p.speed;
      if (p.t >= 1) return false;
      const x = p.x + (p.tx - p.x) * p.t;
      const y = p.y + (p.ty - p.y) * p.t;
      ctx.beginPath();
      ctx.fillStyle = colors.pulse;
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });

    raf = requestAnimationFrame(step);
  }

  resize();
  step();

  window.addEventListener("resize", resize);
  window.addEventListener("themechange", () => {
    colors = getNetworkColors();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      step();
    }
  });
}
