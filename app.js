// Inventory Management System - Main Application Logic (FIXED)

// Global Application State
let currentUser = null;
let currentPage = 'dashboard';
let products = [];
let customers = [];
let invoices = [];
let salesData = [];
let invoiceItems = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    initializeApp();
});

function initializeApp() {
    console.log('Initializing app...');
    loadSampleData();
    setupEventListeners();
    checkAuthState();
}

// Authentication Functions
function checkAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    navigateToPage('dashboard');
}

// Event Listeners Setup
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login/Register tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchLoginTab(tab);
        });
    });

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(e);
        });
    }

    // Register form  
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister(e);
        });
    }

    // Navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                navigateToPage(page);
            }
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Dashboard refresh
    const refreshDashboard = document.getElementById('refresh-dashboard');
    if (refreshDashboard) {
        refreshDashboard.addEventListener('click', loadDashboard);
    }

    // Product management
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            openProductModal();
        });
    }

    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct(e);
        });
    }

    const productSearch = document.getElementById('product-search');
    if (productSearch) {
        productSearch.addEventListener('input', filterProducts);
    }

    const productFilter = document.getElementById('product-filter');
    if (productFilter) {
        productFilter.addEventListener('change', filterProducts);
    }

    // Inventory management
    const inventoryAdjustmentBtn = document.getElementById('inventory-adjustment-btn');
    if (inventoryAdjustmentBtn) {
        inventoryAdjustmentBtn.addEventListener('click', function() {
            showToast('Inventory adjustment feature coming soon!', 'info');
        });
    }

    const batchManagementBtn = document.getElementById('batch-management-btn');
    if (batchManagementBtn) {
        batchManagementBtn.addEventListener('click', function() {
            showToast('Batch management feature coming soon!', 'info');
        });
    }

    // Billing
    const createInvoiceBtn = document.getElementById('create-invoice-btn');
    if (createInvoiceBtn) {
        createInvoiceBtn.addEventListener('click', function() {
            openInvoiceModal();
        });
    }

    const manageCustomersBtn = document.getElementById('manage-customers-btn');
    if (manageCustomersBtn) {
        manageCustomersBtn.addEventListener('click', function() {
            showToast('Customer management feature coming soon!', 'info');
        });
    }

    const invoiceForm = document.getElementById('invoice-form');
    if (invoiceForm) {
        invoiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveInvoice(e);
        });
    }

    const addInvoiceItemBtn = document.getElementById('add-invoice-item');
    if (addInvoiceItemBtn) {
        addInvoiceItemBtn.addEventListener('click', addInvoiceItem);
    }

    // ML Insights
    const refreshInsights = document.getElementById('refresh-insights');
    if (refreshInsights) {
        refreshInsights.addEventListener('click', loadMLInsights);
    }

    // Modal controls
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
        });
    });

    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Invoice item product selection
    const itemProduct = document.getElementById('item-product');
    if (itemProduct) {
        itemProduct.addEventListener('change', updateItemPrice);
    }
}

