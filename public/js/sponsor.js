document.addEventListener("DOMContentLoaded", function () {
    let selectedCategory = '';
    let selectedType = '';
    const footer = document.getElementById("footer1");

    // Default Tab
    window.onload = function () {
        showTab('dashboard'); // Opens the Dashboard tab by default
    };

    // Sponsorship Type Selection
    const typeCards = document.querySelectorAll('.type-card');
    const hiddenTypeInput = document.getElementById('selected-type');
    const visibleTypeInput = document.getElementById('sponsorship-category');

    typeCards.forEach(card => {
        card.addEventListener('click', function () {
            const selectedType = this.querySelector('h4').textContent.trim();
            hiddenTypeInput.value = selectedType;
            visibleTypeInput.value = selectedType;

            // Highlight selected card
            typeCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Handle Category Selection
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function () {
            const category = this.querySelector('h4').textContent;
            selectCategory(category);
        });
    });

    // Handle Category Selection
    function selectCategory(category) {
        selectedCategory = category;
        document.getElementById('selected-category').value = category;

        const amountField = document.getElementById('sponsorship-amount');

        // Set amount based on selected category
        switch (category) {
            case 'Platinum':
                amountField.value = 1000000; // No commas
                amountField.readOnly = true;
                break;
            case 'Gold':
                amountField.value = 500000;
                amountField.readOnly = true;
                break;
            case 'Silver':
                amountField.value = 250000;
                amountField.readOnly = true;
                break;
            case 'Bronze':
                amountField.value = 150000;
                amountField.readOnly = true;
                break;
            case 'Event Specific':
                amountField.value = 100000;
                amountField.readOnly = false; // Allow editing
                break;
            case 'Custom':
                amountField.value = ''; // Empty for custom amount
                amountField.readOnly = false; // Allow editing
                break;
            default:
                amountField.value = '';
                amountField.readOnly = true;
        }

        // Highlight selected category
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
            if (card.querySelector('h4').textContent === category) {
                card.classList.add('selected');
            }
        });
    }

    // Handle focus event for amount field (only for "Event Specific" or "Custom")
    document.getElementById('sponsorship-amount').addEventListener('focus', function () {
        if (selectedCategory === 'Event Specific' || selectedCategory === 'Custom') {
            this.readOnly = false;
        }
    });

    // For Tab Navigation if needed
    function showTab(tabId) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show the selected tab
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }

    // Select Type Function
    function selectType(type) {
        selectedType = type;
        document.getElementById('selected-type').value = type;

        // Highlight selected type
        typeCards.forEach(card => {
            card.classList.remove('selected');
        });

        // Find and select the card
        typeCards.forEach(card => {
            if (card.querySelector('h4').textContent === type) {
                card.classList.add('selected');
            }
        });
    }

    // Make these functions globally available
    window.selectCategory = selectCategory;
    window.selectType = selectType;
    window.showTab = showTab;

    // FORM SUBMISSION HANDLER
    const sponsorshipForm = document.getElementById('sponsorshipForm');
    if (sponsorshipForm) {
        sponsorshipForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!selectedCategory) {
                showAlert('Please select a sponsorship category', 'error');
                return;
            }
            
            if (!selectedType) {
                showAlert('Please select a sponsorship type', 'error');
                return;
            }
            
            // Get form data
            const formData = {
                sponsorId: document.getElementById('sponsorId').value,
                categoryType: selectedCategory,
                sponsorType: selectedType,
                amount: document.getElementById('sponsorship-amount').value,
                contractDate: document.getElementById('contract-date').value,
                description: document.getElementById('sponsorship-description').value
            };

            // Basic validation
            if (!formData.contractDate) {
                showAlert('Please select a contract date', 'error');
                return;
            }
            
            if (!formData.description) {
                showAlert('Please provide a description', 'error');
                return;
            }
            
            if (!formData.amount) {
                showAlert('Please enter an amount', 'error');
                return;
            }

            // Show loading state
            showAlert('Submitting sponsorship...');
            
            try {
                const response = await fetch('/sponsor/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Success handling
                    showAlert('Sponsorship submitted successfully!', 'success');
                    console.log('Contract ID:', data.contractId);
                    
                    // Reset form or redirect
                    sponsorshipForm.reset();
                    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
                    selectedCategory = '';
                    selectedType = '';
                    
                    // Optional: redirect to a thank you page or dashboard
                    // window.location.href = '/sponsor/thank-you';
                } else {
                    // Error handling
                    if (data.errors) {
                        const errorMessages = data.errors.map(e => e.msg).join('\n');
                        showAlert('Validation errors: ' + errorMessages, 'error');
                    } else {
                        showAlert(data.message || 'Failed to submit sponsorship', 'error');
                    }
                }
            } catch (error) {
                console.error('Submission error:', error);
                showAlert('Network error occurred. Please try again.', 'error');
            }
        });
    }

    // Alert handling
    function showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alert-container');
        if (!alertContainer) return;
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} mb-4`;
        alertDiv.textContent = message;
        
        // Add dismiss button
        const dismissBtn = document.createElement('button');
        dismissBtn.className = 'close-btn';
        dismissBtn.innerHTML = '&times;';
        dismissBtn.onclick = function() {
            alertContainer.removeChild(alertDiv);
        };
        
        alertDiv.appendChild(dismissBtn);
        alertContainer.appendChild(alertDiv);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode === alertContainer) {
                alertContainer.removeChild(alertDiv);
            }
        }, 5000);
    }

    // LOAD SPONSORSHIP PACKAGES
    async function loadSponsorshipPackages() {
        try {
            const response = await fetch('/sponsor/packages');
            const packages = await response.json();
            
            // If you have a package select dropdown, populate it here
            // This could be used for a different part of the form or page
            const packageSelect = document.getElementById('package-select');
            if (packageSelect) {
                packages.forEach(pkg => {
                    const option = document.createElement('option');
                    option.value = pkg.packageId;
                    option.textContent = `${pkg.packagename} ($${pkg.cost})`;
                    packageSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Failed to load packages:', error);
        }
    }

    // Call this when the page loads
    loadSponsorshipPackages();
});