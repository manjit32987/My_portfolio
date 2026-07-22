document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverTargets = document.querySelectorAll('a, button, .hover-target');

    if (window.innerWidth >= 900) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 400, fill: "forwards" });
        });

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
            target.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
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
});