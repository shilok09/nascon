document.addEventListener('DOMContentLoaded', function () {
  // HTML elements
  const regForm = document.getElementById('regForm');

  const fields = [
    {
      id: 'firstName',
      errorId: 'firstNameError',
      validate: val => val.trim().length > 0,
      message: "First name is required."
    },
    {
      id: 'lastName',
      errorId: 'lastNameError',
      validate: val => val.trim().length > 0,
      message: "Last name is required."
    },
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
    },
    {
      id: 'phone',
      errorId: 'phoneError',
      validate: val => /^\d{10,15}$/.test(val),
      message: "Phone number must be 10 to 15 digits."
    },
    {
      id: 'role',
      errorId: 'roleError',
      validate: val => val.trim() !== '',
      message: "Please select a user role."
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
      // For select (role dropdown), we listen for "change" too
      if (input.tagName.toLowerCase() === 'select') {
        input.addEventListener('change', () => {
          input.classList.remove('input-error');
          document.getElementById(field.errorId).classList.add('hidden');
        });
      }
    }
  }

  regForm.addEventListener('submit', function (e) {
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
      regForm.classList.add('animate-pulse');
      setTimeout(() => {
        regForm.classList.remove('animate-pulse');
        regForm.reset();
        fields.forEach(f => document.getElementById(f.errorId).classList.add('hidden'));
        alert("Account created!\n(You can hook up your submission logic here.)");
      }, 700);
    }
  });
});
