// Teams Data
const teamsData = {
    level0: [
        { 
            name: "CJ Johnson", 
            title: "CEO/Founder", 
            icon: "👨‍💼", 
            level: 0,
            image: "/images/team/c.jpg",
            altText: "CJ Johnson"
        }
    ],
    level1: [
        { 
            name: "Rheinalei Aubrey Beria Co", 
            title: "Clinical Operations Manager/Lead", 
            icon: "👩‍⚕️", 
            level: 1,
            image: "/images/team/r.jpg",
            altText: "Clinical Operations Lead"
        }
    ],
    level2: [
        { 
            name: "Mona Kona", 
            title: "Front-end and Field Technician Manager/Lead", 
            icon: "👨‍💻", 
            level: 2,
            image: "/images/team/ff.png",
            altText: "Front-end Team Lead"
        },
        { 
            name: "Liz Maldonado", 
            title: "Human Resources & Payroll Manager", 
            icon: "👩‍💼", 
            level: 2,
            image: "/images/team/hr-lead.jpg",
            altText: "HR & Payroll Lead"
        }
    ],
    level3: [
        { 
            name: "Rochelle Cecilio", 
            title: "Part-time Virtual Assistant", 
            icon: "👩‍💻", 
            level: 3, 
            parent: "Front-end Team & Field Technician Lead",
            image: "/images/team/part-time-hva.jpg",
            altText: "Part-time HVA"
        },
        { 
            name: "Neradzmar Antuyan", 
            title: "Full-time Virtual Assistant", 
            icon: "👩‍💻", 
            level: 3, 
            parent: "Front-end Team & Field Technician Lead",
            image: "/images/team/e2.png",
            altText: "Full-time HVA"
        },
        { 
            name: "Carina Betancourt", 
            title: "Logistics & Patient Support Lead", 
            icon: "📦", 
            level: 3, 
            parent: "Clinical Operations Lead",
            image: "/images/team/e.png",
            altText: "Logistics Lead"
        }
    ]
};

// Level labels
const levelLabels = {
    0: "Executive Leadership",
    1: "Clinical Operations",
    2: "Department Leads",
    3: "Team Members"
};

// Create person card
function createPersonCard(person, isCEO = false, isSubCard = false) {
    const card = document.createElement('div');
    card.className = `org-card ${isCEO ? 'ceo-card' : ''} ${isSubCard ? 'sub-card' : ''}`;
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'org-card-image-container';
    
    const img = document.createElement('img');
    img.src = person.image;
    img.alt = person.altText;
    img.className = 'org-card-image';
    img.onerror = function() {
        this.style.display = 'none';
        const iconDiv = document.createElement('div');
        iconDiv.className = 'org-card-icon';
        iconDiv.textContent = person.icon;
        imageContainer.innerHTML = '';
        imageContainer.appendChild(iconDiv);
    };
    
    imageContainer.appendChild(img);
    card.appendChild(imageContainer);
    
    const name = document.createElement('div');
    name.className = 'org-card-name';
    name.textContent = person.name;
    card.appendChild(name);
    
    const title = document.createElement('div');
    title.className = 'org-card-title';
    title.textContent = person.title;
    card.appendChild(title);
    
    if (person.parent) {
        const parent = document.createElement('div');
        parent.className = 'org-card-parent';
        parent.innerHTML = `<i class="fas fa-user-tag"></i> Reports to: ${person.parent}`;
        card.appendChild(parent);
    }
    
    return card;
}

// Create a level wrapper with connector arrows
function createLevelWithConnector(levelData, levelNum, isLastLevel) {
    const wrapper = document.createElement('div');
    wrapper.className = 'org-level-wrapper';
    
    // Create the level container
    const levelDiv = document.createElement('div');
    levelDiv.className = 'grid-level';
    
    // Add level label
    const label = document.createElement('div');
    label.className = 'level-label';
    label.textContent = levelLabels[levelNum] || `Level ${levelNum}`;
    levelDiv.appendChild(label);
    
    // Create cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'grid-cards';
    
    // Add cards for each person
    levelData.forEach(person => {
        const isCEO = (levelNum === 0);
        const isSubCard = (levelNum === 3);
        const card = createPersonCard(person, isCEO, isSubCard);
        cardsContainer.appendChild(card);
    });
    
    levelDiv.appendChild(cardsContainer);
    wrapper.appendChild(levelDiv);
    
    // Add connector arrow (except for last level)
    if (!isLastLevel) {
        const connector = document.createElement('div');
        connector.className = 'grid-connector';
        
        // Create a fancy connecting line with arrow
        connector.innerHTML = `
            <div class="connector-line">
                <div class="connector-dots"></div>
                <i class="fas fa-arrow-down"></i>
                <div class="connector-dots"></div>
            </div>
        `;
        wrapper.appendChild(connector);
    }
    
    return wrapper;
}

// Render organization grid
function renderOrgGrid() {
    const container = document.getElementById('orgGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Get all levels in order
    const levels = ['level0', 'level1', 'level2', 'level3'];
    
    levels.forEach((levelKey, index) => {
        const levelNum = parseInt(levelKey.replace('level', ''));
        const people = teamsData[levelKey];
        const isLastLevel = (index === levels.length - 1);
        
        if (people && people.length > 0) {
            const levelWrapper = createLevelWithConnector(people, levelNum, isLastLevel);
            container.appendChild(levelWrapper);
        }
    });
}

// Initialize teams page
function initTeams() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    if (user.role === 'admin' || user.role === 'super_admin') {
        const adminBtn = document.getElementById('adminNavBtn');
        if (adminBtn) adminBtn.style.display = 'flex';
    }
    
    renderOrgGrid();
}

// Load teams when page is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initTeams();
    }, 100);
});