/**
 * ============================================================
 * NEUROCOMBAT ACADEMY - MAIN JAVASCRIPT
 * ============================================================
 */

(function() {
    'use strict';

    // ============================================================
    // 1. HEADER SCROLL EFFECT
    // ============================================================
    const header = document.getElementById('header');
    let lastScrollY = 0;

    function handleHeaderScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }

    // Throttle para performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleHeaderScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ============================================================
    // 2. SMOOTH SCROLL (Links internos)
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignora links vazios
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================
    // 3. ANIMAÇÃO DE ESTATÍSTICAS (Intersection Observer)
    // ============================================================
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        stats.forEach(stat => {
            const text = stat.textContent;
            // Só anima números (não emojis)
            if (!isNaN(text.replace('+', ''))) {
                const target = parseInt(text.replace('+', ''));
                const suffix = text.includes('+') ? '+' : '';
                let current = 0;
                const increment = Math.ceil(target / 40);
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = current + suffix;
                }, 30);
            }
        });
    }

    // Observer para ativar animação quando a seção entrar na tela
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(heroStats);
    }

    // ============================================================
    // 4. TRACKING DE CLICK (opcional)
    // ============================================================
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Registra clique em CTA (para futuras análises)
            console.log('🔘 CTA Clicked:', this.textContent.trim());
            
            // Se tiver Google Analytics ou Facebook Pixel, adicionar aqui
            // Ex: gtag('event', 'conversion', { ... });
        });
    });

    // ============================================================
    // 5. CONSOLE BRANDING
    // ============================================================
    console.log('========================================');
    console.log('🧠 NEUROCOMBAT ACADEMY');
    console.log('========================================');
    console.log('🎨 Paleta: #07131F · #0D223B · #222222 · #FFFFFF · #FF6A00');
    console.log('🔤 Fontes: Bebas Neue | Montserrat | Inter');
    console.log('📐 Versão: 1.0.0');
    console.log('========================================');
    console.log('🚀 Site carregado com sucesso!');
    console.log('========================================');

    // ============================================================
    // 6. PREVENT DOUBLE SUBMIT (caso tenha formulário)
    // ============================================================
    // Se adicionar formulários no futuro, usar este padrão:
    /*
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            }
        });
    });
    */

})();