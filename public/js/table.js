let currentPage = 1;
let itemsPerPage = 10; // Default items per page
let totalPages = 1;
let data = []; // This will hold the CSV data

// Function to load and parse the CSV file
async function loadCSV() {
  try {
    const response = await fetch('phone-list.csv');
    if (!response.ok) throw new Error('Network response was not ok');
    const csvText = await response.text();
    data = parseCSV(csvText);
    initializeTable(data);
  } catch (error) {
    console.error('Error loading CSV file:', error.message); // Only log the error message
    alert('An error occurred while loading the data. Please try again later.'); // User-friendly message
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
      let sanitizedValue = values[index].trim();

      // Escape potentially dangerous characters
      if (sanitizedValue.startsWith('=') || sanitizedValue.startsWith('+') || sanitizedValue.startsWith('-') || sanitizedValue.startsWith('@')) {
        sanitizedValue = `'${sanitizedValue}`;
      }

      entry[header.trim()] = sanitizedValue;
    });
    return entry;
  });
}

// Function to initialize the table and functionalities
function initializeTable(data) {
  populateFilterOptions(data);
  addFilterFunctionality(data);
  addSearchFunctionality(data);
  addPaginationFunctionality(data);
  updateTable(data); // Initial table population
}

// Function to populate the table with data based on pagination
function populateTable(data) {
  const tableBody = document.querySelector('#phone-table tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  const paginatedData = getPaginatedData(data);

  paginatedData.forEach((entry) => {
    const row = document.createElement('tr');
    row.addEventListener('click', () => showHouseDetails(entry)); // Add click event
    
    Object.keys(entry).forEach((key) => {
      const cell = document.createElement('td');
      cell.setAttribute('data-label', key);
      cell.appendChild(createCellContent(key, entry));
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
}

function getPaginatedData(data) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return data.slice(start, end);
}

function createCellContent(key, entry) {
  const cellContent = document.createElement('span');
  cellContent.textContent = entry[key]; // Use textContent to avoid XSS
  return cellContent;
}

// Function to update the table based on filters, search, and pagination
function updateTable(data) {
  const filteredData = filterData(data);
  totalPages = Math.ceil(filteredData.length / itemsPerPage); // Update total pages
  populateTable(filteredData);
  updatePaginationControls();
}

function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

function getFilterValues() {
  return Array.from(document.getElementById('filter-options').querySelectorAll('select'))
    .map((select) => sanitizeInput(select.value));
}

function filterData(data) {
  const filterValues = getFilterValues();
  const searchTerm = sanitizeInput(document.getElementById('search-input').value.toLowerCase());

  return data.filter((entry) => {
    const matchesFilters = ['County', 'Gender', 'Beds', 'Chapter', 'Re-entry'].every((category, index) => {
      const filterValue = filterValues[index];
      return filterValue === 'All' || entry[category] === filterValue;
    });
    const matchesSearch = Object.values(entry).some((value) => value.toLowerCase().includes(searchTerm));
    return matchesFilters && matchesSearch;
  });
}

// Function to update pagination controls
function updatePaginationControls() {
  document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('prev-button').disabled = currentPage === 1;
  document.getElementById('next-button').disabled = currentPage === totalPages;
}

// Function to show house details in a popup
function showHouseDetails(entry) {
    const popup = document.getElementById('house-popup');
    const houseName = document.getElementById('house-name');
    const houseDetails = document.getElementById('house-details');
    const houseImage = document.getElementById('house-image');

    if (!entry) return; // Don't show popup if no entry is provided

    houseName.textContent = entry.Name;
    // Replace spaces with underscores for the image filename
    const imageName = entry.Name.toLowerCase().replace(/ /g, '_');
    houseImage.src = `assets/houses/${imageName}.jpg`;
    houseImage.onerror = () => {
        houseImage.src = 'assets/houses/default-house.jpg'; // Fallback image
    };

    houseDetails.innerHTML = Object.entries(entry)
        .filter(([key]) => key !== 'Name')
        .map(([key, value]) => `<strong>${key}:</strong> ${value}<br>`)
        .join('');

    popup.style.display = 'block';
}

// Close the popup when the close button is clicked
document.querySelector('.close-button')?.addEventListener('click', () => {
    document.getElementById('house-popup').style.display = 'none';
});

// Close the popup when clicking outside the popup content
window.addEventListener('click', (event) => {
    const popup = document.getElementById('house-popup');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

// Remove any initial popup display
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('house-popup');
    if (popup) popup.style.display = 'none';
});

// Function to populate filter options dynamically
function populateFilterOptions(data) {
  const filterOptions = document.getElementById('filter-options');
  filterOptions.innerHTML = ''; // Clear existing filter options

  const categories = ['County', 'Gender', 'Beds', 'Chapter', 'Re-entry'];

  categories.forEach((category) => {
    const container = document.createElement('div');
    container.classList.add('filter-container');

    const labelElement = document.createElement('label');
    labelElement.htmlFor = `${category.toLowerCase()}-filter`;
    labelElement.textContent = category;

    const selectElement = document.createElement('select');
    selectElement.id = `${category.toLowerCase()}-filter`;
    selectElement.innerHTML = `
      <option value="All">All</option>
      ${getUniqueSortedOptions(data, category).map((option) => `<option value="${option}">${option}</option>`).join('')}
    `;

    container.appendChild(labelElement);
    container.appendChild(selectElement);
    filterOptions.appendChild(container);
  });
}

function getUniqueSortedOptions(data, category) {
  const options = [...new Set(data.map((entry) => entry[category]))];
  const nonNumericOptions = options.filter((item) => isNaN(item)).sort((a, b) => a.localeCompare(b));
  const numericOptions = options.filter((item) => !isNaN(item)).sort((a, b) => a - b);
  return [...nonNumericOptions, ...numericOptions];
}

// Function to add filter functionality
function addFilterFunctionality(data) {
  document.querySelectorAll('#filter-options select').forEach((select) => {
    select.addEventListener('change', () => updateTable(data));
  });
}

// Function to add search functionality
function addSearchFunctionality(data) {
  document.getElementById('search-input').addEventListener('input', () => updateTable(data));
}

// Function to add pagination functionality
function addPaginationFunctionality(data) {
  document.getElementById('prev-button').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable(data);
    }
  });

  document.getElementById('next-button').addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateTable(data);
    }
  });

  document.getElementById('items-per-page').addEventListener('change', (event) => {
    itemsPerPage = Number(event.target.value);
    updateTable(data);
  });
}

// Make rows clickable with cursor pointer
const style = document.createElement('style');
style.textContent = `
    #phone-table tbody tr {
        cursor: pointer;
    }
    #phone-table tbody tr:hover {
        background-color: #f5f5f5;
    }
`;
document.head.appendChild(style);

// Call loadCSV when the page loads
document.addEventListener('DOMContentLoaded', loadCSV);

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading data...</p>
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.querySelector('.loading-overlay');
    if (loadingDiv) loadingDiv.remove();
}