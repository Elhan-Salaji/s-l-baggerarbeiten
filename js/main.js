/*
 * Verhalten der Seite. Reine Verbesserung: ohne JavaScript bleibt die
 * Seite lesbar und kontaktierbar, die Galerie öffnet die Bilder direkt,
 * das Formular und alle Links funktionieren weiter.
 *
 * Enthält: mobiles Menü, Lightbox (Maus und Tastatur), aktiver
 * Navigationspunkt beim Scrollen, Fokus nach Anker-Sprüngen, Honeypot.
 */
(function () {
  "use strict";

  /* ---- Mobiles Menü ------------------------------------------------ */
  function setupMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("hauptnavigation");
    if (!toggle || !nav) return;

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Menü öffnen");
    }

    function openMenu() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Menü schließen");
    }

    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Auswahl eines Links schließt das Menü.
    nav.addEventListener("click", function (event) {
      if (event.target.closest(".nav__link")) closeMenu();
    });

    // Klick außerhalb schließt das offene Menü.
    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (event.target.closest(".site-header")) return;
      closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });

    return closeMenu;
  }

  /* ---- Fokus nach einem Sprung zu einem Anker --------------------- */
  // Das sanfte Scrollen übernimmt CSS (scroll-behavior). Hier wandert nur
  // der Tastatur- und Screenreader-Fokus zum Ziel mit.
  function setupAnchorFocus(closeMenu) {
    var links = document.querySelectorAll('a[href^="#"]');
    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener("click", function () {
        var id = link.getAttribute("href").slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        if (closeMenu) closeMenu();
        target.setAttribute("tabindex", "-1");
        requestAnimationFrame(function () {
          target.focus({ preventScroll: true });
        });
      });
    });
  }

  /* ---- Aktiver Navigationspunkt beim Scrollen --------------------- */
  function setupScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) {
        map[id] = link;
        sections.push(section);
      }
    });
    if (!sections.length || !("IntersectionObserver" in window)) return;

    function setActive(id) {
      links.forEach(function (link) {
        if (map[id] === link) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      // Aktiv ist der Abschnitt, dessen Oberkante das obere Drittel erreicht.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---- Lightbox --------------------------------------------------- */
  function setupLightbox() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
    if (!items.length) return;

    var index = 0;
    var lastFocused = null;

    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Galerie, vergrößerte Ansicht");
    box.hidden = true;
    box.innerHTML =
      '<span class="lightbox__counter" aria-hidden="true"></span>' +
      '<button class="lightbox__close" type="button" aria-label="Schließen">&times;</button>' +
      '<button class="lightbox__nav lightbox__prev" type="button" aria-label="Vorheriges Bild">&#8249;</button>' +
      '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" alt="">' +
      '<figcaption class="lightbox__caption"></figcaption>' +
      "</figure>" +
      '<button class="lightbox__nav lightbox__next" type="button" aria-label="Nächstes Bild">&#8250;</button>';
    document.body.appendChild(box);

    var imgEl = box.querySelector(".lightbox__img");
    var captionEl = box.querySelector(".lightbox__caption");
    var counterEl = box.querySelector(".lightbox__counter");
    var closeBtn = box.querySelector(".lightbox__close");
    var prevBtn = box.querySelector(".lightbox__prev");
    var nextBtn = box.querySelector(".lightbox__next");
    var focusable = [closeBtn, prevBtn, nextBtn];

    function render() {
      var item = items[index];
      var sourceImg = item.querySelector("img");
      imgEl.src = item.getAttribute("data-full-webp") || item.getAttribute("href");
      imgEl.alt = sourceImg ? sourceImg.alt : "";
      captionEl.textContent = item.getAttribute("data-caption") || (sourceImg ? sourceImg.alt : "");
      counterEl.textContent = index + 1 + " / " + items.length;
    }

    function open(i) {
      index = i;
      lastFocused = document.activeElement;
      render();
      box.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      box.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function go(step) {
      index = (index + step + items.length) % items.length;
      render();
    }

    items.forEach(function (item, i) {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        open(i);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () {
      go(-1);
    });
    nextBtn.addEventListener("click", function () {
      go(1);
    });

    // Klick auf den dunklen Hintergrund schließt.
    box.addEventListener("click", function (event) {
      if (event.target === box) close();
    });

    box.addEventListener("keydown", function (event) {
      switch (event.key) {
        case "Escape":
          close();
          break;
        case "ArrowLeft":
          go(-1);
          break;
        case "ArrowRight":
          go(1);
          break;
        case "Tab":
          // Fokus innerhalb der Lightbox halten.
          var first = focusable[0];
          var last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          break;
        default:
          break;
      }
    });
  }

  /* ---- Honeypot --------------------------------------------------- */
  // Füllt ein Bot das versteckte Feld, wird der Versand abgebrochen.
  function setupHoneypot() {
    var form = document.getElementById("kontaktformular");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      var trap = form.querySelector('[name="_gotcha"]');
      if (trap && trap.value !== "") {
        event.preventDefault();
      }
    });
  }

  /* ---- Start ------------------------------------------------------ */
  var closeMenu = setupMenu();
  setupAnchorFocus(closeMenu);
  setupScrollSpy();
  setupLightbox();
  setupHoneypot();
})();
