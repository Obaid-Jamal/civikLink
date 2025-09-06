// ===================================================================================
// GLOBAL STATE & DATA MANAGEMENT
// ===================================================================================

let issueReports = [];
let registeredUsers = [];
let currentUser = null;
let currentLanguage = localStorage.getItem('civicLinkLanguage') || 'english'; // Load saved language
let uploadedFiles = []; // To store files for preview and submission
let currentReportCoordinates = null; // To hold coordinates for a new report
let adminMapInstance = null; // To hold the admin map object
let adminChartInstance = null; // To hold the admin analytics chart object
let notifications = []; // To hold all notifications
let mediaRecorder;
let audioChunks = [];
let audioRecordingBlob = null;

const translations = {
    english: {
        // General & Common
        brandTitle: "CivicLink | Citizen Reporting Platform",
        langText: "English",
        logoutTextDropdown: "Logout",
        
        // Index Page
        portalTitle: "CivicLink Portal",
        portalSubtitle: "Civic Issue Reporting Portal",
        welcomeMessage: "Report civic issues, track their progress, and help build a better community",
        loginBtnText: "Login to Portal",
        signupBtnText: "New User Registration",
        featuresText: "Key Features",
        reportText: "Report Issues",
        trackText: "Track Progress",
        
        // Login Page
        loginSubmitText: "Login to Portal",
        noAccountText: "Don't have an account?",
        signupLinkText: "Register here",

        // Signup Page
        signupPortalSubtitle: "New User Registration",
        signupSubmitText: "Register",
        haveAccountText: "Already have an account?",
        loginLinkText: "Login here",

        // Citizen Dashboard
        reportTitle: "Report a Civic Issue",
        reportSubtitle: "Submit your civic issues here",
        categoryLabel: "Issue Category",
        priorityLabel: "Priority Level",
        descriptionLabel: "Description",
        locationLabel: "Location",
        uploadLabel: "Upload Photos (Max 5)",
        uploadText: "Click to upload photos or drag and drop",
        submitButtonText: "Submit Issue Report",
        trackTitle: "My Reported Issues",
        trackSubtitle: "Track the status of issues you have submitted",
        issueHeader: "Issue",
        categoryHeader: "Category",
        statusHeader: "Status",
        upvotesHeader: "Upvotes",
        actionsHeader: "Actions",

        // Admin Dashboard
        reportsTitle: "All Reported Issues",
        reportsSubtitle: "सभी रिपोर्ट की गई समस्याएं",
    },
    hindi: {
        // General & Common
        brandTitle: "सिविकलिंक | नागरिक रिपोर्टिंग प्लेटफार्म",
        langText: "हिंदी",
        logoutTextDropdown: "लॉग आउट",

        // Index Page
        portalTitle: "सिविकलिंक पोर्टल",
        portalSubtitle: "नागरिक समस्या रिपोर्टिंग पोर्टल",
        welcomeMessage: "नागरिक समस्याओं की रिपोर्ट करें, उनकी प्रगति को ट्रैक करें, और एक बेहतर समुदाय बनाने में मदद करें",
        loginBtnText: "पोर्टल पर लॉगइन करें",
        signupBtnText: "नया उपयोगकर्ता पंजीकरण",
        featuresText: "मुख्य विशेषताएं",
        reportText: "समस्याएं रिपोर्ट करें",
        trackText: "प्रगति ट्रैक करें",

        // Login Page
        loginSubmitText: "पोर्टल पर लॉगइन करें",
        noAccountText: "खाता नहीं है?",
        signupLinkText: "यहां पंजीकरण करें",

        // Signup Page
        signupPortalSubtitle: "नया उपयोगकर्ता पंजीकरण",
        signupSubmitText: "पंजीकरण करें",
        haveAccountText: "पहले से ही एक खाता है?",
        loginLinkText: "यहां लॉगइन करें",

        // Citizen Dashboard
        reportTitle: "एक नागरिक समस्या की रिपोर्ट करें",
        reportSubtitle: "अपनी नागरिक समस्याएं यहां दर्ज करें",
        categoryLabel: "समस्या की श्रेणी",
        priorityLabel: "प्राथमिकता स्तर",
        descriptionLabel: "विवरण",
        locationLabel: "स्थान",
        uploadLabel: "तस्वीरें अपलोड करें (अधिकतम 5)",
        uploadText: "तस्वीरें अपलोड करने के लिए क्लिक करें या खींचें और छोड़ें",
        submitButtonText: "समस्या रिपोर्ट जमा करें",
        trackTitle: "मेरी रिपोर्ट की गई समस्याएं",
        trackSubtitle: "आपके द्वारा सबमिट किए गए मुद्दों की स्थिति को ट्रैक करें",
        issueHeader: "समस्या",
        categoryHeader: "श्रेणी",
        statusHeader: "स्थिति",
        upvotesHeader: "अपवोट्स",
        actionsHeader: "कार्रवाई",

        // Admin Dashboard
        reportsTitle: "सभी रिपोर्ट की गई समस्याएं",
        reportsSubtitle: "All Reported Issues",
    }
};


/**
 * Initializes data from localStorage or uses default sample data if none exists.
 */
