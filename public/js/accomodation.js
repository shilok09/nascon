let selectedAccommodation = '';
        let pricePerNight = 0;

        function selectAccommodation(type, price) {
            selectedAccommodation = type;
            pricePerNight = price;

            document.getElementById('accommodationType').value = type;
            document.getElementById('registrationForm').classList.remove('form-hidden');

            // Scroll to registration form
            document.getElementById('registrationForm').scrollIntoView({ behavior: 'smooth' });

            // Update the total cost
            updateTotalCost();
        }

        function updateTotalCost() {
            const checkInDate = new Date(document.getElementById('checkInDate').value);
            const checkOutDate = new Date(document.getElementById('checkOutDate').value);

            if (checkInDate && checkOutDate && !isNaN(checkInDate) && !isNaN(checkOutDate)) {
                const diffTime = Math.abs(checkOutDate - checkInDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                const totalCost = diffDays * pricePerNight;
                document.getElementById('totalCost').textContent = `PKR ${totalCost.toLocaleString()}`;
            }
        }

        function submitForm(event) {
            event.preventDefault();

            // Here you would typically send the form data to your server
            // For demonstration, we'll just show an alert

            const formData = new FormData(document.getElementById('accommodationForm'));
            const formValues = Object.fromEntries(formData.entries());

            alert(`Thank you for your accommodation registration!\n\nWe have received your request for ${formValues.accommodationType}.\nYou will receive a confirmation email at ${formValues.email} shortly.`);

            // Reset the form
            document.getElementById('accommodationForm').reset();
            document.getElementById('registrationForm').classList.add('form-hidden');

            return false;
        }

        // Add event listeners for date changes to update total cost
        document.getElementById('checkInDate').addEventListener('change', updateTotalCost);
        document.getElementById('checkOutDate').addEventListener('change', updateTotalCost);

        // Set min date for check-in and check-out to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('checkInDate').min = today;
        document.getElementById('checkOutDate').min = today;