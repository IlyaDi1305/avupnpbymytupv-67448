// ===== Mobile Menu Toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Header Scroll Effect =====
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// ===== Service Tabs =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// ===== Form Validation =====
const contactForm = document.getElementById('contactForm');
const formInputs = contactForm.querySelectorAll('.form-input');

// Validation rules
const validators = {
    name: {
        required: true,
        minLength: 2,
        pattern: /^[а-яА-ЯёЁa-zA-Z\s-]+$/,
        messages: {
            required: 'Пожалуйста, введите ваше имя',
            minLength: 'Имя должно содержать минимум 2 символа',
            pattern: 'Имя может содержать только буквы'
        }
    },
    phone: {
        required: true,
        pattern: /^[\d\s()+\-]+$/,
        minLength: 10,
        messages: {
            required: 'Пожалуйста, введите номер телефона',
            pattern: 'Неверный формат номера телефона',
            minLength: 'Номер телефона слишком короткий'
        }
    },
    email: {
        required: false,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        messages: {
            pattern: 'Неверный формат email адреса'
        }
    },
    message: {
        required: false,
        maxLength: 1000,
        messages: {
            maxLength: 'Сообщение слишком длинное (максимум 1000 символов)'
        }
    }
};

// Real-time validation
formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            validateField(input);
        }
    });
});

function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const rules = validators[fieldName];
    
    if (!rules) return true;
    
    const errorElement = field.nextElementSibling;
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (rules.required && !fieldValue) {
        isValid = false;
        errorMessage = rules.messages.required;
    }
    
    // MinLength validation
    if (isValid && rules.minLength && fieldValue.length > 0 && fieldValue.length < rules.minLength) {
        isValid = false;
        errorMessage = rules.messages.minLength;
    }
    
    // MaxLength validation
    if (isValid && rules.maxLength && fieldValue.length > rules.maxLength) {
        isValid = false;
        errorMessage = rules.messages.maxLength;
    }
    
    // Pattern validation
    if (isValid && rules.pattern && fieldValue.length > 0 && !rules.pattern.test(fieldValue)) {
        isValid = false;
        errorMessage = rules.messages.pattern;
    }
    
    // Update UI
    if (isValid) {
        field.classList.remove('error');
        if (errorElement && errorElement.classList.contains('form-error')) {
            errorElement.textContent = '';
        }
    } else {
        field.classList.add('error');
        if (errorElement && errorElement.classList.contains('form-error')) {
            errorElement.textContent = errorMessage;
        }
    }
    
    return isValid;
}

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    const formData = {};
    
    // Validate all fields
    formInputs.forEach(input => {
        const isFieldValid = validateField(input);
        if (!isFieldValid) {
            isFormValid = false;
        }
        formData[input.name] = input.value.trim();
    });
    
    if (isFormValid) {
        // Simulate form submission
        submitForm(formData);
    } else {
        // Focus on first error
        const firstError = contactForm.querySelector('.form-input.error');
        if (firstError) {
            firstError.focus();
        }
    }
});

function submitForm(data) {
    const submitButton = contactForm.querySelector('.btn-primary');
    const formSuccess = document.getElementById('formSuccess');
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    
    // Simulate API call
    setTimeout(() => {
        // Log form data (in real app, send to server)
        console.log('Form submitted:', data);
        
        // Show success message
        formSuccess.classList.add('show');
        
        // Reset form
        contactForm.reset();
        
        // Remove all error states
        formInputs.forEach(input => {
            input.classList.remove('error');
            const errorElement = input.nextElementSibling;
            if (errorElement && errorElement.classList.contains('form-error')) {
                errorElement.textContent = '';
            }
        });
        
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Отправить заявку';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formSuccess.classList.remove('show');
        }, 5000);
    }, 1500);
}

// ===== Scroll to Top Button =====
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Stats Counter Animation =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            const number = parseInt(text.replace(/\D/g, ''));
            
            entry.target.dataset.animated = 'true';
            
            const start = 0;
            const duration = 2000;
            const increment = number / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    let finalText = number.toString();
                    if (hasPlus) finalText += '+';
                    if (hasPercent) finalText += '%';
                    statNumber.textContent = finalText;
                    clearInterval(timer);
                } else {
                    let displayText = Math.floor(current).toString();
                    if (hasPlus) displayText += '+';
                    if (hasPercent) displayText += '%';
                    statNumber.textContent = displayText;
                }
            }, 16);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Phone Number Formatting =====
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Auto-format phone number (Russian format)
    if (value.length > 0) {
        if (value.startsWith('8') || value.startsWith('7')) {
            value = value.substring(1);
        }
        
        let formatted = '+7';
        if (value.length > 0) {
            formatted += ' (' + value.substring(0, 3);
        }
        if (value.length >= 4) {
            formatted += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formatted += '-' + value.substring(6, 8);
        }
        if (value.length >= 9) {
            formatted += '-' + value.substring(8, 10);
        }
        
        e.target.value = formatted;
    }
});

// ===== Preload Animation for Hero =====
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 100);
    }
});

// ===== Lazy Loading Enhancement =====
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== Service Card Hover Effect Enhancement =====
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ===== Review Cards Stagger Animation =====
const reviewCards = document.querySelectorAll('.review-card');

reviewCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// ===== Accessibility: Focus Management =====
const focusableElements = 'a[href], button, textarea, input, select';
const modal = document.querySelector('.nav-menu');

function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusable = focusableContent[0];
    const lastFocusable = focusableContent[focusableContent.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap when mobile menu is active
const menuObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active')) {
            trapFocus(modal);
        }
    });
});

if (modal) {
    menuObserver.observe(modal, { attributes: true, attributeFilter: ['class'] });
}

// ===== Performance: Debounce Scroll Events =====
function debounce(func, wait = 10, immediate = false) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== Console Welcome Message =====
console.log('%c🏁 АвтоПро ', 'background: #ff6b2c; color: white; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%cПрофессиональный сервис для автомобилистов', 'color: #1a2332; font-size: 14px;');
console.log('%cВерсия сайта: 1.0.0', 'color: #6c757d; font-size: 12px;');