function initializeData() {
    const storedReports = localStorage.getItem('issueReports');
    const storedUsers = localStorage.getItem('registeredUsers');
    const storedNotifications = localStorage.getItem('notifications');

    if (storedReports) {
        issueReports = JSON.parse(storedReports);
    } else {
        issueReports = [{
                id: 1,
                description: "Large pothole causing traffic issues on Main Street",
                category: "roads",
                priority: "high",
                status: "Resolved",
                submittedBy: "citizen1",
                dateSubmitted: "2024-01-15",
                photos: [], 
                audioRecording: null,
                location: "Main Street & 5th Ave, City Center",
                lat: 28.6139,
                lng: 77.2090,
                upvotes: 15,
                // Example structure for a reply object after admin action
                reply: {
                    message: "The pothole has been filled and the road surface leveled. Issue resolved.",
                    imageUrl: null, // Placeholder, would contain data:image/jpeg;base64,... if image was uploaded
                    adminUsername: "admin_roads",
                    timestamp: "2024-01-18T10:30:00Z"
                }
            },
            {
                id: 2,
                description: "Streetlight flickering and occasionally going out",
                category: "lighting",
                priority: "medium",
                status: "In Progress",
                submittedBy: "citizen1",
                dateSubmitted: "2024-01-20",
                photos: [],
                audioRecording: null,
                location: "Park Avenue, Downtown",
                lat: 28.6304,
                lng: 77.2177,
                upvotes: 7
            },
            {
                id: 3,
                description: "Broken park bench, posing a hazard to children",
                category: "safety",
                priority: "low",
                status: "Submitted",
                submittedBy: "citizen2",
                dateSubmitted: "2024-01-25",
                photos: [],
                audioRecording: null,
                location: "Central Park, Main District",
                lat: 28.5987,
                lng: 77.2215,
                upvotes: 3
            }
        ];
        saveReports();
    }

    if (storedUsers) {
        registeredUsers = JSON.parse(storedUsers);
    } else {
        registeredUsers = [
            { username: "citizen1", password: "password", email: "arib7488@gmail.com", firstName: "Ravi", lastName: "Kumar", phone: "8877384318", aadhar: "1234-5678-9012", district: "central", role: "user", registrationDate: "2024-01-01", points: 20, upvotedIssues: [1, 3], location: "Someplace, Central District" },
            { username: "citizen2", password: "password", email: "citizen2@email.com", firstName: "Priya", lastName: "Sharma", phone: "9123456789", aadhar: "9876-5432-1098", district: "north", role: "user", registrationDate: "2024-01-10", points: 10, upvotedIssues: [], location: "Another Place, North District" },
            { username: "admin_roads", password: "password", email: "roads@civiclink.com", firstName: "Dept.", lastName: "Roads", phone: "1111111111", aadhar: "0000-0000-0001", district: "central", role: "admin", category: "roads", registrationDate: "2024-01-01" },
            { username: "admin_lighting", password: "password", email: "lighting@civiclink.com", firstName: "Dept.", lastName: "Lighting", phone: "2222222222", aadhar: "0000-0000-0002", district: "central", role: "admin", category: "lighting", registrationDate: "2024-01-01" },
            { username: "admin_water", password: "password", email: "water@civiclink.com", firstName: "Dept.", lastName: "Water", phone: "3333333333", aadhar: "0000-0000-0003", district: "central", role: "admin", category: "water", registrationDate: "2024-01-01" },
            { username: "admin_waste", password: "password", email: "waste@civiclink.com", firstName: "Dept.", lastName: "Waste", phone: "4444444444", aadhar: "0000-0000-0004", district: "central", role: "admin", category: "waste", registrationDate: "2024-01-01" },
            { username: "admin_safety", password: "password", email: "safety@civiclink.com", firstName: "Dept.", lastName: "Safety", phone: "5555555555", aadhar: "0000-0000-0005", district: "central", role: "admin", category: "safety", registrationDate: "2024-01-01" },
            { username: "main_admin", password: "password", email: "main@civiclink.com", firstName: "Main", lastName: "Admin", phone: "9999999999", aadhar: "0000-0000-0000", district: "central", role: "main_admin", registrationDate: "2024-01-01" }
        ];
        saveUsers();
    }

    if (storedNotifications) {
        notifications = JSON.parse(storedNotifications);
    } else {
        notifications = [];
        saveNotifications();
    }

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
}

function saveReports() {
    localStorage.setItem('issueReports', JSON.stringify(issueReports));
}

function saveUsers() {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// ===================================================================================
// NOTIFICATION FUNCTIONS
// ===================================================================================

function createNotification(recipient, message, reportId) {
    const newNotification = {
        id: Date.now(),
        recipient: recipient,
        message: message,
        reportId: reportId,
        isRead: false,
        timestamp: new Date().toISOString()
    };
    notifications.unshift(newNotification);
    saveNotifications();
    renderNotifications();
}

function renderNotifications() {
    if (!currentUser) return;

    const notificationList = document.getElementById('notificationList');
    const notificationBadge = document.getElementById('notificationBadge');
    if (!notificationList || !notificationBadge) return;

    const userNotifications = notifications.filter(n => n.recipient === currentUser.username);
    const unreadCount = userNotifications.filter(n => !n.isRead).length;

    if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = 'flex';
    } else {
        notificationBadge.style.display = 'none';
    }

    if (userNotifications.length === 0) {
        notificationList.innerHTML = '<div class="no-notifications">No new notifications</div>';
        return;
    }

    notificationList.innerHTML = userNotifications.map(n => `
        <div class="notification-item ${n.isRead ? '' : 'unread'}" data-id="${n.id}" data-report-id="${n.reportId}">
            <p>${n.message}</p>
            <small>${new Date(n.timestamp).toLocaleString()}</small>
        </div>
    `).join('');
}

function markNotificationAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.isRead = true;
        saveNotifications();
        renderNotifications();
    }
}

// ===================================================================================
// SHARED & UTILITY FUNCTIONS
// ===================================================================================

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'hindi' ? 'english' : 'hindi';
    localStorage.setItem('civicLinkLanguage', currentLanguage); // Save the new language choice
    updateInterfaceLanguage();
    showToast(currentLanguage === 'hindi' ? 'भाषा हिंदी में बदली गई' : 'Language changed to English');
}

