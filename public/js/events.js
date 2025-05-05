function getSampleEvents() {
    return [
        // Sample event data
    {
        id: 1,
        title: "Tech Startup Hackathon",
        description: "24-hour hackathon to build innovative solutions for real-world problems. Form teams, ideate, and pitch your startup idea to win investment opportunities.",
        date: "April 21-22, 2023",
        time: "3:00 PM",
        location: "CS Block, FAST University",
        category: "Competition",
        categoryColor: "bg-purple-800",
        bgColor: "bg-indigo-900",
        featured: true,
        buttonText: "Register Now"
    },
    {
        id: 2,
        title: "AI & Machine Learning Workshop",
        description: "Hands-on workshop covering the fundamentals of AI and ML with Python. No prior experience required.",
        date: "April 20, 2023",
        time: "10:00 AM",
        location: "Lab 5, CS Block",
        category: "Workshop",
        categoryColor: "bg-blue-800",
        bgColor: "bg-blue-900",
        featured: false,
        buttonText: "Register Now"
    },
    {
        id: 3,
        title: "Blockchain Revolution Talk",
        description: "Industry experts discuss the future of blockchain technology and its real-world applications.",
        date: "April 22, 2023",
        time: "2:00 PM",
        location: "Auditorium",
        category: "Talk",
        categoryColor: "bg-green-800",
        bgColor: "bg-green-900",
        featured: false,
        buttonText: "Register Now"
    },
    {
        id: 4,
        title: "Tech Networking Mixer",
        description: "An evening of networking with tech professionals and peers. Food and drinks provided.",
        date: "April 21, 2023",
        time: "7:00 PM",
        location: "University Courtyard",
        category: "Social",
        categoryColor: "bg-yellow-800",
        bgColor: "bg-yellow-900",
        featured: false,
        buttonText: "Register Now"
    },
    {
        id: 5,
        title: "Cybersecurity Capture The Flag",
        description: "Test your cybersecurity skills in this exciting competition. Individual and team categories available.",
        date: "April 23, 2023",
        time: "9:00 AM",
        location: "Lab 3, CS Block",
        category: "Competition",
        categoryColor: "bg-purple-800",
        bgColor: "bg-indigo-900",
        featured: false,
        buttonText: "Register Now"
    },
    {
        id: 6,
        title: "Cloud Computing Workshop",
        description: "Learn to deploy applications using AWS and Azure. Bring your own laptop for hands-on practice.",
        date: "April 19, 2023",
        time: "11:00 AM",
        location: "Lab 2, CS Block",
        category: "Workshop",
        categoryColor: "bg-blue-800",
        bgColor: "bg-blue-900",
        featured: false,
        buttonText: "Register Now"
    }
];
}
document.addEventListener('DOMContentLoaded', function() {
  // Modal functions - Ensure these are declared first
  function openModal() {
    // Reset the form
    registrationForm.reset();
    
    // Clear any previously added accommodation request ID elements
    const accommodationInfoDiv = document.getElementById('accommodation-info');
    if (accommodationInfoDiv) {
        // Keep only the first two paragraphs (the default text) and remove any added elements
        const paragraphs = accommodationInfoDiv.querySelectorAll('p');
        if (paragraphs.length > 2) {
            for (let i = 2; i < paragraphs.length; i++) {
                paragraphs[i].remove();
            }
        }
        // Hide the accommodation info section
        accommodationInfoDiv.classList.add('hidden');
    }
    
    // Show the modal
    registrationModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
      registrationModal.classList.add('hidden');
      document.body.style.overflow = '';
  }

  function openConfirmationModal() {
      confirmationModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
  }

  function closeConfirmationModal() {
      confirmationModal.classList.add('hidden');
      document.body.style.overflow = '';
  }




  // DOM elements
  const eventsGrid = document.querySelector('.grid');
  const categoryButtons = document.querySelectorAll('section.mb-12 button');
  const registerButtons = document.querySelectorAll('.register-btn');
  const registrationModal = document.getElementById('registrationModal');
  const closeModalButton = document.getElementsByClassName('closeRegistration')[0];  // Select the close button by class
  const confirmationModal = document.getElementById('confirmationModal');
  const eventTitleElement = document.getElementById('eventTitle');
  const registrationForm = document.getElementById('registrationForm');
  const registrationIdElement = document.getElementById('registrationId');

  //updatingggggg
  const currentEventIdElement = document.createElement('input');
  currentEventIdElement.type = 'hidden';
  currentEventIdElement.id = 'currentEventId';
  registrationForm.appendChild(currentEventIdElement);

  // Current filter state
  let currentFilter = 'all';

// Add this at the top with other variable declarations
let events = [];

// Update the init function
function init() {
    fetchEvents(); // Fetch events from the server
    setupEventListeners();
    checkPendingRegistration(); // Check if there's a pending registration
}

// Update fetchEvents function
async function fetchEvents() {
    try {
        const response = await fetch('/events'); // Make sure this matches your route
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        events = data; // Store the fetched events
        renderEvents(events); // Render the events
    } catch (error) {
        console.error('Error:', error);
        // Fallback to sample data if API fails
        events = getSampleEvents();
        renderEvents(events);
    }
}

  // Render events to the grid
  function renderEvents(eventsToRender) {
    eventsGrid.innerHTML = '';
    
    eventsToRender.forEach(event => {
        if (currentFilter !== 'all' && event.category.toLowerCase() !== currentFilter) return;
        
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card rounded-xl overflow-hidden shadow-lg bg-gray-800';
        eventCard.innerHTML = `
            <div class="h-48 ${event.bgColor} relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div class="absolute bottom-0 left-0 p-4">
                    <span class="text-white text-xs font-bold px-3 py-1 rounded-full ${event.category_color}">${event.category}</span>
                    <h3 class="text-xl font-bold text-white mt-2">${event.title}</h3>
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-center text-gray-400 text-sm mb-4">
                    <div class="mr-4">
                        <i class="fas fa-calendar-alt mr-2"></i>
                        <span>${event.date}</span>
                    </div>
                    <div>
                        <i class="fas fa-clock mr-2"></i>
                        <span>${event.time}</span>
                    </div>
                </div>
                <div class="text-gray-400 text-sm mb-4">
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    <span>${event.location}</span>
                </div>
                <p class="text-gray-300 mb-6">${event.description}</p>
                <button class="register-btn btn-primary w-full py-3 rounded-lg text-white font-semibold" 
                        data-event="${event.title}" 
                        data-event-id="${event.id}">
                    Register Now
                </button>
            </div>
        `;
        eventsGrid.appendChild(eventCard);
    });

    // Add event listeners to new register buttons
    document.querySelectorAll('.register-btn').forEach(button => {
        button.addEventListener('click', handleRegisterClick);
    });
}

  // Set up event listeners
  function setupEventListeners() {
      // Category filter buttons
      categoryButtons.forEach(button => {
          button.addEventListener('click', () => {
              // Update active button styling
              categoryButtons.forEach(btn => {
                  btn.classList.remove('bg-purple-800');
                  btn.classList.add('bg-gray-800');
              });
              
              button.classList.remove('bg-gray-800');
              button.classList.add('bg-purple-800');
              
              // Update filter and re-render
              currentFilter = button.textContent.toLowerCase();
              renderEvents(events);
          });
          if (closeModalButton) {
            closeModalButton.addEventListener('click', closeModal);  // Add the event listener to close the modal
        }
      });

      // Register buttons
      registerButtons.forEach(button => {
          button.addEventListener('click', handleRegisterClick);
      });

      // Form submission
      registrationForm.addEventListener('submit', handleFormSubmit);
  }

  // Handle register button clicks
  function handleRegisterClick(e) {
    const eventName = e.currentTarget.getAttribute('data-event');
    const eventId = e.currentTarget.getAttribute('data-event-id');
    eventTitleElement.textContent = eventName;
    currentEventIdElement.value = eventId;
    openModal();
}
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Check if user is logged in first
    const userId = await getCurrentUserId();
    if (!userId) {
        // User is not logged in - show message and redirect to login
        alert('Please log in to register for events');
        // Store the event info in sessionStorage so we can return to it after login
        const eventId = currentEventIdElement.value;
        const eventTitle = eventTitleElement.textContent;
        sessionStorage.setItem('pendingEventRegistration', JSON.stringify({
            eventId,
            eventTitle
        }));
        // Redirect to login page
        window.location.href = '/login-register?mode=login&redirect=events';
        return;
    }
    
    const formData = {
        eventId: currentEventIdElement.value,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        university: document.getElementById('university').value,
        phone: document.getElementById('phone').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        teamSize: document.getElementById('teamSize').value,
        specialRequirements: document.getElementById('specialRequirements').value,
        needsAccommodation: document.getElementById('accomodaion').checked
    };
    
    try {
        // Show loading state
        const submitBtn = registrationForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Create request payload
        const requestPayload = {
            userId,
            eventId: formData.eventId,
            teamSize: parseInt(formData.teamSize),
            specialRequirements: formData.specialRequirements,
            needsAccommodation: formData.needsAccommodation
        };
        
        // If accommodation is needed, add accommodation details
        if (formData.needsAccommodation) {
            requestPayload.accommodation = {
                reqDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
                noOfPeople: parseInt(formData.teamSize), // Use team size as the number of people
                userID: userId,
                // accommodationID will be assigned by the server based on availability
            };
        }
        
        const response = await fetch('/events/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPayload)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        // Show confirmation with real registration ID
        registrationIdElement.textContent = data.registrationCode || 'Registration successful!';
        
        // If accommodation was requested, show accommodation info in the confirmation
        const accommodationInfoDiv = document.getElementById('accommodation-info');
        if (formData.needsAccommodation && accommodationInfoDiv) {
            // Show the accommodation info section
            accommodationInfoDiv.classList.remove('hidden');
            
            // Add accommodation request ID if available
            if (data.accommodationRequestId) {
                const requestIdElement = document.createElement('p');
                requestIdElement.className = 'text-white text-sm mt-2';
                requestIdElement.innerHTML = `<strong>Request ID:</strong> <span class="font-mono">${data.accommodationRequestId}</span>`;
                accommodationInfoDiv.appendChild(requestIdElement);
            }
        } else if (accommodationInfoDiv) {
            // Make sure it's hidden if accommodation wasn't requested
            accommodationInfoDiv.classList.add('hidden');
        }
        
        // Close registration modal and show confirmation
        closeModal();
        openConfirmationModal();
        
        // Reset form
        registrationForm.reset();
        
        // Log success for debugging
        console.log('Registration successful:', data);
        
    } catch (error) {
        console.error('Registration error:', error);
        
        // Create or update an error message element
        const errorElement = document.getElementById('form-error') || 
            createErrorElement('form-error', registrationForm);
            
        errorElement.textContent = error.message || 'An error occurred during registration';
        errorElement.classList.remove('hidden');
        
        // Scroll to error message
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
        // Restore the button state
        const submitBtn = registrationForm.querySelector('button[type="submit"]');
        submitBtn.textContent = originalBtnText || 'Complete Registration';
        submitBtn.disabled = false;
    }
}

// Helper function to create an error element
function createErrorElement(id, parentElement) {
    const errorDiv = document.createElement('div');
    errorDiv.id = id;
    errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
    
    const closeButton = document.createElement('span');
    closeButton.className = 'absolute top-0 right-0 px-4 py-3';
    closeButton.innerHTML = '&times;';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => errorDiv.classList.add('hidden');
    
    errorDiv.appendChild(closeButton);
    
    // Insert at the top of the form
    parentElement.insertBefore(errorDiv, parentElement.firstChild);
    
    return errorDiv;
}

  // Helper function to get current user ID (implement based on your auth system)
  async function getCurrentUserId() {
    try {
      // Get the user data from localStorage
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        console.warn('User not logged in or user data not found in localStorage');
        return null;
      }
      
      // Parse the user data JSON
      const user = JSON.parse(userData);
      
      // Check if user has an ID property (could be id, userId, or user_id)
      if (user.id) {
        return user.id;
      } else if (user.userId) {
        return user.userId;
      } else if (user.user_id) {
        return user.user_id;
      }
      
      // If we don't find a recognized ID format, log a warning
      console.warn('User ID not found in user data:', user);
      return null;
    } catch (error) {
      console.error('Error retrieving user ID:', error);
      return null;
    }
}

  // Fixed modal overlay click handlers
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', function(e) {
          // Only close if clicking directly on the overlay (not a child element)
          if (e.target === overlay) {
              if (overlay.parentElement.id === 'registrationModal') {
                  closeModal();
              } else if (overlay.parentElement.id === 'confirmationModal') {
                  closeConfirmationModal();
              }
          }
      });
  });

  // // Prevent clicks inside modal content from closing the modal
  document.querySelectorAll('.modal-content').forEach(content => {
      content.addEventListener('click', function(e) {
          e.stopPropagation();  // Prevent the click event from reaching the overlay
      });
  });
  const featuredRegisterBtn = document.querySelector('.register-btn-featured');
  if (featuredRegisterBtn) {
      featuredRegisterBtn.addEventListener('click', function () {
          // Optional: Trigger same register flow
          handleRegisterClick({ currentTarget: featuredRegisterBtn });
      });
  }
  

  // Initialize the page
  init();
  
});

// Add this function to check for pending registrations
function checkPendingRegistration() {
    const pendingRegistration = sessionStorage.getItem('pendingEventRegistration');
    
    if (pendingRegistration) {
        try {
            const { eventId, eventTitle } = JSON.parse(pendingRegistration);
            
            // Clear the pending registration from session storage
            sessionStorage.removeItem('pendingEventRegistration');
            
            // Make sure events are loaded before proceeding
            const checkEventsLoaded = setInterval(() => {
                if (events && events.length > 0) {
                    clearInterval(checkEventsLoaded);
                    
                    // Find the event in our loaded events
                    const event = events.find(e => e.id.toString() === eventId.toString());
                    
                    if (event) {
                        // Trigger the registration modal
                        eventTitleElement.textContent = eventTitle;
                        currentEventIdElement.value = eventId;
                        setTimeout(() => {
                            openModal();
                        }, 500); // Small delay to ensure the page has finished loading
                    }
                }
            }, 100);
        } catch (error) {
            console.error('Error processing pending registration:', error);
        }
    }
}

