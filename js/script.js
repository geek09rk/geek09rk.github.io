(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Theme toggle (defaults to dark; choice persists across pages via localStorage)
  var themeToggle = document.getElementById("themeToggle");
  var root = document.documentElement;
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // Publication filters + search
  var filterButtons = document.querySelectorAll(".filter-btn");
  var pubGroups = document.querySelectorAll(".pub-group");
  var pubSearch = document.getElementById("pubSearch");
  var pubNoResults = document.getElementById("pubNoResults");

  function applyPubFilters() {
    var activeBtn = document.querySelector(".filter-btn.active");
    var filter = activeBtn ? activeBtn.getAttribute("data-filter") : "all";
    var query = pubSearch ? pubSearch.value.trim().toLowerCase() : "";
    var totalVisible = 0;

    pubGroups.forEach(function (group) {
      var visibleCount = 0;
      group.querySelectorAll(".pub-item").forEach(function (item) {
        var typeMatches = filter === "all" || item.getAttribute("data-type") === filter;
        var textMatches = query === "" || item.textContent.toLowerCase().indexOf(query) !== -1;
        var matches = typeMatches && textMatches;
        item.hidden = !matches;
        if (matches) visibleCount++;
      });
      group.hidden = visibleCount === 0;
      totalVisible += visibleCount;
      var countEl = group.querySelector(".pub-group-title .count");
      if (countEl) countEl.textContent = "(" + visibleCount + ")";
    });

    if (pubNoResults) pubNoResults.hidden = totalVisible !== 0;
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      applyPubFilters();
    });
  });

  if (pubSearch) {
    pubSearch.addEventListener("input", applyPubFilters);
  }

})();