function toggleNavigationMenu() {
    const menu = document.getElementById('navMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.dropdown-nav-item[data-section]').forEach(tab => tab.classList.remove('active'));

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    const targetTab = document.querySelector(`.dropdown-nav-item[data-section="${sectionId}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// Helper functions for formatting
function getCategoryName(category) {
    const names = {
        "roads": "Roads & Transportation",
        "lighting": "Lighting & Electricity",
        "water": "Water & Drainage",
        "waste": "Waste & Sanitation",
        "safety": "Public Safety"
    };
    return names[category] || "Unknown";
}

function getDistrictName(district) {
    const districtNames = { "central": "Central District", "north": "North District", "south": "South District", "east": "East District", "west": "West District" };
    return districtNames[district] || district;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 */
function haversineDistance(coords1, coords2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (coords2.lat - coords1.latitude) * Math.PI / 180;
    const dLon = (coords2.lng - coords1.longitude) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coords1.latitude * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


// ===================================================================================
// PAGE INITIALIZATION ROUTER
// ===================================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeData();

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch (currentPage) {
        case 'index.html':
            initializeHomePage();
            break;
        case 'login.html':
            initializeLoginPage();
            break;
        case 'signup.html':
            initializeSignupPage();
            break;
        case 'citizen-dashboard.html':
            initializeCitizenDashboard();
            break;
        case 'admin-dashboard.html':
            initializeAdminDashboard();
            break;
        case 'stats.html':
            initializeStatsPage();
            break;
        case 'nearby.html':
            initializeNearbyPage();
            break;
    }
    updateInterfaceLanguage(); // Apply language on every page load
});

// ===================================================================================
// HOME PAGE LOGIC
// ===================================================================================

function initializeHomePage() {
    if (currentUser && currentUser.username) {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.innerHTML = `Welcome back, <strong>${currentUser.username}</strong>! Use the buttons below to navigate.`;
        }
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const viewNearbyBtn = document.getElementById('viewNearbyIssuesBtn');

        if (loginBtn && signupBtn) {
            if (currentUser.role === 'admin' || currentUser.role === 'main_admin') {
                loginBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i><span>Admin Dashboard</span>';
                loginBtn.onclick = () => window.location.href = 'admin-dashboard.html';
                signupBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Logout</span>';
                signupBtn.onclick = logout;
                if (viewNearbyBtn) viewNearbyBtn.style.display = 'none';
            } else {
                loginBtn.innerHTML = '<i class="fas fa-user"></i><span>My Dashboard</span>';
                loginBtn.onclick = () => window.location.href = 'citizen-dashboard.html';
                signupBtn.innerHTML = '<i class="fas fa-plus-circle"></i><span>Report a New Issue</span>';
                signupBtn.onclick = () => window.location.href = 'citizen-dashboard.html#report';
                
                if(viewNearbyBtn) {
                    viewNearbyBtn.style.display = 'flex';
                    viewNearbyBtn.addEventListener('click', () => {
                        window.location.href = 'nearby.html';
                    });
                }
            }
        }
    }
}

// ===================================================================================
// NEARBY ISSUES PAGE LOGIC
// ===================================================================================

function initializeNearbyPage() {
    if (!currentUser || currentUser.role !== 'user') {
        const container = document.getElementById('nearbyReportsContainer');
        if (container) {
            container.innerHTML = `<p style="text-align: center; color: #dc2626; padding: 1rem;">
                <i class="fas fa-exclamation-triangle"></i> You must be logged in to view this page. Redirecting...
            </p>`;
        }
        setTimeout(() => { window.location.href = 'login.html' }, 2000);
        return;
    }
    loadAndDisplayNearbyReports();
}

function loadAndDisplayNearbyReports() {
    const container = document.getElementById('nearbyReportsContainer');
    if (!container) return;

    navigator.geolocation.getCurrentPosition(
        position => {
            renderNearbyReports(position.coords);
        },
        error => {
            container.innerHTML = `<p style="text-align: center; color: #dc2626; padding: 1rem;">
                <i class="fas fa-exclamation-triangle"></i> Could not get your location. Please enable location services to see nearby reports.
            </p>`;
        }
    );
}

function renderNearbyReports(userCoords) {
    const container = document.getElementById('nearbyReportsContainer');
    const user = registeredUsers.find(u => u.username === currentUser.username);
    const radius = 10; // 10 km radius

    const reportsWithLocation = issueReports.filter(r => r.lat && r.lng);
    
    const nearbyReports = reportsWithLocation
        .map(report => ({
            ...report,
            distance: haversineDistance(userCoords, report)
        }))
        .filter(report => report.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

    if (nearbyReports.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #666; padding: 1rem;">
            <i class="fas fa-info-circle"></i> No issues found within a ${radius}km radius of your location.
        </p>`;
        return;
    }

    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Issue</th>
                    <th>Distance</th>
                    <th>Upvotes</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>`;
    
    nearbyReports.forEach(report => {
        const hasUpvoted = user.upvotedIssues && user.upvotedIssues.includes(report.id);
        tableHTML += `
            <tr>
                <td>
                    <strong><a href="report-details.html?id=${report.id}&from=citizen" class="text-link">${report.description}</a></strong><br>
                    <small style="color: #718096;">${getCategoryName(report.category)}</small>
                </td>
                <td>${report.distance.toFixed(2)} km</td>
                <td><span style="font-weight: 600;">${report.upvotes || 0}</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="upvoteIssue(${report.id})" ${hasUpvoted ? 'disabled' : ''} style="font-size: 0.75rem;">
                        <i class="fas fa-thumbs-up"></i> ${hasUpvoted ? 'Upvoted' : 'Upvote'}
                    </button>
                </td>
            </tr>`;
    });
    
    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}


// ===================================================================================
// LOGIN PAGE LOGIC
// ===================================================================================

function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button');
            submitBtn.innerHTML = '<div class="loading"></div> Signing in...';
            submitBtn.disabled = true;

            const username = document.getElementById("loginUsername").value.trim();
            const password = document.getElementById("loginPassword").value;

            try {
                const response = await fetch('api/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'An error occurred.');
                }

                // Login was successful, the session is set on the server.
                // Now we can redirect to the home page.
                window.location.href = 'index.html';

            } catch (error) {
                showToast(error.message, 'error');
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Portal';
                submitBtn.disabled = false;
            }
        });
    }
}

// ===================================================================================
// SIGNUP PAGE LOGIC
// ===================================================================================

function initializeSignupPage() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById("signupPassword").value;

            const newUser = {
                firstName: document.getElementById("signupFirstName").value.trim(),
                lastName: document.getElementById("signupLastName").value.trim(),
                email: document.getElementById("signupEmail").value.trim(),
                phone: document.getElementById("signupPhone").value.trim(),
                aadhar: document.getElementById("signupAadhar").value.trim(),
                district: document.getElementById("signupDistrict").value,
                location: document.getElementById("signupLocation").value.trim(),
                username: document.getElementById("signupUsername").value.trim(),
                password: password,
                role: "user",
                registrationDate: new Date().toISOString().split('T')[0],
                points: 0,
                upvotedIssues: []
            };

            if (Object.values(newUser).some(value => typeof value === 'string' && value.trim() === '')) {
                showToast("Please fill all fields.", "error");
                return;
            }

            if (password.length < 6) {
                showToast("Password must be at least 6 characters.", "error");
                return;
            }
            if (registeredUsers.some(u => u.username === newUser.username || u.email === newUser.email)) {
                showToast("Username or email already exists.", "error");
                return;
            }

            registeredUsers.push(newUser);
            saveUsers();
            showToast(`Registration successful! Welcome ${newUser.firstName}.`);
            
            const submitBtn = e.target.querySelector('button');
            submitBtn.innerHTML = '<div class="loading"></div> Registering...';
            submitBtn.disabled = true;

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }
}


// ===================================================================================
// CITIZEN DASHBOARD LOGIC
// ===================================================================================

async function fetchAddressFromCoordinates(lat, lng) {
    const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const locationInput = document.getElementById('issueLocation');
    const getLocationBtn = document.getElementById('getLocationBtn');

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data.display_name) {
            locationInput.value = data.display_name;
            showToast("Location fetched successfully!", "success");
        } else {
            throw new Error('Address not found');
        }
    } catch (error) {
        locationInput.value = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        showToast("Could not fetch address. Using coordinates.", "error");
    } finally {
        if(getLocationBtn) {
            getLocationBtn.disabled = false;
            getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Get Location';
        }
    }
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function initializeCitizenDashboard() {
    if (!currentUser || currentUser.role !== 'user') { 
        window.location.href = 'login.html'; 
        return; 
    }

    const getLocationBtn = document.getElementById('getLocationBtn');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', () => {
            getLocationBtn.disabled = true;
            getLocationBtn.innerHTML = '<div class="loading" style="width:16px; height:16px;"></div>';
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    currentReportCoordinates = { lat: latitude, lng: longitude };
                    fetchAddressFromCoordinates(latitude, longitude);
                },
                error => {
                    showToast("Could not access location. Please enable location services.", "error");
                    getLocationBtn.disabled = false;
                    getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Get Location';
                }
            );
        });
    }

    document.querySelectorAll('.dropdown-nav-item[data-section]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(tab.getAttribute('data-section'));
        });
    });

    // --- Voice Recording Logic ---
    const recordBtn = document.getElementById('recordBtn');
    const stopBtn = document.getElementById('stopBtn');
    const audioPreviewPlayer = document.getElementById('audioPreviewPlayer');
    const deleteRecordingBtn = document.getElementById('deleteRecordingBtn');

    if (recordBtn) {
        recordBtn.addEventListener('click', async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    recordBtn.style.display = 'none';
                    stopBtn.style.display = 'inline-flex';
                    deleteRecordingBtn.style.display = 'none';
                    audioPreviewPlayer.style.display = 'none';
                    audioPreviewPlayer.src = '';
                    audioRecordingBlob = null;
                    audioChunks = [];

                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();

                    mediaRecorder.addEventListener("dataavailable", event => {
                        audioChunks.push(event.data);
                    });

                    mediaRecorder.addEventListener("stop", () => {
                        audioRecordingBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        const audioUrl = URL.createObjectURL(audioRecordingBlob);
                        audioPreviewPlayer.src = audioUrl;
                        audioPreviewPlayer.style.display = 'block';
                        deleteRecordingBtn.style.display = 'inline-flex';
                        stream.getTracks().forEach(track => track.stop());
                    });
                } catch (err) {
                    showToast('Microphone access denied.', 'error');
                    console.error("The following error occurred: " + err);
                    recordBtn.style.display = 'inline-flex';
                    stopBtn.style.display = 'none';
                }
            } else {
                showToast('Your browser does not support audio recording.', 'error');
            }
        });

        stopBtn.addEventListener('click', () => {
            mediaRecorder.stop();
            recordBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'none';
        });

        deleteRecordingBtn.addEventListener('click', () => {
            audioRecordingBlob = null;
            audioChunks = [];
            audioPreviewPlayer.src = '';
            audioPreviewPlayer.style.display = 'none';
            deleteRecordingBtn.style.display = 'none';
            showToast('Recording deleted.', 'info');
        });
    }

    const issueForm = document.getElementById('issueForm');
    if (issueForm) {
        issueForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="loading"></div> Submitting...';
            
            const descriptionValue = document.getElementById('issueDescription').value.trim();
            const categoryValue = document.getElementById('issueCategory').value;
            const locationValue = document.getElementById('issueLocation').value.trim();

            if ((!descriptionValue && !audioRecordingBlob) || !categoryValue || !locationValue) {
                showToast("Please provide a description (text or voice), category, and location.", "error");
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Issue Report';
                return;
            }

            // --- DUPLICATE CHECK LOGIC ---
            if (currentReportCoordinates) {
                const searchRadiusKm = 0.05; // 50 meters
                const duplicateReport = issueReports.find(report => {
                    if (!report.lat || !report.lng) return false;

                    const distance = haversineDistance(
                        { latitude: currentReportCoordinates.lat, longitude: currentReportCoordinates.lng },
                        { lat: report.lat, lng: report.lng }
                    );

                    return report.category === categoryValue &&
                           distance <= searchRadiusKm &&
                           (report.status === 'Submitted' || report.status === 'In Progress');
                });

                if (duplicateReport) {
                    showToast(`This issue was already reported (ID #${duplicateReport.id}). Your report was added as an upvote.`, 'info');
                    upvoteIssue(duplicateReport.id, true); // Suppress the default upvote toast

                    // Reset form and exit
                    this.reset();
                    currentReportCoordinates = null;
                    uploadedFiles = [];
                    audioRecordingBlob = null;
                    audioChunks = [];
                    if(audioPreviewPlayer) {
                        audioPreviewPlayer.src = '';
                        audioPreviewPlayer.style.display = 'none';
                        deleteRecordingBtn.style.display = 'none';
                    }
                    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
                    if(imagePreviewContainer) imagePreviewContainer.innerHTML = '';
                    
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Issue Report';
                    return;
                }
            }

            // --- If not a duplicate, proceed ---
            let audioDataUrl = null;
            if (audioRecordingBlob) {
                audioDataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(audioRecordingBlob);
                });
            }

            const photoDataUrls = await Promise.all(uploadedFiles.map(readFileAsDataURL));
            
            const lat = currentReportCoordinates ? currentReportCoordinates.lat : null;
            const lng = currentReportCoordinates ? currentReportCoordinates.lng : null;

            const newIssue = {
                id: Date.now(),
                description: descriptionValue,
                category: categoryValue,
                priority: document.getElementById('issuePriority').value,
                status: "Submitted",
                submittedBy: currentUser.username,
                dateSubmitted: new Date().toISOString().split('T')[0],
                photos: photoDataUrls,
                audioRecording: audioDataUrl,
                location: locationValue,
                lat: lat,
                lng: lng,
                upvotes: 0,
                reply: null
            };

            issueReports.push(newIssue);
            const user = registeredUsers.find(u => u.username === currentUser.username);
            if(user) {
                user.points = (user.points || 0) + 10;
                saveUsers();
            }
            saveReports();
            
            createNotification(currentUser.username, `Your report #${newIssue.id} was submitted.`, newIssue.id);
            const categoryAdmin = registeredUsers.find(u => u.role === 'admin' && u.category === newIssue.category);
            if(categoryAdmin) {
                createNotification(categoryAdmin.username, `New report #${newIssue.id} in your category.`, newIssue.id);
            }

            this.reset();
            currentReportCoordinates = null;
            uploadedFiles = [];
            audioRecordingBlob = null;
            audioChunks = [];
            if(audioPreviewPlayer) {
                audioPreviewPlayer.src = '';
                audioPreviewPlayer.style.display = 'none';
                deleteRecordingBtn.style.display = 'none';
            }
            const imagePreviewContainer = document.getElementById('imagePreviewContainer');
            if(imagePreviewContainer) imagePreviewContainer.innerHTML = '';
            
            showToast("Issue reported successfully!");
            loadAllCommunityReports();
            loadLeaderboard();
            switchSection('track');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Issue Report';
        });
    }
    const issuePhotoInput = document.getElementById('issuePhoto');
    if(issuePhotoInput) {
        issuePhotoInput.addEventListener('change', handleFileSelect);
    }
    
    const notificationBell = document.getElementById('notificationBell');
    if (notificationBell) {
        const notificationPanel = document.getElementById('notificationPanel');
        notificationBell.addEventListener('click', () => {
            notificationPanel.style.display = notificationPanel.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', (e) => {
            if (!notificationBell.contains(e.target) && !notificationPanel.contains(e.target)) {
                notificationPanel.style.display = 'none';
            }
        });
        document.getElementById('notificationList').addEventListener('click', (e) => {
            const item = e.target.closest('.notification-item');
            if (item) {
                const notifId = parseInt(item.dataset.id);
                const reportId = parseInt(item.dataset.reportId);
                markNotificationAsRead(notifId);
                window.location.href = `report-details.html?id=${reportId}&from=citizen`;
            }
        });
    }

    renderNotifications();
    loadAllCommunityReports();
    loadLeaderboard();
}

