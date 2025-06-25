document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Initialize main hero slider
    if (document.getElementById('mainSlider')) {
        new Splide('#mainSlider', {
            type: 'loop',         // default is 'slide', but use 'loop' to slide from both sides
            rewind: true,
            autoplay: true,
            interval: 5000,      // 15 seconds
            speed: 1000,          // transition speed: 1 second
            arrows: true,         // show navigation arrows
            pagination: true      // optional, shows slide dots
        }).mount();
    }
    
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Splide slider
    if (document.getElementById('testimonialSlider')) {
        new Splide('#testimonialSlider', {
            type: 'loop',
            perPage: 1,
            autoplay: true,
            interval: 8000,
            speed: 1000,
            arrows: true,
            pagination: true,
            pauseOnHover: true,
            pauseOnFocus: true,
            drag: true,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            classes: {
                arrows: 'splide__arrows',
                arrow : 'splide__arrow',
                prev  : 'splide__arrow--prev',
                next  : 'splide__arrow--next',
            }
        }).mount();
    }

    // Read More functionality
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.testimonial-card');
            const excerpt = card.querySelector('.excerpt');
            const fullStory = card.querySelector('.full-story');
            
            if (excerpt.style.display === 'none') {
                excerpt.style.display = 'block';
                fullStory.style.display = 'none';
                this.textContent = 'Read Full Story';
            } else {
                excerpt.style.display = 'none';
                fullStory.style.display = 'block';
                this.textContent = 'Show Less';
                
                // Animate the appearance
                fullStory.style.animation = 'fadeInUp 0.5s ease-out';
            }
        });
    });

    // Share button functionality
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function() {
            const storyId = this.getAttribute('data-story');
            const storyTitle = this.closest('.testimonial-card').querySelector('h4').textContent;
            const shareUrl = window.location.href.split('#')[0] + '?story=' + storyId;
            
            if (navigator.share) {
                navigator.share({
                    title: `${storyTitle}'s Success Story`,
                    text: `Read ${storyTitle}'s inspiring journey with Dzikwa Trust`,
                    url: shareUrl
                }).catch(err => {
                    console.log('Error sharing:', err);
                    fallbackShare(shareUrl);
                });
            } else {
                fallbackShare(shareUrl);
            }
        });
    });

    function fallbackShare(url) {
        // Copy to clipboard as fallback
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
            window.open(`https://twitter.com/intent/tweet?text=Check out this inspiring story from Dzikwa Trust&url=${encodeURIComponent(url)}`, '_blank');
        });
    }

    // Video modal functionality (if you add videos later)
    document.querySelectorAll('[data-video]').forEach(button => {
        button.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video').replace('youtu.be/', 'youtube.com/embed/');
            document.getElementById('storyVideoFrame').src = videoUrl;
            const modal = new bootstrap.Modal(document.getElementById('storyVideoModal'));
            modal.show();
        });
    });

    document.getElementById('storyVideoModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById('storyVideoFrame').src = '';
    });

    // Add animation to cards when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});

// Additional animation for when full story is shown
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

    // Counter animation for stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target.toLocaleString(); // Format number with commas
            }
        });
    };

    // Start counter animation when stats section is in view
    const statsSection = document.querySelector('.impact-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });

        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Form submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('newsletter-form')) {
                const emailInput = this.querySelector('input[type="email"]');
                if (emailInput && emailInput.value) {
                    // Here you would typically send the data to your server
                    alert('Thank you for subscribing to our newsletter!');
                    this.reset();
                }
            }
        });
    });

    // Mobile menu dropdown fix
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth >= 992) {
                this.querySelector('.dropdown-menu').classList.add('show');
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth >= 992) {
                this.querySelector('.dropdown-menu').classList.remove('show');
            }
        });
    });
});

        // Initialize AOS animation library
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Form submission handler
        document.getElementById('donationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real implementation, you would process the payment here
            alert('Thank you for your donation! In a real implementation, this would process your payment.');
        });

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js');
            });
          }

          