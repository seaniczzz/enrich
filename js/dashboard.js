// Load dashboard data
function loadDashboard() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('employeeName').textContent = user.name;
        
        if (user.role === 'admin' || user.role === 'super_admin') {
            document.getElementById('adminNavBtn').style.display = 'flex';
        }
    }
    loadNotifications();
    loadSOPs();
    loadForms();
}

// SOP Data
const sopDocuments = {
    "Field": {
        icon: "fas fa-syringe",
        count: 1,
        documents: [
            { id: 1, name: "SOP- Blood collection and Phlebotomy Guidelines", url: "/sops/field/SOP- Blood collection and Phlebotomy Guidelines.pdf" }
        ]
    },
    "Front-end": {
        icon: "fas fa-desktop",
        count: 14,
        documents: [
            { id: 2, name: "Standard Operating Procedure Route Scheduling", url: "/sops/front-end/Standard Operating Procedure Route Scheduling.pdf" },
            { id: 3, name: "SOP-Tiered Institutional Pricing", url: "/sops/front-end/SOP-Tiered Institutional Pricing.pdf" },
            { id: 4, name: "SOP-INSURANCE CLAIMS REIMBURSEMENT", url: "/sops/front-end/SOP-INSURANCE CLAIMS REIMBURSEMENT.pdf" },
            { id: 5, name: "SOP- Workflow process from Px intake", url: "/sops/front-end/SOP- Workflow process.pdf" },
            { id: 6, name: "SOP- PHONE CALL HANDLING STRATEGIES", url: "/sops/front-end/SOP- PHONE CALL HANDLING.pdf" },
            { id: 7, name: "SOP- Patient Eye Assessment Workflow", url: "/sops/front-end/SOP- Patient Eye Assessment.pdf" },
            { id: 8, name: "SOP- PART TIME SCHEDULING", url: "/sops/front-end/SOP- PART TIME SCHEDULING.pdf" },
            { id: 9, name: "SOP- HVA TROUBLESHOOTING GUIDE", url: "/sops/front-end/SOP- HVA TROUBLESHOOTING.pdf" },
            { id: 10, name: "SOP- Drop-offs Protocol", url: "/sops/front-end/SOP- Drop-offs Protocol.pdf" },
            { id: 11, name: "SOP Revisions - Physician outreach guide", url: "/sops/front-end/SOP Revisions.pdf" },
            { id: 12, name: "SOP ENRICH SOCIAL MEDIA", url: "/sops/front-end/SOP ENRICH SOCIAL MEDIA.pdf" },
            { id: 13, name: "Provider Statement Agreement", url: "/sops/front-end/Provider Statement Agreement.pdf" },
            { id: 14, name: "Onboarding Guide Time Doctor", url: "/sops/front-end/Onboarding Guide Time Doctor.pdf" },
            { id: 15, name: "HVA Quick Guide Navigating Routific", url: "/sops/front-end/HVA Quick Guide.pdf" }
        ]
    },
    "HR & Payroll": {
        icon: "fas fa-users",
        count: 7,
        documents: [
            { id: 16, name: "SOP-Chain of command", url: "/sops/hr/SOP-Chain of command.pdf" },
            { id: 17, name: "SOP- Jibble Time Tracker Implementation", url: "/sops/hr/SOP- Jibble Time Tracker.pdf" },
            { id: 18, name: "SOP- Jibble Time installation Guide", url: "/sops/hr/SOP- Jibble Installation.pdf" },
            { id: 19, name: "SOP- HVA Pre-Onboarding Checklist", url: "/sops/hr/SOP- Pre-Onboarding.pdf" },
            { id: 20, name: "SOP- Code of Conduct", url: "/sops/hr/SOP- Code of Conduct.pdf" },
            { id: 21, name: "PAYROLL AMENDMENT AGREEMENT", url: "/sops/hr/PAYROLL AMENDMENT.pdf" },
            { id: 22, name: "HR DOCUMENTATION & PAYROLL WORKFLOW", url: "/sops/hr/HR DOCUMENTATION.pdf" }
        ]
    }
};

let sopListOpen = false;

function toggleSOPList() {
    sopListOpen = !sopListOpen;
    const sopList = document.getElementById('sopList');
    const chevron = document.getElementById('sopChevron');
    
    if (sopListOpen) {
        renderSOPList();
        sopList.style.display = 'block';
        chevron.classList.remove('fa-chevron-down');
        chevron.classList.add('fa-chevron-up');
    } else {
        sopList.style.display = 'none';
        chevron.classList.remove('fa-chevron-up');
        chevron.classList.add('fa-chevron-down');
    }
}

