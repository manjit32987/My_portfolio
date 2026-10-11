document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Theme Toggle (Night / Light Mode)
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 2. Smooth Scrolling for Navigation Links with Navbar Offset
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 60;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 3. ScrollSpy / Highlight Active Section in Navbar
    const sections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-25% 0px -65% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${id}`);
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // 4. Academic CV Certificates Filtering & Live Search
    const filterBtns = document.querySelectorAll('.cv-filter-btn');
    const certList = document.getElementById('cvCertList');
    const certItems = certList ? certList.querySelectorAll('.academic-item') : [];
    const searchInput = document.getElementById('cvCertSearch');
    const noMatchMsg = document.getElementById('noCertMatch');

    let currentFilter = 'all';
    let currentQuery = '';

    const applyCertFilter = () => {
        let matchCount = 0;

        certItems.forEach(item => {
            const category = item.getAttribute('data-category') || '';
            const keywords = (item.getAttribute('data-keywords') || '' + ' ' + item.textContent).toLowerCase();

            const matchesCategory = (currentFilter === 'all' || category === currentFilter);
            const matchesQuery = !currentQuery || keywords.includes(currentQuery);

            if (matchesCategory && matchesQuery) {
                item.classList.remove('hide-item');
                matchCount++;
            } else {
                item.classList.add('hide-item');
            }
        });

        if (noMatchMsg) {
            noMatchMsg.classList.toggle('active', matchCount === 0);
        }
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            applyCertFilter();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentQuery = e.target.value.trim().toLowerCase();
            applyCertFilter();
        });
    }

});
