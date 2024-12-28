// Show the appropriate section (e.g., plugins, mods)
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Open modal for Login or Register
function openModal(type) {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'flex';
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.classList.remove('active'));
    document.getElementById(`${type}-form`).classList.add('active');
}

// Close the modal
function closeModal() {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'none';
}

// Show notification message
function showNotification(message, isError = false) {
    const notificationBox = document.getElementById('notification');
    notificationBox.textContent = message;
    notificationBox.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
    notificationBox.style.display = 'block';

    // Hide notification after 5 seconds
    setTimeout(() => {
        notificationBox.style.display = 'none';
    }, 5000);
}

// Switch to Register form
function showRegisterForm() {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.classList.remove('active'));
    document.getElementById('register-form').classList.add('active');
}

// Switch to Login form
function showLoginForm() {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.classList.remove('active'));
    document.getElementById('login-form').classList.add('active');
}

// Register a new user
function registerUser(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Check if user already exists
    const existingUser = localStorage.getItem(username);
    if (existingUser) {
        showNotification("Username already taken. Please choose another one.", true);
        return;
    }

    // Store the user data in localStorage
    const user = { username, email, password };
    localStorage.setItem(username, JSON.stringify(user));

    showNotification('Registration successful!');
    closeModal();
}

// Login an existing user
function loginUser(event) {
    event.preventDefault();
    
    const usernameOrEmail = document.getElementById('login-username-email').value;
    const password = document.getElementById('login-password').value;

    let storedUser = null;

    // Check if username is provided and retrieve user data
    storedUser = localStorage.getItem(usernameOrEmail);
    if (!storedUser) {
        // Try to find by email (in case email is used for registration)
        const users = Object.keys(localStorage);
        for (const key of users) {
            const user = JSON.parse(localStorage.getItem(key));
            if (user.email === usernameOrEmail) {
                storedUser = JSON.stringify(user);
                break;
            }
        }
    }

    if (!storedUser) {
        showNotification("Username or Email not found.", true);
        return;
    }

    const user = JSON.parse(storedUser);
    if (user.password !== password) {
        showNotification("Incorrect password.", true);
        return;
    }

    // Successful login
    showNotification('Login successful!');
    closeModal();
    showLoggedInState(user.username);
}

// Show logged-in state
function showLoggedInState(username) {
    document.querySelector('.auth-buttons').style.display = 'none';
    document.querySelector('.logged-in').style.display = 'block';
    document.querySelector('.logged-in button').textContent = `Logout (${username})`;

    // Show sections after login
    showSection('plugins');
}

// Logout the user
function logout() {
    localStorage.clear();
    showNotification('Logged out successfully!');
    document.querySelector('.auth-buttons').style.display = 'block';
    document.querySelector('.logged-in').style.display = 'none';
    showSection('plugins');
}

// Validate file format
function validateFile(input, requiredFormat) {
    const file = input.files[0];
    if (!file) return;

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (fileExtension !== requiredFormat) {
        showNotification(`Invalid file format. Please upload a .${requiredFormat} file.`, true);
        input.value = ""; // Clear the input
    } else {
        showNotification(`${fileName} uploaded successfully!`);
    }
}

// Display default section on page load
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        showLoggedInState(loggedInUser);
    } else {
        showSection('plugins');
    }
});
