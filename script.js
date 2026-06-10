/**
 * ===========================================================================
 * ISMAIL HISHAM PORTFOLIO - MAIN SCRIPT
 * ===========================================================================
 * This file handles all interactive elements of the portfolio, including:
 * 1. Icon initialization (Lucide)
 * 2. Dark/Light theme switching & persistence
 * 3. Mobile Hamburger Menu Toggle & Auto-Close
 * 4. ScrollSpy (Active Section Navigation Highlighting)
 * 5. Scroll Progress Bar
 * 6. Scroll Reveal Entrance Animations
 * 7. Projects Category Filtering
 * 8. Back to Top Button
 * 9. AJAX Form Submission with Client-side Validation & Smooth Reset
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
     * 3. MOBILE HAMBURGER MENU TOGGLE
     * -----------------------------------------------------------------------
     */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuToggle && navLinksContainer && menuIcon) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinksContainer.classList.toggle('active');
            menuIcon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
            lucide.createIcons();
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                menuIcon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });

        // Close menu when clicking anywhere else on the document
        document.addEventListener('click', (e) => {
            if (!navLinksContainer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    menuIcon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    }

    /**
     * 4. SCROLLSPY (ACTIVE SECTION HIGHLIGHTING)
     * -----------------------------------------------------------------------
     */
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');

    const scrollSpyCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const scrollSpyObserver = new IntersectionObserver(scrollSpyCallback, {
        rootMargin: '-40% 0px -60% 0px' // Checks center of the screen
    });

    sections.forEach(sec => {
        if (sec.id) scrollSpyObserver.observe(sec);
    });

    /**
     * 5. SCROLL PROGRESS BAR
     * -----------------------------------------------------------------------
     */
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0) {
                const scrolledPercent = (window.scrollY / scrollHeight) * 100;
                scrollProgress.style.width = `${scrolledPercent}%`;
            }
        });
    }

    /**
     * 6. SCROLL REVEAL ANIMATIONS
     * -----------------------------------------------------------------------
     */
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.12
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    /**
     * 7. PROJECTS CATEGORY FILTERING
     * -----------------------------------------------------------------------
     */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Reset styling before changing states to avoid glitchy transitions
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hidden');
                    // Small timeout to trigger CSS transition smoothly
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95) translateY(10px)';
                    // Add hidden class after fade-out transition is complete
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    /**
     * 8. BACK TO TOP BUTTON
     * -----------------------------------------------------------------------
     */
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
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
     * 9. AJAX FORM SUBMISSION & CLIENT-SIDE VALIDATION
     * -----------------------------------------------------------------------
     */
    const contactForm = document.querySelector('.contact-form');
    const successMsg = document.querySelector('.form-success');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (contactForm && successMsg) {
        
        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Client side validation
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            if (nameInput.value.trim().length < 2) {
                nameInput.style.borderColor = 'red';
                isValid = false;
            } else {
                nameInput.style.borderColor = '';
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.style.borderColor = 'red';
                isValid = false;
            } else {
                emailInput.style.borderColor = '';
            }

            if (messageInput.value.trim().length < 10) {
                messageInput.style.borderColor = 'red';
                isValid = false;
            } else {
                messageInput.style.borderColor = '';
            }

            if (!isValid) {
                alert('Please check the highlighted fields. Name should be at least 2 chars, message at least 10 chars, and email must be valid.');
                return;
            }

            const btn = contactForm.querySelector('button[type="submit"]');
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
                    // Smooth transition
                    contactForm.style.transition = 'opacity 0.3s ease';
                    contactForm.style.opacity = '0';
                    
                    setTimeout(() => {
                        contactForm.style.display = 'none';
                        successMsg.style.display = 'block';
                        successMsg.style.opacity = '0';
                        successMsg.style.transform = 'translateY(15px)';
                        
                        setTimeout(() => {
                            successMsg.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                            successMsg.style.opacity = '1';
                            successMsg.style.transform = 'translateY(0)';
                        }, 50);
                    }, 300);

                    contactForm.reset();
                } else {
                    alert('Oops! There was a problem submitting your form. Please try again.');
                }
            } catch (error) {
                alert('Oops! There was a problem connecting to the server. Please check your network connection.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });

        // Smooth Reset Form Button (Instead of location.reload())
        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                successMsg.style.transition = 'opacity 0.3s ease';
                successMsg.style.opacity = '0';
                
                setTimeout(() => {
                    successMsg.style.display = 'none';
                    contactForm.style.display = 'flex';
                    contactForm.style.opacity = '0';
                    
                    setTimeout(() => {
                        contactForm.style.opacity = '1';
                    }, 50);
                }, 300);
            });
        }
    }
});
