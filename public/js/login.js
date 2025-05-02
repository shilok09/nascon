document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const fields = [
      {
          id: 'email',
          errorId: 'emailError',
          validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
          message: "Please enter a valid email address."
      },
      {
          id: 'password',
          errorId: 'passwordError',
          validate: val => val.length >= 6,
          message: "Password should be at least 6 characters."
      }
  ];

  // Field event listeners
  fields.forEach(field => {
      const input = document.getElementById(field.id);
      if (input) {
          input.addEventListener('focus', (e) => {
              e.target.classList.add('ring', 'ring-orange-400');
          });
          input.addEventListener('blur', (e) => {
              e.target.classList.remove('ring', 'ring-orange-400');
          });
          input.addEventListener('input', () => {
              input.classList.remove('input-error');
              document.getElementById(field.errorId).classList.add('hidden');
          });
      }
  });

  loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      let hasError = false;

      // Validate fields
      fields.forEach(f => {
          const input = document.getElementById(f.id);
          const errorSpan = document.getElementById(f.errorId);
          const isValid = f.validate(input.value);
          
          if (!isValid) {
              input.classList.add('input-error');
              errorSpan.textContent = f.message;
              errorSpan.classList.remove('hidden');
              hasError = true;
          } else {
              input.classList.remove('input-error');
              errorSpan.classList.add('hidden');
          }
      });

      if (!hasError) {
          loginForm.classList.add('animate-pulse');
          const submitBtn = loginForm.querySelector('button[type="submit"]');
          submitBtn.disabled = true;

          try {
              const response = await fetch('/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      email: document.getElementById('email').value,
                      password: document.getElementById('password').value
                  })
              });

              const result = await response.json();

              if (response.ok) {
                  // Store user data in session/local storage if needed
                  if (result.user) {
                      localStorage.setItem('user', JSON.stringify(result.user));
                  }
                  
                  // Redirect based on user type
                  window.location.href = result.redirect || '/dashboard';
              } else {
                  // Show specific field error if available
                  if (result.field) {
                      const errorSpan = document.getElementById(`${result.field}Error`);
                      if (errorSpan) {
                          errorSpan.textContent = result.error;
                          errorSpan.classList.remove('hidden');
                          document.getElementById(result.field).classList.add('input-error');
                      }
                  } else {
                      alert(result.error || 'Login failed');
                  }
              }
          } catch (error) {
              console.error('Error:', error);
              alert('Network error. Please try again.');
          } finally {
              loginForm.classList.remove('animate-pulse');
              submitBtn.disabled = false;
          }
      }
  });
});