var users = JSON.parse(localStorage.getItem('users')) || [];

    function login() {
        var enteredUsername = document.getElementById('username').value;
        var enteredPassword = document.getElementById('password').value;

       // Check credentials
       var user = users.find(u => u.username === enteredUsername && u.password === enteredPassword);

       if (user) {
            window.location.href = '/index.html';
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

       // Store the new user credentials
       users.push({ username: newUsername, password: newPassword });
       localStorage.setItem('users', JSON.stringify(users));

       alert('Account created successfully!');
   }

   function showLoginForm() {
       document.getElementById('loginForm').style.display = 'block';
       document.getElementById('registerForm').style.display = 'none';
   }
