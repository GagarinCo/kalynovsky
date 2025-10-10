// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize EmailJS
emailjs.init('euiONUqefh-Fu4iFh');

// Input sanitization function to prevent XSS
function sanitizeInput(input) {
    if (!input) return '';
    return input.toString()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/['"]/g, '') // Remove quotes that could break email format
        .trim()
        .substring(0, 1000); // Limit length to prevent abuse
}

// Form handling with error handling
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        try {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (!submitBtn) throw new Error('Submit button not found');
            
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data and sanitize inputs
            const formData = new FormData(contactForm);
            const templateParams = {
                from_name: sanitizeInput(formData.get('name')),
                from_email: sanitizeInput(formData.get('email')),
                message: sanitizeInput(formData.get('message')),
                to_email: 'kalynovskiy@yahoo.com'
            };
            
            // Validate required fields
            if (!templateParams.from_name || !templateParams.from_email || !templateParams.message) {
                throw new Error('Please fill in all required fields');
            }
            
            // Send email using EmailJS
            emailjs.send('service_645d4ws', 'template_u217nwu', templateParams)
                .then(function(response) {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                }, function(error) {
                    console.error('EmailJS error:', error);
                    showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
                    
                    // Fallback to mailto if EmailJS fails
                    const name = sanitizeInput(formData.get('name'));
                    const email = sanitizeInput(formData.get('email'));
                    const message = sanitizeInput(formData.get('message'));
                    const subject = `New Project Inquiry from ${name}`;
                    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
                    const mailtoLink = `mailto:kalynovskiy@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.open(mailtoLink, '_blank');
                    showNotification('Opening your email client as backup...', 'info');
                })
                .catch((error) => {
                    console.error('Unexpected error:', error);
                    showNotification('An unexpected error occurred. Please try again.', 'error');
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification(error.message || 'Please check your input and try again.', 'error');
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Create elements safely to prevent XSS
    const contentDiv = document.createElement('div');
    contentDiv.className = 'notification-content';
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'notification-message';
    messageSpan.textContent = message; // Use textContent instead of innerHTML
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.textContent = '×';
    
    contentDiv.appendChild(messageSpan);
    contentDiv.appendChild(closeBtn);
    notification.appendChild(contentDiv);
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    const notificationCloseBtn = notification.querySelector('.notification-close');
    notificationCloseBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance monitoring
function measurePerformance(name, fn) {
    const start = performance.now();
    try {
        fn();
    } catch (error) {
        console.error(`Performance error in ${name}:`, error);
    } finally {
        const end = performance.now();
        if (end - start > 16) { // Log if operation takes longer than one frame
            console.warn(`${name} took ${end - start}ms`);
        }
    }
}

// Cache DOM elements for performance
let cachedElements = null;

function getCachedElements() {
    if (!cachedElements) {
        cachedElements = {
            navbar: document.querySelector('.navbar'),
            backToTopBtn: document.getElementById('backToTop'),
            heroSection: document.querySelector('.hero'),
            parallaxElements: document.querySelectorAll('.hero-visual')
        };
    }
    return cachedElements;
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    const elements = getCachedElements();
    const scrollY = window.scrollY;
    
    // Navbar background change
    if (elements.navbar) {
        if (scrollY > 50) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    }
    
    // Back to top button visibility
    if (elements.backToTopBtn && elements.heroSection) {
        const heroHeight = elements.heroSection.offsetHeight;
        if (scrollY > heroHeight * 0.5) {
            elements.backToTopBtn.classList.add('show');
        } else {
            elements.backToTopBtn.classList.remove('show');
        }
    }
    
    // Parallax effect
    elements.parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}, 16)); // 60fps

// Main DOMContentLoaded handler - consolidates all initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Animate elements on load
        const animatedElements = document.querySelectorAll('.work-item, .contact-item');
        if (animatedElements.length > 0) {
            animatedElements.forEach(el => {
                if (el && observer) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    observer.observe(el);
                }
            });
        }
    } catch (error) {
        console.error('Error initializing animations:', error);
    }
    
    // Add hover effects for work items
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Simplified phone number click handler
    const phoneElement = document.querySelector('.phone-obfuscated');
    if (phoneElement) {
        phoneElement.addEventListener('click', () => {
            window.open('tel:+14159905711', '_self');
        });
        phoneElement.setAttribute('title', 'Click to call +1 (415) 990-5711');
    }
    
    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    
    // Image Modal Functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('modalPrevBtn');
    const nextBtn = document.getElementById('modalNextBtn');
    
    if (modal && modalImg && closeBtn && prevBtn && nextBtn) {
        let currentImageIndex = 0;
        let workImages = Array.from(document.querySelectorAll('.work-image-img'));
        
        // Update modal image
        const updateModalImage = (index) => {
            if (workImages[index]) {
                modalImg.src = workImages[index].src;
                modalCaption.textContent = '';
                currentImageIndex = index;
                updateNavButtons();
            }
        };
        
        // Update navigation button states
        const updateNavButtons = () => {
            const showButtons = workImages.length > 1;
            [prevBtn, nextBtn].forEach((btn, i) => {
                const isDisabled = i === 0 ? currentImageIndex === 0 : currentImageIndex === workImages.length - 1;
                btn.style.display = showButtons ? 'flex' : 'none';
                btn.style.opacity = isDisabled ? '0.5' : '1';
                btn.disabled = isDisabled;
            });
        };
        
        // Add click event to all work images
        workImages.forEach((img, index) => {
            img.addEventListener('click', function() {
                currentImageIndex = index;
                modal.style.display = 'block';
                updateModalImage(currentImageIndex);
                setTimeout(() => modal.classList.add('show'), 10);
                
                // Focus management for accessibility
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                closeBtn.focus();
            });
        });
        
        // Navigation button events
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentImageIndex > 0) {
                updateModalImage(currentImageIndex - 1);
            }
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentImageIndex < workImages.length - 1) {
                updateModalImage(currentImageIndex + 1);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.style.display !== 'block' || !modal.classList.contains('show')) return;
            
            const actions = {
                'ArrowLeft': () => currentImageIndex > 0 && updateModalImage(currentImageIndex - 1),
                'ArrowRight': () => currentImageIndex < workImages.length - 1 && updateModalImage(currentImageIndex + 1),
                'Escape': closeModal
            };
            
            if (actions[e.key]) {
                e.preventDefault();
                actions[e.key]();
            }
        });
        
        // Close modal events
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        
        function closeModal() {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => modal.style.display = 'none', 300);
            
            // Return focus to the image that opened the modal
            const activeImage = workImages[currentImageIndex];
            if (activeImage) {
                activeImage.focus();
            }
        }
    }
    
    // Carousel functionality
    const carousel = document.getElementById('workCarousel');
    const carouselPrevBtn = document.getElementById('prevBtn');
    const carouselNextBtn = document.getElementById('nextBtn');
    
    if (carousel && carouselPrevBtn && carouselNextBtn) {
        // Responsive scroll amount based on screen size
        const getScrollAmount = () => {
            const workItem = carousel.querySelector('.work-item');
            if (workItem) {
                const itemWidth = workItem.offsetWidth;
                const gap = window.innerWidth <= 480 ? 16 : 32;
                return itemWidth + gap;
            }
            return window.innerWidth <= 480 ? 266 : 382;
        };
        
        carouselPrevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
        
        carouselNextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
        
        // Update button states based on scroll position
        const updateButtons = () => {
            const isAtStart = carousel.scrollLeft <= 0;
            const isAtEnd = carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth);
            
            [carouselPrevBtn, carouselNextBtn].forEach((btn, i) => {
                const isDisabled = i === 0 ? isAtStart : isAtEnd;
                btn.style.opacity = isDisabled ? '0.5' : '1';
                btn.disabled = isDisabled;
            });
        };
        
        carousel.addEventListener('scroll', updateButtons);
        updateButtons();
        
        // Touch/swipe support for mobile
        let startX = 0;
        let scrollLeft = 0;
        let isDragging = false;
        
        carousel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.scrollBehavior = 'auto';
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
        
        carousel.addEventListener('touchend', () => {
            isDragging = false;
            carousel.style.scrollBehavior = 'smooth';
            updateButtons();
        });
        
        // Mouse drag support for desktop
        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.scrollBehavior = 'auto';
            carousel.style.cursor = 'grabbing';
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
        
        carousel.addEventListener('mouseup', () => {
            isDragging = false;
            carousel.style.scrollBehavior = 'smooth';
            carousel.style.cursor = 'grab';
            updateButtons();
        });
        
        carousel.addEventListener('mouseleave', () => {
            isDragging = false;
            carousel.style.scrollBehavior = 'smooth';
            carousel.style.cursor = 'grab';
        });
        
        carousel.style.cursor = 'grab';
    }
    
    // Cleanup function for memory management
    window.addEventListener('beforeunload', () => {
        // Remove event listeners to prevent memory leaks
        if (cachedElements) {
            cachedElements = null;
        }
    });
});

// Add CSS for mobile menu and notifications
const style = document.createElement('style');
style.textContent = `
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;

document.head.appendChild(style);