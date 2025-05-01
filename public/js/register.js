document.addEventListener('DOMContentLoaded', function () {
  const roleSelect = document.getElementById('role');
  const companyNameContainer = document.getElementById('companyNameContainer');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const regForm = document.getElementById('regForm');

  // Role selection handler
  roleSelect.addEventListener('change', function () {
    const isSponsor = roleSelect.value === 'sponsor';
    companyNameContainer.classList.toggle('hidden', !isSponsor);
    firstNameInput.parentElement.classList.toggle('hidden', isSponsor);
    lastNameInput.parentElement.classList.toggle('hidden', isSponsor);
    
    // Toggle required attributes
    [firstNameInput, lastNameInput].forEach(input => 
      input.toggleAttribute('required', !isSponsor));
    document.getElementById('companyName').toggleAttribute('required', isSponsor);
  });

  // Field validations
  const fields = [
    {
      id: 'firstName',
      errorId: 'firstNameError',
      validate: (val, isSponsor) => isSponsor || val.trim().length > 0,
      message: "First name is required."
    },
    {
      id: 'lastName',
      errorId: 'lastNameError',
      validate: (val, isSponsor) => isSponsor || val.trim().length > 0,
      message: "Last name is required."
    },
    {
      id: 'companyName',
      errorId: 'companyNameError',
      validate: (val, isSponsor) => !isSponsor || val.trim().length > 0,
      message: "Company name is required."
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

  // Field event listeners
  fields.forEach(field => {
    const input = document.getElementById(field.id);
    if (!input) return;

    input.addEventListener('focus', () => {
      input.classList.add('ring', 'ring-orange-400');
    });
    
    input.addEventListener('blur', () => {
      input.classList.remove('ring', 'ring-orange-400');
    });

    const clearError = () => {
      input.classList.remove('input-error');
      document.getElementById(field.errorId).classList.add('hidden');
    };
    
    input.addEventListener('input', clearError);
    if (input.tagName === 'SELECT') input.addEventListener('change', clearError);
  });

  // Form submission
  regForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const isSponsor = roleSelect.value === 'sponsor';
    let hasError = false;

    // Validate all fields
    fields.forEach(f => {
      const input = document.getElementById(f.id);
      const errorSpan = document.getElementById(f.errorId);
      const isValid = f.validate(input.value, isSponsor);
      
      if (!isValid) {
        input.classList.add('input-error');
        errorSpan.textContent = f.message;
        errorSpan.classList.remove('hidden');
        hasError = true;
      }
    });

    if (!hasError) {
      regForm.classList.add('animate-pulse');
      const submitBtn = regForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      
      try {
        const formData = {
          firstName: firstNameInput.value,
          lastName: lastNameInput.value,
          companyName: document.getElementById('companyName').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
          phone: document.getElementById('phone').value,
          role: roleSelect.value
        };

        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Registration successful:", result);
          if (formData.role === 'sponsor') {
            // Handle sponsor redirection
            window.location.href = '/sponsor';
          } else {
            window.location.href = '/dashboard';
          }
        } else {
          // Show server errors
          if (result.errors) {
            Object.entries(result.errors).forEach(([field, message]) => {
              const errorSpan = document.getElementById(`${field}Error`);
              if (errorSpan) {
                errorSpan.textContent = message;
                errorSpan.classList.remove('hidden');
                document.getElementById(field).classList.add('input-error');
              }
            });
          } else {
            alert(result.message || 'Registration failed');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        const serverError = document.getElementById('serverError') || createServerErrorElement();
        serverError.textContent = 'Network error. Please try again.';
        serverError.classList.remove('hidden');
      } finally {
        regForm.classList.remove('animate-pulse');
        submitBtn.disabled = false;
      }
    }
  });

  function createServerErrorElement() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'serverError';
    errorDiv.className = 'hidden text-red-500 text-sm mt-4 p-3 bg-red-50 rounded';
    regForm.parentNode.insertBefore(errorDiv, regForm.nextSibling);
    return errorDiv;
  }
});