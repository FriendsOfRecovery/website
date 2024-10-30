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
    populateFilterOptions(data);
    addFilterFunctionality(data);
    addSearchFunctionality(data);
    addPaginationFunctionality(data);
    updateTable(data); // Initial table population
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

// Function to populate the table with data based on pagination
function populateTable(data) {
  const tableBody = document.querySelector('#phone-table tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = data.slice(start, end);

  paginatedData.forEach((entry) => {
    const row = document.createElement('tr');

    Object.keys(entry).forEach((key) => {
      const cell = document.createElement('td');
      if (key === 'Name') {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = entry[key];
        link.addEventListener('click', () => showHouseDetails(entry));
        cell.appendChild(link);
      } else {
        cell.textContent = entry[key];
      }
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });
}

// Function to update the table based on filters, search, and pagination
function updateTable(data) {
  const filterSelects = Array.from(document.getElementById('filter-options').querySelectorAll('select'));
  const filterValues = filterSelects.map((select) => select.value);
  const searchTerm = document.getElementById('search-input').value.toLowerCase();

  const filteredData = data.filter((entry) => {
    const matchesFilters = ['County', 'Gender', 'Beds', 'Chapter', 'Re-entry'].every((category, index) => {
      const filterValue = filterValues[index];
      return filterValue === 'All' || entry[category] === filterValue;
    });
    const matchesSearch = Object.values(entry).some((value) => value.toLowerCase().includes(searchTerm));
    return matchesFilters && matchesSearch;
  });

  totalPages = Math.ceil(filteredData.length / itemsPerPage); // Update total pages
  populateTable(filteredData);
  updatePaginationControls();
}

// Function to update pagination controls
function updatePaginationControls() {
  document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('prev-button').disabled = currentPage === 1;
  document.getElementById('next-button').disabled = currentPage === totalPages;
}

// Function to show house details in a popup// Function to show house details in a popup
function showHouseDetails(entry) {
    const popup = document.getElementById('house-popup');
    const houseName = document.getElementById('house-name');
    const houseDetails = document.getElementById('house-details');
    const houseImage = document.getElementById('house-image');
  
    houseName.textContent = entry.Name;
    // Replace spaces with underscores for the image filename
    houseImage.src = `assets/houses/${entry.Name.toLowerCase().replace(/ /g, '_')}.jpg`;
  
    let details = '';
    for (const [key, value] of Object.entries(entry)) {
      if (key !== 'Name') {
        details += `<strong>${key}:</strong> ${value}<br>`;
      }
    }
    houseDetails.innerHTML = details;
  
    popup.style.display = 'block';
  }

// Close the popup when the close button is clicked
document.querySelector('.close-button').addEventListener('click', () => {
  document.getElementById('house-popup').style.display = 'none';
});

// Close the popup when clicking outside the popup content
window.addEventListener('click', (event) => {
  if (event.target === document.getElementById('house-popup')) {
    document.getElementById('house-popup').style.display = 'none';
  }
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
      ${[...[...new Set(data.map((entry) => entry[category]))].filter((item) => isNaN(item)).sort((a, b) => a.localeCompare(b)), ...[...new Set(data.map((entry) => entry[category]))].filter((item) => !isNaN(item)).sort((a, b) => a - b)].map((option) => `<option value="${option}">${option}</option>`).join('')}
    `;

    container.appendChild(labelElement);
    container.appendChild(selectElement);
    filterOptions.appendChild(container);
  });
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

// Call loadCSV when the page loads
document.addEventListener('DOMContentLoaded', loadCSV);