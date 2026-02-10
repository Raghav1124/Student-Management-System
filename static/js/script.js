// Main JavaScript for Student Management System

class StudentManagementSystem {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initTooltips();
        this.initCounters();
        this.setupSearch();
        this.setupSorting();
        this.setupPrint();
        this.setupExport();
    }

    bindEvents() {
        // Search functionality
        this.setupSearch();

        // Sort functionality
        this.setupSorting();

        // Print functionality
        this.setupPrint();

        // Export functionality
        this.setupExport();

        // Form validation
        this.setupFormValidation();
    }

    initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    initCounters() {
        // Animate counter elements
        document.querySelectorAll('.counter').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / 50;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const table = document.querySelector('table');

            if (!table) return;

            const rows = table.querySelectorAll('tbody tr');
            let visibleCount = 0;

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const isVisible = text.includes(searchTerm);
                row.style.display = isVisible ? '' : 'none';
                if (isVisible) visibleCount++;

                // Add animation for visible rows
                if (isVisible && !row.classList.contains('animate__animated')) {
                    row.classList.add('animate__animated', 'animate__fadeIn');
                }
            });

            // Show message if no results
            const noResultsRow = table.querySelector('.no-results');
            if (visibleCount === 0 && !noResultsRow) {
                const tr = document.createElement('tr');
                tr.className = 'no-results';
                tr.innerHTML = `
                    <td colspan="100" class="text-center py-4 text-muted">
                        <i class="bi bi-search display-6 d-block mb-2"></i>
                        <h5>No results found</h5>
                        <p>Try different search terms</p>
                    </td>
                `;
                table.querySelector('tbody').appendChild(tr);
            } else if (visibleCount > 0 && noResultsRow) {
                noResultsRow.remove();
            }
        });
    }

    setupSorting() {
        document.querySelectorAll('.sortable th[data-sort]').forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const table = header.closest('table');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr:not(.no-results)'));
                const columnIndex = Array.from(header.parentNode.children).indexOf(header);
                const sortType = header.getAttribute('data-sort') || 'text';

                // Toggle sort direction
                const isAscending = !header.classList.contains('asc');
                header.classList.toggle('asc', isAscending);
                header.classList.toggle('desc', !isAscending);

                // Remove sort indicators from other headers
                header.parentNode.querySelectorAll('th').forEach(th => {
                    if (th !== header) {
                        th.classList.remove('asc', 'desc');
                    }
                });

                // Sort rows
                rows.sort((a, b) => {
                    let aText = a.children[columnIndex].textContent.trim();
                    let bText = b.children[columnIndex].textContent.trim();

                    // Handle different sort types
                    if (sortType === 'number') {
                        aText = parseFloat(aText.replace(/[^0-9.-]+/g, '')) || 0;
                        bText = parseFloat(bText.replace(/[^0-9.-]+/g, '')) || 0;
                    } else if (sortType === 'date') {
                        aText = new Date(aText);
                        bText = new Date(bText);
                    }

                    if (isAscending) {
                        return aText > bText ? 1 : -1;
                    } else {
                        return aText < bText ? 1 : -1;
                    }
                });

                // Re-add sorted rows with animation
                rows.forEach((row, index) => {
                    row.style.animationDelay = `${index * 0.05}s`;
                    row.classList.add('animate__animated', 'animate__fadeIn');
                    tbody.appendChild(row);
                });
            });
        });
    }

    setupPrint() {
        const printBtn = document.querySelector('.print-btn');
        if (!printBtn) return;

        printBtn.addEventListener('click', () => {
            // Store original content
            const originalContent = document.body.innerHTML;

            // Get printable content
            const printable = document.querySelector('.printable-area') || document.querySelector('main');
            const printContent = printable.innerHTML;

            // Create print window
            document.body.innerHTML = `
                <div class="container mt-4">
                    <div class="text-center mb-4">
                        <h2>Student Management System</h2>
                        <p>Report Generated: ${new Date().toLocaleDateString()}</p>
                    </div>
                    ${printContent}
                </div>
            `;

            // Add print styles
            const style = document.createElement('style');
            style.innerHTML = `
                @media print {
                    body { font-size: 12pt; }
                    .no-print { display: none !important; }
                    .table { border-collapse: collapse; }
                    .table th, .table td { border: 1px solid #ddd; padding: 8px; }
                    .card { border: 1px solid #ddd; box-shadow: none !important; }
                    h1, h2, h3 { page-break-after: avoid; }
                    table { page-break-inside: avoid; }
                }
            `;
            document.head.appendChild(style);

            // Print and restore
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload(); // Refresh to restore functionality
        });
    }

    setupExport() {
        const exportBtn = document.querySelector('.export-btn');
        if (!exportBtn) return;

        exportBtn.addEventListener('click', () => {
            const table = document.querySelector('table');
            if (!table) return;

            // Choose export format
            const format = prompt('Export as (csv/json):', 'csv').toLowerCase();

            if (format === 'csv') {
                this.exportToCSV(table);
            } else if (format === 'json') {
                this.exportToJSON(table);
            } else {
                alert('Please enter "csv" or "json"');
            }
        });
    }

    exportToCSV(table) {
        let csv = [];
        const rows = table.querySelectorAll('tr');

        rows.forEach(row => {
            const rowData = [];
            const cols = row.querySelectorAll('th, td');

            cols.forEach(col => {
                // Clean up the text content
                let text = col.textContent.trim();
                text = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
                // Escape quotes and wrap in quotes
                text = `"${text.replace(/"/g, '""')}"`;
                rowData.push(text);
            });

            csv.push(rowData.join(','));
        });

        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    exportToJSON(table) {
        const data = [];
        const headers = [];

        // Get headers
        const headerRow = table.querySelector('thead tr');
        headerRow.querySelectorAll('th').forEach(th => {
            headers.push(th.textContent.trim());
        });

        // Get data rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            if (row.style.display === 'none') return;

            const rowData = {};
            const cells = row.querySelectorAll('td');

            cells.forEach((cell, index) => {
                if (headers[index]) {
                    rowData[headers[index]] = cell.textContent.trim();
                }
            });

            if (Object.keys(rowData).length > 0) {
                data.push(rowData);
            }
        });

        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `students_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    setupFormValidation() {
        document.querySelectorAll('form[novalidate]').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, false);
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => {
            input.classList.remove('is-invalid');

            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;

                // Add error message
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'This field is required';
                    input.parentNode.appendChild(errorDiv);
                }
            } else {
                // Custom validation for specific input types
                if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        input.classList.add('is-invalid');
                        isValid = false;

                        const errorDiv = input.nextElementSibling;
                        if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
                            errorDiv.textContent = 'Please enter a valid email address';
                        }
                    }
                }

                if (input.type === 'password' && input.hasAttribute('data-min-length')) {
                    const minLength = parseInt(input.getAttribute('data-min-length'));
                    if (input.value.length < minLength) {
                        input.classList.add('is-invalid');
                        isValid = false;

                        const errorDiv = input.nextElementSibling;
                        if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
                            errorDiv.textContent = `Password must be at least ${minLength} characters`;
                        }
                    }
                }
            }
        });

        return isValid;
    }

    // Utility function to show notification
    static showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        document.querySelectorAll('.custom-notification').forEach(n => n.remove());

        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-notification alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
        `;

        const icons = {
            success: 'check-circle',
            danger: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };

        alertDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${icons[type] || 'info-circle'} fs-4 me-3"></i>
                <div class="flex-grow-1">${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        document.body.appendChild(alertDiv);

        // Auto-remove after duration
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.classList.add('animate__animated', 'animate__fadeOut');
                setTimeout(() => alertDiv.remove(), 300);
            }
        }, duration);
    }

    // Load data from API
    static async loadData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('Failed to load data', 'danger');
            return null;
        }
    }

    // Save data via API
    static async saveData(url, data, method = 'POST') {
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            this.showNotification('Data saved successfully', 'success');
            return result;
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Failed to save data', 'danger');
            return null;
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize SMS
    window.sms = new StudentManagementSystem();

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            const printBtn = document.querySelector('.print-btn');
            if (printBtn) printBtn.click();
        }

        // Ctrl + F for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Escape to close modals and clear search
        if (e.key === 'Escape') {
            const modal = bootstrap.Modal.getInstance(document.querySelector('.modal.show'));
            if (modal) {
                modal.hide();
            }

            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
        }
    });

    // Add animation to timetable cells
    const timetableCells = document.querySelectorAll('.timetable-cell');
    timetableCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            cell.classList.add('pulse');
        });

        cell.addEventListener('mouseleave', () => {
            cell.classList.remove('pulse');
        });
    });

    // Initialize data tables with pagination
    this.initDataTables();

    // Add confirmation for delete actions
    this.setupDeleteConfirmations();
});