function handleFileSelect(event) {
    const files = event.target.files;
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    if (uploadedFiles.length + files.length > 5) {
        showToast("Maximum 5 images allowed.", "error");
        return;
    }

    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        if (uploadedFiles.some(f => f.name === file.name)) continue;

        uploadedFiles.push(file);

        const previewDiv = document.createElement('div');
        previewDiv.className = 'image-preview-item';
        previewDiv.dataset.fileName = file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewDiv.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <div class="file-info">
                    <span>${file.name.substring(0, 10)}...</span>
                    <button type="button" class="remove-file-btn" data-file-name="${file.name}">
                        <i class="fas fa-times-circle"></i>
                    </button>
                </div>
            `;
            previewDiv.querySelector('.remove-file-btn').addEventListener('click', function() {
                removeFile(this.dataset.fileName);
            });
        };
        reader.readAsDataURL(file);
        imagePreviewContainer.appendChild(previewDiv);
    }
    event.target.value = '';
}

function removeFile(fileName) {
    const previewElement = document.querySelector(`.image-preview-item[data-file-name="${fileName}"]`);
    if (previewElement) {
        previewElement.remove();
    }
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    showToast(`${fileName} removed.`, 'info');
}

function upvoteIssue(issueId, suppressToast = false) {
    const reportIndex = issueReports.findIndex(r => r.id === issueId);
    if (reportIndex === -1) return;
    const issue = issueReports[reportIndex];

    const userIndex = registeredUsers.findIndex(u => u.username === currentUser.username);
    if (userIndex === -1) return;
    const user = registeredUsers[userIndex];

    if (user.upvotedIssues && user.upvotedIssues.includes(issueId)) {
        if (!suppressToast) {
            showToast("You have already upvoted this issue.", "info");
        }
        return;
    }

    // 1. Increment Upvotes
    issue.upvotes = (issue.upvotes || 0) + 1;
    if (!user.upvotedIssues) {
        user.upvotedIssues = [];
    }
    user.upvotedIssues.push(issueId);

    // 2. Notify Admin of the Upvote
    const categoryAdmin = registeredUsers.find(u => u.role === 'admin' && u.category === issue.category);
    if (categoryAdmin) {
        createNotification(categoryAdmin.username, `Report #${issue.id} received a new upvote. Total: ${issue.upvotes}.`, issue.id);
    }

    // 3. Check for Priority Upgrade
    const originalPriority = issue.priority;
    if (issue.upvotes >= 30 && issue.priority !== 'urgent') {
        issue.priority = 'urgent';
    } else if (issue.upvotes >= 15 && (issue.priority === 'low' || issue.priority === 'medium')) {
        issue.priority = 'high';
    } else if (issue.upvotes >= 5 && issue.priority === 'low') {
        issue.priority = 'medium';
    }

    // 4. If priority was changed, send notifications
    if (originalPriority !== issue.priority) {
        createNotification(issue.submittedBy, `Priority for your report #${issue.id} was upgraded to '${issue.priority}' due to upvotes.`, issue.id);
        if (categoryAdmin) {
            createNotification(categoryAdmin.username, `Priority for report #${issue.id} has been auto-upgraded to '${issue.priority}'.`, issue.id);
        }
    }
    
    // Update data in arrays
    issueReports[reportIndex] = issue;
    registeredUsers[userIndex] = user;

    // Save to localStorage
    saveReports();
    saveUsers();
    
    // Re-render view
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'nearby.html') {
        loadAndDisplayNearbyReports();
    } else {
        loadAllCommunityReports();
    }

    if (!suppressToast) {
        showToast("Upvoted successfully!", "success");
    }
}


