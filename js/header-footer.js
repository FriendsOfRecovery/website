// Header and Footer Loading
export function initializeHeaderFooter() {
    loadHeader();
    loadFooter();
}

async function loadHeader() {
    try {
        const response = await fetch('header.html');
        const html = await response.text();
        const header = document.getElementById('main-header');
        header.innerHTML = html;
        header.classList.add('fade-in');
        initializeMobileMenu();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

async function loadFooter() {
    try {
        const response = await fetch('footer.html');
        const html = await response.text();
        const footer = document.getElementById('main-footer');
        footer.innerHTML = html;
        footer.classList.add('fade-in');
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

function initializeMobileMenu() {
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('nav ul');
    
    if (!menuIcon || !navMenu) return;

    // Toggle menu and icon
    menuIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('show');
        
        // Add slide animation
        if (navMenu.classList.contains('show')) {
            navMenu.style.animation = 'slideIn 0.3s forwards';
            menuIcon.innerHTML = '✕'; // Change to close icon
        } else {
            navMenu.style.animation = 'slideOut 0.3s forwards';
            menuIcon.innerHTML = '☰'; // Change back to hamburger
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            !menuIcon.contains(e.target)) {
            navMenu.classList.remove('show');
            menuIcon.innerHTML = '☰';
        }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            menuIcon.innerHTML = '☰';
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            menuIcon.innerHTML = '☰';
        }
    });

    // Add active page indicator
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navMenu.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active-page');
        }
    });
} 