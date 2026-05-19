let allUsers = [];
let editingUserId = null;

// Default users data - 7 specific users
const defaultUsers = [
    { 
        id: 1, 
        name: "CJ Johnson", 
        email: "superadmin@enricheye.com", 
        password: "super123", 
        role: "super_admin", 
        title: "CEO/Founder"
    },
    { 
        id: 2, 
        name: "Rheinalei Aubrey Beria Co", 
        email: "admin1@enricheye.com", 
        password: "admin123", 
        role: "admin", 
        title: "Clinical Operations Manager"
    },
    { 
        id: 3, 
        name: "Liz Maldonado", 
        email: "admin2@enricheye.com", 
        password: "admin123", 
        role: "admin", 
        title: "Human Resources & Payroll Manager"
    },
    { 
        id: 4, 
        name: "Mona Kona", 
        email: "employee1@enricheye.com", 
        password: "demo123", 
        role: "employee", 
        title: "Front-end and Field Technician"
    },
    { 
        id: 5, 
        name: "Rochelle Cecilio", 
        email: "employee2@enricheye.com", 
        password: "demo123", 
        role: "employee", 
        title: "Part-time Virtual Assistant"
    },
    { 
        id: 6, 
        name: "Neradzmar Antuyan", 
        email: "employee3@enricheye.com", 
        password: "demo123", 
        role: "employee", 
        title: "Full-time Virtual Assistant"
    },
    { 
        id: 7, 
        name: "Carina Betancourt", 
        email: "employee4@enricheye.com", 
        password: "demo123", 
        role: "employee", 
        title: "Logistics & Patient Support Lead"
    }
];

// Initialize localStorage with default users - FORCE OVERWRITE
function initUsers() {
    // Always set the 7 default users (overwrites any existing data)
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    console.log('Users initialized with 7 users');
}

function loadAdminData() {
    const user = getCurrentUser();
    if (user.role !== 'admin' && user.role !== 'super_admin') {
        window.location.href = 'dashboard.html';
        return;
    }
    
    document.getElementById('adminName').textContent = user.name;
    const roleSpan = document.getElementById('adminRole');
    if (user.role === 'super_admin') {
        roleSpan.textContent = 'Super Administrator - CEO';
        roleSpan.classList.add('super-admin');
    } else if (user.role === 'admin') {
        roleSpan.textContent = 'Admin';
        roleSpan.classList.add('admin');
    } else {
        roleSpan.textContent = 'Team Member';
        roleSpan.classList.add('employee');
    }
    
    loadUsers();
}

function loadUsers() {
    // Force reload from localStorage
    allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // If still no users, set defaults
    if (allUsers.length === 0) {
        allUsers = [...defaultUsers];
        localStorage.setItem('users', JSON.stringify(allUsers));
    }
    
    console.log('Loaded users count:', allUsers.length);
    filterUsers();
}

function filterUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    
    let filtered = allUsers;
    if (searchTerm) {
        filtered = filtered.filter(u => u.name.toLowerCase().includes(searchTerm) || u.email.toLowerCase().includes(searchTerm));
    }
    if (roleFilter !== 'all') {
        filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    renderUsersTable(filtered);
}

function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    const currentUser = getCurrentUser();
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <strong>${escapeHtml(user.name)}</strong><br>
                <small style="color: #DAA520; font-size: 0.7rem;">${escapeHtml(user.title || '')}</small>
            </td>
            <td>${escapeHtml(user.email)}</td>
            <td>${getRoleBadge(user.role)}</td>
            <td>
                <button class="action-btn edit" onclick="openEditUserModal(${user.id})" title="Edit User">
                    <i class="fas fa-edit"></i>
                </button>
                ${currentUser.role === 'super_admin' && user.role !== 'super_admin' ? 
                    `<button class="action-btn delete" onclick="deleteUser(${user.id})" title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
            </td>
        `
    ).join('');
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getRoleBadge(role) {
    switch(role) {
        case 'super_admin': return '<span class="role-badge super-admin">CEO / Super Admin</span>';
        case 'admin': return '<span class="role-badge admin">Admin</span>';
        default: return '<span class="role-badge employee">Team Member</span>';
    }
}

function openAddUserModal() {
    editingUserId = null;
    document.getElementById('userModalTitle').textContent = 'Add New User';
    document.getElementById('userForm').reset();
    document.getElementById('passwordField').style.display = 'block';
    document.getElementById('userModal').style.display = 'flex';
}

function openEditUserModal(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        editingUserId = userId;
        document.getElementById('userModalTitle').textContent = 'Edit User';
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userTitle').value = user.title || '';
        document.getElementById('passwordField').style.display = 'none';
        document.getElementById('userModal').style.display = 'flex';
    }
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
    editingUserId = null;
}

function saveUser(e) {
    e.preventDefault();
    const userData = {
        id: editingUserId || Date.now(),
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        title: document.getElementById('userTitle').value || '',
        isActive: true
    };
    
    if (!editingUserId) {
        userData.password = document.getElementById('userPassword').value;
        if (!userData.password) {
            alert('Password is required for new users');
            return;
        }
    }
    
    if (editingUserId) {
        const index = allUsers.findIndex(u => u.id === editingUserId);
        if (index !== -1) {
            if (!userData.password && allUsers[index].password) {
                userData.password = allUsers[index].password;
            }
            allUsers[index] = { ...allUsers[index], ...userData };
        }
    } else {
        allUsers.push(userData);
    }
    
    localStorage.setItem('users', JSON.stringify(allUsers));
    closeUserModal();
    loadUsers();
    alert(editingUserId ? 'User updated successfully!' : 'User created successfully!');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        allUsers = allUsers.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(allUsers));
        loadUsers();
        alert('User deleted successfully!');
    }
}

function showTab(tab) {
    const usersTab = document.getElementById('usersTab');
    const settingsTab = document.getElementById('settingsTab');
    const navButtons = document.querySelectorAll('.admin-nav-item');
    
    if (tab === 'users') {
        usersTab.style.display = 'block';
        settingsTab.style.display = 'none';
        navButtons[0].classList.add('active');
        navButtons[1].classList.remove('active');
    } else {
        usersTab.style.display = 'none';
        settingsTab.style.display = 'block';
        navButtons[0].classList.remove('active');
        navButtons[1].classList.add('active');
    }
}

function saveSettings() {
    const companyName = document.getElementById('companyName').value;
    const notificationsEnabled = document.getElementById('notificationsEnabled').checked;
    const sessionTimeout = document.getElementById('sessionTimeout').value;
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('notificationsEnabled', notificationsEnabled);
    localStorage.setItem('sessionTimeout', sessionTimeout);
    alert('Settings saved successfully!');
}

// Initialize
initUsers();
loadAdminData();