// Initialize data tables
function initDataTables() {
    const tables = document.querySelectorAll('table[data-pagination]');

    tables.forEach(table => {
        const itemsPerPage = parseInt(table.getAttribute('data-items-per-page')) || 10;
        let currentPage = 1;

        // Add pagination controls if not already present
        if (!table.nextElementSibling || !table.nextElementSibling.classList.contains('pagination-controls')) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'pagination-controls d-flex justify-content-between align-items-center mt-3';
            paginationDiv.innerHTML = `
                <div class="text-muted">Showing <span class="page-info">0-0</span> of <span class="total-items">0</span> items</div>
                <nav>
                    <ul class="pagination pagination-sm mb-0">
                        <li class="page-item prev-btn">
                            <a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a>
                        </li>
                        <li class="page-item next-btn">
                            <a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a>
                        </li>
                    </ul>
                </nav>
            `;
            table.parentNode.insertBefore(paginationDiv, table.nextSibling);
        }

        updatePagination(table, itemsPerPage, currentPage);

        // Add event listeners for pagination
        const prevBtn = table.nextElementSibling.querySelector('.prev-btn');
        const nextBtn = table.nextElementSibling.querySelector('.next-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    updatePagination(table, itemsPerPage, currentPage);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const rows = table.querySelectorAll('tbody tr:not(.no-results)');
                const totalPages = Math.ceil(rows.length / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePagination(table, itemsPerPage, currentPage);
                }
            });
        }
    });
}

