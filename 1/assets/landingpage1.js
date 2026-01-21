/**
 * Responsive Reveal Animation and Canvas Particle Background
 * Optimized and documented
 *
 * Features:
 * 1. IntersectionObserver to reveal elements with animation.
 * 2. Responsive particle and shape background canvas.
 * 3. Mobile and low-end device optimizations.
 * 4. Simple form validation and redirect.
 */

// -------------------------
// 1. Reveal Elements on Scroll
// -------------------------
const isMobile = window.innerWidth < 768;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        // On mobile, animate only once
        if (isMobile) observer.unobserve(entry.target);
      } else {
        // On desktop, allow repeated animation
        if (!isMobile) entry.target.classList.remove("active");
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// -------------------------
// 2. Canvas Particle & Shape Background
// -------------------------
(() => {
  const canvas = document.getElementById("wave-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit devicePixelRatio to 2 for performance

  // Resize canvas to full screen
  function resizeCanvas() {
    const { innerWidth: w, innerHeight: h } = window;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Detect mobile and low-end devices
  const lowEnd =
    isMobile ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4);

  // -------------------------
  // Particle Class
  // -------------------------
  class Particle {
    constructor(x, y, speed, amplitude, frequency, radius = 2) {
      this.x = x;
      this.y = y;
      this.baseY = y;
      this.speed = speed;
      this.amplitude = amplitude;
      this.frequency = frequency;
      this.radius = radius;
    }

    update() {
      this.x += this.speed;
      this.y = this.baseY + Math.sin(this.x * this.frequency) * this.amplitude;

      if (this.x > window.innerWidth) this.x = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(249,115,22,0.7)";
      ctx.fill();
    }
  }

  // -------------------------
  // Shape Class (Hexagon)
  // -------------------------
  class Shape {
    constructor() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.size = 12 + Math.random() * 12;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.angle = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.005;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.rotationSpeed;

      if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
      if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.strokeStyle = "rgba(249,115,22,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = 0; i < 6; i++) {
        const theta = (i / 6) * Math.PI * 2;
        const px = Math.cos(theta) * this.size;
        const py = Math.sin(theta) * this.size;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  let particles = [];
  let shapes = [];

  // Initialize particles and shapes
  function initParticles() {
    const particleCount = isMobile ? 20 : 60;
    const shapeCount = isMobile ? 6 : 20;

    particles = [];
    for (let i = 0; i < particleCount; i++) {
      const speed = lowEnd
        ? 0.15 + Math.random() * 0.2
        : 0.3 + Math.random() * 0.3;
      const amplitude = lowEnd
        ? 10 + Math.random() * 10
        : 20 + Math.random() * 15;

      particles.push(
        new Particle(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
          speed,
          amplitude,
          0.01 + Math.random() * 0.015,
          lowEnd ? 1.5 : 2,
        ),
      );
    }

    shapes = [];
    for (let i = 0; i < shapeCount; i++) {
      shapes.push(new Shape());
    }
  }

  // Connect nearby particles with lines
  function connectParticles() {
    const maxDist = lowEnd ? 50 ** 2 : 80 ** 2;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = dx * dx + dy * dy;

        if (dist < maxDist) {
          ctx.strokeStyle = "rgba(249,115,22,0.1)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    if (!lowEnd) connectParticles(); // Skip connections on low-end devices

    shapes.forEach((s) => {
      s.update();
      s.draw();
    });

    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  // Re-init particles and shapes on window resize
  window.addEventListener("resize", initParticles);
})();

// -------------------------
// 3. Form Validation & Redirect
// -------------------------
document.getElementById("form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const requiredFields = document.querySelectorAll("#form .required");
  let isValid = true;
  const formData = {};

  requiredFields.forEach((field) => {
    if (!field.value) {
      isValid = false;
      field.style.border = "1px solid red";
    } else {
      field.style.border = "1px solid #ccc";
      formData[field.name] = field.value;
    }
  });

  if (!isValid) {
    alert("Please fill all required fields");
    return;
  }

  // Redirect on successful validation
  window.location.href =
    "https://wisdora.vercel.app/thank-you-custom-elearning-solution.html";
});