// Login/Register Functions
function switchLoginTab(tab) {
    console.log('Switching to tab:', tab);
    
    // Remove active class from all tabs and forms
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
    
    // Add active class to selected tab and form
    const tabButton = document.querySelector(`[data-tab="${tab}"]`);
    if (tabButton) {
        tabButton.classList.add('active');
    }
    
    const form = document.getElementById(`${tab}-form`);
    if (form) {
        form.classList.add('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    console.log('Login attempted');
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    if (!emailInput || !passwordInput) {
        showToast('Login form elements not found', 'error');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    console.log('Login credentials:', email, password);

    // Simple demo authentication
    if (email === 'demo@inventory.com' && password === 'demo123') {
        currentUser = { email, name: 'Demo User', role: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainApp();
        showToast('Welcome back!', 'success');
    } else {
        showToast('Invalid credentials. Use demo@inventory.com / demo123', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    console.log('Register attempted');
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    // Simple registration
    currentUser = { email, name, role: 'user' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMainApp();
    showToast(`Welcome ${name}!`, 'success');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginScreen();
    showToast('Logged out successfully', 'info');
}

// Navigation Functions
function navigateToPage(pageName) {
    console.log('Navigating to:', pageName);
    
    if (!pageName) return;
    
    // Update active sidebar link
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Show corresponding page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    currentPage = pageName;

    // Load page-specific content
    setTimeout(() => {
        switch(pageName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'products':
                loadProducts();
                break;
            case 'inventory':
                loadInventory();
                break;
            case 'billing':
                loadBilling();
                break;
            case 'ml-insights':
                loadMLInsights();
                break;
        }
    }, 100);
}

// Data Management Functions
function loadSampleData() {
    console.log('Loading sample data...');
    
    // Load from localStorage or use default data
    const savedProducts = localStorage.getItem('products');
    const savedCustomers = localStorage.getItem('customers');
    const savedInvoices = localStorage.getItem('invoices');
    const savedSalesData = localStorage.getItem('salesData');

    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = [
            {
                id: 1,
                name: "Laptop - Dell Inspiron 15",
                description: "15-inch business laptop with Intel Core i5",
                category: "Electronics",
                price: 45000,
                quantity: 25,
                batch_number: "DELL2024001",
                expiry_date: "2027-12-31",
                supplier: "Dell Technologies",
                reorder_level: 10,
                last_restocked: "2024-01-15"
            },
            {
                id: 2,
                name: "Office Chair - Ergonomic",
                description: "Adjustable height office chair with lumbar support",
                category: "Furniture",
                price: 12000,
                quantity: 15,
                batch_number: "FURN2024002",
                expiry_date: null,
                supplier: "Office Furniture Co.",
                reorder_level: 5,
                last_restocked: "2024-02-01"
            },
            {
                id: 3,
                name: "Wireless Mouse",
                description: "Bluetooth wireless mouse with ergonomic design",
                category: "Electronics",
                price: 800,
                quantity: 50,
                batch_number: "ELEC2024003",
                expiry_date: null,
                supplier: "Tech Accessories Inc.",
                reorder_level: 20,
                last_restocked: "2024-01-20"
            }
        ];
        saveToStorage('products', products);
    }

    if (savedCustomers) {
        customers = JSON.parse(savedCustomers);
    } else {
        customers = [
            {
                id: 1,
                name: "Rajesh Sharma",
                email: "rajesh@company.com",
                phone: "+91-9876543210",
                address: "123 Business District, Mumbai, 400001",
                company: "Tech Solutions Pvt Ltd",
                payment_terms: "Net 30"
            },
            {
                id: 2,
                name: "Priya Patel",
                email: "priya@startup.com",
                phone: "+91-9876543211",
                address: "456 Innovation Hub, Bangalore, 560001",
                company: "StartupCorp",
                payment_terms: "Net 15"
            }
        ];
        saveToStorage('customers', customers);
    }

    if (savedInvoices) {
        invoices = JSON.parse(savedInvoices);
    } else {
        invoices = [];
    }

    if (savedSalesData) {
        salesData = JSON.parse(savedSalesData);
    } else {
        salesData = [
            {date: "2024-01-01", product_id: 1, quantity: 5, revenue: 225000},
            {date: "2024-01-02", product_id: 2, quantity: 3, revenue: 36000},
            {date: "2024-01-03", product_id: 1, quantity: 2, revenue: 90000},
            {date: "2024-01-04", product_id: 2, quantity: 4, revenue: 48000},
            {date: "2024-01-05", product_id: 1, quantity: 3, revenue: 135000},
            {date: "2024-01-06", product_id: 3, quantity: 10, revenue: 8000},
            {date: "2024-01-07", product_id: 1, quantity: 1, revenue: 45000}
        ];
        saveToStorage('salesData', salesData);
    }
    
    console.log('Sample data loaded:', { products: products.length, customers: customers.length });
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Dashboard Functions
function loadDashboard() {
    console.log('Loading dashboard...');
    updateDashboardMetrics();
    setTimeout(() => {
        createSalesChart();
        createInventoryChart();
        loadDashboardAlerts();
    }, 200);
}

function updateDashboardMetrics() {
    const totalProductsEl = document.getElementById('total-products');
    const totalRevenueEl = document.getElementById('total-revenue');
    const lowStockItemsEl = document.getElementById('low-stock-items');
    const pendingOrdersEl = document.getElementById('pending-orders');
    
    if (totalProductsEl) totalProductsEl.textContent = products.length;
    
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.revenue, 0);
    if (totalRevenueEl) totalRevenueEl.textContent = `₹${totalRevenue.toLocaleString()}`;
    
    const lowStockItems = products.filter(p => p.quantity <= p.reorder_level).length;
    if (lowStockItemsEl) lowStockItemsEl.textContent = lowStockItems;
    
    if (pendingOrdersEl) pendingOrdersEl.textContent = invoices.filter(inv => inv.status === 'pending').length;
}

function createSalesChart() {
    const canvas = document.getElementById('sales-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear any existing chart
    if (window.salesChart && typeof window.salesChart.destroy === 'function') {
        window.salesChart.destroy();
    }

    const chartData = salesData.slice(-7).map(sale => ({
        x: sale.date,
        y: sale.revenue
    }));

    window.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Daily Revenue',
                data: chartData,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createInventoryChart() {
    const canvas = document.getElementById('inventory-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear any existing chart
    if (window.inventoryChart && typeof window.inventoryChart.destroy === 'function') {
        window.inventoryChart.destroy();
    }

    const categoryData = {};
    products.forEach(product => {
        categoryData[product.category] = (categoryData[product.category] || 0) + product.quantity;
    });

    window.inventoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function loadDashboardAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    if (!alertsContainer) return;
    
    alertsContainer.innerHTML = '';

    // Low stock alerts
    const lowStockItems = products.filter(p => p.quantity <= p.reorder_level);
    lowStockItems.forEach(product => {
        const alertCard = createAlertCard({
            type: 'Low Stock Alert',
            product: product.name,
            severity: 'High',
            description: `Only ${product.quantity} units left. Reorder level: ${product.reorder_level}`
        });
        alertsContainer.appendChild(alertCard);
    });

    // ML-based alerts
    const mlAlerts = [
        {
            type: 'Demand Surge Detected',
            product: 'Laptop - Dell Inspiron 15',
            severity: 'Medium',
            description: 'AI predicts 25% increase in demand over next 2 weeks'
        },
        {
            type: 'Price Optimization Opportunity',
            product: 'Office Chair - Ergonomic',
            severity: 'Low',
            description: 'Consider reducing price by 4% to increase sales by 12%'
        }
    ];

    mlAlerts.forEach(alert => {
        const alertCard = createAlertCard(alert);
        alertsContainer.appendChild(alertCard);
    });
}

function createAlertCard(alert) {
    const div = document.createElement('div');
    div.className = `alert-card ${alert.severity.toLowerCase()}`;
    div.innerHTML = `
        <div class="alert-header">
            <h4 class="alert-title">${alert.type}</h4>
            <span class="alert-severity ${alert.severity.toLowerCase()}">${alert.severity}</span>
        </div>
        <p class="alert-description">${alert.description}</p>
    `;
    return div;
}

// Product Management Functions
function loadProducts() {
    console.log('Loading products...');
    displayProductsTable(products);
}

function displayProductsTable(productList) {
    const tbody = document.querySelector('#products-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    productList.forEach(product => {
        const row = createProductRow(product);
        tbody.appendChild(row);
    });
}

function createProductRow(product) {
    const tr = document.createElement('tr');
    const stockStatus = product.quantity <= product.reorder_level ? 'Low Stock' : 'In Stock';
    const statusClass = product.quantity <= product.reorder_level ? 'red' : 'green';

    tr.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>₹${product.price.toLocaleString()}</td>
        <td>${product.quantity}</td>
        <td>${product.batch_number || 'N/A'}</td>
        <td>
            <span class="status-dot ${statusClass}"></span>
            ${stockStatus}
        </td>
        <td>
            <button class="btn btn--sm btn--outline" onclick="editProduct(${product.id})">Edit</button>
            <button class="btn btn--sm btn--outline" onclick="deleteProduct(${product.id})" style="color: var(--color-error);">Delete</button>
        </td>
    `;
    return tr;
}

function filterProducts() {
    const searchInput = document.getElementById('product-search');
    const filterSelect = document.getElementById('product-filter');
    
    if (!searchInput || !filterSelect) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = filterSelect.value;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    displayProductsTable(filteredProducts);
}

function openProductModal(productId = null) {
    console.log('Opening product modal for ID:', productId);
    
    // Show the correct modal and hide others
    const productModal = document.getElementById('product-modal');
    const invoiceModal = document.getElementById('invoice-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (productModal) productModal.style.display = 'block';
    if (invoiceModal) invoiceModal.style.display = 'none';
    
    const title = document.getElementById('product-modal-title');
    const form = document.getElementById('product-form');

    if (productId && form && title) {
        const product = products.find(p => p.id === productId);
        if (product) {
            title.textContent = 'Edit Product';
            fillProductForm(product);
            form.dataset.productId = productId;
        }
    } else if (form && title) {
        title.textContent = 'Add Product';
        form.reset();
        delete form.dataset.productId;
    }

    if (modalOverlay) {
        modalOverlay.classList.remove('hidden');
    }
}

function fillProductForm(product) {
    const fields = {
        'product-name': product.name,
        'product-description': product.description,
        'product-category': product.category,
        'product-price': product.price,
        'product-quantity': product.quantity,
        'product-batch': product.batch_number || '',
        'product-reorder': product.reorder_level,
        'product-supplier': product.supplier || '',
        'product-expiry': product.expiry_date || ''
    };

    Object.keys(fields).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = fields[fieldId];
        }
    });
}

function saveProduct(e) {
    e.preventDefault();
    console.log('Saving product...');
    
    const form = e.target;
    const formData = new FormData(form);

    const productData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        quantity: parseInt(document.getElementById('product-quantity').value),
        batch_number: document.getElementById('product-batch').value,
        reorder_level: parseInt(document.getElementById('product-reorder').value),
        supplier: document.getElementById('product-supplier').value,
        expiry_date: document.getElementById('product-expiry').value
    };

    if (form.dataset.productId) {
        // Edit existing product
        const productId = parseInt(form.dataset.productId);
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...productData };
            showToast('Product updated successfully!', 'success');
        }
    } else {
        // Add new product
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        products.push({ id: newId, ...productData, last_restocked: new Date().toISOString().split('T')[0] });
        showToast('Product added successfully!', 'success');
    }

    saveToStorage('products', products);
    loadProducts();
    closeModal();
}

function editProduct(productId) {
    console.log('Edit product:', productId);
    openProductModal(productId);
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveToStorage('products', products);
        loadProducts();
        showToast('Product deleted successfully!', 'success');
    }
}

// Inventory Management Functions
function loadInventory() {
    console.log('Loading inventory...');
    updateInventoryStats();
    displayInventoryTable();
}

function updateInventoryStats() {
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const inventoryValueEl = document.getElementById('inventory-value');
    if (inventoryValueEl) inventoryValueEl.textContent = `₹${totalValue.toLocaleString()}`;
    
    const activeBatches = products.filter(p => p.batch_number).length;
    const activeBatchesEl = document.getElementById('active-batches');
    if (activeBatchesEl) activeBatchesEl.textContent = activeBatches;
    
    const expiringItems = products.filter(p => {
        if (!p.expiry_date) return false;
        const expiryDate = new Date(p.expiry_date);
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return expiryDate <= thirtyDaysFromNow;
    }).length;
    const expiringItemsEl = document.getElementById('expiring-items');
    if (expiringItemsEl) expiringItemsEl.textContent = expiringItems;
}

function displayInventoryTable() {
    const tbody = document.querySelector('#inventory-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    products.forEach(product => {
        const row = createInventoryRow(product);
        tbody.appendChild(row);
    });
}

function createInventoryRow(product) {
    const tr = document.createElement('tr');
    const value = product.price * product.quantity;
    const status = getInventoryStatus(product);

    tr.innerHTML = `
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${product.batch_number || 'N/A'}</td>
        <td>${product.expiry_date || 'N/A'}</td>
        <td>${product.reorder_level}</td>
        <td>₹${value.toLocaleString()}</td>
        <td>
            <span class="status-dot ${status.class}"></span>
            ${status.text}
        </td>
        <td>
            <button class="btn btn--sm btn--outline">Adjust</button>
            <button class="btn btn--sm btn--outline">History</button>
        </td>
    `;
    return tr;
}

function getInventoryStatus(product) {
    if (product.quantity <= product.reorder_level) {
        return { class: 'red', text: 'Low Stock' };
    }
    if (product.expiry_date) {
        const expiryDate = new Date(product.expiry_date);
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        if (expiryDate <= thirtyDaysFromNow) {
            return { class: 'yellow', text: 'Expiring Soon' };
        }
    }
    return { class: 'green', text: 'Good' };
}

// Billing Functions
function loadBilling() {
    console.log('Loading billing...');
    updateBillingStats();
    displayInvoicesTable();
    loadCustomersToSelect();
    loadProductsToSelect();
}

function updateBillingStats() {
    const todaySales = salesData
        .filter(sale => sale.date === new Date().toISOString().split('T')[0])
        .reduce((sum, sale) => sum + sale.revenue, 0);
    const todaySalesEl = document.getElementById('today-sales');
    if (todaySalesEl) todaySalesEl.textContent = `₹${todaySales.toLocaleString()}`;
    
    const pendingPayments = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.total, 0);
    const pendingPaymentsEl = document.getElementById('pending-payments');
    if (pendingPaymentsEl) pendingPaymentsEl.textContent = `₹${pendingPayments.toLocaleString()}`;
    
    const totalCustomersEl = document.getElementById('total-customers');
    if (totalCustomersEl) totalCustomersEl.textContent = customers.length;
}

function displayInvoicesTable() {
    const tbody = document.querySelector('#invoices-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    invoices.forEach(invoice => {
        const row = createInvoiceRow(invoice);
        tbody.appendChild(row);
    });
}

function createInvoiceRow(invoice) {
    const tr = document.createElement('tr');
    const statusClass = invoice.status === 'paid' ? 'green' : invoice.status === 'pending' ? 'yellow' : 'red';

    tr.innerHTML = `
        <td>INV-${invoice.id.toString().padStart(4, '0')}</td>
        <td>${invoice.customer_name}</td>
        <td>${invoice.date}</td>
        <td>₹${invoice.total.toLocaleString()}</td>
        <td>
            <span class="status-dot ${statusClass}"></span>
            ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </td>
        <td>
            <button class="btn btn--sm btn--outline">View</button>
            <button class="btn btn--sm btn--outline">Print</button>
        </td>
    `;
    return tr;
}

function loadCustomersToSelect() {
    const select = document.getElementById('invoice-customer');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Customer</option>';
    
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.name;
        select.appendChild(option);
    });
}

function loadProductsToSelect() {
    const select = document.getElementById('item-product');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Product</option>';
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (₹${product.price})`;
        option.dataset.price = product.price;
        select.appendChild(option);
    });
}

function openInvoiceModal() {
    console.log('Opening invoice modal...');
    
    // Show the correct modal and hide others
    const invoiceModal = document.getElementById('invoice-modal');
    const productModal = document.getElementById('product-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (invoiceModal) invoiceModal.style.display = 'block';
    if (productModal) productModal.style.display = 'none';
    
    const invoiceDate = document.getElementById('invoice-date');
    if (invoiceDate) {
        invoiceDate.value = new Date().toISOString().split('T')[0];
    }
    
    clearInvoiceItems();
    
    if (modalOverlay) {
        modalOverlay.classList.remove('hidden');
    }
}

function updateItemPrice() {
    const productSelect = document.getElementById('item-product');
    const priceInput = document.getElementById('item-price');
    
    if (!productSelect || !priceInput) return;
    
    const selectedOption = productSelect.selectedOptions[0];
    
    if (selectedOption && selectedOption.dataset.price) {
        priceInput.value = selectedOption.dataset.price;
    }
}

function addInvoiceItem() {
    const productSelect = document.getElementById('item-product');
    const quantityInput = document.getElementById('item-quantity');
    const priceInput = document.getElementById('item-price');

    if (!productSelect || !quantityInput || !priceInput) {
        showToast('Form elements not found', 'error');
        return;
    }

    const productId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);

    if (!productId || !quantity || !price) {
        showToast('Please select product and enter quantity', 'error');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }
    
    if (quantity > product.quantity) {
        showToast(`Only ${product.quantity} units available`, 'error');
        return;
    }

    const item = {
        product_id: productId,
        product_name: product.name,
        quantity: quantity,
        price: price,
        total: quantity * price
    };

    invoiceItems.push(item);
    displayInvoiceItems();
    updateInvoiceTotals();

    // Clear form
    productSelect.value = '';
    quantityInput.value = '';
    priceInput.value = '';
}

function displayInvoiceItems() {
    const tbody = document.querySelector('#invoice-items-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    invoiceItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product_name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price.toLocaleString()}</td>
            <td>₹${item.total.toLocaleString()}</td>
            <td>
                <button class="btn btn--sm btn--outline" onclick="removeInvoiceItem(${index})" style="color: var(--color-error);">Remove</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function removeInvoiceItem(index) {
    invoiceItems.splice(index, 1);
    displayInvoiceItems();
    updateInvoiceTotals();
}

function updateInvoiceTotals() {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('invoice-subtotal');
    const taxEl = document.getElementById('invoice-tax');
    const totalEl = document.getElementById('invoice-total');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;
    if (taxEl) taxEl.textContent = `₹${tax.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
}

function clearInvoiceItems() {
    invoiceItems = [];
    displayInvoiceItems();
    updateInvoiceTotals();
}

function saveInvoice(e) {
    e.preventDefault();
    console.log('Saving invoice...');
    
    const customerSelect = document.getElementById('invoice-customer');
    const dateInput = document.getElementById('invoice-date');
    
    if (!customerSelect || !dateInput) {
        showToast('Form elements not found', 'error');
        return;
    }
    
    const customerId = parseInt(customerSelect.value);
    const date = dateInput.value;

    if (!customerId || invoiceItems.length === 0) {
        showToast('Please select customer and add items', 'error');
        return;
    }

    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        showToast('Customer not found', 'error');
        return;
    }
    
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const invoice = {
        id: Math.max(...invoices.map(inv => inv.id), 0) + 1,
        customer_id: customerId,
        customer_name: customer.name,
        date: date,
        items: [...invoiceItems],
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'pending'
    };

    invoices.push(invoice);
    saveToStorage('invoices', invoices);

    // Update product quantities
    invoiceItems.forEach(item => {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
            product.quantity -= item.quantity;
        }
    });
    saveToStorage('products', products);

    // Add to sales data
    salesData.push({
        date: date,
        product_id: invoiceItems[0].product_id, // Simplified
        quantity: invoiceItems.reduce((sum, item) => sum + item.quantity, 0),
        revenue: total
    });
    saveToStorage('salesData', salesData);

    showToast('Invoice created successfully!', 'success');
    closeModal();
    loadBilling();
}

// ML Insights Functions
function loadMLInsights() {
    console.log('Loading ML insights...');
    loadDemandForecast();
    loadPriceOptimization();
    loadProductRecommendations();
    loadAnomalyDetection();
}

function loadDemandForecast() {
    const container = document.getElementById('demand-forecast-content');
    if (!container) return;
    
    const forecasts = [
        { product: "Laptop - Dell Inspiron 15", predicted_demand: 15, confidence: 85 },
        { product: "Office Chair - Ergonomic", predicted_demand: 8, confidence: 78 },
        { product: "Wireless Mouse", predicted_demand: 25, confidence: 92 }
    ];

    container.innerHTML = '';
    forecasts.forEach(forecast => {
        const div = document.createElement('div');
        div.className = 'recommendation-card';
        div.innerHTML = `
            <div class="recommendation-header">
                <h5 class="recommendation-title">${forecast.product}</h5>
                <span class="confidence-score">${forecast.confidence}% confidence</span>
            </div>
            <p>Predicted demand: <strong>${forecast.predicted_demand} units</strong> in next 30 days</p>
        `;
        container.appendChild(div);
    });

    setTimeout(createDemandChart, 100);
}

function createDemandChart() {
    const canvas = document.getElementById('demand-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (window.demandChart && typeof window.demandChart.destroy === 'function') {
        window.demandChart.destroy();
    }

    window.demandChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Predicted Demand',
                data: [12, 15, 18, 14],
                backgroundColor: '#1FB8CD'
            }, {
                label: 'Historical Average',
                data: [10, 12, 15, 13],
                backgroundColor: '#FFC185'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function loadPriceOptimization() {
    const container = document.getElementById('price-optimization-content');
    if (!container) return;
    
    const recommendations = [
        {
            product: "Laptop - Dell Inspiron 15",
            current_price: 45000,
            optimized_price: 47000,
            expected_profit_increase: "8%"
        },
        {
            product: "Office Chair - Ergonomic",
            current_price: 12000,
            optimized_price: 11500,
            expected_sales_increase: "12%"
        }
    ];

    container.innerHTML = '';
    recommendations.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'recommendation-card';
        div.innerHTML = `
            <h5 class="recommendation-title">${rec.product}</h5>
            <p>Current: ₹${rec.current_price.toLocaleString()} → Recommended: ₹${rec.optimized_price.toLocaleString()}</p>
            <p>Expected impact: <strong>${rec.expected_profit_increase || rec.expected_sales_increase}</strong></p>
        `;
        container.appendChild(div);
    });
}

function loadProductRecommendations() {
    const container = document.getElementById('product-recommendations-content');
    if (!container) return;
    
    const recommendations = [
        "Customers who buy laptops often purchase wireless mice (+78% correlation)",
        "Ergonomic chairs are frequently bought with laptop stands (+65% correlation)",
        "Bundle suggestion: Laptop + Mouse + Chair (increases average order value by 23%)"
    ];

    container.innerHTML = '';
    recommendations.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'recommendation-card';
        div.innerHTML = `<p>${rec}</p>`;
        container.appendChild(div);
    });
}

function loadAnomalyDetection() {
    const container = document.getElementById('anomaly-detection-content');
    if (!container) return;
    
    const anomalies = [
        {
            type: 'High Demand',
            product: 'Laptop - Dell Inspiron 15',
            severity: 'Medium',
            description: 'Unusually high demand detected for this quarter'
        },
        {
            type: 'Inventory Discrepancy',
            product: 'Office Chair - Ergonomic',
            severity: 'Low',
            description: 'Minor variance in stock count detected'
        }
    ];

    container.innerHTML = '';
    anomalies.forEach(anomaly => {
        const alertCard = createAlertCard(anomaly);
        container.appendChild(alertCard);
    });
}

// Utility Functions
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.add('hidden');
    }
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        console.warn('Toast container not found');
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 18px;">&times;</button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}

// Global functions for inline event handlers
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.removeInvoiceItem = removeInvoiceItem;