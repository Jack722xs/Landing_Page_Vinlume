gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. LENIS SMOOTH SCROLL (Flujo inercial)
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // 2. PRELOADER CINEMÁTICO
  const tlPreloader = gsap.timeline();
  tlPreloader.to('.preloader-text', { opacity: 0, y: -20, duration: 0.5, delay: 1.5, ease: "power2.inOut" })
             .to('.preloader', { yPercent: -100, duration: 0.8, ease: "power4.inOut" })
             .from('.hero-title', { y: 60, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.3")
             .from('.badge, .hero-subtitle, .btn', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.6")
             .from('.navbar', { y: -50, opacity: 0, duration: 0.8 }, "-=0.8");

  // 3. CURSORES INTELIGENTES
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const xSetDot = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3"});
  const ySetDot = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3"});
  const xSetRing = gsap.quickTo(cursorRing, "x", {duration: 0.4, ease: "power3"});
  const ySetRing = gsap.quickTo(cursorRing, "y", {duration: 0.4, ease: "power3"});

  window.addEventListener("mousemove", (e) => {
    xSetDot(e.clientX - 3); ySetDot(e.clientY - 3);
    xSetRing(e.clientX - 20); ySetRing(e.clientY - 20);
  });

  document.querySelectorAll('.hover-target, .add-to-cart, .spotlight-card, .faq-item, .xray-container').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursorDot, {scale: 0, duration: 0.2});
      gsap.to(cursorRing, {scale: 1.5, backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(2px)", duration: 0.3});
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursorDot, {scale: 1, duration: 0.2});
      gsap.to(cursorRing, {scale: 1, backgroundColor: "transparent", backdropFilter: "none", duration: 0.3});
    });
  });

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
      gsap.to(btn, {x: x, y: y, duration: 0.3, ease: "power2.out"});
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, {x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)"}));
  });

  gsap.to(".marquee", { xPercent: -50, ease: "none", duration: 20, repeat: -1 });

  // 4. ATMÓSFERA MUTANTE (Color Shift)
  gsap.utils.toArray('.color-shift-section').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: "top 50%", end: "bottom 50%",
      onEnter: () => gsap.to('body', { backgroundColor: sec.dataset.bg, duration: 1 }),
      onEnterBack: () => gsap.to('body', { backgroundColor: sec.dataset.bg, duration: 1 })
    });
  });

  // 5. DECODIFICADOR MATRIX (Scramble Text)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  gsap.utils.toArray('.scramble-text').forEach(elem => {
    ScrollTrigger.create({
      trigger: elem, start: "top 85%", once: true,
      onEnter: () => {
        let iterations = 0; const originalText = elem.dataset.text;
        const interval = setInterval(() => {
          elem.innerText = originalText.split("").map((letter, index) => {
            if(index < iterations) { return originalText[index]; }
            return letters[Math.floor(Math.random() * letters.length)];
          }).join("");
          if(iterations >= originalText.length){ clearInterval(interval); }
          iterations += 1/2; 
        }, 30);
      }
    });
  });

  // Animaciones básicas Reveal
  gsap.utils.toArray('.gs-reveal:not(.scramble-text)').forEach(elem => {
    gsap.from(elem, { scrollTrigger: { trigger: elem, start: "top 85%" }, y: 50, opacity: 0, duration: 1, ease: "power3.out" });
  });

  // 6. VISOR DE RAYOS X (Máscara CSS Dinámica)
  const xrayDisc = document.getElementById("xray-disc");
  const xrayCircuit = document.querySelector(".xray-circuit");
  if (xrayDisc) {
    xrayDisc.addEventListener("mousemove", (e) => {
      const rect = xrayDisc.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      xrayCircuit.style.clipPath = `circle(70px at ${x}px ${y}px)`;
    });
    xrayDisc.addEventListener("mouseleave", () => { xrayCircuit.style.clipPath = `circle(0px at 50% 50%)`; });
  }

  // 7. SPOTLIGHT BORDERS (Catálogo)
  const spotlightCards = document.querySelectorAll(".spotlight-card");
  spotlightCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // 8. LA FORJA MÁGICA (Scroll Vertical Fijado)
  const prodSteps = gsap.utils.toArray('.prod-step');
  gsap.set(prodSteps[0], { autoAlpha: 1 });
  const tlForja = gsap.timeline({ scrollTrigger: { trigger: ".production-pin-wrap", start: "top top", end: "+=3000", pin: true, scrub: 1 } });

  tlForja.to(".cd-builder", { rotateZ: 135, ease: "none", duration: 4 }, 0);
  gsap.set(".layer-1", { opacity: 1, z: 0 });

  tlForja.to(prodSteps[0], { autoAlpha: 0, y: -20, duration: 0.5 }, 0.5)
         .to(prodSteps[1], { autoAlpha: 1, y: 0, duration: 0.5 }, 0.5)
         .to(".layer-2", { opacity: 1, z: 40, duration: 0.5 }, 0.5);

  tlForja.to(prodSteps[1], { autoAlpha: 0, y: -20, duration: 0.5 }, 1.5)
         .to(prodSteps[2], { autoAlpha: 1, y: 0, duration: 0.5 }, 1.5)
         .to(".layer-3", { opacity: 1, z: 80, duration: 0.5 }, 1.5);

  tlForja.to(prodSteps[2], { autoAlpha: 0, y: -20, duration: 0.5 }, 2.5)
         .to(prodSteps[3], { autoAlpha: 1, y: 0, duration: 0.5 }, 2.5)
         .to(".layer-4", { opacity: 1, z: 120, duration: 0.5 }, 2.5)
         .to(".cd-layer", { z: 0, duration: 0.8, ease: "power2.inOut" }, 3.2);

  // 9. SCROLL HORIZONTAL DEL CATÁLOGO
  const container = document.querySelector(".horizontal-container");
  const getScrollAmount = () => -(container.scrollWidth - window.innerWidth);
  const tween = gsap.to(container, { x: getScrollAmount, ease: "none" });

  ScrollTrigger.create({
    trigger: ".catalog-pin-wrap", start: "top top", end: () => `+=${getScrollAmount() * -1}`,
    pin: true, animation: tween, scrub: 1, invalidateOnRefresh: true
  });

  // 10. SIMULADOR NFC
  const nfcBtn = document.getElementById("simulate-nfc-btn");
  const nfcStage = document.querySelector(".nfc-stage");
  const nfcStatus = document.getElementById("nfc-status");

  if(nfcBtn) {
    nfcBtn.addEventListener("click", () => {
      if(nfcBtn.disabled) return;
      nfcBtn.disabled = true; nfcBtn.innerText = "Transfiriendo...";
      nfcStage.classList.remove("nfc-success");
      nfcStatus.innerText = "Aproximando dispositivo..."; nfcStatus.style.color = "var(--text-muted)";

      const tlNfc = gsap.timeline();
      tlNfc.to(".nfc-phone", { x: 50, duration: 0.5, ease: "power2.out" })
           .call(() => { nfcStage.classList.add("nfc-active"); nfcStatus.innerText = "Leyendo chip NFC..."; })
           .to({}, {duration: 1.5}) 
           .call(() => {
             nfcStage.classList.remove("nfc-active"); nfcStage.classList.add("nfc-success");
             nfcStatus.innerText = "¡Conexión Exitosa! Reproduciendo..."; nfcStatus.style.color = "var(--success)";
           })
           .to(".nfc-phone", { x: 0, duration: 0.5, delay: 1, ease: "power2.inOut" })
           .call(() => { nfcBtn.disabled = false; nfcBtn.innerText = "Ejecutar Simulación"; });
    });
  }

  // 11. FAQ ANIMADO
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    let isOpen = false;

    question.addEventListener('click', () => {
      faqItems.forEach(otherItem => {
        if(otherItem !== item && otherItem.isOpen) {
          gsap.to(otherItem.querySelector('.faq-answer'), { height: 0, paddingBottom: 0, duration: 0.4, ease: "power2.out" });
          gsap.to(otherItem.querySelector('.faq-icon'), { rotation: 0, duration: 0.4 });
          otherItem.isOpen = false;
        }
      });
      if(!isOpen) {
        gsap.to(answer, { height: "auto", paddingBottom: "1.5rem", duration: 0.4, ease: "power2.out" });
        gsap.to(icon, { rotation: 45, duration: 0.4 });
        isOpen = true;
      } else {
        gsap.to(answer, { height: 0, paddingBottom: 0, duration: 0.4, ease: "power2.out" });
        gsap.to(icon, { rotation: 0, duration: 0.4 });
        isOpen = false;
      }
      item.isOpen = isOpen;
    });
  });

  // 12. CARRITO Y TOASTS
  let cartCount = 0;
  const cartCountDOM = document.getElementById("cart-count");
  const toastContainer = document.getElementById("toast-container");

  const showToast = (itemName) => {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = `<span style="font-size: 1.2rem; color: var(--success);">✓</span><div><strong style="display:block; font-family:'Syne', sans-serif;">Añadido a la bolsa</strong><span style="font-size: 0.85rem; color: var(--text-muted);">${itemName}</span></div>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 400); }, 3000);
  };

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault(); 
      cartCount++;
      cartCountDOM.innerText = cartCount;
      gsap.fromTo(cartCountDOM, { scale: 1.5, backgroundColor: "#fff", color: "#000" }, { scale: 1, backgroundColor: "var(--accent-1)", color: "#fff", duration: 0.4, ease: "back.out(2)" });
      showToast(button.getAttribute("data-name"));
    });
  });
  
  // Refrescar ScrollTrigger al final por si las tipografías movieron el layout
  setTimeout(() => ScrollTrigger.refresh(), 500);
});xx