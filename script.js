// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.scrollY > 50;
    navbar.style.background = scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = scrolled ? '0 2px 20px rgba(0, 0, 0, 0.1)' : 'none';
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.work-item, .skill-category, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form handling
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Create Gmail mailto link with form data
        const subject = `New Project Inquiry from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        
        const mailtoLink = `mailto:kalynovskiy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open Gmail with the form data
        window.open(mailtoLink, '_blank');
        
        // Show success message
        showNotification('Opening Gmail with your message!', 'success');
        
        // Reset the form
        contactForm.reset();
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
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
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
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Parallax effect for floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Smooth reveal animation for work items
const workItems = document.querySelectorAll('.work-item');
workItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
});

// Add hover effects for work items
workItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads (optional)
// Uncomment the following lines if you want a typing effect
/*
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});
*/

// Add CSS for mobile menu
const style = document.createElement('style');
style.textContent = `
    .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
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

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Parallax effect
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}, 16)); // 60fps

// Image Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('modalPrevBtn');
    const nextBtn = document.getElementById('modalNextBtn');
    
    let currentImageIndex = 0;
    let workImages = [];
    
    // Initialize work images array
    const initializeWorkImages = () => {
        workImages = Array.from(document.querySelectorAll('.work-image-img'));
    };
    
    // Initialize on page load
    initializeWorkImages();
    
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
            
            // Add show class after a small delay for smooth animation
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
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
        if (modal.style.display !== 'block') return;
        
        const actions = {
            'ArrowLeft': () => currentImageIndex > 0 && updateModalImage(currentImageIndex - 1),
            'ArrowRight': () => currentImageIndex < workImages.length - 1 && updateModalImage(currentImageIndex + 1),
            'Escape': closeModal
        };
        
        actions[e.key]?.();
    });
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});

// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('workCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 380; // Width of one item + gap
        
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Update button states based on scroll position
        const updateButtons = () => {
            const isAtStart = carousel.scrollLeft <= 0;
            const isAtEnd = carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth);
            
            [prevBtn, nextBtn].forEach((btn, i) => {
                const isDisabled = i === 0 ? isAtStart : isAtEnd;
                btn.style.opacity = isDisabled ? '0.5' : '1';
                btn.disabled = isDisabled;
            });
        };
        
        carousel.addEventListener('scroll', updateButtons);
        updateButtons(); // Initial state
    }
});
