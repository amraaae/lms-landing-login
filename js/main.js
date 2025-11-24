// --- THEME MANAGEMENT ---
const themeToggleBtn = document.getElementById('theme-toggle');
const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');

function setDark(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
        const sun = document.getElementById('sun-icon');
        const moon = document.getElementById('moon-icon');
        if (sun) sun.classList.remove('hidden');
        if (moon) moon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
        const sun = document.getElementById('sun-icon');
        const moon = document.getElementById('moon-icon');
        if (sun) sun.classList.add('hidden');
        if (moon) moon.classList.remove('hidden');
    }
}

// Check local storage or system preference
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setDark(true);
} else {
    setDark(false);
}

const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    setDark(!isDark);
};

if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

// --- MOBILE MENU ---
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// --- MODAL LOGIC ---
const loginModal = document.getElementById('login-modal');
const loginBtns = document.querySelectorAll('button[id="login-btn"], button[onclick*="login-modal"], #mobile-login-btn');
const closeModalBtn = document.getElementById('close-modal');

if (loginModal) {
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.hasAttribute('onclick')) {
                e.preventDefault();
            }
            loginModal.showModal();
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            loginModal.close();
        });
    }

    // Close on backdrop click
    loginModal.addEventListener('click', (e) => {
        const rect = loginModal.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            loginModal.close();
        }
    });
}

// --- GSAP ANIMATIONS ---
document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Entrance
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-content > *", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        })
        .from(".hero-image", {
            x: 50,
            opacity: 0,
            duration: 1,
        }, "-=0.6")
        .from("#float-card-1", {
            y: 20,
            opacity: 0,
            duration: 0.6
        }, "-=0.4")
        .from("#float-card-2", {
            y: -20,
            opacity: 0,
            duration: 0.6
        }, "-=0.4");

    // 2. Floating Card Micro-interaction (Hover)
    gsap.to("#float-card-1", {
        y: "-=10",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to("#float-card-2", {
        y: "+=10",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5
    });

    // 3. Infinite Logo Slider
    const logoTrack = document.querySelector(".logo-track");
    if (logoTrack) {
        const totalWidth = logoTrack.scrollWidth;
        const animation = gsap.to(logoTrack, {
            x: -totalWidth / 2,
            duration: 20,
            ease: "none",
            repeat: -1
        });
        const sliderSection = logoTrack.parentElement;
        if (sliderSection) {
            sliderSection.addEventListener("mouseenter", () => animation.pause());
            sliderSection.addEventListener("mouseleave", () => animation.play());
        }
    }

    // 4. Features Scroll Reveal
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1
        });
    });

    // 5. App Screen Carousel
    const screens = document.getElementById('app-screens');
    if (screens) {
        let screenIndex = 0;
        setInterval(() => {
            screenIndex = (screenIndex + 1) % 3;
            screens.style.transform = `translateX(-${screenIndex * 100}%)`;
        }, 3000);
    }

    // 6. Roles & Permissions Animation (FIXED)
    const rolesGrid = document.getElementById('roles-grid');
    if (rolesGrid) {
        // Use a simpler animation that cleans up after itself
        gsap.from(".role-card", {
            scrollTrigger: {
                trigger: "#roles-grid",
                start: "top 90%", // Triggers sooner
                toggleActions: "play none none none" // Play once and stay visible
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "transform,opacity" // Critical: Ensures elements stay visible after animation
        });

        // Accordion Logic
        const roleCards = document.querySelectorAll('.role-card');
        if (roleCards.length > 0) {
            roleCards.forEach(card => {
                const btn = card.querySelector('.role-toggle-btn');
                const details = card.querySelector('.role-details');
                const icon = btn ? btn.querySelector('svg') : null;

                if (btn && details && icon) {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent bubbling issues
                        const isOpen = btn.getAttribute('aria-expanded') === 'true';

                        // Close others
                        roleCards.forEach(otherCard => {
                            if (otherCard !== card) {
                                const otherBtn = otherCard.querySelector('.role-toggle-btn');
                                const otherDetails = otherCard.querySelector('.role-details');
                                const otherIcon = otherBtn ? otherBtn.querySelector('svg') : null;

                                if (otherBtn && otherBtn.getAttribute('aria-expanded') === 'true') {
                                    gsap.to(otherDetails, { height: 0, duration: 0.3, ease: "power2.inOut" });
                                    if (otherIcon) gsap.to(otherIcon, { rotation: 0, duration: 0.3 });
                                    otherBtn.setAttribute('aria-expanded', 'false');
                                }
                            }
                        });

                        // Toggle current
                        if (!isOpen) {
                            gsap.to(details, { height: "auto", duration: 0.4, ease: "power2.out" });
                            gsap.to(icon, { rotation: 180, duration: 0.3 });
                            btn.setAttribute('aria-expanded', 'true');
                        } else {
                            gsap.to(details, { height: 0, duration: 0.3, ease: "power2.in" });
                            gsap.to(icon, { rotation: 0, duration: 0.3 });
                            btn.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
            });
        }
    }
});

// Back to Top Button Logic
const backToTopBtn = document.getElementById('back-to-top');

// Хуудсыг гүйлгэх үед товчийг харуулах/нуух
window.addEventListener('scroll', () => {
    // Хэрэв 300px-ээс доош гүйлгэсэн бол товчийг харуулна
    if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-20');
        backToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
    } else {
        // Дээшээ гарсан үед товчийг нууна
        backToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-20');
        backToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
    }
});

// Товч дээр дарахад дээш гүйлгэх
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Зөөлөн гүйлгэх эффект
    });
});

// Force refresh ScrollTrigger after all assets (images) are loaded
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});