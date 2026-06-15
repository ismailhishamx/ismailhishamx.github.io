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
     * 2. THEME & ACCENT COLOR SYSTEM
     * -----------------------------------------------------------------------
     */
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');

    // Accent colors config
    const colorsConfig = {
        teal: {
            light: { accent: '171, 77%, 40%', secondary: '226, 70%, 50%' },
            dark: { accent: '171, 80%, 50%', secondary: '217, 91%, 60%' }
        },
        indigo: {
            light: { accent: '226, 70%, 50%', secondary: '262, 80%, 50%' },
            dark: { accent: '226, 80%, 60%', secondary: '262, 83%, 60%' }
        },
        emerald: {
            light: { accent: '142, 71%, 45%', secondary: '171, 77%, 40%' },
            dark: { accent: '142, 76%, 50%', secondary: '171, 80%, 50%' }
        },
        violet: {
            light: { accent: '262, 80%, 50%', secondary: '346, 87%, 50%' },
            dark: { accent: '262, 83%, 60%', secondary: '346, 90%, 60%' }
        },
        rose: {
            light: { accent: '346, 87%, 50%', secondary: '262, 80%, 50%' },
            dark: { accent: '346, 90%, 60%', secondary: '262, 83%, 60%' }
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedColor = localStorage.getItem('accent-color') || 'teal';
    
    html.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
    applyAccentColor(savedColor, savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
            
            // Re-apply current accent color with the new theme HSL adjustments
            const currentAccent = localStorage.getItem('accent-color') || 'teal';
            applyAccentColor(currentAccent, newTheme);
        });
    }

    function updateIcon(theme) {
        if (!themeIcon) return;
        const newIconName = theme === 'dark' ? 'sun' : 'moon';
        themeIcon.setAttribute('data-lucide', newIconName);
        lucide.createIcons();
    }

    function applyAccentColor(color, theme) {
        const activeTheme = theme || html.getAttribute('data-theme') || 'dark';
        const config = colorsConfig[color]?.[activeTheme] || colorsConfig['teal'][activeTheme];
        
        html.style.setProperty('--accent-hsl', config.accent);
        html.style.setProperty('--accent-secondary-hsl', config.secondary);
        
        localStorage.setItem('accent-color', color);
        
        // Update picker active status classes
        document.querySelectorAll('.color-dot').forEach(dot => {
            if (dot.getAttribute('data-color') === color) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Attach click events to color dots
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const color = dot.getAttribute('data-color');
            const currentTheme = html.getAttribute('data-theme') || 'dark';
            applyAccentColor(color, currentTheme);
        });
    });

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
                const response = await
                    
                    fetch(contactForm.action, {
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

    /**
     * 10. RESUME PREVIEW MODAL CONTROL
     * -----------------------------------------------------------------------
     */
    const previewCvBtn = document.getElementById('preview-cv-btn');
    const resumeModal = document.getElementById('resume-modal');
    const modalCloseBtn = document.getElementById('modal-close');

    if (previewCvBtn && resumeModal && modalCloseBtn) {
        const openModal = () => {
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        };

        const closeModal = () => {
            resumeModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore background scroll
        };

        previewCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });

        modalCloseBtn.addEventListener('click', closeModal);

        // Close on clicking the background overlay outside modal-content
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                closeModal();
            }
        });

        // Close on pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /**
     * 11. COPY EMAIL TO CLIPBOARD UTIL
     * -----------------------------------------------------------------------
     */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyIcon = document.getElementById('copy-icon');

    if (copyEmailBtn && copyIcon) {
        const copyTooltip = copyEmailBtn.querySelector('.copy-tooltip');

        copyEmailBtn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Stop click from triggering mailto anchor
            e.preventDefault();

            try {
                await navigator.clipboard.writeText('ismailhisham610@gmail.com');
                
                copyEmailBtn.classList.add('copied');
                if (copyTooltip) copyTooltip.textContent = 'Copied!';
                copyIcon.setAttribute('data-lucide', 'check');
                lucide.createIcons();

                setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                    if (copyTooltip) copyTooltip.textContent = 'Copy';
                    copyIcon.setAttribute('data-lucide', 'copy');
                    lucide.createIcons();
                }, 2000);
            } catch (err) {
                console.error('Failed to copy email to clipboard: ', err);
            }
        });
    }

    /**
     * 12. 3D HOVER TILT & GLOSS SHINE EFFECT
     * -----------------------------------------------------------------------
     */
    const tiltElements = document.querySelectorAll('.project-card, .hero-image');

    if (tiltElements.length > 0 && window.matchMedia("(hover: hover)").matches) {
        tiltElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transition = 'transform 0.1s ease';
            });

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Normalized coordinates (-0.5 to 0.5)
                const normX = (x / rect.width) - 0.5;
                const normY = (y / rect.height) - 0.5;

                // Compute rotation (max 12 degrees)
                const rotX = -normY * 12;
                const rotY = normX * 12;

                // Apply transform. If project card, preserve the hover height translate offset
                const isProjectCard = el.classList.contains('project-card');
                const translateOffset = isProjectCard ? 'translateY(-8px)' : '';
                
                el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) ${translateOffset}`;
                el.style.setProperty('--shine-x', `${x}px`);
                el.style.setProperty('--shine-y', `${y}px`);
            });

            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    /**
     * 13. DYNAMIC COPYRIGHT YEAR
     * -----------------------------------------------------------------------
     */
    const copyrightParagraph = document.querySelector('footer p');
    if (copyrightParagraph) {
        const currentYear = new Date().getFullYear();
        copyrightParagraph.innerHTML = `&copy; ${currentYear} Ismail Hisham AlTamboly. Built with passion in Cairo.`;
    }
});
