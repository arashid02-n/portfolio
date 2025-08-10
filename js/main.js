// Navbar active section
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});

// Email form handler
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/.netlify/functions/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert("email sent successfully");
        form.reset();
      } else {
        alert("error in email: " + result.error);
      }
    } catch (error) {
      alert("something went wrong: " + error.message);
    }
  });
}

// Typed.js initialization
new Typed('.typed', {
  strings: ["Designer", "Developer", "Freelancer"],
  typeSpeed: 100,
  backSpeed: 50,
  backDelay: 2000,
  loop: true
});