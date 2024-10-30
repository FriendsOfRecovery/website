let currentPage = 1;
let itemsPerPage = 10; // Default items per page
let totalPages = 1;

// Function to load and parse the CSV file
async function loadCSV() {
  try {
    const response = await fetch('phone-list.csv');
    if (!response.ok) throw new Error('Network response was not ok');
    const csvText = await response.text();
    const data = parseCSV(csvText);
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
  tableBody.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = data.slice(start, end);

  paginatedData.forEach((entry) => {
    const row = document.createElement('tr');
    Object.values(entry).forEach((text) => {
      const cell = document.createElement('td');
      cell.textContent = text;
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
}

// Function to populate the filter options
function populateFilterOptions(data) {
  const filterOptions = document.getElementById('filter-options');
  const categories = ['County', 'Gender', 'Beds', 'Chapter'];

  categories.forEach((category) => {
    const selectElement = document.createElement('select');
    selectElement.id = `${category.toLowerCase()}-filter`;
    selectElement.innerHTML = `
      <option value="All">All</option>
      ${[...[...new Set(data.map((entry) => entry[category]))].filter((item) => isNaN(item)).sort((a, b) => a.localeCompare(b)), ...[...new Set(data.map((entry) => entry[category]))].filter((item) => !isNaN(item)).sort((a, b) => a - b)].map((option) => `<option value="${option}">${option}</option>`).join('')}
    `;
    filterOptions.appendChild(selectElement);
  });
}

// Function to add filter functionality
function addFilterFunctionality(data) {
  const filterOptions = document.getElementById('filter-options');
  const filterSelects = Array.from(filterOptions.children);

  filterSelects.forEach((select) => {
    select.addEventListener('change', () => {
      currentPage = 1; // Reset to first page
      updateTable(data);
    });
  });
}

// Function to add search functionality
function addSearchFunctionality(data) {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    currentPage = 1; // Reset to first page
    updateTable(data);
  });
}

// Function to add pagination functionality
function addPaginationFunctionality(data) {
  const itemsPerPageSelect = document.getElementById('items-per-page');
  itemsPerPageSelect.addEventListener('change', (event) => {
    itemsPerPage = parseInt(event.target.value, 10);
    currentPage = 1; // Reset to first page
    updateTable(data);
  });

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
}

// Function to update the table based on filters, search, and pagination
function updateTable(data) {
  const filterValues = Array.from(document.getElementById('filter-options').children).map((select) => select.value);
  const searchTerm = document.getElementById('search-input').value.toLowerCase();

  const filteredData = data.filter((entry) => {
    const matchesFilters = ['County', 'Gender', 'Beds', 'Chapter'].every((category, index) => {
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

// Call loadCSV when the page loads
document.addEventListener('DOMContentLoaded', loadCSV);
