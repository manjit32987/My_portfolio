document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Custom Magnetic Dual-Ring Glassmorphism Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (window.innerWidth >= 900 && cursorDot && cursorRing) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Precision dot tracks cursor instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Helper to detect if element under cursor is inside white section
        function checkThemeSection() {
            const el = document.elementFromPoint(mouseX, mouseY);
            if (!el) return;
            const isWhite = !!el.closest('.hero-section');
            if (isWhite) {
                cursorDot.classList.add('on-white-section');
                cursorRing.classList.add('on-white-section');
            } else {
                cursorDot.classList.remove('on-white-section');
                cursorRing.classList.remove('on-white-section');
            }
        }

        // Fluid spring lerp animation frame loop
        function animateCursor() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            checkThemeSection();

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Magnetic snap & expansion on hover
        const setupHoverTargets = () => {
            const hoverTargets = document.querySelectorAll('a, button, .hover-target, .cert-card, .btn-green, .social-icon, .nav-pill a, .cert-filter-btn, .btn-cert-link');

            hoverTargets.forEach(target => {
                target.addEventListener('mouseenter', () => {
                    cursorRing.classList.add('cursor-hover');
                    cursorDot.classList.add('cursor-hover');
                });

                target.addEventListener('mouseleave', () => {
                    cursorRing.classList.remove('cursor-hover');
                    cursorDot.classList.remove('cursor-hover');
                });
            });
        };
        setupHoverTargets();

        // Click squeeze & spring pulse on mouse down
        window.addEventListener('mousedown', () => {
            cursorRing.classList.add('cursor-active');
            cursorDot.classList.add('cursor-active');
        });

        window.addEventListener('mouseup', () => {
            cursorRing.classList.remove('cursor-active');
            cursorDot.classList.remove('cursor-active');
        });
    }

    // 2. Scroll Reveals (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. 3D Tilt Effect for Project Cards & Experience Photo
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    if (window.innerWidth >= 900) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; 
                const y = e.clientY - rect.top;  
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                card.style.transition = 'none'; 
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
                card.style.transition = 'transform 0.5s ease-out';
            });
        });
    }

    // 4. Magnetic Button Effect (Resume Button)
    const magneticButton = document.querySelector('.magnetic-btn');
    
    if (magneticButton && window.innerWidth >= 900) {
        magneticButton.addEventListener('mousemove', function(e) {
            const position = magneticButton.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            magneticButton.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
        });

        magneticButton.addEventListener('mouseleave', function() {
            magneticButton.style.transform = 'translate(0px, 0px)';
            magneticButton.style.transition = 'transform 0.5s ease-out';
            setTimeout(() => { magneticButton.style.transition = ''; }, 500);
        });
    }

    // 5. Smooth Scroll for Nav Links
    document.querySelectorAll('.nav-center a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({ top: targetSection.offsetTop - 100, behavior: 'smooth' });
            }
        });
    });

    // 6. Highlight the current section in the navigation.
    const navLinks = [...document.querySelectorAll('.nav-center a')];
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
                link.classList.toggle('active-nav', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));

    // 7. Fill the education and experience timeline as the visitor scrolls.
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        const timelineItems = [...timeline.querySelectorAll('.timeline-item')];
        let isTimelineTicking = false;

        const updateTimeline = () => {
            const rect = timeline.getBoundingClientRect();
            const triggerPoint = window.innerHeight * 0.7;
            const progress = Math.max(0, Math.min(1, (triggerPoint - rect.top) / rect.height));

            timeline.classList.add('is-active');
            timeline.style.setProperty('--timeline-progress', progress);
            timelineItems.forEach(item => {
                item.classList.toggle('is-complete', item.getBoundingClientRect().top < triggerPoint);
            });
            isTimelineTicking = false;
        };

        const requestTimelineUpdate = () => {
            if (!isTimelineTicking) {
                window.requestAnimationFrame(updateTimeline);
                isTimelineTicking = true;
            }
        };

        window.addEventListener('scroll', requestTimelineUpdate, { passive: true });
        window.addEventListener('resize', requestTimelineUpdate);
        updateTimeline();
    }

    // 8. Certificate Category Filtering Logic
    const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
    const certCards = document.querySelectorAll('.cert-card');

    certFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            certFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            certCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide-card');
                } else {
                    card.classList.add('hide-card');
                }
            });
        });
    });

    // 9. Certificate Modal Lightbox
    const certModal = document.getElementById('certModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCloseIcon = document.querySelector('.cert-modal-close');
    const modalBackdrop = document.querySelector('.cert-modal-backdrop');

    const modalBadge = document.getElementById('modalBadge');
    const modalDate = document.getElementById('modalDate');
    const modalTitle = document.getElementById('modalTitle');
    const modalIssuer = document.getElementById('modalIssuer');
    const modalDesc = document.getElementById('modalDesc');
    const modalSkills = document.getElementById('modalSkills');

    const openCertModal = (buttonEl) => {
        if (!certModal) return;

        const title = buttonEl.getAttribute('data-title') || 'Certificate';
        const issuer = buttonEl.getAttribute('data-issuer') || '';
        const date = buttonEl.getAttribute('data-date') || '';
        const badge = buttonEl.getAttribute('data-badge') || 'VERIFIED';
        const desc = buttonEl.getAttribute('data-desc') || '';
        const skillsStr = buttonEl.getAttribute('data-skills') || '';

        modalTitle.textContent = title;
        modalIssuer.textContent = issuer;
        modalDate.textContent = date;
        modalBadge.textContent = badge;
        modalDesc.textContent = desc;

        // Populate skills chips
        modalSkills.innerHTML = '';
        if (skillsStr) {
            skillsStr.split(',').forEach(skill => {
                const chip = document.createElement('span');
                chip.className = 'modal-skill-chip';
                chip.textContent = skill.trim();
                modalSkills.appendChild(chip);
            });
        }

        certModal.classList.add('active');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeCertModal = () => {
        if (!certModal) return;
        certModal.classList.remove('active');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Attach click listeners to all detail buttons and card containers
    document.querySelectorAll('.btn-cert-detail').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openCertModal(btn);
        });
    });

    document.querySelectorAll('.btn-cert-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-cert-link')) return;
            const btn = card.querySelector('.btn-cert-detail');
            if (btn) openCertModal(btn);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCertModal);
    if (modalCloseIcon) modalCloseIcon.addEventListener('click', closeCertModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeCertModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
            closeCertModal();
        }
    });

    // Re-bind cursor hover for newly added elements
    if (window.innerWidth >= 900) {
        document.querySelectorAll('.hover-target, .cert-card, .fame-card, .cert-filter-btn, .btn-cert-link, .footer-nav a').forEach(target => {
            target.addEventListener('mouseenter', () => {
                if (cursorDot) cursorDot.classList.add('cursor-hover');
                if (cursorRing) cursorRing.classList.add('cursor-hover');
            });
            target.addEventListener('mouseleave', () => {
                if (cursorDot) cursorDot.classList.remove('cursor-hover');
                if (cursorRing) cursorRing.classList.remove('cursor-hover');
            });
        });
    }
});

