import { initializeHeaderFooter } from './js/header-footer.js';
import { initializeBioModal } from './js/bio-modal.js';
import { initializeSlideshow } from './js/slideshow.js';
import { initializeFloatingButton } from './js/floating-button.js';
import { initializeOutreachScroll } from './js/outreach-scroll.js';
import { initializePhoneList } from './js/table.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeHeaderFooter();
    initializeBioModal();
    initializeSlideshow();
    initializeFloatingButton();
    initializeOutreachScroll();
    
    // Only initialize phone list if we're on the correct page
    if (document.querySelector('.oxford-phone')) {
        initializePhoneList();
    }
});
