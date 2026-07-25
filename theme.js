/* Theme picker. Builds the swatches in the nav and remembers the choice.
   Setting data-theme on <html> is all it takes, since the CSS derives every
   color from that one hue. */
(function () {
  var THEMES = [
    { id: "purple", label: "Purple", sw: "#cdcfff" },
    { id: "blue", label: "Blue", sw: "#a5c8ff" },
    { id: "cyan", label: "Cyan", sw: "#8fe3ea" },
    { id: "green", label: "Green", sw: "#9fe6c4" },
    { id: "amber", label: "Amber", sw: "#f2d79b" },
    { id: "red", label: "Red", sw: "#ffb0b8" },
    { id: "multi", label: "Multicolor", sw: null },
  ];
  var KEY = "theme";
  var root = document.documentElement;

  function saved() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }
  function store(id) {
    try {
      localStorage.setItem(KEY, id);
    } catch (e) {}
  }

  var current = saved() || "purple";
  root.setAttribute("data-theme", current);

  function findTheme(id) {
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === id) return THEMES[i];
    }
    return THEMES[0];
  }

  function build() {
    var nav = document.getElementById("navbar");
    if (!nav || document.querySelector(".theme-picker")) return;

    var picker = document.createElement("div");
    picker.className = "theme-picker";

    var label = document.createElement("span");
    label.className = "theme-picker-label";
    label.textContent = "Theme";
    picker.appendChild(label);

    /* mobile: one dot showing the current color, opens the popover */
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-toggle";
    toggle.setAttribute("aria-label", "Choose color theme");
    toggle.setAttribute("aria-expanded", "false");
    picker.appendChild(toggle);

    var grid = document.createElement("div");
    grid.className = "theme-swatches";

    function paintToggle(id) {
      var t = findTheme(id);
      toggle.classList.toggle("tog-multi", id === "multi");
      toggle.style.setProperty("--tsw", t.sw || "#cdcfff");
    }
    function close() {
      picker.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    THEMES.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "theme-swatch" + (t.id === "multi" ? " sw-multi" : "");
      if (t.sw) b.style.setProperty("--sw", t.sw);
      b.setAttribute("aria-label", t.label + " theme");
      b.setAttribute("title", t.label);
      if (t.id === current) b.classList.add("is-active");
      b.addEventListener("click", function () {
        current = t.id;
        root.setAttribute("data-theme", t.id);
        store(t.id);
        grid.querySelectorAll(".theme-swatch").forEach(function (el) {
          el.classList.remove("is-active");
        });
        b.classList.add("is-active");
        paintToggle(t.id);
        close();
      });
      grid.appendChild(b);
    });

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = picker.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (picker.classList.contains("is-open") && !picker.contains(e.target)) {
        close();
      }
    });

    paintToggle(current);
    picker.appendChild(grid);
    nav.appendChild(picker);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
