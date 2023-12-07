function login() {
    var enteredUsername = document.getElementById('username').value;
    var enteredPassword = document.getElementById('password').value;

    // Check credentials (replace with your authentication logic)
    if (enteredUsername === 'user' && enteredPassword === 'password') {
        alert('Login successful!');
    } else {
        alert('Invalid username or password');
    }
}

function showRegistrationForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function register() {
    var newUsername = document.getElementById('newUsername').value;
    var newPassword = document.getElementById('newPassword').value;

    // Store the new user credentials (replace with your storage logic)
    alert('Account created successfully!');
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('registerForm').style.display = 'none';
}
