/**
 * ===========================================================================
 * ISMAIL HISHAM PORTFOLIO - MAIN SCRIPT
 * ===========================================================================
 * This file handles all interactive elements of the portfolio, including:
 * 1. Icon initialization (Lucide)
 * 2. Dark/Light theme switching & persistence
 * 3. Scroll Reveal Animations
 * 4. Back to Top functionality
 * 5. AJAX Form submission with Success Message
 * ===========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. INITIALIZE ICONS
     * -----------------------------------------------------------------------
     */
    lucide.createIcons();

    /**
     * 2. THEME TOGGLE SYSTEM
     * -----------------------------------------------------------------------
     */
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');

    // Default to dark theme if no preference is saved
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }

    function updateIcon(theme) {
        if (!themeIcon) return;
        const newIconName = theme === 'dark' ? 'sun' : 'moon';
        themeIcon.setAttribute('data-lucide', newIconName);
        lucide.createIcons();
    }

    /**
     * 3. SCROLL REVEAL ANIMATIONS
     * -----------------------------------------------------------------------
     * Uses Intersection Observer to trigger entrance animations
     */
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    /**
     * 4. BACK TO TOP BUTTON
     * -----------------------------------------------------------------------
     */
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /**
     * 5. AJAX FORM SUBMISSION (FORMSPREE)
     * -----------------------------------------------------------------------
     * Submits the form without page refresh and shows a success message.
     */
    const contactForm = document.querySelector('.contact-form');
    const successMsg = document.querySelector('.form-success');

    if (contactForm && successMsg) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            // Loading state
            btn.disabled = true;
            btn.innerHTML = 'Sending...';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.style.display = 'none';
                    successMsg.style.display = 'block';
                    contactForm.reset();
                } else {
                    alert('Oops! There was a problem submitting your form.');
                }
            } catch (error) {
                alert('Oops! There was a problem connecting to the server.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    }
});
