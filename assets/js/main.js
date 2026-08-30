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

    // ============================================================
    // POP-UP SISGCORP (VERSÃO ATUALIZADA)
    // ============================================================
    (function() {
        'use strict';

        // ===== NÃO EXIBE O POP-UP DENTRO DA PRÓPRIA PÁGINA SISGCORP =====
        if (window.location.pathname.includes('/sisgcorp')) {
            return;
        }

        // Verifica se o pop-up já foi exibido nesta sessão
        if (sessionStorage.getItem('sisgcorp_popup_shown')) {
            return;
        }

        // Tempo para exibir o pop-up (3 segundos)
        const DELAY = 3000;

        // ===== CRIA O POP-UP =====
        function criarPopup() {
            // Overlay
            const overlay = document.createElement('div');
            overlay.id = 'sisgcorp-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(7, 19, 31, 0.85);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: fadeIn 0.4s ease;
            `;

            // Container do pop-up
            const popup = document.createElement('div');
            popup.id = 'sisgcorp-popup';
            popup.style.cssText = `
                max-width: 560px;
                width: 100%;
                background: linear-gradient(145deg, #0D223B, #07131F);
                border: 1px solid rgba(212, 175, 55, 0.25);
                border-radius: 20px;
                padding: 40px 32px;
                position: relative;
                box-shadow: 0 30px 80px rgba(0,0,0,0.8);
                animation: slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                max-height: 90vh;
                overflow-y: auto;
            `;

            // Botão fechar
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 14px;
                right: 18px;
                background: none;
                border: none;
                color: #8899AA;
                font-size: 1.4rem;
                cursor: pointer;
                transition: color 0.3s ease;
                line-height: 1;
            `;
            closeBtn.onmouseover = () => closeBtn.style.color = '#F1F5F9';
            closeBtn.onmouseout = () => closeBtn.style.color = '#8899AA';
            closeBtn.onclick = fecharPopup;

            // Badge
            const badge = document.createElement('div');
            badge.style.cssText = `
                display: inline-block;
                background: rgba(232, 122, 42, 0.15);
                color: #E87A2A;
                padding: 4px 16px;
                border-radius: 60px;
                font-size: 0.6rem;
                font-weight: 700;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 12px;
                border: 1px solid rgba(232, 122, 42, 0.15);
            `;
            badge.textContent = '⚡ ATENÇÃO: NOVA EXIGÊNCIA 2026';

            // ===== TÍTULO ATUALIZADO =====
            const title = document.createElement('h2');
            title.style.cssText = `
                font-family: 'Bebas Neue', sans-serif;
                font-size: 1.8rem;
                color: #F1F5F9;
                margin: 0 0 8px 0;
                letter-spacing: 1px;
            `;
            title.innerHTML = 'Você possui uma <span style="color:#D4AF37;">arma de fogo registrada?</span>';

            // ===== DESCRIÇÃO ATUALIZADA =====
            const desc = document.createElement('p');
            desc.style.cssText = `
                color: #94A3B8;
                font-size: 0.95rem;
                line-height: 1.7;
                margin: 8px 0 16px 0;
            `;
            desc.textContent = 'Proprietários de armas registradas na Polícia Federal e CACs devem verificar e atualizar seu cadastro no SisGCorp/SINARM. A regularização será necessária para compra de munições e outros serviços relacionados às armas de fogo.';

            // Data destaque
            const dataBox = document.createElement('div');
            dataBox.style.cssText = `
                background: rgba(212, 175, 55, 0.06);
                border: 1px solid rgba(212, 175, 55, 0.12);
                border-radius: 12px;
                padding: 12px 16px;
                margin: 12px 0 20px 0;
                display: flex;
                align-items: center;
                gap: 12px;
            `;
            dataBox.innerHTML = `
                <span style="font-size:1.8rem;">📅</span>
                <div>
                    <span style="color:#F1F5F9;font-weight:600;display:block;">31 de agosto de 2026</span>
                    <span style="color:#94A3B8;font-size:0.8rem;">Data limite para regularização</span>
                </div>
            `;

            // Botões
            const botoes = document.createElement('div');
            botoes.style.cssText = `
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                margin-top: 8px;
            `;

            const btnSaiba = document.createElement('a');
            btnSaiba.href = '/sisgcorp/';
            btnSaiba.style.cssText = `
                background: linear-gradient(135deg, #E87A2A, #C95A1A);
                color: #FFFFFF;
                padding: 14px 32px;
                border-radius: 60px;
                text-decoration: none;
                font-weight: 700;
                font-size: 0.85rem;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                flex: 1;
                justify-content: center;
                box-shadow: 0 8px 20px rgba(232, 122, 42, 0.25);
            `;
            btnSaiba.onmouseover = () => {
                btnSaiba.style.background = 'linear-gradient(135deg, #F08A3A, #D96A2A)';
                btnSaiba.style.transform = 'translateY(-2px)';
                btnSaiba.style.boxShadow = '0 12px 30px rgba(232, 122, 42, 0.35)';
            };
            btnSaiba.onmouseout = () => {
                btnSaiba.style.background = 'linear-gradient(135deg, #E87A2A, #C95A1A)';
                btnSaiba.style.transform = 'translateY(0)';
                btnSaiba.style.boxShadow = '0 8px 20px rgba(232, 122, 42, 0.25)';
            };
            
            // ===== BOTÃO ATUALIZADO =====
            btnSaiba.innerHTML = '<i class="fas fa-shield-alt"></i> ENTENDER A NOVA EXIGÊNCIA';

            const btnDepois = document.createElement('button');
            btnDepois.style.cssText = `
                background: transparent;
                color: #94A3B8;
                padding: 14px 24px;
                border-radius: 60px;
                border: 1px solid rgba(255,255,255,0.08);
                cursor: pointer;
                font-weight: 600;
                font-size: 0.8rem;
                transition: all 0.3s ease;
            `;
            btnDepois.textContent = 'Agora não';
            btnDepois.onmouseover = () => {
                btnDepois.style.borderColor = 'rgba(255,255,255,0.2)';
                btnDepois.style.color = '#F1F5F9';
            };
            btnDepois.onmouseout = () => {
                btnDepois.style.borderColor = 'rgba(255,255,255,0.08)';
                btnDepois.style.color = '#94A3B8';
            };
            btnDepois.onclick = fecharPopup;

            botoes.appendChild(btnSaiba);
            botoes.appendChild(btnDepois);

            // ===== RODAPÉ ATUALIZADO =====
            const footer = document.createElement('div');
            footer.style.cssText = `
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid rgba(255,255,255,0.04);
                text-align: center;
            `;
            footer.innerHTML = `
                <p style="color:#64748B;font-size:0.72rem;margin:0;line-height:1.5;">
                    Conteúdo elaborado pela <strong style="color:#D4AF37;">NeuroCombat Academy</strong>
                    com base em informações oficiais da Polícia Federal, DFPC e legislação vigente.
                </p>
            `;

            // Montagem
            popup.appendChild(closeBtn);
            popup.appendChild(badge);
            popup.appendChild(title);
            popup.appendChild(desc);
            popup.appendChild(dataBox);
            popup.appendChild(botoes);
            popup.appendChild(footer);
            overlay.appendChild(popup);
            document.body.appendChild(overlay);

            // Marcar como exibido
            sessionStorage.setItem('sisgcorp_popup_shown', 'true');

            // Fechar ao clicar fora
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    fecharPopup();
                }
            });

            // Fechar com ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    fecharPopup();
                }
            });
        }

        function fecharPopup() {
            const overlay = document.getElementById('sisgcorp-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            }
        }

        // ===== ANIMAÇÕES CSS =====
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.96);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        // ===== EXIBIR APÓS O DELAY =====
        setTimeout(criarPopup, DELAY);

    })();

})();
