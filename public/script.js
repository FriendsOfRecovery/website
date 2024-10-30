// Toggle the mobile menu
function toggleMenu() {
  const menu = document.getElementById('menu');
  if (menu) {
      menu.classList.toggle('show');
  }
}

// Slideshow Logic
let slideIndex = 1;
let autoSlideIndex = 0;
let autoSlideInterval;

document.addEventListener('DOMContentLoaded', () => {
  // Load Header
  loadHTML('main-header', 'header.html', () => {
      // Attach menu toggle event listener
      const menuIcon = document.querySelector('.menu-icon');
      if (menuIcon) {
          menuIcon.addEventListener('click', toggleMenu);
      }
  });

  // Load Footer and then adjust button position
  loadHTML('main-footer', 'footer.html', () => {
      adjustButtonPosition(); // Ensure correct position after footer load

      // Add scroll and resize listeners only if button is visible
      const donateButton = document.querySelector(".floating-donate-button");
      if (donateButton && donateButton.style.display !== 'none') {
          window.addEventListener('scroll', adjustButtonPosition);
          window.addEventListener('resize', adjustButtonPosition);
      }
  });

  // Slideshow Initialization
  showSlides(slideIndex);
  autoShowSlides(); // Start auto slideshow

  // Add event listeners to toggle bio buttons once page is fully loaded
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

// Next/previous controls
function plusSlides(n) {
  clearInterval(autoSlideInterval); // Pause auto slideshow when user interacts
  showSlides(slideIndex += n);
  autoShowSlides(); // Restart auto slideshow
}

// Current slide
function currentSlide(n) {
  clearInterval(autoSlideInterval); // Pause auto slideshow when user interacts
  showSlides(slideIndex = n);
  autoShowSlides(); // Restart auto slideshow
}

function showSlides(n) {
  const slides = document.getElementsByClassName("slides");
  const dots = document.getElementsByClassName("dot");

  if (slides.length === 0) return; // Exit if no slides exist

  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }

  for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("active");
  }

  if (slides[slideIndex - 1]) {
      slides[slideIndex - 1].style.display = "block";
  }

  if (dots[slideIndex - 1]) {
      dots[slideIndex - 1].classList.add("active");
  }
}

// Auto slideshow function
function autoShowSlides() {
  const slides = document.getElementsByClassName("slides");
  const dots = document.getElementsByClassName("dot");

  if (slides.length === 0) return; // Exit if no slides

  for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }

  autoSlideIndex++;
  if (autoSlideIndex > slides.length) { autoSlideIndex = 1; }

  slides[autoSlideIndex - 1].style.display = "block";

  for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("active");
  }

  if (dots[autoSlideIndex - 1]) {
      dots[autoSlideIndex - 1].classList.add("active");
  }

  autoSlideInterval = setTimeout(autoShowSlides, 5000); // Change slide every 5 seconds
}

// Load external HTML into an element
function loadHTML(elementID, url, callback) {
  const element = document.getElementById(elementID);
  if (element) {
      fetch(url)
          .then(response => {
              if (!response.ok) throw new Error('Failed to load');
              return response.text();
          })
          .then(data => {
              element.innerHTML = data;
              if (callback) callback();
          })
          .catch(err => console.error('Error loading HTML:', err));
  }
}

// Adjust the floating donate button position when it reaches the footer
function adjustButtonPosition() {
  const donateButton = document.querySelector(".floating-donate-button");
  const footer = document.querySelector("footer");

  if (!donateButton || !footer) return; // Exit if button or footer isn't available

  // Initial display check to hide on specific pages or mobile view
  if (document.title === 'Oxford Phone List' || document.title === "Q&A - F.O.R.A." || document.title === "About - F.O.R.A." || window.innerWidth <= 768) {
      donateButton.style.display = 'none';
      return;
  } else {
      donateButton.style.display = 'block';
  }

  const footerRect = footer.getBoundingClientRect();
  const buttonRect = donateButton.getBoundingClientRect();

  // Adjust button position based on footer overlap
  if (footerRect.top < window.innerHeight - buttonRect.height) {
      donateButton.style.position = 'absolute';
      donateButton.style.bottom = `${footerRect.height + 3}px`; // Position above footer
      donateButton.style.right = '3px';
  } else {
      donateButton.style.position = 'fixed';
      donateButton.style.bottom = '30px';
      donateButton.style.right = '3px';
  }
}

// Initial run to set up button display
adjustButtonPosition();
