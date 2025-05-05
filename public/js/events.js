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

  // Initialize the page
  function init() {
      renderEvents(events);
      setupEventListeners();
  }
  async function fetchEvents() {
    try {
        const response = await fetch('/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        events = await response.json();
        renderEvents(events);
    } catch (error) {
        console.error('Error:', error);
        // Fallback to sample data if API fails
        // events = getSampleEvents();
        // renderEvents(events);
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
            <div class="h-48 ${event.bg_color} relative overflow-hidden">
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
        // In a real app, you would get userId from the session
        const userId = await getCurrentUserId(); // You need to implement this
        
        const response = await fetch('/api/events/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // If using JWT
            },
            body: JSON.stringify({
                userId,
                eventId: formData.eventId,
                teamSize: formData.teamSize,
                specialRequirements: formData.specialRequirements,
                needsAccommodation: formData.needsAccommodation
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }
        
        const data = await response.json();
        
        // Show confirmation with real registration ID
        registrationIdElement.textContent = data.registrationCode;
        
        // Close registration modal and show confirmation
        closeModal();
        openConfirmationModal();
        
        // Reset form
        registrationForm.reset();
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message);
    }
}
  // Helper function to get current user ID (implement based on your auth system)
  async function getCurrentUserId() {
    // This is a placeholder - implement based on your authentication system
    // For example, if you're using JWT:
    // const token = localStorage.getItem('token');
    // const decoded = jwtDecode(token);
    // return decoded.userId;
    
    // For now, return a dummy value
    return 1;
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

