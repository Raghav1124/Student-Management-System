// Page Transition Effects
class PageTransitions {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        this.createOverlay();
        this.bindLinks();
        this.bindForms();
        this.bindAnimations();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'transition-overlay';
        document.body.appendChild(this.overlay);
    }

    bindLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || link.target === '_blank' || link.href.includes('#') || link.hasAttribute('data-no-transition')) return;

            const href = link.getAttribute('href');
            if (href && href.startsWith('/') && !href.startsWith('//')) {
                e.preventDefault();
                this.navigate(href);
            }
        });
    }

    bindForms() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.method === 'get') return;

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    bindAnimations() {
        // Add animation classes to elements on page load
        document.addEventListener('DOMContentLoaded', () => {
            // Animate cards
            document.querySelectorAll('.card').forEach((card, index) => {
                card.classList.add('fade-in-up');
                card.style.animationDelay = `${index * 0.1}s`;
            });

            // Animate table rows
            document.querySelectorAll('tbody tr').forEach((row, index) => {
                row.classList.add('slide-in-left');
                row.style.animationDelay = `${index * 0.05}s`;
            });

            // Animate buttons
            document.querySelectorAll('.btn').forEach(btn => {
                btn.classList.add('hover-grow');
            });

            // Auto-dismiss alerts after 5 seconds
            document.querySelectorAll('.alert').forEach(alert => {
                setTimeout(() => {
                    if (alert.parentNode) {
                        const bsAlert = bootstrap.Alert.getInstance(alert) || new bootstrap.Alert(alert);
                        bsAlert.close();
                    }
                }, 5000);
            });

            // Add smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        });
    }

    navigate(url) {
        this.overlay.classList.add('active');

        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    showLoading() {
        this.overlay.classList.add('active');
    }

    hideLoading() {
        this.overlay.classList.remove('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitions = new PageTransitions();

    // Hide loading when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (window.pageTransitions) {
                window.pageTransitions.hideLoading();
            }
        }, 500);
    });
});

// Loading state for page transitions
window.addEventListener('beforeunload', () => {
    if (window.pageTransitions) {
        window.pageTransitions.showLoading();
    }
});

// Utility functions for animations
const AnimationUtils = {
        fadeIn(element, duration = 500) {
            element.style.opacity = 0;
            element.style.display = 'block';

            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const opacity = Math.min(progress / duration, 1);
                element.style.opacity = opacity;

                if (progress < duration) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        },

        fadeOut(element, duration = 500) {
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const opacity = 1 - Math.min(progress / duration, 1);
                element.style.opacity = opacity;

                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                }
            };
            requestAnimationFrame(animate);
        },

        slideIn(element, from = 'left', duration = 500) {
            element.style.transform = `translateX(${from === 'left' ? '-100%' : '100%'})`;
            element.style.opacity = 0;
            element.style.display = 'block';

            let start = null;
            const animate = (timestamp) => {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);

                    element.style.transform = `translateX(${from === 'left' ? `-${100 - percentage * 100}%` : `${100 - percentage * 100}%`})`;
            element.style.opacity = percentage;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },
    
    bounce(element, intensity = 10, duration = 300) {
        const originalPosition = element.style.transform;
        let start = null;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Bounce effect using sine wave
            const bounceValue = Math.sin(percentage * Math.PI * 2) * intensity * (1 - percentage);
            element.style.transform = `${originalPosition} translateY(${-bounceValue}px)`;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.transform = originalPosition;
            }
        };
        requestAnimationFrame(animate);
    }
};

// Make animation utils globally available
window.AnimationUtils = AnimationUtils;