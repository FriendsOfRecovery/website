export function initializeFloatingButton() {
    const floatingButton = document.querySelector('.floating-donate-button');
    const footer = document.getElementById('main-footer');
    
    if (!floatingButton || !footer) return;

    function updateButtonPosition() {
        const footerRect = footer.getBoundingClientRect();
        const buttonHeight = floatingButton.offsetHeight;
        
        if (footerRect.top < window.innerHeight) {
            // Position the button above the footer
            const bottomPosition = window.innerHeight - footerRect.top + 20;
            floatingButton.style.bottom = `${bottomPosition}px`;
        } else {
            // Reset to default position
            floatingButton.style.bottom = '20px';
        }
    }

    window.addEventListener('scroll', updateButtonPosition);
    window.addEventListener('resize', updateButtonPosition);
    
    // Initial check
    updateButtonPosition();
} 