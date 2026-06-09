/*
  ============================================================
  script.js — Deepak Singh Portfolio
  ------------------------------------------------------------
  This file handles all the interactive behaviour on the page.
  The HTML and CSS work fine without it — this file just adds
  polish and smooth animations on top.

  Features included:
    1. Fade-in on scroll    → sections animate in as you scroll down
    2. Active nav highlight → the correct nav link is highlighted
                              based on which section is visible
  ============================================================
*/


/* ============================================================
   WAIT FOR PAGE TO LOAD
   ------------------------------------------------------------
   We wrap everything in DOMContentLoaded so our code only
   runs after all the HTML elements exist on the page.
   Without this, our code might try to find elements that
   haven't been created yet.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {


  /* ==========================================================
     1. FADE-IN ON SCROLL
     ------------------------------------------------------------
     Each <section> and the <header> fades in smoothly when
     the user scrolls down to it, instead of everything just
     appearing all at once.

     How it works:
     - We add a CSS class "fade-hidden" to every section to
       make it invisible and shifted slightly downward.
     - We use IntersectionObserver — a browser API that fires
       a callback when an element enters the visible viewport.
     - When a section becomes visible, we swap "fade-hidden"
       for "fade-visible", triggering a CSS transition.
     ========================================================== */

  /* --- Inject the required CSS for the animation --- */
  const fadeStyle = document.createElement('style');
  fadeStyle.textContent = `
    /* Starting state: invisible and shifted 24px down */
    .fade-hidden {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }

    /* End state: fully visible and in normal position */
    .fade-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(fadeStyle);

  /* --- Select all elements we want to animate --- */
  const fadeTargets = document.querySelectorAll('section, header.hero');

  /* --- Add the hidden class to each one initially --- */
  fadeTargets.forEach(function (el) {
    el.classList.add('fade-hidden');
  });

  /* --- Create the observer that watches for visibility --- */
  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          /* Element is now visible — animate it in */
          entry.target.classList.remove('fade-hidden');
          entry.target.classList.add('fade-visible');

          /* Stop watching this element once it's animated in
             (no need to re-animate if the user scrolls back up) */
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, /* Trigger when 10% of the element is visible */
    }
  );

  /* --- Start observing each target element --- */
  fadeTargets.forEach(function (el) {
    fadeObserver.observe(el);
  });


  /* ==========================================================
     2. ACTIVE NAV LINK HIGHLIGHT
     ------------------------------------------------------------
     As the user scrolls down the page, the corresponding nav
     link becomes visually highlighted (darker colour, underline)
     to show which section they're currently reading.

     How it works:
     - We use IntersectionObserver again, this time watching each
       section with an id that matches a nav link href.
     - When a section enters the viewport, we mark its matching
       nav link as "active" and remove "active" from all others.
     ========================================================== */

  /* --- Inject CSS for the active nav link style --- */
  const navStyle = document.createElement('style');
  navStyle.textContent = `
    /* Active nav link: darker colour + underline indicator */
    .nav-links a.active {
      color: #1a1a18;                /* Uses the --ink colour */
      border-bottom: 2px solid #185FA5; /* Blue underline (--accent colour) */
      padding-bottom: 2px;
    }
  `;
  document.head.appendChild(navStyle);

  /* --- Get all nav links and the sections they point to --- */
  const navLinks = document.querySelectorAll('.nav-links a');

  /* Build a map: section id → nav link element
     e.g. { "about": <a href="#about">, "skills": <a href="#skills">, ... } */
  const sectionToLink = {};
  navLinks.forEach(function (link) {
    /* link.getAttribute('href') gives us "#about", "#skills", etc.
       We slice off the # to get just the id: "about", "skills", etc. */
    const id = link.getAttribute('href').slice(1);
    sectionToLink[id] = link;
  });

  /* --- Create an observer for section visibility --- */
  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const id = entry.target.id;
        const matchingLink = sectionToLink[id];

        if (!matchingLink) return; /* Skip sections without a nav link */

        if (entry.isIntersecting) {
          /* This section entered the viewport — mark its nav link active */

          /* First, remove active from all other links */
          navLinks.forEach(function (link) {
            link.classList.remove('active');
          });

          /* Then add active to the matching link */
          matchingLink.classList.add('active');
        }
      });
    },
    {
      /* rootMargin shrinks the detection zone so a section is only
         considered "active" when it's well into view, not just barely
         touching the top of the screen. "-30% 0px -60% 0px" means:
         trigger when the section is between 30% and 70% down the screen. */
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    }
  );

  /* --- Watch every section that has an id --- */
  document.querySelectorAll('section[id]').forEach(function (section) {
    navObserver.observe(section);
  });


}); /* End of DOMContentLoaded */