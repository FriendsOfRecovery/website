export function initializeHolidayPopup() {
    // Get the current path
    const currentPath = window.location.pathname.toLowerCase();
    
    // Check if we're on the index page (more lenient check)
    const isIndexPage = currentPath === '/' || 
                       currentPath.includes('index') || 
                       currentPath.endsWith('/');
    
    if (isIndexPage) {
        function shouldShowHolidayPopup() {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            
            // Create date objects for the range
            const startDate = new Date(currentYear, 11, 2); // December 2nd
            const endDate = new Date(currentYear + 1, 0, 1); // January 1st
            
            // For testing - always return true
            // return true;
            
            return currentDate >= startDate && currentDate <= endDate;
        }

        function showHolidayPopup() {
            const popup = document.getElementById('holiday-popup');
            if (!popup) {
                console.error('Holiday popup element not found');
                return;
            }
            
            const closeBtn = popup.querySelector('.close-btn');
            if (!closeBtn) {
                console.error('Close button not found in holiday popup');
                return;
            }

            const lastClosed = localStorage.getItem('holidayPopupClosed');
            const today = new Date().toDateString();
            
            console.log('Holiday Popup Debug:');
            console.log('- Current Path:', currentPath);
            console.log('- Is Index Page:', isIndexPage);
            console.log('- Should Show:', shouldShowHolidayPopup());
            console.log('- Last Closed:', lastClosed);
            console.log('- Today:', today);
            
            if (shouldShowHolidayPopup() && lastClosed !== today) {
                popup.classList.add('show');
            }

            closeBtn.addEventListener('click', () => {
                popup.classList.remove('show');
                localStorage.setItem('holidayPopupClosed', today);
            });

            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.classList.remove('show');
                    localStorage.setItem('holidayPopupClosed', today);
                }
            });
        }

        // Call showHolidayPopup after a short delay to ensure DOM is ready
        setTimeout(showHolidayPopup, 500);
    }
} 