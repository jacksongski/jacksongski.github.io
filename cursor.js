/* Custom cursor: a dot that follows the pointer and a ring that trails it.
   Skipped on touch and reduced motion, which keep the native cursor.
   Builds its own elements so a page only needs the script tag. */
(function () {
  var fine = window.matchMedia("(pointer: fine)").matches;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce || !document.body) return;

  var root = document.documentElement;
  var ring = document.createElement("div");
  var dot = document.createElement("div");
  ring.className = "cursor-ring";
  dot.className = "cursor-dot";
  ring.setAttribute("aria-hidden", "true");
  dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);
  document.body.appendChild(dot);
  root.classList.add("cursor-on");

  var mx = window.innerWidth / 2,
    my = window.innerHeight / 2,
    dx = mx,
    dy = my,
    rx = mx,
    ry = my,
    raf = null,
    seen = false;

  function frame() {
    dx += (mx - dx) * 0.35;
    dy += (my - dy) * 0.35;
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    dot.style.transform =
      "translate3d(" + dx + "px," + dy + "px,0) translate(-50%,-50%)";
    ring.style.transform =
      "translate3d(" + rx + "px," + ry + "px,0) translate(-50%,-50%)";
    // stop looping once it has caught up
    if (
      Math.abs(mx - rx) < 0.1 &&
      Math.abs(my - ry) < 0.1 &&
      Math.abs(mx - dx) < 0.1 &&
      Math.abs(my - dy) < 0.1
    ) {
      raf = null;
    } else {
      raf = requestAnimationFrame(frame);
    }
  }
  function kick() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  window.addEventListener(
    "mousemove",
    function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (!seen) {
        seen = true;
        root.classList.add("cursor-active");
      }
      kick();
    },
    { passive: true }
  );

  // only genuinely clickable things, otherwise the swollen ring means nothing
  var HIT = "a[href],button,[role='button'],[onclick],summary";
  document.addEventListener("mouseover", function (e) {
    var hit = e.target.closest && e.target.closest(HIT);
    root.classList.toggle("cursor-hovering", !!hit);
  });

  // fade out when the pointer leaves
  document.addEventListener("mouseleave", function () {
    root.classList.remove("cursor-active");
  });
  document.addEventListener("mouseenter", function () {
    if (seen) root.classList.add("cursor-active");
  });

  // static burst on click
  window.addEventListener("mousedown", function (e) {
    root.classList.add("cursor-down");
    var b = document.createElement("div");
    b.className = "cursor-buzz";
    b.style.left = e.clientX + "px";
    b.style.top = e.clientY + "px";
    document.body.appendChild(b);
    b.addEventListener("animationend", function () {
      b.remove();
    });
  });
  window.addEventListener("mouseup", function () {
    root.classList.remove("cursor-down");
  });
})();