function loadAllCommunityReports() {
    if (!currentUser) return;
    const tbody = document.getElementById('allCommunityReportsTable');
    if (!tbody) return;

    tbody.innerHTML = "";
    
    const myReports = issueReports.filter(report => report.submittedBy === currentUser.username);

    if (myReports.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem;">You have not reported any issues yet.</td></tr>`;
        return;
    }

    [...myReports].reverse().forEach(report => {
        const row = document.createElement("tr");
        const statusClass = `status-${report.status.toLowerCase().replace(/ /g, '')}`;

        row.innerHTML = `
          <td>
            <strong><a href="report-details.html?id=${report.id}&from=citizen" class="text-link">${report.description}</a></strong><br>
            <small style="color: #718096;">Report ID: #${report.id}</small>
          </td>
          <td>${getCategoryName(report.category)}</td>
          <td><span class="status-badge ${statusClass}">${report.status}</span></td>
          <td><span style="font-weight: 600; font-size: 1.1rem;">${report.upvotes || 0}</span></td>
          <td>
            <a href="report-details.html?id=${report.id}&from=citizen" class="btn btn-secondary" style="font-size: 0.75rem;">
              <i class="fas fa-eye"></i> View Details
            </a>
          </td>
        `;
        tbody.appendChild(row);
    });
}


