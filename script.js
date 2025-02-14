let isLoggedIn = false;

// Service Request Form Submission
document.getElementById('service-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const serviceType = document.getElementById('service-type').value;
    const serviceTime = document.getElementById('service-time').value;
    const priceRange = document.getElementById('price-range').value;
    const details = document.getElementById('details').value;

    // Simulate API call for service request submission
    setTimeout(() => {
        showToast(`Service request submitted:\nType: ${serviceType}\nTime: ${serviceTime}\nPrice Range: ${priceRange}\nDetails: ${details}`, 'success');
        closeModal();
        resetForm('service-form');
    }, 1000);
});

// Filter Providers Form Submission
document.getElementById('filter-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const location = document.getElementById('location').value.toLowerCase();
    const priceMin = parseFloat(document.getElementById('price-min').value) || 0;
    const priceMax = parseFloat(document.getElementById('price-max').value) || Infinity;
    filterProviders(location, priceMin, priceMax);
});

// Providers Data
const providers = [
    { name: 'John Doe', service: 'Plumbing', rating: 4.5, location: 'Cape Town', price: 100, 
      contact: '555-0100', description: 'Experienced plumber with 10 years in the field. Specializes in residential and commercial plumbing.' },
    { name: 'Jane Smith', service: 'Cleaning', rating: 4.8, location: 'Johannesburg', price: 150, 
      contact: '555-0200', description: 'Professional cleaner with eco-friendly products. Available for one-time or recurring services.' },
    { name: 'Alice Johnson', service: 'Electrical', rating: 4.7, location: 'Durban', price: 200, 
      contact: '555-0300', description: 'Certified electrician with expertise in both residential and industrial installations.' },
    { name: 'Bob Brown', service: 'Plumbing', rating: 4.3, location: 'Pretoria', price: 90, 
      contact: '555-0400', description: 'Affordable plumbing services with quick response times and quality workmanship.' }
];

// Filter Providers Function
function filterProviders(location, priceMin, priceMax) {
    const providersList = document.getElementById('providers-list');
    providersList.innerHTML = '<div class="loading-spinner"></div>';

    setTimeout(() => {
        const filteredProviders = providers.filter(provider => {
            return provider.location.toLowerCase().includes(location) &&
                provider.price >= priceMin &&
                provider.price <= priceMax;
        });

        providersList.innerHTML = '';

        if (filteredProviders.length === 0) {
            providersList.innerHTML = '<p class="no-results">No providers found. Try adjusting your filters.</p>';
        } else {
            filteredProviders.forEach(provider => {
                const providerDiv = document.createElement('div');
                providerDiv.classList.add('provider-card');
                providerDiv.innerHTML = `
                    <h3>${provider.name}</h3>
                    <p><strong>Service:</strong> ${provider.service}</p>
                    <p class="rating">${generateStarRating(provider.rating)}</p>
                    <p><strong>Location:</strong> ${provider.location}</p>
                    <p><strong>Price:</strong> R${provider.price}/hr</p>
                    <p class="description">${provider.description}</p>
                    <div class="provider-actions">
                        <button class="btn-primary" onclick="contactProvider('${provider.contact}')">Contact</button>
                        <button class="btn-secondary" onclick="showMoreInfo('${provider.name}', '${provider.service}', ${provider.price}, '${provider.description}')">More Info</button>
                    </div>
                `;
                providersList.appendChild(providerDiv);
            });
        }
    }, 1000);
}

// Generate Star Rating
function generateStarRating(rating) {
    const fullStars = '★'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '⯨' : '';
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return `<span class="stars">${fullStars}${halfStar}${emptyStars}</span> (${rating.toFixed(1)})`;
}

// Contact Provider
function contactProvider(contactNumber) {
    showToast(`Contacting provider at ${contactNumber}...`, 'info');
    setTimeout(() => {
        showToast(`Connected to provider!`, 'success');
    }, 2000);
}

