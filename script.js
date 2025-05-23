// Ensure DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const contactForm = document.getElementById('contact-form');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // Theme Toggle Functionality
    function setTheme(theme) {
        try {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateThemeIcon(theme);
        } catch (error) {
            console.error('Error setting theme:', error);
        }
    }

    function updateThemeIcon(theme) {
        if (themeToggleBtn) {
            // Use text fallback if Font Awesome icons fail
            themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        }
    }

    // Load saved theme or default to light
    try {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    } catch (error) {
        console.error('Error loading theme from localStorage:', error);
        setTheme('light'); // Fallback to light theme
    }

    // Toggle theme on button click
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    } else {
        console.warn('Theme toggle button not found.');
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced Skills Animation with Percentage Counter
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    const percentageElement = bar.parentElement.querySelector('.skill-percentage');
                    let currentWidth = 0;
                    const targetWidth = parseFloat(width);
                    const targetPercentage = Math.round(targetWidth);
                    let currentPercentage = 0;
                    const increment = targetWidth / 100;

                    const animate = () => {
                        if (currentWidth < targetWidth) {
                            currentWidth += increment * 2;
                            currentPercentage = Math.min(Math.round((currentWidth / targetWidth) * targetPercentage), targetPercentage);
                            bar.style.width = `${Math.min(currentWidth, targetWidth)}%`;
                            if (percentageElement) {
                                percentageElement.textContent = `${currentPercentage}%`;
                                percentageElement.classList.add('active');
                            }
                            requestAnimationFrame(animate);
                        } else {
                            bar.style.width = width;
                            if (percentageElement) {
                                percentageElement.textContent = `${targetPercentage}%`;
                            }
                        }
                    };
                    setTimeout(() => {
                        requestAnimationFrame(animate);
                    }, 200);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe skills section
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Fade in animation for sections
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Apply fade animation to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(section);
    });

    // Contact form handling
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Simple form validation
            if (!name || !email || !subject || !message) {
                showNotification('Mohon lengkapi semua field!', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Email tidak valid!', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Sedang mengirim pesan...', 'info');

            setTimeout(() => {
                showNotification('Pesan berhasil dikirim! Terima kasih.', 'success');
                this.reset();
            }, 2000);
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: var(--hero-text);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px var(--card-shadow);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: var(--hero-text);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            removeNotification(notification);
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            removeNotification(notification);
        });
    }

    function getNotificationColor(type) {
        switch (type) {
            case 'success':
                return 'var(--notification-success)';
            case 'error':
                return 'var(--notification-error)';
            case 'warning':
                return 'var(--notification-warning)';
            default:
                return 'var(--notification-info)';
        }
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Typing animation for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 150);
        }, 1000);
    }

    function typeWriter(element, text, delay = 100) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, delay);
            }
        }

        type();
    }

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Scroll reveal animation
    function scrollReveal() {
        const reveals = document.querySelectorAll('.skill-card, .project-card, .certificate-card, .contact-card, .fact');

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            } else {
                element.classList.remove('revealed');
            }
        });
    }

    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .skill-card, .project-card, .certificate-card, .contact-card, .fact {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .skill-card.revealed, .project-card.revealed, .certificate-card.revealed, .contact-card.revealed, .fact.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nav-link.active {
            color: var(--primary-color) !important;
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(revealStyle);

    document.addEventListener('scroll', scrollReveal);
    scrollReveal();

    // Parallax effect for hero background shapes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Project and Certificate card hover effects
    document.querySelectorAll('.project-card, .certificate-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    const loadedStyle = document.createElement('style');
    loadedStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadedStyle);

    // Optional: Display current date and time (e.g., in footer or console)
    // Uncomment the following lines to display the current date and time in the console
    /*
    const now = new Date();
    const options = { timeZone: 'Asia/Jakarta', hour12: false, hour: '2-digit', minute: '2-digit', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    const formattedDateTime = now.toLocaleString('id-ID', options).replace(' pukul ', ', ');
    console.log(`Current Date and Time: ${formattedDateTime}`); // e.g., Thursday, 22 May 2025, 16:39
    */

    // Console message
    console.log(`
🚀 Portfolio Website by Ayu Safitri
📧 Contact: ayu.safitri@example.com
💼 LinkedIn: linkedin.com/in/ayu-safitri
🐙 GitHub: https://github.com/ayusafitri721/

Thanks for checking out my code! 
Feel free to reach out if you'd like to collaborate.
    `);
});