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
        modalTitle.textContent = name;
        
        // Split content into paragraphs and handle line breaks
        const formattedContent = content
            .split(/\n+/) // Split on one or more newlines
            .map(para => para.trim()) // Trim whitespace
            .filter(para => para) // Remove empty paragraphs
            .map(para => `<p>${para}</p>`) // Wrap each paragraph in <p> tags
            .join(''); // Join paragraphs together

        modalBioText.innerHTML = `
            <div class="modal-image">
                <img src="${imgSrc}" alt="${imgAlt}">
            </div>
            ${formattedContent}
        `;
        
        bioModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function setupModalClosing() {
        const closeModal = () => {
            bioModal.style.display = 'none';
            document.body.style.overflow = '';
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