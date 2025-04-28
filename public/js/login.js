document.addEventListener('DOMContentLoaded', function () {
    // HTML elements
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
  
    // Add focus/blur transitions
    for (const field of fields) {
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
    }
  
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let hasError = false;
      for (let f of fields) {
        const input = document.getElementById(f.id);
        const errorSpan = document.getElementById(f.errorId);
        if (!f.validate(input.value)) {
          input.classList.add('input-error');
          errorSpan.textContent = f.message;
          errorSpan.classList.remove('hidden');
          hasError = true;
        } else {
          input.classList.remove('input-error');
          errorSpan.classList.add('hidden');
        }
      }
      if (!hasError) {
        // Simulate form success: animation and reset
        loginForm.classList.add('animate-pulse');
        setTimeout(() => {
          loginForm.classList.remove('animate-pulse');
          loginForm.reset();
          fields.forEach(f => document.getElementById(f.errorId).classList.add('hidden'));
          alert("Logged in successfully!\n(You can hook up your login logic here.)");
        }, 700);
      }
    });
  });
  