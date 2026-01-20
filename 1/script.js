// Minimal JavaScript for Wisdora Landing Page
document.addEventListener("DOMContentLoaded", function () {
  initFormHandling();
  initMobileMenu();
  initBasicNavigation();
});

// Essential form handling
function initFormHandling() {
  const form = document.getElementById("consultation-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic validation
      let isValid = true;
      this.querySelectorAll("input[required], select[required]").forEach(
        (field) => {
          if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = "#ef4444";
          } else {
            field.style.borderColor = "#10b981";
          }
        }
      );

      if (isValid) {
        // Show success message
        alert(
          "Thank you! Our eLearning expert will contact you within 24 hours."
        );

        // Reset form
        this.reset();

        // Reset border colors
        this.querySelectorAll("input, select").forEach((field) => {
          field.style.borderColor = "#e5e7eb";
        });

        console.log("Form submitted successfully");
      } else {
        alert("Please fill in all required fields.");
      }
    });
  }
}

// Essential mobile menu
function initMobileMenu() {
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      navLinks.classList.toggle("hidden");
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.add("hidden");
      });
    });
  }
}

// Basic navigation (no fancy animations)
function initBasicNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}