function loadLeaderboard() {
    const tbody = document.getElementById('leaderboardTable');
    if(!tbody) return;

    const citizens = registeredUsers.filter(u => u.role === 'user');
    citizens.sort((a, b) => (b.points || 0) - (a.points || 0));

    tbody.innerHTML = "";
    citizens.slice(0, 10).forEach((user, index) => {
        const issueCount = issueReports.filter(r => r.submittedBy === user.username).length;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td><strong>${user.firstName} ${user.lastName}</strong><br><small>@${user.username}</small></td>
            <td>${user.points || 0}</td>
            <td>${issueCount}</td>
        `;
        tbody.appendChild(row);
    });
}

// ===================================================================================
// ADMIN DASHBOARD LOGIC
// ===================================================================================

function showUserDetailsModal(username) {
    const user = registeredUsers.find(u => u.username === username);
    if (!user) return;

    document.getElementById('modal-fullName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('modal-username').textContent = `@${user.username}`;
    document.getElementById('modal-email').textContent = user.email;
    document.getElementById('modal-phone').textContent = user.phone;
    document.getElementById('modal-aadhar').textContent = user.aadhar;
    document.getElementById('modal-district').textContent = getDistrictName(user.district);
    document.getElementById('modal-regDate').textContent = formatDate(user.registrationDate);

    document.getElementById('userModal').style.display = 'flex';
}

function getPriorityColor(priority) {
    switch (priority) {
        case 'urgent': return '#dc2626'; 
        case 'high': return '#f59e0b';   
        case 'medium': return '#3b82f6'; 
        case 'low': return '#10b981';    
        default: return '#6b7280';       
    }
}

function getPriorityRadius(priority) {
    switch (priority) {
        case 'urgent': return 12;
        case 'high': return 10;
        case 'medium': return 8;
        case 'low': return 6;
        default: return 6;
    }
}

function initializeAdminIssueMap() {
    const reportsForAdmin = (currentUser.role === 'main_admin')
        ? issueReports
        : issueReports.filter(report => report.category === currentUser.category);
    
    if (!adminMapInstance) {
        adminMapInstance = L.map('admin-leaflet-map');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(adminMapInstance);
    } else {
        adminMapInstance.eachLayer(layer => {
            if (layer instanceof L.CircleMarker) {
                adminMapInstance.removeLayer(layer);
            }
        });
    }

    const markerCoordinates = [];
    reportsForAdmin.forEach(report => {
        if (report.lat && report.lng) {
            const color = getPriorityColor(report.priority);
            const radius = getPriorityRadius(report.priority);
            const marker = L.circleMarker([report.lat, report.lng], {
                radius: radius, fillColor: color, color: '#fff',
                weight: 2, opacity: 1, fillOpacity: 0.9
            }).addTo(adminMapInstance);
            
            marker.bindTooltip(`<b>${report.description}</b><br>Priority: ${report.priority}`);
            marker.on('click', () => {
                window.location.href = `report-details.html?id=${report.id}&from=admin`;
            });

            markerCoordinates.push([report.lat, report.lng]);
        }
    });

    if (markerCoordinates.length > 0) {
        const bounds = L.latLngBounds(markerCoordinates);
        adminMapInstance.fitBounds(bounds, { padding: [50, 50] });
    } else {
        adminMapInstance.setView([28.6139, 77.2090], 12);
    }

    setTimeout(() => adminMapInstance.invalidateSize(), 10);
}


function initializeAdminDashboard() {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'main_admin')) {
        window.location.href = 'login.html';
        return;
    }
    
    const categoryFilterAdmin = document.getElementById('categoryFilterAdmin');
    const reportsTitle = document.getElementById('reportsTitle');

    if (currentUser.role === 'main_admin') {
        if(categoryFilterAdmin) categoryFilterAdmin.style.display = 'inline-block';
        if(reportsTitle) reportsTitle.textContent = 'All Reported Issues';
    } else {
        if(categoryFilterAdmin) categoryFilterAdmin.style.display = 'none';
        if(reportsTitle && currentUser.category) {
            reportsTitle.textContent = `${getCategoryName(currentUser.category)} Issues`;
            document.getElementById('mapTitle').textContent = `${getCategoryName(currentUser.category)} Issue Map`;
        }
    }
    
    document.querySelectorAll('.dropdown-nav-item[data-section]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = tab.getAttribute('data-section');
            switchSection(sectionId);
            if (sectionId === 'issueMap') {
                initializeAdminIssueMap();
            }
            if (sectionId === 'analytics') {
                setTimeout(() => initializeAdminAnalyticsChart(), 10);
            }
        });
    });

    document.getElementById('statusFilter')?.addEventListener('change', filterReports);
    if(categoryFilterAdmin) categoryFilterAdmin.addEventListener('change', filterReports);
    document.getElementById('userIssueFilter')?.addEventListener('change', filterUsersByIssueCount);

    const modal = document.getElementById('userModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modal && modalCloseBtn) {
        const closeModal = () => modal.style.display = 'none';
        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    const notificationBell = document.getElementById('notificationBell');
    if (notificationBell) {
        const notificationPanel = document.getElementById('notificationPanel');
        notificationBell.addEventListener('click', () => {
            notificationPanel.style.display = notificationPanel.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', (e) => {
            if (!notificationBell.contains(e.target) && !notificationPanel.contains(e.target)) {
                notificationPanel.style.display = 'none';
            }
        });
        document.getElementById('notificationList').addEventListener('click', (e) => {
            const item = e.target.closest('.notification-item');
            if (item) {
                const notifId = parseInt(item.dataset.id);
                const reportId = parseInt(item.dataset.reportId);
                markNotificationAsRead(notifId);
                window.location.href = `report-details.html?id=${reportId}&from=admin`;
            }
        });
    }

    renderNotifications();
    loadAllReports();
    loadAllUsers();
    loadAdminLeaderboard();
    updateAnalytics();
}

function approveReport(issueId) {
    if (currentUser.role !== 'main_admin') return;
    const issue = issueReports.find(report => report.id === issueId);
    if (issue) {
        issue.status = "Completed";
        saveReports();
        filterReports();
        updateAnalytics();
        showToast(`Issue #${issueId} has been approved and completed.`);
        createNotification(issue.submittedBy, `Your report #${issue.id} has been completed by main admin.`, issue.id);
    }
}

function deleteUser(username) {
    if (currentUser.role !== 'main_admin') return;
    if (confirm(`Are you sure you want to delete the user @${username}? This action cannot be undone.`)) {
        registeredUsers = registeredUsers.filter(u => u.username !== username);
        saveUsers();
        issueReports = issueReports.filter(r => r.submittedBy !== username);
        saveReports();
        loadAllUsers();
        filterReports();
        showToast(`User @${username} and all their reports have been deleted.`, 'info');
    }
}

function renderAllReportsTable(reportsToDisplay) {
    const tbody = document.getElementById('allReportsTable');
    if (!tbody) return;
    tbody.innerHTML = "";

    if (reportsToDisplay.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;">No issues match the current filters.</td></tr>`;
        return;
    }

    reportsToDisplay.forEach(report => {
        const row = document.createElement("tr");
        const statusClass = `status-${report.status.toLowerCase().replace(/ /g, '')}`;
        const user = registeredUsers.find(u => u.username === report.submittedBy);
        const userName = user ? `${user.firstName} ${user.lastName}` : report.submittedBy;
        const photoInfo = (report.photos && report.photos.length > 0)
            ? `<span style="color: #10b981;"><i class="fas fa-check-circle"></i> Yes (${report.photos.length})</span>`
            : `<span style="color: #718096;">No</span>`;
        
        const audioIndicator = report.audioRecording
            ? ` <i class="fas fa-volume-up" title="Voice note attached" style="color: #3b82f6; margin-left: 5px;"></i>`
            : '';

        let actionButtons = '';
        if (currentUser.role === 'main_admin' && report.status === 'Resolved') {
            actionButtons = `<button class="btn btn-success" onclick="approveReport(${report.id})" style="font-size: 0.75rem;"><i class="fas fa-check-double"></i> Approve</button>`;
        } else if (report.status === 'Submitted' || report.status === 'In Progress') {
             actionButtons = `<a href="report-details.html?id=${report.id}&from=admin" class="btn btn-primary" style="font-size: 0.75rem; background-color: #3b82f6;"><i class="fas fa-edit"></i> Review</a>`;
        } else {
             actionButtons = `<span style="color: #10b981; font-weight: 500;"><i class="fas fa-check-circle"></i> ${report.status}</span>`;
        }

        row.innerHTML = `
            <td><strong>#${report.id}</strong></td>
            <td>
              <a href="report-details.html?id=${report.id}&from=admin" class="text-link">${report.description}</a>${audioIndicator}<br>
              <small style="color: #718096;"><i class="fas fa-map-marker-alt"></i> ${report.location || 'Not provided'}</small>
            </td>
            <td>
                ${userName}<br>
                <small style="color: #718096;">@${report.submittedBy}</small>
            </td>
            <td>${getCategoryName(report.category)}</td>
            <td style="text-transform: capitalize;">${report.priority}</td>
            <td><span class="status-badge ${statusClass}">${report.status}</span></td>
            <td>${photoInfo}</td>
            <td>${formatDate(report.dateSubmitted)}</td>
            <td>${actionButtons}</td>
        `;
        tbody.appendChild(row);
    });
}

function filterReports() {
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilterAdmin = document.getElementById('categoryFilterAdmin')?.value;

    let filteredReports = (currentUser.role === 'main_admin')
        ? [...issueReports]
        : issueReports.filter(report => report.category === currentUser.category);
    
    if (statusFilter !== 'all') {
        filteredReports = filteredReports.filter(report => report.status.toLowerCase().replace(' ', '') === statusFilter.replace(' ', ''));
    }
    if (currentUser.role === 'main_admin' && categoryFilterAdmin !== 'all') {
        filteredReports = filteredReports.filter(report => report.category === categoryFilterAdmin);
    }

    renderAllReportsTable(filteredReports.reverse());
}

function loadAllReports() {
    const reportsForAdmin = (currentUser.role === 'main_admin')
        ? [...issueReports]
        : issueReports.filter(report => report.category === currentUser.category);
    renderAllReportsTable(reportsForAdmin.reverse());
}

function renderUsersTable(usersToDisplay) {
    const tbody = document.getElementById('usersTable');
    if (!tbody) return;

    if (currentUser.role === 'main_admin') {
        const tableHead = document.getElementById('usersTableHead');
        tableHead.innerHTML = `
            <tr>
                <th>User / उपयोगकर्ता</th>
                <th>Role / भूमिका</th>
                <th>Activity / गतिविधि</th>
                <th>Contact / संपर्क</th>
                <th>Registered / पंजीकृत</th>
                <th>Actions / कार्य</th>
            </tr>
        `;
    }

    tbody.innerHTML = "";

    usersToDisplay.forEach(user => {
        const issueCount = issueReports.filter(r => r.submittedBy === user.username).length;
        const row = document.createElement("tr");

        let actions = `<button class="btn btn-secondary" onclick="showUserDetailsModal('${user.username}')" style="font-size: 0.75rem;"><i class="fas fa-eye"></i> View</button>`;
        if (currentUser.role === 'main_admin' && user.username !== 'main_admin') {
            actions += `<button class="btn" onclick="deleteUser('${user.username}')" style="font-size: 0.75rem; background-color:#dc2626; color:white; margin-left: 5px;"><i class="fas fa-trash-alt"></i> Delete</button>`;
        }

        let userRoleDisplay = (user.role === 'main_admin') ? 'Main Admin' : (user.role === 'admin') ? `Admin (${getCategoryName(user.category)})` : 'Citizen';
        let activityDisplay = (user.role === 'user') ? 
            `<span style="font-weight: 500;">${issueCount}</span> reports<br><small>${issueCount > 0 ? 'Active' : 'New User'}</small>` :
            'N/A';
        
        const columnCount = (currentUser.role === 'main_admin') ? 6 : 5;
        if(columnCount === 6){
             row.innerHTML = `
                <td><strong>${user.firstName} ${user.lastName}</strong><br><small>@${user.username}</small></td>
                <td>${userRoleDisplay}</td>
                <td>${activityDisplay}</td>
                <td>${user.email}<br>${user.phone}</td>
                <td>${formatDate(user.registrationDate)}</td>
                <td>${actions}</td>
            `;
        } else {
             // Non-main admin view (simpler user list)
             row.innerHTML = `
                <td><strong>${user.firstName} ${user.lastName}</strong><br><small>@${user.username}</small></td>
                <td>${getDistrictName(user.district)}</td>
                <td>${activityDisplay}</td>
                <td>${user.email}<br>${user.phone}</td>
                <td>${formatDate(user.registrationDate)}</td>
                <td>${actions}</td>
            `;
        }
        tbody.appendChild(row);
    });
}

function filterUsersByIssueCount() {
    const filterValue = document.getElementById('userIssueFilter').value;
    let usersToList = registeredUsers;
    if (currentUser.role !== 'main_admin') {
        usersToList = registeredUsers.filter(u => u.role === 'user');
    }

    if (filterValue === 'all') {
        renderUsersTable(usersToList);
        return;
    }

    const filteredUsers = usersToList.filter(user => {
        const issueCount = issueReports.filter(r => r.submittedBy === user.username).length;
        if (filterValue === 'active') return issueCount > 0;
        if (filterValue === 'inactive') return issueCount === 0;
        return true;
    });
    renderUsersTable(filteredUsers);
}

function loadAllUsers() {
    let usersToList = (currentUser.role === 'main_admin')
        ? registeredUsers
        : registeredUsers.filter(u => u.role === 'user');
    renderUsersTable(usersToList);
}

function updateAnalytics() {
    const reportsForAdmin = (currentUser.role === 'main_admin')
        ? issueReports
        : issueReports.filter(report => report.category === currentUser.category);
    
    if(document.getElementById('totalReports')) {
        document.getElementById('totalReports').textContent = reportsForAdmin.length;
        document.getElementById('resolvedReports').textContent = reportsForAdmin.filter(r => r.status === "Resolved" || r.status === "Completed").length;
        document.getElementById('inProgressReports').textContent = reportsForAdmin.filter(r => r.status === "In Progress").length;
        document.getElementById('pendingReports').textContent = reportsForAdmin.filter(r => r.status === "Submitted").length;
    }
}

function initializeAdminAnalyticsChart() {
    const ctx = document.getElementById('adminCategoryChart')?.getContext('2d');
    if (!ctx) return;

    const reportsForAdmin = (currentUser.role === 'main_admin')
        ? issueReports
        : issueReports.filter(report => report.category === currentUser.category);

    const categories = ["roads", "lighting", "water", "waste", "safety"];
    const categoryLabels = categories.map(getCategoryName);
    const categoryCounts = categories.map(cat => reportsForAdmin.filter(r => r.category === cat).length);
    
    const filteredLabels = [];
    const filteredCounts = [];
    const backgroundColors = [
        '#ef4444', '#f59e0b', '#3b82f6', '#a855f7', '#10b981'
    ];
    const filteredBackgroundColors = [];

    categoryLabels.forEach((label, index) => {
        if (categoryCounts[index] > 0) {
            filteredLabels.push(label);
            filteredCounts.push(categoryCounts[index]);
            filteredBackgroundColors.push(backgroundColors[index]);
        }
    });

    if (adminChartInstance) {
        adminChartInstance.destroy();
    }

    adminChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: filteredLabels.length > 0 ? filteredLabels : ['No data'],
            datasets: [{
                label: '# of Reports',
                data: filteredCounts.length > 0 ? filteredCounts : [1],
                backgroundColor: filteredCounts.length > 0 ? filteredBackgroundColors : ['#e0e0e0'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } }
        }
    });
}

