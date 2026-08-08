"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initTheme();
  initMobileNavigation();
  initActiveNavigation();
  initRevealAnimations();
  initContactForm();

});


/* =========================================================
   DARK / LIGHT MODE
========================================================= */

function initTheme() {

  const toggle = document.getElementById("dark-mode-toggle");

  if (!toggle) {
    return;
  }

  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggle.setAttribute("aria-pressed", "true");
  } else {
    document.body.classList.remove("dark-mode");
    toggle.setAttribute("aria-pressed", "false");
  }


  toggle.addEventListener("click", () => {

    const isDark =
      document.body.classList.toggle("dark-mode");

    localStorage.setItem(
      "portfolio-theme",
      isDark ? "dark" : "light"
    );

    toggle.setAttribute(
      "aria-pressed",
      String(isDark)
    );

  });

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initMobileNavigation() {

  const toggle =
    document.getElementById("mobile-menu-toggle");

  const navigation =
    document.getElementById("mobile-navigation");

  if (!toggle || !navigation) {
    return;
  }


  toggle.addEventListener("click", () => {

    const isOpen =
      navigation.classList.toggle("open");

    toggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    toggle.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );

  });


  const links =
    navigation.querySelectorAll(".mobile-nav-link");

  links.forEach((link) => {

    link.addEventListener("click", () => {

      navigation.classList.remove("open");

      toggle.setAttribute(
        "aria-expanded",
        "false"
      );

      toggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    });

  });

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function initActiveNavigation() {

  const sections =
    document.querySelectorAll("main section[id]");

  const navLinks =
    document.querySelectorAll(
      ".desktop-navigation .nav-link"
    );

  if (!sections.length || !navLinks.length) {
    return;
  }


  const updateActiveLink = () => {

    const scrollPosition =
      window.scrollY + 180;

    let currentSection = "hero";


    sections.forEach((section) => {

      const sectionTop =
        section.offsetTop;

      if (scrollPosition >= sectionTop) {
        currentSection =
          section.getAttribute("id");
      }

    });


    navLinks.forEach((link) => {

      const target =
        link.getAttribute("href");

      link.classList.toggle(
        "active",
        target === `#${currentSection}`
      );

    });

  };


  updateActiveLink();

  window.addEventListener(
    "scroll",
    updateActiveLink,
    { passive: true }
  );

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function initRevealAnimations() {

  const elements =
    document.querySelectorAll(".reveal");

  if (!elements.length) {
    return;
  }


  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    elements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }


  const observer =
    new IntersectionObserver(
      (entries, observerInstance) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          observerInstance.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );


  elements.forEach((element) => {
    observer.observe(element);
  });

}


/* =========================================================
   CONTACT FORM
========================================================= */

function initContactForm() {

  const form =
    document.getElementById("contact-form");

  const status =
    document.getElementById("form-status");

  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (status) {
        status.textContent =
          "Sending message...";
      }


      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );

      const originalButtonContent =
        submitButton
          ? submitButton.innerHTML
          : "";


      if (submitButton) {

        submitButton.disabled = true;

        submitButton.innerHTML =
          `
            <span>Sending...</span>
            <i class="bi bi-arrow-repeat"></i>
          `;

      }


      const formData =
        new FormData(form);

      const data =
        Object.fromEntries(
          formData.entries()
        );


      try {

        const response =
          await fetch(
            "/.netlify/functions/send-message",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify(data)
            }
          );


        const result =
          await response.json();


        if (!response.ok || !result.success) {

          throw new Error(
            result.error ||
            "Unable to send the message."
          );

        }


        form.reset();

        if (status) {

          status.textContent =
            "Email sent successfully.";

        }


      } catch (error) {

        if (status) {

          status.textContent =
            error.message ||
            "Something went wrong.";

        }

      } finally {

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.innerHTML =
            originalButtonContent;

        }

      }

    }
  );

}
