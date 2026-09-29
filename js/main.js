/* Mahmoud Adel — Portfolio interactions */
(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    var preloader = document.getElementById("preloader");
    if (preloader) setTimeout(function () { preloader.classList.add("hidden"); }, 500);
  });

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById("nav");
  var navMenu = document.getElementById("navMenu");
  var navToggle = document.getElementById("navToggle");

  function closeMenu() {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  navToggle.addEventListener("click", function () {
    var isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("no-scroll", isOpen);
  });

  navMenu.querySelectorAll(".nav__link").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- Scroll: navbar, progress, active link, back-to-top ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);
  var progress = document.getElementById("scrollProgress");
  var toTop = document.getElementById("toTop");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;

    nav.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 500);
    progress.style.width = (docHeight > 0 ? (y / docHeight) * 100 : 0) + "%";

    var currentId = sections.length ? sections[0].id : "";
    sections.forEach(function (section) {
      if (y >= section.offsetTop - 140) currentId = section.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Typing effect ---------- */
  var typedEl = document.getElementById("typed");
  var phrases = [
    "Frontend Developer",
    "React.js Developer",
    "React Native Developer",
    "TypeScript Enthusiast",
    "Mobile UI/UX Builder"
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function type() {
    var phrase = phrases[phraseIndex];
    typedEl.textContent = phrase.slice(0, charIndex);

    if (!deleting && charIndex < phrase.length) {
      charIndex++;
      setTimeout(type, 85);
    } else if (!deleting) {
      deleting = true;
      setTimeout(type, 1600);
    } else if (charIndex > 0) {
      charIndex--;
      setTimeout(type, 40);
    } else {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 300);
    }
  }
  if (typedEl) type();

  /* ---------- Scroll reveal + counters + skill bars ---------- */
  function animateCounters(container) {
    container.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseInt(el.dataset.count, 10);
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progressRatio = Math.min((timestamp - start) / 1400, 1);
        el.textContent = Math.floor(progressRatio * target);
        if (progressRatio < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    });
  }

  function fillBars(container) {
    container.querySelectorAll(".bar__fill").forEach(function (fill) {
      fill.style.width = fill.dataset.width + "%";
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      animateCounters(entry.target);
      fillBars(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  document.querySelectorAll("[data-animate]").forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 90 + "ms";
    observer.observe(el);
  });

  /* ---------- Project filters ---------- */
  var filters = document.querySelectorAll(".filter");
  var projects = document.querySelectorAll(".project");

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("active"); });
      button.classList.add("active");

      var value = button.dataset.filter;
      projects.forEach(function (card) {
        var match = value === "all" || card.dataset.category === value;
        card.classList.toggle("hide", !match);
      });
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setFieldError(input, message) {
    var field = input.closest(".field");
    field.classList.toggle("invalid", Boolean(message));
    field.querySelector(".error").textContent = message;
    return !message;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // form.name would resolve to the form's name attribute, so go through elements
    var name = form.elements.name;
    var email = form.elements.email;
    var subject = form.elements.subject;
    var message = form.elements.message;

    var valid = [
      setFieldError(name, name.value.trim().length < 2 ? "Please enter your name." : ""),
      setFieldError(email, EMAIL_RE.test(email.value.trim()) ? "" : "Please enter a valid email address."),
      setFieldError(subject, subject.value.trim() ? "" : "Please enter a subject."),
      setFieldError(message, message.value.trim().length < 10 ? "Message must be at least 10 characters." : "")
    ].every(Boolean);

    if (!valid) {
      formStatus.className = "form-status";
      formStatus.textContent = "Please fix the highlighted fields.";
      return;
    }

    var body =
      "Name: " + name.value.trim() +
      "\nEmail: " + email.value.trim() +
      "\n\n" + message.value.trim();

    window.location.href =
      "mailto:mrmahmoudadel1996@gmail.com?subject=" +
      encodeURIComponent(subject.value.trim()) +
      "&body=" + encodeURIComponent(body);

    formStatus.className = "form-status success";
    formStatus.textContent = "Opening your email client… Thanks for reaching out!";
    form.reset();
  });

  form.querySelectorAll("input, textarea").forEach(function (input) {
    input.addEventListener("input", function () {
      input.closest(".field").classList.remove("invalid");
      input.closest(".field").querySelector(".error").textContent = "";
    });
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
