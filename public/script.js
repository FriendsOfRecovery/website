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
    showSlides(slideIndex);
    autoShowSlides(); // Start auto slideshow
    adjustButtonPosition(); // Ensure correct position on page load
    window.addEventListener('scroll', adjustButtonPosition); // Adjust button on scroll
    window.addEventListener('resize', adjustButtonPosition); // Adjust on resize as well
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

  // Check screen size and hide button on small screens
  if (window.innerWidth <= 768) {
    donateButton.style.display = 'none';
    return;
  } else {
    donateButton.style.display = 'block';
  }

  const footerRect = footer.getBoundingClientRect();
  const buttonRect = donateButton.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Check if the button is about to overlap with the footer
  if (footerRect.top <= windowHeight - buttonRect.height) {
    donateButton.style.position = 'absolute';
    donateButton.style.bottom = `${footerRect.height + 30}px`;  // Adjust the button above the footer
  } else {
    donateButton.style.position = 'fixed';
    donateButton.style.bottom = '30px';
  }
}

// Call adjustButtonPosition on window resize
window.addEventListener('resize', adjustButtonPosition);

// Call adjustButtonPosition on page load
document.addEventListener('DOMContentLoaded', adjustButtonPosition);

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load Header
    loadHTML('main-header', 'header.html', () => {
        // Attach menu toggle event listener
        const menuIcon = document.querySelector('.menu-icon');
        if (menuIcon) {
            menuIcon.addEventListener('click', toggleMenu);
        }
    });

    // Load Footer
    loadHTML('main-footer', 'footer.html');

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


// Function to load and parse the CSV file
async function loadCSV() {
  try {
    const response = await fetch('phone-list.csv');
    if (!response.ok) throw new Error('Network response was not ok');
    const csvText = await response.text();
    const data = parseCSV(csvText);
    populateTable(data);
    populateFilterOptions(data);
    addFilterFunctionality(data);
    addSearchFunctionality(data);
  } catch (error) {
    console.error('Error loading CSV file:', error);
  }
}

// Function to parse CSV text into an array of objects
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split('\t');  // Use tab as delimiter
  const rows = lines.slice(1);

  return rows.map((line) => {
    const values = line.split('\t');  // Use tab as delimiter
    const entry = {};
    headers.forEach((header, index) => {
      entry[header.trim()] = values[index].trim();
    });
    return entry;
  });
}
// Function to populate the table with data
function populateTable(data) {
  const tableBody = document.querySelector('#phone-table tbody');
  tableBody.innerHTML = '';

  data.forEach((entry) => {
    const row = document.createElement('tr');
    Object.values(entry).forEach((text) => {
      const cell = document.createElement('td');
      cell.textContent = text;
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
  console.log('Table populated with data:', data); // Debug statement
}

// Function to populate the filter options
function populateFilterOptions(data) {
  const filterOptions = document.getElementById('filter-options');
  const categories = ['County', 'Gender', 'Beds', 'Chapter']; // Only include these categories
  console.log('Categories:', categories); // Debug statement

  categories.forEach((category) => {
    const selectElement = document.createElement('select');
    selectElement.id = `${category.toLowerCase()}-filter`;
    selectElement.innerHTML = `
      <option value="All">All</option>
      ${[...[...new Set(data.map((entry) => entry[category]))].filter((item) => isNaN(item)).sort((a, b) => a.localeCompare(b)), ...[...new Set(data.map((entry) => entry[category]))].filter((item) => !isNaN(item)).sort((a, b) => a - b)].map((option) => `<option value="${option}">${option}</option>`).join('')}
    `;
    filterOptions.appendChild(selectElement);
  });
  console.log('Filter options populated'); // Debug statement
}

// Function to add filter functionality
function addFilterFunctionality(data) {
  const filterOptions = document.getElementById('filter-options');
  const filterSelects = filterOptions.children;

  function filterData() {
    const filterValues = Array.from(filterSelects).map((select) => select.value);
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredData = data.filter((entry) => {
      const matchesFilters = ['County', 'Gender', 'Beds', 'Chapter'].every((category, index) => {
        const filterValue = filterValues[index];
        return filterValue === 'All' || entry[category] === filterValue;
      });
      const matchesSearch = Object.values(entry).some((value) => value.toLowerCase().includes(searchTerm));
      return matchesFilters && matchesSearch;
    });
    populateTable(filteredData);
  }

  Array.from(filterSelects).forEach((select) => {
    select.addEventListener('change', filterData);
  });

  // Call filterData once to initialize the table with any active filters
  filterData();
}

// Function to add search functionality
function addSearchFunctionality(data) {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    const filterOptions = document.getElementById('filter-options');
    const filterSelects = filterOptions.children;
    const filterValues = Array.from(filterSelects).map((select) => select.value);

    const filteredData = data.filter((entry) => {
      const matchesFilters = ['County', 'Gender', 'Beds', 'Chapter'].every((category, index) => {
        const filterValue = filterValues[index];
        return filterValue === 'All' || entry[category] === filterValue;
      });
      const matchesSearch = Object.values(entry).some((value) => value.toLowerCase().includes(searchInput.value.toLowerCase()));
      return matchesFilters && matchesSearch;
    });

    populateTable(filteredData);
  });
}

// Call loadCSV when the page loads
document.addEventListener('DOMContentLoaded', loadCSV);