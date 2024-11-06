// Bio Modal Functionality
export function initializeBioModal() {
    const bioModal = document.querySelector('.bio-modal');
    if (!bioModal) return;

    const modalContent = bioModal.querySelector('.bio-modal-content');
    const modalTitle = modalContent.querySelector('h3');
    const modalBioText = modalContent.querySelector('.bio-text');
    const closeBtn = modalContent.querySelector('.close-btn');

    setupBioButtons();
    setupModalClosing();

    function setupBioButtons() {
        document.querySelectorAll('.toggle-bio').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const member = button.closest('.chairman-section, .staff-member, .outreach-member');
                const name = member.querySelector('h2, h3').textContent;
                const bioContent = member.querySelector('.bio-content p').textContent;
                const imgSrc = member.querySelector('img').src;
                const imgAlt = member.querySelector('img').alt;

                showModal(name, bioContent, imgSrc, imgAlt);
            });
        });
    }

    function showModal(name, content, imgSrc, imgAlt) {
        // Prepare modal content before showing
        modalTitle.textContent = name;
        modalBioText.innerHTML = `
            <div class="modal-image">
                <img src="${imgSrc}" alt="${imgAlt}">
            </div>
            <p>${content}</p>
        `;
        
        // Reset any existing animations
        modalContent.style.animation = 'none';
        modalContent.offsetHeight; // Trigger reflow
        
        // Show modal with fade in
        bioModal.style.display = 'flex';
        bioModal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.95)';
        
        // Trigger animation
        requestAnimationFrame(() => {
            bioModal.style.opacity = '1';
            bioModal.style.transition = 'opacity 0.2s ease-out';
            modalContent.style.animation = 'modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        });
        
        document.body.style.overflow = 'hidden';
    }

    function setupModalClosing() {
        const closeModal = () => {
            bioModal.style.opacity = '0';
            modalContent.style.animation = 'modalClose 0.2s ease-out forwards';
            
            setTimeout(() => {
                bioModal.style.display = 'none';
                document.body.style.overflow = '';
                bioModal.style.opacity = '';
                modalContent.style.transform = '';
            }, 200);
        };

        closeBtn.addEventListener('click', closeModal);
        bioModal.addEventListener('click', (e) => {
            if (e.target === bioModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && bioModal.style.display === 'flex') closeModal();
        });
    }
}

// Add this CSS to your modal styles:
/*
@keyframes modalPop {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes modalClose {
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.95);
    }
}
*/ 