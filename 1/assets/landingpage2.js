/**
 * Main JavaScript for website interactions
 * Features:
 * 1. AOS (Animate on Scroll) Initialization
 * 2. Background Slider
 * 3. FAQ Accordion
 * 4. Animated Counters on Scroll
 * 5. Intersection Observer for scroll-triggered animations
 * 6. Form Validation & Submission
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ============================================================
   * 1. Initialize AOS (Animate on Scroll)
   * ============================================================ */
  if (typeof AOS !== "undefined") {
    AOS.init({
      once: true, // Animations occur only once
      offset: 50, // Start animation 50px before element enters viewport
      duration: 800, // Animation duration in ms
    });
  }

  /* ============================================================
   * 2. Background Slider
   * ============================================================ */
  const slides = document.querySelectorAll("#bg-slider > div");
  if (slides.length > 0) {
    let currentSlide = 0;

    setInterval(() => {
      slides[currentSlide].classList.replace("opacity-100", "opacity-0");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.replace("opacity-0", "opacity-100");
    }, 4000); // Slide change every 4 seconds
  }

  /* ============================================================
   * 3. FAQ Accordion Logic
   * ============================================================ */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const header = item.querySelector(".faq-header");
    const content = item.querySelector(".faq-content");
    const icon = item.querySelector(".faq-icon");

    header.addEventListener("click", () => {
      const isOpen = content.classList.contains("open");

      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        const otherContent = otherItem.querySelector(".faq-content");
        const otherIcon = otherItem.querySelector(".faq-icon");
        otherContent.classList.remove("open");
        otherIcon.classList.remove("rotate-180");
      });

      // Toggle current FAQ
      if (!isOpen) {
        content.classList.add("open");
        icon.classList.add("rotate-180");
      }
    });
  });

  /* ============================================================
   * 4. Animated Counters (Trigger on Scroll)
   * ============================================================ */
  const counterContainer = document.getElementById("results-container");
  if (counterContainer) {
    const counters = document.querySelectorAll(".counter");

    const runCounters = () => {
      counters.forEach((counter) => {
        const target = parseFloat(counter.dataset.target);
        const duration = 2000; // ms
        const startTime = performance.now();

        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const value = easeOut * target;

          counter.innerText =
            target % 1 !== 0 ? value.toFixed(1) : Math.floor(value);

          if (progress < 1) requestAnimationFrame(update);
          else counter.innerText = target;
        };

        requestAnimationFrame(update);
      });
    };

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        if (entries[0].isIntersecting) {
          runCounters();
          observerInstance.unobserve(counterContainer);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(counterContainer);
  }

  /* ============================================================
   * 5. Intersection Observer for Scroll Animations
   * ============================================================ */
  const scrollElements = document.querySelectorAll(".animate-on-scroll");
  if (scrollElements.length > 0) {
    const scrollObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up");
            obs.unobserve(entry.target); // Fire only once
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.15 },
    );

    scrollElements.forEach((el) => scrollObserver.observe(el));
  }

  /* ============================================================
   * 6. Form Validation & Submission
   * ============================================================ */
  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const requiredFields = form.querySelectorAll(".required");
      let isValid = true;
      const formData = {};

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.border = "1px solid red";
        } else {
          field.style.border = "1px solid #ccc";
          formData[field.name] = field.value.trim();
        }
      });

      if (!isValid) {
        alert("Please fill all required fields");
        return;
      }

      // Redirect to thank you page
      window.location.href =
        "https://wisdora.vercel.app/thank-you-learning-management-system-development.html";
    });
  }
});
