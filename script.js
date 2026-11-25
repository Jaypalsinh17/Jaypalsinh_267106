// Wait until the HTML document is loaded
document.addEventListener("DOMContentLoaded", function () {
  // =========================================
  // Helper: Small Status Toast Notification
  // =========================================
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function showToast(text) {
    toastEl.textContent = text;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.hidden = true;
    }, 2400);
  }

  // =========================================
  // 1. Dark Mode Toggle
  // =========================================
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = themeToggle.querySelector(".theme-label");

  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeLabel.textContent = "Light";
    themeToggle.setAttribute("aria-pressed", "true");
  }

  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    themeLabel.textContent = isDark ? "Light" : "Dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    showToast(isDark ? "Switched to dark theme" : "Switched to light theme");
  });

  // =========================================
  // 2. Mobile Menu Open / Close
  // =========================================
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");

  menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navItems.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // =========================================
  // 3. Page View Mode Switcher (All vs Focused Page)
  // =========================================
  const viewTabs = document.querySelectorAll(".view-tab");
  const sections = document.querySelectorAll("main > section");
  const heroSection = document.getElementById("hero-section");
  const brandLink = document.querySelector(".brand");
  const jumpLinks = document.querySelectorAll("[data-jump]");

  function setPageView(viewName) {
    // Update tab button active states
    viewTabs.forEach(function (tab) {
      tab.classList.toggle("active", tab.getAttribute("data-view") === viewName);
    });

    // Update navbar active link
    navItems.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-section") === viewName);
    });

    if (viewName === "all") {
      heroSection.hidden = false;
      sections.forEach(function (sec) {
        sec.hidden = false;
      });
    } else {
      heroSection.hidden = true;
      sections.forEach(function (sec) {
        const isTarget = sec.getAttribute("data-page") === viewName;
        sec.hidden = !isTarget;
        if (isTarget) {
          sec.classList.add("visible");
        }
      });
    }
  }

  viewTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setPageView(tab.getAttribute("data-view"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Clicking brand returns to full overview
  brandLink.addEventListener("click", function () {
    setPageView("all");
  });

  // Clicking navbar links or hero buttons switches cleanly when in single-page mode
  navItems.forEach(function (link) {
    link.addEventListener("click", function () {
      const targetSection = link.getAttribute("data-section");
      const currentActiveTab = document.querySelector(".view-tab.active").getAttribute("data-view");
      if (currentActiveTab !== "all") {
        setPageView(targetSection);
      }
    });
  });

  jumpLinks.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const currentActiveTab = document.querySelector(".view-tab.active").getAttribute("data-view");
      if (currentActiveTab !== "all") {
        setPageView(btn.getAttribute("data-jump"));
      }
    });
  });

  // =========================================
  // 4. Interactive Skills Inspector
  // =========================================
  const skillButtons = document.querySelectorAll(".skill-item");
  const skillDetailTitle = document.getElementById("skill-detail-title");
  const skillDetailText = document.getElementById("skill-detail-text");
  const skillFilterBtn = document.getElementById("skill-filter-btn");

  const skillDetails = {
    html: {
      title: "HTML",
      text: "Semantic page structure using header, nav, main, section, footer, and accessible form elements like inputs, labels, radio buttons, checkboxes, and select menus.",
      filter: "html-css"
    },
    css: {
      title: "CSS",
      text: "Clean layouts with Flexbox and Grid, CSS custom properties for light and dark themes, responsive media queries, and subtle hover transitions.",
      filter: "html-css"
    },
    js: {
      title: "JavaScript",
      text: "DOM manipulation and event handling using addEventListener, input events, form validation, IntersectionObserver scroll reveal, and localStorage.",
      filter: "javascript"
    },
    git: {
      title: "Git and GitHub",
      text: "Tracking changes step by step with small focused commits, checking repository history with git log, and preparing projects for GitHub Pages.",
      filter: "all"
    }
  };

  skillButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.getAttribute("data-skill");
      const info = skillDetails[key];

      skillButtons.forEach(function (item) {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      skillDetailTitle.textContent = info.title;
      skillDetailText.textContent = info.text;
      skillFilterBtn.setAttribute("data-filter-target", info.filter);
    });
  });

  // =========================================
  // 5. Projects Filter & Workbench Preview
  // =========================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectRows = document.querySelectorAll(".project-row");
  const projectCount = document.getElementById("project-count");

  function applyProjectFilter(filterValue) {
    let visibleCount = 0;

    filterButtons.forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-filter") === filterValue);
    });

    projectRows.forEach(function (row) {
      const tech = row.getAttribute("data-tech");
      const matches = filterValue === "all" || tech === filterValue;
      row.hidden = !matches;
      if (matches) {
        visibleCount += 1;
      }
    });

    projectCount.textContent = "Showing " + visibleCount + " of " + projectRows.length;
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyProjectFilter(btn.getAttribute("data-filter"));
    });
  });

  // Jump from Skill Detail directly to filtered Projects
  skillFilterBtn.addEventListener("click", function () {
    const targetFilter = skillFilterBtn.getAttribute("data-filter-target");
    const activeView = document.querySelector(".view-tab.active").getAttribute("data-view");
    if (activeView !== "all") {
      setPageView("projects");
    }
    applyProjectFilter(targetFilter);
    document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
  });

  // Workbench preview & Code Notes
  const previewBox = document.getElementById("project-preview");
  const previewLabel = document.getElementById("preview-label");
  const closePreviewBtn = document.getElementById("close-preview");
  const demoRegistration = document.getElementById("demo-registration");
  const demoColourChanger = document.getElementById("demo-colour-changer");
  const viewLinks = document.querySelectorAll(".project-view");
  const workbenchTabs = document.querySelectorAll(".workbench-tab");
  const tabLive = document.getElementById("tab-live");
  const tabNotes = document.getElementById("tab-notes");
  const notesSummary = document.getElementById("notes-summary");
  const notesList = document.getElementById("notes-list");

  const projectNotes = {
    registration: {
      summary: "Built with semantic HTML form controls and required-field validation.",
      items: [
        "Uses text, email, password, radio, checkbox, and select inputs.",
        "Groups radio buttons and checkboxes cleanly with fieldset and legend.",
        "Checks input length and displays a summary once all required fields pass."
      ]
    },
    "colour-changer": {
      summary: "Interactive DOM demo powered by click and input event listeners.",
      items: [
        "Uses addEventListener('click', ...) to cycle or pick heading colours.",
        "Uses addEventListener('input', ...) to mirror typed text immediately.",
        "Calculates live character and word counts on every keystroke."
      ]
    }
  };

  function setWorkbenchTab(tabName) {
    workbenchTabs.forEach(function (tab) {
      tab.classList.toggle("active", tab.getAttribute("data-tab") === tabName);
    });
    tabLive.hidden = tabName !== "live";
    tabNotes.hidden = tabName !== "notes";
  }

  workbenchTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setWorkbenchTab(tab.getAttribute("data-tab"));
    });
  });

  viewLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const projectName = link.getAttribute("data-project");
      const notes = projectNotes[projectName];

      previewBox.hidden = false;
      demoRegistration.hidden = projectName !== "registration";
      demoColourChanger.hidden = projectName !== "colour-changer";
      setWorkbenchTab("live");

      previewLabel.textContent =
        projectName === "registration"
          ? "Workbench — Registration Form"
          : "Workbench — Colour Changer & Live Text";

      // Populate Code Notes tab
      notesSummary.textContent = notes.summary;
      notesList.innerHTML = "";
      notes.items.forEach(function (point) {
        const li = document.createElement("li");
        li.textContent = point;
        notesList.appendChild(li);
      });

      previewBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  closePreviewBtn.addEventListener("click", function () {
    previewBox.hidden = true;
  });

  // Project 1 Demo: password strength hint + submit summary
  const demoRegForm = document.getElementById("demo-reg-form");
  const demoRegStatus = document.getElementById("demo-reg-status");
  const regPass = document.getElementById("reg-pass");
  const regStrength = document.getElementById("reg-strength");

  regPass.addEventListener("input", function () {
    const val = regPass.value;
    if (val.length === 0) {
      regStrength.textContent = "Strength: waiting for input";
    } else if (val.length < 6) {
      regStrength.textContent = "Strength: Weak (use 6+ characters)";
    } else if (/[0-9]/.test(val) && /[A-Za-z]/.test(val)) {
      regStrength.textContent = "Strength: Strong";
    } else {
      regStrength.textContent = "Strength: Fair (add a number)";
    }
  });

  demoRegForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const nameVal = document.getElementById("reg-name").value.trim();
    const branchVal = document.getElementById("reg-course").value;
    demoRegStatus.textContent =
      "Submitted for " + nameVal + " (" + branchVal + "). All required fields verified.";
  });

  // Project 2 Demo: Colour Changer + Swatches + Live Text + Stats
  const changeColourBtn = document.getElementById("change-colour-btn");
  const resetColourBtn = document.getElementById("reset-colour-btn");
  const demoHeading = document.getElementById("demo-heading");
  const liveTextInput = document.getElementById("live-text-input");
  const liveTextOutput = document.getElementById("live-text-output");
  const liveTextStats = document.getElementById("live-text-stats");
  const swatches = document.querySelectorAll(".swatch");

  const headingColours = ["#1d4d3a", "#2f6b53", "#6b5a3e", "#1b221d"];
  let colourIndex = 0;

  changeColourBtn.addEventListener("click", function () {
    demoHeading.style.color = headingColours[colourIndex];
    colourIndex = (colourIndex + 1) % headingColours.length;
  });

  swatches.forEach(function (swatch) {
    swatch.addEventListener("click", function () {
      demoHeading.style.color = swatch.getAttribute("data-colour");
    });
  });

  resetColourBtn.addEventListener("click", function () {
    demoHeading.style.color = "";
    liveTextInput.value = "";
    liveTextOutput.textContent = "...";
    liveTextStats.textContent = "0 characters · 0 words";
  });

  liveTextInput.addEventListener("input", function () {
    const raw = liveTextInput.value;
    const trimmed = raw.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

    liveTextOutput.textContent = trimmed === "" ? "..." : raw;
    liveTextStats.textContent = raw.length + " characters · " + words + " words";
  });

  // =========================================
  // 6. Scroll-Reveal, Scrollspy, Progress & Back-to-Top
  // =========================================
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealSections = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealSections.forEach(function (section) {
      section.classList.add("visible");
    });
  } else {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealSections.forEach(function (section) {
      observer.observe(section);
    });
  }

  const progressBar = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";

    // Show floating Back-to-Top button after scrolling down
    backToTopBtn.hidden = scrollTop < 300;

    // Update active navbar link during full-page scroll
    const activeTab = document.querySelector(".view-tab.active").getAttribute("data-view");
    if (activeTab === "all") {
      let currentId = "";
      sections.forEach(function (sec) {
        if (!sec.hidden && scrollTop >= sec.offsetTop - 160) {
          currentId = sec.id;
        }
      });
      navItems.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("data-section") === currentId);
      });
    }
  });

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Keyboard shortcuts: 0 = All, 1-4 = Page views, Escape = Close preview
  document.addEventListener("keydown", function (event) {
    const tag = document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      return;
    }

    const keyMap = {
      "0": "all",
      "1": "about",
      "2": "skills",
      "3": "projects",
      "4": "contact"
    };

    if (keyMap[event.key]) {
      setPageView(keyMap[event.key]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (event.key === "Escape" && !previewBox.hidden) {
      previewBox.hidden = true;
    }
  });

  // =========================================
  // 7. Copy Email & Contact Form Validation
  // =========================================
  const copyEmailBtn = document.getElementById("copy-email-btn");
  copyEmailBtn.addEventListener("click", function () {
    const emailText = "jaypalsinhbhati56@gmail.com";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emailText).then(function () {
        copyEmailBtn.textContent = "Copied";
        showToast("Email copied to clipboard");
        setTimeout(function () {
          copyEmailBtn.textContent = "Copy email";
        }, 1800);
      });
    } else {
      showToast(emailText);
    }
  });

  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const messageInput = document.getElementById("contact-message");
  const messageCounter = document.getElementById("message-counter");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");
  const formStatus = document.getElementById("form-status");

  function setFieldError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    if (message !== "") {
      inputEl.classList.add("input-error");
    } else {
      inputEl.classList.remove("input-error");
    }
  }

  nameInput.addEventListener("input", function () {
    setFieldError(nameInput, nameError, "");
  });

  emailInput.addEventListener("input", function () {
    setFieldError(emailInput, emailError, "");
  });

  messageInput.addEventListener("input", function () {
    setFieldError(messageInput, messageError, "");
    const len = messageInput.value.trim().length;
    messageCounter.textContent =
      len >= 10 ? len + " chars (ready)" : len + " / 10 min chars";
  });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;
    formStatus.textContent = "";
    formStatus.className = "form-status";

    if (nameValue === "") {
      setFieldError(nameInput, nameError, "Please enter your name.");
      isValid = false;
    } else {
      setFieldError(nameInput, nameError, "");
    }

    if (emailValue === "") {
      setFieldError(emailInput, emailError, "Please enter your email address.");
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      setFieldError(emailInput, emailError, "Please enter a valid email address.");
      isValid = false;
    } else {
      setFieldError(emailInput, emailError, "");
    }

    if (messageValue.length < 10) {
      setFieldError(
        messageInput,
        messageError,
        "Please write a message of at least 10 characters."
      );
      isValid = false;
    } else {
      setFieldError(messageInput, messageError, "");
    }

    if (!isValid) {
      formStatus.textContent = "Please fix the highlighted fields above.";
      formStatus.classList.add("form-error");
      return;
    }


