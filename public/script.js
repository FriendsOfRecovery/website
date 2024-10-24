// script.js

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('show');
}

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Current slide
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("slides");
    const dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return; // Exit if no slides

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    slides[slideIndex - 1].style.display = "block";
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }
}


// Auto slideshow feature (optional)
let autoSlideIndex = 0;
autoShowSlides();

function autoShowSlides() {
    let i;
    const slides = document.getElementsByClassName("slides");
    const dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return; // Exit if no slides

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    autoSlideIndex++;
    if (autoSlideIndex > slides.length) { autoSlideIndex = 1; }

    slides[autoSlideIndex - 1].style.display = "block";

    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    if (dots[autoSlideIndex - 1]) {
        dots[autoSlideIndex - 1].classList.add("active");
    }

    setTimeout(autoShowSlides, 5000); // Change slide every 5 seconds
}

// Load external HTML into an element
function loadHTML(elementID, url, callback) {
    const element = document.getElementById(elementID);
    fetch(url)
        .then(response => response.text())
        .then(data => {
            element.innerHTML = data;
            if (callback) callback();
        })
        .catch(err => console.error('Error loading HTML:', err));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load Header
    loadHTML('main-header', 'header.html', () => {
        // After header is loaded, attach event listeners
        const menuIcon = document.querySelector('.menu-icon');
        if (menuIcon) {
            menuIcon.addEventListener('click', toggleMenu);
        }
    });

    // Load Footer
    loadHTML('main-footer', 'footer.html');
    // Add event listeners to toggle bio buttons
    const toggleButtons = document.querySelectorAll('.toggle-bio');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bioContent = button.nextElementSibling;
            if (bioContent.style.display === 'block') {
                bioContent.style.display = 'none';
                button.textContent = 'View Bio';
            } else {
                bioContent.style.display = 'block';
                button.textContent = 'Hide Bio';
            }
            });
        });
    });