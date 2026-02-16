// API Base URL
const API_URL = 'http://localhost:8080/api/auth';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const alertBox = document.getElementById('alert');

// Switch between Login and Register forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    hideAlert();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    hideAlert();
});

// Show Alert
function showAlert(message, type = 'error') {
    alertBox.textContent = message;
    alertBox.className = `alert ${type} show`;

    setTimeout(() => {
        hideAlert();
    }, 5000);
}

// Hide Alert
function hideAlert() {
    alertBox.classList.remove('show');
}

// Set Loading State
function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Handle Login
document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    setLoading(submitBtn, true);
    hideAlert();

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save tokens to localStorage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                id: data.userId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role
            }));

            showAlert('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');

            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            // Handle errors
            const errorMessage = data.title || data.message || 'Giriş yapılırken bir hata oluştu';
            showAlert(errorMessage, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.', 'error');
    } finally {
        setLoading(submitBtn, false);
    }
});

// Handle Register
document.getElementById('register').addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    setLoading(submitBtn, true);
    hideAlert();

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save tokens to localStorage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                id: data.userId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role || 'User'
            }));

            showAlert('Kayıt başarılı! Hoş geldin mail gönderildi. Yönlendiriliyorsunuz...', 'success');

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Handle validation errors
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat().join(', ');
                showAlert(errorMessages, 'error');
            } else {
                const errorMessage = data.title || data.message || 'Kayıt olurken bir hata oluştu';
                showAlert(errorMessage, 'error');
            }
        }
    } catch (error) {
        console.error('Register error:', error);
        showAlert('Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.', 'error');
    } finally {
        setLoading(submitBtn, false);
    }
});

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        // User is logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});
