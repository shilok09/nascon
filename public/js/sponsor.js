const registerTab = document.getElementById("registerBtn");
// Get the footer element
const footer = document.getElementById("footer1");

// Event listener for "Register" tab click
registerTab.addEventListener("click", function() {
    // Change the margin-top of the footer when "Register" is clicked
    footer.style.marginTop = "10px";  // You can adjust this value as needed
});
window.onload = function () {
    showTab('dashboard'); // This will open the Dashboard tab by default
  };
        
        // document.querySelector('.dashboard-tab').classList.remove('hidden');
        // document.querySelector('.profile-tab').classList.remove('hidden');
        // document.querySelector('.logout-tab').classList.remove('hidden');
        // document.getElementById('profile-company-name').value = user.companyName;
        // document.getElementById('profile-business-email').value = user.email;
        // document.getElementById('profile-contact-person').value = user.contactPerson;
        // document.getElementById('profile-phone').value = user.phone;
        // document.getElementById('company-website').value = user.website || '';
         //Simulated database to store registered users and sponsorships

        let users = [];
        let currentUser = null;
        let sponsorships = [];
        let sponsorshipIdCounter = 1;

        // Selected category and type
        let selectedCategory = '';
        let selectedType = '';

        // DOM elements
        document.addEventListener('DOMContentLoaded', function () {
            // Form event listeners
            // document.getElementById('login-form').addEventListener('submit', handleLogin);
            // document.getElementById('register-form').addEventListener('submit', handleRegister);
            document.getElementById('sponsorship-form').addEventListener('submit', handleSponsorshipSubmit);
            document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
            document.getElementById('password-form').addEventListener('submit', handlePasswordChange);

            // Add some demo data
            addDemoData();
        });

        // Tab navigation
        function showTab(tabId) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });

            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            // Show the selected tab
            document.getElementById(tabId).classList.add('active');

            // Add active class to the clicked link
            document.querySelector(`.${tabId}-tab`).classList.add('active');
        }
       

        // // Login handler
        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Find user
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                currentUser = user;
                showAlertMessage('Login successful! Welcome back ' + user.companyName, 'success');

                // Show dashboard and profile tabs

                // Hide login and register tabs
                document.querySelector('.login-tab').classList.add('hidden');
                document.querySelector('.register-tab').classList.add('hidden');

                // Navigate to dashboard
                showTab('dashboard');

                // Load user data into profile form
                document.getElementById('profile-company-name').value = user.companyName;
                document.getElementById('profile-business-email').value = user.email;
                document.getElementById('profile-contact-person').value = user.contactPerson;
                document.getElementById('profile-phone').value = user.phone;
                document.getElementById('company-website').value = user.website || '';

                // Load user sponsorships
                loadUserSponsorships();
            } else {
                showAlertMessage('Invalid email or password. Please try again.', 'error');
            }
        }

        // Register handler

        // function handleRegister(e) {
        //     e.preventDefault();
        //     const companyName = document.getElementById('company-name').value;
        //     const email = document.getElementById('business-email').value;
        //     const contactPerson = document.getElementById('contact-person').value;
        //     const phone = document.getElementById('phone').value;
        //     const password = document.getElementById('register-password').value;
        //     const confirmPassword = document.getElementById('confirm-password').value;

        //     // Validate fields
        //     if (password !== confirmPassword) {
        //         showAlertMessage('Passwords do not match!', 'error');
        //         return;
        //     }

        //     // Check if email is already registered
        //     if (users.some(user => user.email === email)) {
        //         showAlertMessage('This email is already registered. Please login instead.', 'error');
        //         return;
        //     }

        //     // Create new user
        //     const newUser = {
        //         id: users.length + 1,
        //         companyName,
        //         email,
        //         contactPerson,
        //         phone,
        //         password,
        //         website: ''
        //     };

        //     // Add to users array
        //     users.push(newUser);

        //     showAlertMessage('Registration successful! Please login with your credentials.', 'success');

        //     // Clear form and switch to login tab
        //     document.getElementById('register-form').reset();
        //     //MOVE TO SPONSOR PAGE //sponsor.ejs
        // }

        // Sponsorship submission handler
        function handleSponsorshipSubmit(e) {
            e.preventDefault();

            if (!currentUser) {
                showAlertMessage('Please login to submit a sponsorship.', 'error');
                return;
            }

            if (!selectedCategory || !selectedType) {
                showAlertMessage('Please select both a category and type for your sponsorship.', 'error');
                return;
            }

            const amount = document.getElementById('sponsorship-amount').value;
            const contractDate = document.getElementById('contract-date').value;
            const description = document.getElementById('sponsorship-description').value;

            // Create new sponsorship
            const newSponsorship = {
                id: sponsorshipIdCounter++,
                userId: currentUser.id,
                category: selectedCategory,
                type: selectedType,
                amount,
                contractDate,
                description,
                status: 'Pending Approval'
            };

            // Add to sponsorships array
            sponsorships.push(newSponsorship);

            showAlertMessage('Sponsorship submitted successfully!', 'success');

            // Clear form and refresh sponsorships table
            document.getElementById('sponsorship-form').reset();
            document.getElementById('selected-category').value = '';
            document.getElementById('selected-type').value = '';
            selectedCategory = '';
            selectedType = '';

            // Reset card selections
            document.querySelectorAll('.category-card, .type-card').forEach(card => {
                card.classList.remove('selected');
            });

            loadUserSponsorships();
        }

        // Profile update handler
        function handleProfileUpdate(e) {
            e.preventDefault();

            if (!currentUser) {
                showAlertMessage('Please login to update your profile.', 'error');
                return;
            }

            const companyName = document.getElementById('profile-company-name').value;
            const email = document.getElementById('profile-business-email').value;
            const contactPerson = document.getElementById('profile-contact-person').value;
            const phone = document.getElementById('profile-phone').value;
            const website = document.getElementById('company-website').value;

            // Check if email is already registered to another user
            const existingUser = users.find(user => user.email === email && user.id !== currentUser.id);
            if (existingUser) {
                showAlertMessage('This email is already registered to another account.', 'error');
                return;
            }

            // Update user data
            currentUser.companyName = companyName;
            currentUser.email = email;
            currentUser.contactPerson = contactPerson;
            currentUser.phone = phone;
            currentUser.website = website;

            // Update users array
            const userIndex = users.findIndex(user => user.id === currentUser.id);
            users[userIndex] = currentUser;

            showAlertMessage('Profile updated successfully!', 'success');
        }

        // Password change handler
        function handlePasswordChange(e) {
            e.preventDefault();

            if (!currentUser) {
                showAlertMessage('Please login to change your password.', 'error');
                return;
            }

            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;

            // Validate current password
            if (currentPassword !== currentUser.password) {
                showAlertMessage('Current password is incorrect.', 'error');
                return;
            }

            // Validate new passwords match
            if (newPassword !== confirmNewPassword) {
                showAlertMessage('New passwords do not match.', 'error');
                return;
            }

            // Update password
            currentUser.password = newPassword;

            // Update users array
            const userIndex = users.findIndex(user => user.id === currentUser.id);
            users[userIndex] = currentUser;

            showAlertMessage('Password changed successfully!', 'success');

            // Clear form
            document.getElementById('password-form').reset();
        }

        // Logout function
        function logout() {
            currentUser = null;
            showAlertMessage('You have been logged out successfully.', 'success');

            // Hide dashboard and profile tabs
            document.querySelector('.dashboard-tab').classList.add('hidden');
            document.querySelector('.profile-tab').classList.add('hidden');
            document.querySelector('.logout-tab').classList.add('hidden');

            // Show login and register tabs
            document.querySelector('.login-tab').classList.remove('hidden');
            document.querySelector('.register-tab').classList.remove('hidden');

            // Navigate to login
            showTab('login');
        }

        // Select category function
        function selectCategory(category) {
            selectedCategory = category;
            document.getElementById('selected-category').value = category;

            // Highlight selected category
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Find and select the card
            document.querySelectorAll('.category-card').forEach(card => {
                if (card.querySelector('h4').textContent === category) {
                    card.classList.add('selected');
                }
            });
        }

        // Select type function
        function selectType(type) {
            selectedType = type;
            document.getElementById('selected-type').value = type;

            // Highlight selected type
            document.querySelectorAll('.type-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Find and select the card
            document.querySelectorAll('.type-card').forEach(card => {
                if (card.querySelector('h4').textContent === type) {
                    card.classList.add('selected');
                }
            });
        }

        // Load user sponsorships
        function loadUserSponsorships() {
            if (!currentUser) return;

            const tableBody = document.getElementById('sponsorships-table-body');
            const userSponsorships = sponsorships.filter(sponsorship => sponsorship.userId === currentUser.id);

            if (userSponsorships.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4">
                            No sponsorships found. Submit your first sponsorship.
                        </td>
                    </tr>
                `;
                return;
            }

            tableBody.innerHTML = '';

            userSponsorships.forEach(sponsorship => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${sponsorship.id}</td>
                    <td>${sponsorship.category}</td>
                    <td>${sponsorship.type}</td>
                    <td>${sponsorship.contractDate}</td>
                    <td>$${sponsorship.amount}</td>
                    <td>${sponsorship.status}</td>
                    <td>
                        <button class="text-blue-500 hover:text-blue-700 mr-2" onclick="viewSponsorship(${sponsorship.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="text-yellow-500 hover:text-yellow-700 mr-2" onclick="editSponsorship(${sponsorship.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-500 hover:text-red-700" onclick="deleteSponsorship(${sponsorship.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        }

        // View sponsorship function
        function viewSponsorship(id) {
            const sponsorship = sponsorships.find(s => s.id === id);

            if (sponsorship) {
                const message = `
                    <div class="p-4">
                        <h3 class="text-lg font-bold mb-2">Sponsorship Details</h3>
                        <p><strong>ID:</strong> ${sponsorship.id}</p>
                        <p><strong>Category:</strong> ${sponsorship.category}</p>
                        <p><strong>Type:</strong> ${sponsorship.type}</p>
                        <p><strong>Amount:</strong> $${sponsorship.amount}</p>
                        <p><strong>Contract Date:</strong> ${sponsorship.contractDate}</p>
                        <p><strong>Description:</strong> ${sponsorship.description}</p>
                        <p><strong>Status:</strong> ${sponsorship.status}</p>
                    </div>
                `;

                // Create a modal-like alert
                const alertContainer = document.getElementById('alert-container');
                const alertDiv = document.createElement('div');
                alertDiv.className = 'card p-0 mb-4';
                alertDiv.innerHTML = `
                    ${message}
                    <div class="p-4 bg-gray-800 text-right">
                        <button class="btn btn-secondary" onclick="this.parentNode.parentNode.remove()">Close</button>
                    </div>
                `;
                alertContainer.appendChild(alertDiv);

                // Scroll to alert
                alertDiv.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Edit sponsorship function
        function editSponsorship(id) {
            const sponsorship = sponsorships.find(s => s.id === id);

            if (sponsorship && sponsorship.userId === currentUser.id) {
                // Set selected category and type
                selectCategory(sponsorship.category);
                selectType(sponsorship.type);

                // Update form fields
                document.getElementById('sponsorship-amount').value = sponsorship.amount;
                document.getElementById('contract-date').value = sponsorship.contractDate;
                document.getElementById('sponsorship-description').value = sponsorship.description;

                // Scroll to form
                document.getElementById('sponsorship-form').scrollIntoView({ behavior: 'smooth' });

                // Remove sponsorship (it will be re-added on form submit)
                sponsorships = sponsorships.filter(s => s.id !== id);
                sponsorshipIdCounter = id; // Keep the same ID

                showAlertMessage('Edit mode: Update the form and submit to save changes.', 'success');
            }
        }

        // Delete sponsorship function
        function deleteSponsorship(id) {
            if (confirm('Are you sure you want to delete this sponsorship?')) {
                sponsorships = sponsorships.filter(s => s.id !== id);
                loadUserSponsorships();
                showAlertMessage('Sponsorship deleted successfully.', 'success');
            }
        }

        // Show alert message function
        function showAlertMessage(message, type) {
            const alertContainer = document.getElementById('alert-container');
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.innerHTML = message;
            alertContainer.appendChild(alertDiv);

            // Remove alert after 5 seconds
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }

        // Add demo data function
        function addDemoData() {
            // Add demo user
            users.push({
                id: 1,
                companyName: 'Demo Company',
                email: 'demo@example.com',
                contactPerson: 'John Doe',
                phone: '1234567890',
                password: 'password',
                website: 'https://demo.example.com'
            });

            // Add demo sponsorships
            sponsorships.push({
                id: sponsorshipIdCounter++,
                userId: 1,
                category: 'Gold',
                type: 'Financial',
                amount: '7500',
                contractDate: '2023-12-01',
                description: 'Financial support for NASCON 2023',
                status: 'Approved'
            });

            sponsorships.push({
                id: sponsorshipIdCounter++,
                userId: 1,
                category: 'Silver',
                type: 'Media',
                amount: '5000',
                contractDate: '2023-11-15',
                description: 'Media coverage for NASCON events',
                status: 'Pending Approval'
            });
        }