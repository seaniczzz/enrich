// Profile Modal Functions
function openProfileModal() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileRole').textContent = user.role === 'super_admin' ? 'Super Administrator' : user.role === 'admin' ? 'Administrator' : 'Employee';
        document.getElementById('profileDepartment').textContent = user.department || 'General';
        
        const infoHtml = `
            <div class="profile-info-item"><label>Employee ID</label><p>${user.id || 'N/A'}</p></div>
            <div class="profile-info-item"><label>Email Address</label><p>${user.email}</p></div>
            <div class="profile-info-item"><label>Phone Number</label><p>${user.phone || '+63 912 345 6789'}</p></div>
            <div class="profile-info-item"><label>Status</label><p class="profile-status-active">Active</p></div>
        `;
        document.getElementById('profileInfo').innerHTML = infoHtml;
        
        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editRole').value = user.role === 'super_admin' ? 'Super Administrator' : user.role === 'admin' ? 'Administrator' : 'Employee';
        document.getElementById('editDepartment').value = user.department || '';
        document.getElementById('editPhone').value = user.phone || '';
    }
    document.getElementById('profileModal').style.display = 'flex';
}

function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
    document.getElementById('profileViewMode').style.display = 'block';
    document.getElementById('profileEditMode').style.display = 'none';
}

function editProfile() {
    document.getElementById('profileViewMode').style.display = 'none';
    document.getElementById('profileEditMode').style.display = 'block';
}

function cancelEdit() {
    document.getElementById('profileViewMode').style.display = 'block';
    document.getElementById('profileEditMode').style.display = 'none';
}

document.getElementById('profileEditForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const currentUser = getCurrentUser();
    const updatedUser = {
        ...currentUser,
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        department: document.getElementById('editDepartment').value,
        phone: document.getElementById('editPhone').value
    };
    
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    closeProfileModal();
    alert('Profile updated successfully!');
    location.reload();
});

function showLogoutConfirm() {
    document.getElementById('logoutConfirmModal').style.display = 'flex';
    if (document.getElementById('profileModal')) {
        closeProfileModal();
    }
}

function hideLogoutConfirm() {
    document.getElementById('logoutConfirmModal').style.display = 'none';
}

function confirmLogout() {
    hideLogoutConfirm();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberedUser');
    window.location.href = 'login.html';
}