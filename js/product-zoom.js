// js/product-zoom.js
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-card");
  const overlay = document.getElementById("pageOverlay");

  let activeCard = null;
  let toastTimeout = null;

  function openCard(card) {
    // close any existing
    if (activeCard && activeCard !== card) closeCard();

    activeCard = card;
    card.classList.add("revealed", "zoomed");
    if (overlay) {
      overlay.classList.add("visible");
      overlay.setAttribute("aria-hidden", "false");
    }
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.focus();
  }

  function closeCard() {
    if (!activeCard) return;
    activeCard.classList.remove("revealed", "zoomed");
    activeCard = null;
    if (overlay) {
      overlay.classList.remove("visible");
      overlay.setAttribute("aria-hidden", "true");
    }
  }

  // toggle card open/close on click
  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      // if clicking an actual button inside card (like Add to Cart), don't toggle here
      const path = (e.composedPath && e.composedPath()) || (e.path) || [];
      if (path.some(node => node.classList && node.classList.contains('add-to-cart'))) {
        // let the add-to-cart handler run separately
        return;
      }

      if (card.classList.contains("revealed")) {
        closeCard();
      } else {
        openCard(card);
      }
    });

    // keyboard: Enter to open
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (card.classList.contains("revealed")) closeCard(); else openCard(card);
      }
    });
  });

  // overlay click closes
  if (overlay) {
    overlay.addEventListener("click", () => {
      closeCard();
    });
  }

  // Esc closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCard();
  });

  /* ---- ADD TO CART + TOAST ---- */
  function createToast(text = "Added to cart!") {
    // clear existing
    if (document.querySelector(".toast-notification")) {
      document.querySelectorAll(".toast-notification").forEach(n => n.remove());
      clearTimeout(toastTimeout);
    }

    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerText = text;
    document.body.appendChild(toast);

    // animate in
    requestAnimationFrame(() => toast.classList.add("show"));

    // hide after 2.8s
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
      // remove after transition
      setTimeout(() => toast.remove(), 260);
    }, 2800);
  }

  // wire up add-to-cart buttons
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // show toast
      createToast("Added to cart!");
      // you can also close the card if you prefer:
      // closeCard();
    });
  });

});