function renderSOPList() {
    const container = document.getElementById('sopList');
    let html = '';
    
    for (const [folderName, folderData] of Object.entries(sopDocuments)) {
        html += `
            <div class="sop-folder">
                <button class="sop-folder-btn" onclick="toggleSOPFolder('${folderName}')">
                    <i class="${folderData.icon}"></i>
                    <span>${folderName}</span>
                    <span class="folder-count">${folderData.count} PDFs</span>
                    <i class="fas fa-chevron-down" id="chevron-${folderName}"></i>
                </button>
                <div class="sop-folder-content" id="folder-${folderName}" style="display: none;">
                    ${folderData.documents.map(doc => `
                        <button class="sop-item" onclick="openPDF('${doc.url}', '${doc.name.replace(/'/g, "\\'")}')">
                            <i class="fas fa-file-pdf"></i>
                            <span>${doc.name}</span>
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

let openFolders = {};

function toggleSOPFolder(folderName) {
    openFolders[folderName] = !openFolders[folderName];
    const folderContent = document.getElementById(`folder-${folderName}`);
    const chevron = document.getElementById(`chevron-${folderName}`);
    
    if (openFolders[folderName]) {
        folderContent.style.display = 'block';
        chevron.classList.remove('fa-chevron-down');
        chevron.classList.add('fa-chevron-up');
    } else {
        folderContent.style.display = 'none';
        chevron.classList.remove('fa-chevron-up');
        chevron.classList.add('fa-chevron-down');
    }
}

// Forms Data
const employeeForms = [
    { name: "Leave Request Form", url: "https://forms.gle/rm3onTDVf2kbUPXw7", type: "link" },
    { name: "Internet Connectivity Stipend Form", url: "/forms/Internet_Allowance_Application_Enrich.pdf", type: "pdf" },
    { name: "Equipment and Productivity", url: "/forms/Equipment Stipend Reimbursement Request Form.pdf", type: "pdf" },
    { name: "Health Insurance Form", url: "/forms/Healthcare_Enrollment_Form_Maxicare.pdf", type: "pdf" },
    { name: "Provider Service Agreement", url: "/forms/Provider Statement Agreement.pdf", type: "pdf" }
];

const onboardingForms = [
    { name: "Employee Handbook", url: "/forms/EMPLOYEE HANDBOOK_PH BASED 2026.pdf", type: "pdf" },
    { name: "Code of Conduct", url: "/forms/SOP- Code of Conduct.pdf", type: "pdf" },
    { name: "Payroll Ammendment", url: "/forms/PAYROLL AMENDMENT AGREEMENT.pdf", type: "pdf" },
    { name: "Full-time HVA Job Role Acceptance", url: "/forms/Provider Statement Agreement.pdf", type: "pdf" },
    { name: "Independent Contractor Agreement", url: "/forms/ENRICH VA INDEPENDENT CONTRACTOR AGREEMENT.pdf", type: "pdf" }
];

let employeeFormsOpen = false;
let onboardingFormsOpen = false;

function toggleEmployeeForms() {
    employeeFormsOpen = !employeeFormsOpen;
    const menu = document.getElementById('employeeFormsMenu');
    const chevron = document.getElementById('employeeChevron');
    
    if (employeeFormsOpen) {
        renderEmployeeForms();
        menu.style.display = 'block';
        chevron.classList.remove('fa-chevron-down');
        chevron.classList.add('fa-chevron-up');
    } else {
        menu.style.display = 'none';
        chevron.classList.remove('fa-chevron-up');
        chevron.classList.add('fa-chevron-down');
    }
}

function toggleOnboardingForms() {
    onboardingFormsOpen = !onboardingFormsOpen;
    const menu = document.getElementById('onboardingFormsMenu');
    const chevron = document.getElementById('onboardingChevron');
    
    if (onboardingFormsOpen) {
        renderOnboardingForms();
        menu.style.display = 'block';
        chevron.classList.remove('fa-chevron-down');
        chevron.classList.add('fa-chevron-up');
    } else {
        menu.style.display = 'none';
        chevron.classList.remove('fa-chevron-up');
        chevron.classList.add('fa-chevron-down');
    }
}

function renderEmployeeForms() {
    const container = document.getElementById('employeeFormsMenu');
    container.innerHTML = employeeForms.map(form => `
        <button class="form-item-btn ${form.type === 'link' ? 'link-form' : ''}" onclick="openForm('${form.url}', '${form.type}', '${form.name.replace(/'/g, "\\'")}')">
            <i class="fas ${form.type === 'link' ? 'fa-external-link-alt' : 'fa-file-pdf'}"></i>
            ${form.name}
            ${form.type === 'link' ? '<span class="google-badge">Google Form</span>' : ''}
        </button>
    `).join('');
}

function renderOnboardingForms() {
    const container = document.getElementById('onboardingFormsMenu');
    container.innerHTML = onboardingForms.map(form => `
        <button class="form-item-btn" onclick="openForm('${form.url}', '${form.type}', '${form.name.replace(/'/g, "\\'")}')">
            <i class="fas fa-file-pdf"></i>
            ${form.name}
        </button>
    `).join('');
}

function openForm(url, type, name) {
    if (type === 'link') {
        window.open(url, '_blank');
    } else {
        openPDF(url, name);
    }
}

// PDF Modal
let currentPDFUrl = '';

function openPDF(url, title) {
    currentPDFUrl = url;
    document.getElementById('pdfTitle').textContent = title;
    document.getElementById('pdfFrame').src = url + '#toolbar=1';
    document.getElementById('pdfModal').style.display = 'flex';
}

function closePDFModal() {
    document.getElementById('pdfModal').style.display = 'none';
    document.getElementById('pdfFrame').src = '';
}

function downloadPDF() {
    window.open(currentPDFUrl, '_blank');
}

// Directory Modal
function openDirectoryModal() {
    const directoryList = document.getElementById('directoryList');
    directoryList.innerHTML = `
        <div class="directory-item">
            <div class="directory-icon">💰</div>
            <div class="directory-info">
                <div class="directory-title">HR & Payroll Support</div>
                <div class="directory-description">For payroll inquiries, benefits, and HR concerns</div>
                <div class="directory-email"><a href="mailto:hr-payroll@enricheye.com" class="email-link">hr-payroll@enricheye.com</a></div>
            </div>
        </div>
        <div class="directory-item">
            <div class="directory-icon">👥</div>
            <div class="directory-info">
                <div class="directory-title">Patient Inquiry Concerns</div>
                <div class="directory-description">For patient feedback, complaints, and medical inquiries</div>
                <div class="directory-email"><a href="mailto:patientconcerns@enricheye.com" class="email-link">patientconcerns@enricheye.com</a></div>
            </div>
        </div>
        <div class="directory-item">
            <div class="directory-icon">📋</div>
            <div class="directory-info">
                <div class="directory-title">Management Support</div>
                <div class="directory-description">For administrative and management-related matters</div>
                <div class="directory-email"><a href="mailto:managementsupport@enricheye.com" class="email-link">managementsupport@enricheye.com</a></div>
            </div>
        </div>
    `;
    document.getElementById('directoryModal').style.display = 'flex';
}

function closeDirectoryModal() {
    document.getElementById('directoryModal').style.display = 'none';
}

// Notifications
let notifications = [];

function loadNotifications() {
    const stored = localStorage.getItem('notifications');
    if (stored) {
        notifications = JSON.parse(stored);
    } else {
        notifications = [];
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationBadge');
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    } else {
        renderNotifications();
        dropdown.classList.add('show');
    }
}

function renderNotifications() {
    const container = document.getElementById('notificationList');
    if (notifications.length === 0) {
        container.innerHTML = `
            <div style="padding: 1rem; text-align: center; color: rgba(255,255,255,0.5);">
                <i class="fas fa-bell-slash" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                No notifications yet
            </div>
        `;
    } else {
        container.innerHTML = notifications.map(n => `
            <div class="notification-item ${n.read ? '' : 'unread'}" onclick="markAsRead(${n.id})">
                <i class="fas ${n.icon || 'fa-bell'}"></i>
                <div class="notification-content">
                    <p>${n.message}</p>
                    <span class="notification-time">${n.time}</span>
                </div>
            </div>
        `).join('');
    }
}

function markAsRead(id) {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationBadge();
    renderNotifications();
}

function markAllAsRead() {
    notifications = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationBadge();
    renderNotifications();
}

function viewAllNotifications() {
    alert('View all notifications feature coming soon!');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const container = document.querySelector('.notification-container');
    const dropdown = document.getElementById('notificationDropdown');
    if (container && !container.contains(e.target) && dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

// Initialize dashboard
loadDashboard();