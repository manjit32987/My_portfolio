/**
 * MANJIT CHAKRABORTY — PORTFOLIO CORE INTERACTION LOGIC
 * High performance, zero external dependencies, 60fps animations
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================================
       1. DYNAMIC COPYRIGHT YEAR
       ========================================================================== */
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       2. TOAST NOTIFICATION SYSTEM (Success, Error, Info)
       ========================================================================== */
    const toastContainer = document.getElementById('toastContainer');

    window.showToast = function(message, type = 'info') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        } else {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
        }

        toast.innerHTML = `
            <div class="toast-icon">${iconSvg}</div>
            <div class="toast-message">${message}</div>
        `;

        toastContainer.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto dismiss after 3.2s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3200);
    };

    /* ==========================================================================
       3. THEME SWITCHER (Dark / Light)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                showToast("Switched to Dark theme", "info");
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                showToast("Switched to Light theme", "info");
            }
        });
    }

    /* ==========================================================================
       4. DOCK NAVIGATION SCROLLSPY & SMOOTH SCROLLING
       ========================================================================== */
    const dockLinks = document.querySelectorAll('.dock-link');
    const sections = document.querySelectorAll('section[id]');

    function scrollToSection(targetId) {
        if (!targetId || !targetId.startsWith('#')) return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            const navHeight = 90;
            const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - navHeight,
                behavior: 'smooth'
            });
        }
    }

    dockLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                scrollToSection(targetId);
            }
        });
    });

    // ScrollSpy observer
    if (sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    dockLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${activeId}`);
                    });
                }
            });
        }, observerOptions);

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    /* ==========================================================================
       5. MOBILE MENU DRAWER
       ========================================================================== */
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, #mobileBrandLink');

    function openMobileMenu() {
        if (!mobileNavDrawer) return;
        mobileNavDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!mobileNavDrawer) return;
        mobileNavDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuTrigger) mobileMenuTrigger.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            closeMobileMenu();
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                setTimeout(() => scrollToSection(targetId), 200);
            }
        });
    });

    /* ==========================================================================
       6. INTERACTIVE OSCILLOSCOPE SIMULATOR (Function Generator Card)
       ========================================================================== */
    const oscCanvas = document.getElementById('oscilloscopeCanvas');
    if (oscCanvas) {
        const oscCtx = oscCanvas.getContext('2d');
        let currentWave = 'sine'; // 'sine', 'square', 'triangle'
        let oscTime = 0;

        const waveButtons = document.querySelectorAll('.btn-osc-wave');
        waveButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                waveButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentWave = btn.getAttribute('data-wave') || 'sine';
                showToast(`Oscilloscope set to ${currentWave.toUpperCase()} wave`, 'info');
            });
        });

        function resizeOsc() {
            if (oscCanvas.parentElement) {
                oscCanvas.width = Math.max(280, oscCanvas.parentElement.clientWidth - 32);
                oscCanvas.height = 120;
            }
        }
        resizeOsc();
        window.addEventListener('resize', resizeOsc);

        function drawOscilloscope() {
            const w = oscCanvas.width;
            const h = oscCanvas.height;
            const cy = h / 2;

            oscCtx.fillStyle = '#070a0f';
            oscCtx.fillRect(0, 0, w, h);

            // Draw oscilloscope grid lines
            oscCtx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
            oscCtx.lineWidth = 1;

            for (let x = 0; x < w; x += 30) {
                oscCtx.beginPath();
                oscCtx.moveTo(x, 0);
                oscCtx.lineTo(x, h);
                oscCtx.stroke();
            }
            for (let y = 0; y < h; y += 20) {
                oscCtx.beginPath();
                oscCtx.moveTo(0, y);
                oscCtx.lineTo(w, y);
                oscCtx.stroke();
            }

            // Draw Center Axis
            oscCtx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            oscCtx.setLineDash([4, 4]);
            oscCtx.beginPath();
            oscCtx.moveTo(0, cy);
            oscCtx.lineTo(w, cy);
            oscCtx.stroke();
            oscCtx.setLineDash([]);

            // Draw Signal Trace
            oscCtx.strokeStyle = '#38bdf8';
            oscCtx.lineWidth = 2.5;
            oscCtx.shadowColor = '#38bdf8';
            oscCtx.shadowBlur = 10;
            oscCtx.beginPath();

            const freq = 0.035;
            const amp = 38;

            for (let x = 0; x < w; x++) {
                const t = (x * freq) + oscTime;
                let y = cy;

                if (currentWave === 'sine') {
                    y = cy + Math.sin(t) * amp;
                } else if (currentWave === 'square') {
                    y = cy + (Math.sin(t) >= 0 ? amp : -amp);
                } else if (currentWave === 'triangle') {
                    y = cy + (Math.asin(Math.sin(t)) * (2 / Math.PI)) * amp;
                }

                if (x === 0) {
                    oscCtx.moveTo(x, y);
                } else {
                    oscCtx.lineTo(x, y);
                }
            }

            oscCtx.stroke();
            oscCtx.shadowBlur = 0;

            oscTime += 0.08;
            requestAnimationFrame(drawOscilloscope);
        }

        drawOscilloscope();
    }

    /* ==========================================================================
       7. CERTIFICATES LIVE SEARCH & FILTERING
       ========================================================================== */
    const certFilterBtns = document.querySelectorAll('.cert-filter-pills .filter-btn');
    const certCards = document.querySelectorAll('.cert-card');
    const certSearchInput = document.getElementById('certSearch');
    const noCertsNotice = document.getElementById('noCertsFound');

    let currentCertCat = 'all';
    let currentCertQuery = '';

    function applyCertFilters() {
        let matchCount = 0;

        certCards.forEach(card => {
            const cat = card.getAttribute('data-category') || '';
            const searchPool = (card.getAttribute('data-keywords') || '' + ' ' + card.textContent).toLowerCase();

            const matchesCategory = (currentCertCat === 'all' || cat === currentCertCat);
            const matchesQuery = !currentCertQuery || searchPool.includes(currentCertQuery);

            if (matchesCategory && matchesQuery) {
                card.classList.remove('hide-cert');
                matchCount++;
            } else {
                card.classList.add('hide-cert');
            }
        });

        if (noCertsNotice) {
            noCertsNotice.classList.toggle('show', matchCount === 0);
        }
    }

    certFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            certFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCertCat = btn.getAttribute('data-cert-filter') || 'all';
            applyCertFilters();
        });
    });

    if (certSearchInput) {
        certSearchInput.addEventListener('input', (e) => {
            currentCertQuery = e.target.value.toLowerCase().trim();
            applyCertFilters();
        });
    }

    /* ==========================================================================
       8. WALL OF FAME LIGHTBOX MODAL
       ========================================================================== */
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const fameCards = document.querySelectorAll('.fame-card');

    if (lightboxModal && fameCards.length > 0) {
        fameCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const title = card.querySelector('.fame-title')?.textContent || '';
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxCaption.textContent = title;
                    lightboxModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /* ==========================================================================
       9. COMMAND PALETTE (⌘K / Ctrl+K) MODAL
       ========================================================================== */
    const cmdModal = document.getElementById('cmdModal');
    const cmdTrigger = document.getElementById('cmdTrigger');
    const cmdInput = document.getElementById('cmdInput');
    const cmdItems = document.querySelectorAll('.cmd-item');

    function openCmdModal() {
        if (!cmdModal) return;
        cmdModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (cmdInput) {
            cmdInput.value = '';
            cmdInput.focus();
            filterCmdItems('');
        }
    }

    function closeCmdModal() {
        if (!cmdModal) return;
        cmdModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function filterCmdItems(query) {
        cmdItems.forEach(item => {
            const txt = item.textContent.toLowerCase();
            item.style.display = txt.includes(query) ? 'flex' : 'none';
        });
    }

    if (cmdTrigger) cmdTrigger.addEventListener('click', openCmdModal);

    if (cmdModal) {
        cmdModal.addEventListener('click', (e) => {
            if (e.target === cmdModal) closeCmdModal();
        });

        if (cmdInput) {
            cmdInput.addEventListener('input', (e) => {
                filterCmdItems(e.target.value.toLowerCase().trim());
            });
        }

        cmdItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-cmd-action');
                const target = item.getAttribute('data-cmd-target');

                closeCmdModal();

                if (action === 'navigate' && target) {
                    scrollToSection(target);
                } else if (action === 'theme') {
                    if (themeToggleBtn) themeToggleBtn.click();
                } else if (action === 'copy-email') {
                    copyToClipboard('manjitc.info@gmail.com', 'Email copied to clipboard (manjitc.info@gmail.com)');
                } else if (action === 'copy-phone') {
                    copyToClipboard('+91 6009236698', 'Phone number copied to clipboard (+91 6009236698)');
                } else if (action === 'resume') {
                    const link = document.createElement('a');
                    link.href = 'Manjit_Chakraborty_Resume.pdf';
                    link.download = 'Manjit_Chakraborty_Resume.pdf';
                    link.click();
                    showToast("Downloading Manjit Chakraborty's Resume...", "success");
                }
            });
        });
    }

    /* ==========================================================================
       10. RESUME DOWNLOAD TRACKING FEEDBACK
       ========================================================================== */
    const resumeLinks = document.querySelectorAll('a[href$="Resume.pdf"], a[href$="Report.pdf"]');
    resumeLinks.forEach(link => {
        link.addEventListener('click', () => {
            showToast("Document download initiated!", "success");
        });
    });

    /* ==========================================================================
       11. HELPER: COPY TO CLIPBOARD
       ========================================================================== */
    function copyToClipboard(text, successMessage) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMessage, "success");
            }).catch(() => {
                fallbackCopy(text, successMessage);
            });
        } else {
            fallbackCopy(text, successMessage);
        }
    }

    function fallbackCopy(text, successMessage) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            showToast(successMessage, "success");
        } catch (err) {
            showToast("Failed to copy automatically. " + text, "error");
        }
        document.body.removeChild(tempInput);
    }

    /* ==========================================================================
       12. GLOBAL KEYBOARD SHORTCUTS (⌘K / Ctrl+K / Escape)
       ========================================================================== */
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (cmdModal && cmdModal.classList.contains('active')) {
                closeCmdModal();
            } else {
                openCmdModal();
            }
        } else if (e.key === 'Escape') {
            if (cmdModal && cmdModal.classList.contains('active')) closeCmdModal();
            if (mobileNavDrawer && mobileNavDrawer.classList.contains('active')) closeMobileMenu();
        }
    });

});