function declareWinner(username) {
    if (!currentUser || currentUser.role !== 'main_admin') {
        showToast("You do not have permission to perform this action.", "error");
        return;
    }
    const user = registeredUsers.find(u => u.username === username);
    if (user) {
        showToast(`@${username} has been declared a Civic Champion!`, 'success');
        createNotification(username, `Congratulations! You have been declared a Civic Champion for your contributions.`, null);
    }
}

function loadAdminLeaderboard() {
    const tbody = document.getElementById('adminLeaderboardTable');
    if(!tbody) return;

    const citizens = registeredUsers.filter(u => u.role === 'user');
    citizens.sort((a, b) => (b.points || 0) - (a.points || 0));

    tbody.innerHTML = "";
    citizens.forEach((user, index) => {
        const issueCount = issueReports.filter(r => r.submittedBy === user.username).length;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td><strong>${user.firstName} ${user.lastName}</strong><br><small>@${user.username}</small></td>
            <td>${user.points || 0}</td>
            <td>${issueCount}</td>
            <td>
                <button class="btn btn-success" onclick="declareWinner('${user.username}')" style="font-size:0.75rem;">
                    <i class="fas fa-trophy"></i> Declare Winner
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}


// ===================================================================================
// PUBLIC STATS PAGE LOGIC
// ===================================================================================

function initializeStatsPage() {
    const totalResolved = issueReports.filter(r => r.status === 'Resolved' || r.status === 'Completed').length;
    const openIssues = issueReports.length - totalResolved;
    const totalUsers = registeredUsers.filter(u => u.role === 'user').length;
    
    if(document.getElementById('statsTotalResolved')) {
        document.getElementById('statsTotalResolved').textContent = totalResolved;
        document.getElementById('statsOpenIssues').textContent = openIssues;
        document.getElementById('statsTotalUsers').textContent = totalUsers;
    }

    const citizens = registeredUsers.filter(u => u.role === 'user');
    citizens.sort((a, b) => (b.points || 0) - (a.points || 0));
    if(document.getElementById('statsTopCitizen')) {
        document.getElementById('statsTopCitizen').textContent = citizens.length > 0 ? `@${citizens[0].username}` : 'N/A';
    }

    const ctx = document.getElementById('categoryChart')?.getContext('2d');
    if (ctx) {
        const categories = ["roads", "lighting", "water", "waste", "safety"];
        const categoryCounts = categories.map(cat => issueReports.filter(r => r.category === cat).length);
        const categoryLabels = categories.map(getCategoryName);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoryLabels,
                datasets: [{
                    label: '# of Reports',
                    data: categoryCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    }
}


// ===================================================================================
// LANGUAGE & UI TEXT UPDATES
// ===================================================================================

function updateInterfaceLanguage() {
    const lang = translations[currentLanguage];

    const updateText = (elementId, translationKey, isSpan = false) => {
        const element = document.getElementById(elementId);
        if (element) {
            if (isSpan) {
                // Directly targets the span inside a button
                const span = element.querySelector('span');
                if(span) span.textContent = lang[translationKey];
            } else {
                element.textContent = lang[translationKey];
            }
        }
    };
    
    // Update dashboard user info if available
    const currentUserInfo = document.getElementById('currentUserInfo');
    if (currentUser && currentUserInfo) {
        currentUserInfo.innerHTML = `<i class="fas fa-user-circle"></i> <span>${currentUser.username}</span>`;
    }

    // --- Apply translations ---
    // General
    document.querySelectorAll('.brand-title').forEach(el => el.textContent = lang.brandTitle);
    updateText('langText', 'langText');
    updateText('logoutTextDropdown', 'logoutTextDropdown');

    // Index Page
    updateText('portalTitle', 'portalTitle');
    updateText('portalSubtitle', 'portalSubtitle');
    updateText('welcomeMessage', 'welcomeMessage');
    updateText('loginBtnText', 'loginBtnText');
    updateText('signupBtnText', 'signupBtnText');
    updateText('featuresText', 'featuresText');
    updateText('reportText', 'reportText');
    updateText('trackText', 'trackText');

    // Login Page
    const loginSubmitBtn = document.getElementById('loginSubmitText');
    if (loginSubmitBtn) loginSubmitBtn.textContent = lang.loginSubmitText;
    updateText('noAccountText', 'noAccountText');
    updateText('signupLinkText', 'signupLinkText');

    // Signup Page
    const signupSubtitle = document.getElementById('portalSubtitle');
    if (signupSubtitle && window.location.pathname.includes('signup.html')) {
        signupSubtitle.textContent = lang.signupPortalSubtitle;
    }
    const signupSubmitBtn = document.getElementById('signupSubmitText');
    if(signupSubmitBtn) signupSubmitBtn.textContent = lang.signupSubmitText;
    updateText('haveAccountText', 'haveAccountText');
    updateText('loginLinkText', 'loginLinkText');

    // Citizen Dashboard
    updateText('reportTitle', 'reportTitle');
    updateText('reportSubtitle', 'reportSubtitle');
    updateText('categoryLabel', 'categoryLabel');
    updateText('priorityLabel', 'priorityLabel');
    updateText('descriptionLabel', 'descriptionLabel');
    updateText('locationLabel', 'locationLabel');
    updateText('uploadLabel', 'uploadLabel');
    updateText('uploadText', 'uploadText');
    const submitBtnText = document.getElementById('submitButtonText');
    if (submitBtnText) submitBtnText.textContent = lang.submitButtonText;
    updateText('trackTitle', 'trackTitle');
    updateText('trackSubtitle', 'trackSubtitle');
    updateText('issueHeader', 'issueHeader');
    updateText('categoryHeader', 'categoryHeader');
    updateText('statusHeader', 'statusHeader');
    updateText('upvotesHeader', 'upvotesHeader');
    updateText('actionsHeader', 'actionsHeader');

    // Admin Dashboard
    updateText('reportsTitle', 'reportsTitle');
    updateText('reportsSubtitle', 'reportsSubtitle');
}