function updatePagination(table, itemsPerPage, currentPage) {
    const rows = Array.from(table.querySelectorAll('tbody tr:not(.no-results)'));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Hide all rows
    rows.forEach(row => row.style.display = 'none');

    // Show rows for current page
    rows.slice(startIndex, endIndex).forEach(row => {
        row.style.display = '';
        row.classList.add('animate__animated', 'animate__fadeIn');
    });

    // Update pagination info
    const pageInfo = table.nextElementSibling.querySelector('.page-info');
    const totalItems = table.nextElementSibling.querySelector('.total-items');
    const prevBtn = table.nextElementSibling.querySelector('.prev-btn');
    const nextBtn = table.nextElementSibling.querySelector('.next-btn');

    if (pageInfo) {
        pageInfo.textContent = `${startIndex + 1}-${Math.min(endIndex, rows.length)}`;
    }

    if (totalItems) {
        totalItems.textContent = rows.length;
    }

    if (prevBtn) {
        prevBtn.classList.toggle('disabled', currentPage === 1);
    }

    if (nextBtn) {
        const totalPages = Math.ceil(rows.length / itemsPerPage);
        nextBtn.classList.toggle('disabled', currentPage === totalPages);
    }
}

// Setup delete confirmations
function setupDeleteConfirmations() {
    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const message = this.getAttribute('data-confirm') || 'Are you sure you want to delete this item?';
            const itemName = this.getAttribute('data-item-name') || 'this item';

            const modalHtml = `
                <div class="modal fade" id="confirmDeleteModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title text-danger">
                                    <i class="bi bi-exclamation-triangle me-2"></i>Confirm Deletion
                                </h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="text-center mb-4">
                                    <i class="bi bi-trash display-1 text-danger mb-3"></i>
                                    <h4>${message}</h4>
                                    <p class="text-muted">You are about to delete: <strong>${itemName}</strong></p>
                                    <p class="text-danger small">This action cannot be undone.</p>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">
                                    <i class="bi bi-trash me-2"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Remove existing modal
            const existingModal = document.getElementById('confirmDeleteModal');
            if (existingModal) existingModal.remove();

            // Add new modal
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
            modal.show();

            // Handle confirmation
            document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
                // Perform the actual deletion
                const url = this.getAttribute('href') || this.getAttribute('data-url');
                if (url) {
                    fetch(url, { method: 'DELETE' })
                        .then(response => {
                            if (response.ok) {
                                StudentManagementSystem.showNotification('Item deleted successfully', 'success');
                                // Reload the page or remove the item from DOM
                                setTimeout(() => location.reload(), 1500);
                            } else {
                                throw new Error('Delete failed');
                            }
                        })
                        .catch(error => {
                            StudentManagementSystem.showNotification('Failed to delete item', 'danger');
                        });
                }

                modal.hide();
            });
        });
    });
}
