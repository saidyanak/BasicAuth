// API Base URL
const API_URL = 'http://localhost:8080/api/auth';

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!accessToken || !user.id) {
        // Not logged in, redirect to login page
        window.location.href = 'index.html';
        return;
    }

    // Display user info
    document.getElementById('userName').textContent = user.firstName;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userId').textContent = user.id;
    document.getElementById('roleValue').textContent = user.role;

    const roleElement = document.getElementById('userRole');
    roleElement.textContent = user.role;
    if (user.role === 'Admin') {
        roleElement.classList.add('admin');
    }

    // Display tokens
    document.getElementById('accessToken').textContent = localStorage.getItem('accessToken');
    document.getElementById('refreshToken').textContent = localStorage.getItem('refreshToken');
});

// Logout function
function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Display API response
function displayResponse(data, success = true) {
    const responseDiv = document.getElementById('apiResponse');
    responseDiv.style.display = 'block';
    responseDiv.style.color = success ? 'var(--success-color)' : 'var(--error-color)';
    responseDiv.textContent = JSON.stringify(data, null, 2);
}

// Test GET /api/auth/me
async function testGetMe() {
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            displayResponse(data, true);
        } else {
            displayResponse(data, false);
        }
    } catch (error) {
        displayResponse({ error: error.message }, false);
    }
}

// Test GET /api/auth/admin-only
async function testAdminOnly() {
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`${API_URL}/admin-only`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            displayResponse(data, true);
        } else {
            displayResponse(data, false);
        }
    } catch (error) {
        displayResponse({ error: error.message }, false);
    }
}

// Test POST /api/auth/refresh
async function testRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await fetch(`${API_URL}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();

        if (response.ok) {
            // Update tokens in localStorage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            // Update display
            document.getElementById('accessToken').textContent = data.accessToken;
            document.getElementById('refreshToken').textContent = data.refreshToken;

            displayResponse({
                message: 'Token rotation başarılı! Yeni tokenlar kaydedildi.',
                ...data
            }, true);
        } else {
            displayResponse(data, false);
        }
    } catch (error) {
        displayResponse({ error: error.message }, false);
    }
}
