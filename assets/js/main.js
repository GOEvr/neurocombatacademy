/**
 * NeuroCombat Academy - Script Principal
 */

(function() {
    'use strict';

    // ============================================
    // HEADER SCROLL
    // ============================================
    const header = document.getElementById('header');
    let ticking = false;
    const TRIGGER = 50;

    function handleScroll() {
        const currentScroll = window.scrollY;
        if (currentScroll > TRIGGER) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

    handleScroll();

    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question?.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
        faqItems[0]?.classList.add('active');
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.length <= 1) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // SCROLL REVEAL
    // ============================================
    const fadeElements = document.querySelectorAll('.fade-up, .depoimento-card, .curso-card, .step, .card');

    if (fadeElements.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ============================================
    // BANNER SISGCORP / SICOVEM
    // ============================================
    (function () {

        const banner = document.getElementById("sisgcorp-banner");

        if (!banner) return;

        // Não exibe dentro da página SisGCorp
        if (window.location.pathname.includes("/sisgcorp")) {
            banner.style.display = "none";
            return;
        }

        // Se o usuário já fechou o banner
        if (localStorage.getItem("sisgcorp_banner_closed") === "true") {
            banner.style.display = "none";
            return;
        }

        // Evita criar múltiplos botões de fechar (hot reload / cache)
        if (banner.querySelector(".sisgcorp-banner-close")) return;

        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = "&times;";
        closeBtn.className = "sisgcorp-banner-close";
        closeBtn.setAttribute("aria-label", "Fechar aviso");

        closeBtn.addEventListener("click", () => {
            banner.style.display = "none";
            localStorage.setItem("sisgcorp_banner_closed", "true");
        });

        banner.querySelector(".sisgcorp-banner-content")?.appendChild(closeBtn);

    })();

})();
