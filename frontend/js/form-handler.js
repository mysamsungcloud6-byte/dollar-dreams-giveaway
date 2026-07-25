// Form Handler for Giveaway Entry

const entryForm = document.getElementById('entryForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

if (entryForm) {
  entryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Validate
    if (!name || !email || !phone) {
      showError('Please fill in all fields');
      return;
    }
    
    if (!email.includes('@')) {
      showError('Please enter a valid email address');
      return;
    }
    
    // Submit entry
    try {
      const response = await fetch(`${API_URL}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit entry');
      }
      
      const data = await response.json();
      
      // Show success message
      entryForm.style.display = 'none';
      successMessage.style.display = 'block';
      
      showNotification('Entry submitted successfully!');
    } catch (error) {
      showError(error.message);
      console.error('Error:', error);
    }
  });
}

function showError(message) {
  errorText.textContent = message;
  errorMessage.style.display = 'block';
  showNotification(message, 'error');
}