// Show More Info Modal
function showMoreInfo(name, service, price, description) {
    const moreInfoContent = document.getElementById('more-info-content');
    moreInfoContent.innerHTML = `
        <h3>${name}</h3>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Base Price:</strong> R${price}/hr</p>
        <p>${description}</p>
    `;

    openModal('more-info-modal');

    document.getElementById('submit-request').onclick = function () {
        const immediateService = document.getElementById('immediate-service').checked;
        const bookableService = document.getElementById('bookable-service').checked;
        const notes = document.getElementById('service-notes').value;
        
        showToast(`Request submitted!\nImmediate: ${immediateService ? 'Yes' : 'No'}\nBookable: ${bookableService ? 'Yes' : 'No'}\nNotes: ${notes || 'None'}`, 'success');
        closeModal();
    };
}

// Modal Management
const modals = {
    'request-modal': document.getElementById('request-modal'),
    'profile-modal': document.getElementById('profile-modal'),
    'more-info-modal': document.getElementById('more-info-modal')
};

function openModal(modalId) {
    modals[modalId].style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeModal() {
    Object.values(modals).forEach(modal => {
        modal.style.display = 'none';
        if(modal.id === 'more-info-modal') {
            document.getElementById('immediate-service').checked = false;
            document.getElementById('bookable-service').checked = false;
            document.getElementById('service-notes').value = '';
        }
    });
    document.body.classList.remove('modal-open');
}

// Login/Logout Functionality
document.getElementById('login-button').onclick = function () {
    isLoggedIn = true;
    document.getElementById('login-button').classList.add('hidden');
    document.getElementById('logout-button').classList.remove('hidden');
    showToast('Logged in successfully!', 'success');
};

document.getElementById('logout-button').onclick = function () {
    isLoggedIn = false;
    document.getElementById('login-button').classList.remove('hidden');
    document.getElementById('logout-button').classList.add('hidden');
    showToast('Logged out successfully!', 'info');
};

// Profile Picture Upload
document.getElementById('profile-pic-upload').onchange = function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profile-pic-img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// Profile Form Submission
document.getElementById('profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    showToast('Profile updated successfully!', 'success');
    closeModal();
});

// Toast Notifications
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Reset Form
function resetForm(formId) {
    document.getElementById(formId).reset();
}

// Initial Load
filterProviders('', 0, Infinity);

// Event Listeners for Modals
document.getElementById('open-request-modal').addEventListener('click', () => openModal('request-modal'));
document.getElementById('open-profile-modal').addEventListener('click', () => openModal('profile-modal'));
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', closeModal);
});
window.addEventListener('click', (e) => {
    if(e.target.classList.contains('modal')) closeModal();
});

// Responsive Menu Toggle
document.getElementById('menu-toggle').addEventListener('click', () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('login-modal');
    const loginButton = document.getElementById('login-button');
    const closeButtons = document.querySelectorAll('.close-button');
    const serviceTime = document.getElementById('service-time');
    const dateTimePicker = document.getElementById('date-time-picker');
    const serviceDateTime = document.getElementById('service-date-time');

    // Initialize flatpickr for date and time picker
    flatpickr(serviceDateTime, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });

    // Show/Hide date and time picker based on service time selection
    serviceTime.addEventListener('change', function() {
        if (this.value === 'scheduled') {
            dateTimePicker.style.display = 'block';
        } else {
            dateTimePicker.style.display = 'none';
        }
    });

    // Open login modal
    loginButton.addEventListener('click', function() {
        loginModal.style.display = 'block';
    });

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Register as User or Business
    document.getElementById('register-user').addEventListener('click', function() {
        alert('Redirect to User Registration Page');
    });

    document.getElementById('register-business').addEventListener('click', function() {
        alert('Redirect to Business Registration Page');
    });

    // Handle search functionality
    document.getElementById('search-button').addEventListener('click', function() {
        const searchQuery = document.getElementById('search-input').value;
        alert('Search for: ' + searchQuery);
    });

    // Handle filter form submission
    document.getElementById('filter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const location = document.getElementById('location').value;
        const distance = document.getElementById('distance').value;
        const serviceType = document.getElementById('service-type-filter').value;
        const priceMin = document.getElementById('price-min').value;
        const priceMax = document.getElementById('price-max').value;
        alert(`Filters Applied: Location - ${location}, Distance - ${distance}km, Service Type - ${serviceType}, Price Range - ${priceMin} to ${priceMax}`);
    });
});
