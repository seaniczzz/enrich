// User database
const users = [
    { id: 1, name: "Super Admin", email: "superadmin@enricheye.com", password: "super123", role: "super_admin", department: "IT Management", phone: "+63 912 345 6789" },
    { id: 2, name: "Admin User", email: "admin@enricheye.com", password: "admin123", role: "admin", department: "Human Resources", phone: "+63 923 456 7890" },
    { id: 3, name: "Rheina Lei", email: "employee@enricheye.com", password: "demo123", role: "employee", department: "Clinical Services", phone: "+63 934 567 8901" }
];

// Initialize localStorage
function initStorage() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    if (!localStorage.getItem('currentUser')) {
        localStorage.removeItem('currentUser');
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

// Forgot password
function forgotPassword() {
    alert("Please contact your administrator for password assistance.");
}

// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const userData = { ...user };
        delete userData.password;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        if (rememberMe) {
            localStorage.setItem('rememberedUser', email);
        }
        window.location.href = 'dashboard.html';
    } else {
        const errorDiv = document.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = 'Invalid credentials. Please try again.';
        const form = document.getElementById('loginForm');
        if (!document.querySelector('.error-message')) {
            form.insertBefore(errorDiv, form.firstChild);
        }
        setTimeout(() => errorDiv.classList.remove('show'), 3000);
    }
});

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Navigate between pages
function navigateTo(page) {
    if (page === 'dashboard') {
        window.location.href = 'dashboard.html';
    } else if (page === 'teams') {
        window.location.href = 'teams.html';
    } else if (page === 'admin') {
        window.location.href = 'admin.html';
    }
}

// Check if user is logged in
function checkAuth() {
    const user = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!user && currentPage !== 'login.html' && currentPage !== 'index.html') {
        window.location.href = 'login.html';
    }
    if (user && (currentPage === 'login.html' || currentPage === 'index.html')) {
        window.location.href = 'dashboard.html';
    }
    return user;
}

// Initialize
initStorage();
checkAuth();