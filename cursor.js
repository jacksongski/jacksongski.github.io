/* Click burst: a small grayscale-noise puff at the pointer on mousedown.
   Desktop only, and skipped under reduced motion (which disables the animation,
   so the element would otherwise never fire animationend and never get cleaned up). */
(function () {
  var fine = window.matchMedia("(pointer: fine)").matches;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce || !document.body) return;

  window.addEventListener("mousedown", function (e) {
    var b = document.createElement("div");
    b.className = "cursor-buzz";
    b.style.left = e.clientX + "px";
    b.style.top = e.clientY + "px";
    document.body.appendChild(b);
    b.addEventListener("animationend", function () {
      b.remove();
    });
  });
})();
