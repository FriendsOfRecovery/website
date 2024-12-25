export function initializeOutreachScroll() {
    const scrollContainer = document.querySelector('.outreach-scroll');
    const leftButton = document.querySelector('.scroll-btn.scroll-left');
    const rightButton = document.querySelector('.scroll-btn.scroll-right');
    
    if (!scrollContainer || !leftButton || !rightButton) return;

    // Set initial scroll position to 0
    scrollContainer.scrollLeft = 0;

    // Set proper display for scroll container
    scrollContainer.style.display = 'flex';
    scrollContainer.style.overflowX = 'scroll';
    scrollContainer.style.scrollBehavior = 'smooth';
    scrollContainer.style.gap = '20px';
    scrollContainer.style.padding = '20px';

    const scrollAmount = 300;

    leftButton.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
        updateScrollButtons();
    });

    rightButton.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
        updateScrollButtons();
    });

    // Update button visibility based on scroll position
    function updateScrollButtons() {
        const isAtStart = scrollContainer.scrollLeft <= 0;
        const isAtEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth;

        leftButton.style.display = isAtStart ? 'none' : 'flex';
        rightButton.style.display = isAtEnd ? 'none' : 'flex';
    }

    // Add event listeners for scroll and resize
    scrollContainer.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    
    // Initial check
    updateScrollButtons();
} 