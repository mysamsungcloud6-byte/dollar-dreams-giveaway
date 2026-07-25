// Admin Dashboard JavaScript

// Check authentication
if (!isAuthenticated()) {
  window.location.href = 'login.html';
}

// Menu navigation
document.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = link.getAttribute('data-section');
    
    // Remove active class from all links and sections
    document.querySelectorAll('.menu-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    // Add active class to clicked link and corresponding section
    link.classList.add('active');
    document.getElementById(sectionId).classList.add('active');
    
    // Load data for the section
    if (sectionId === 'overview') {
      loadOverview();
    } else if (sectionId === 'entries') {
      loadEntries();
    } else if (sectionId === 'prizes') {
      loadPrizes();
    }
  });
});

// Load overview data
async function loadOverview() {
  try {
    const response = await fetchWithAuth(`${API_URL}/admin/analytics`);
    const data = await response.json();
    
    document.getElementById('totalEntries').textContent = data.totalEntries || 0;
    document.getElementById('selectedEntries').textContent = data.selectedEntries || 0;
    document.getElementById('totalPrizes').textContent = data.prizeCounts.length || 0;
    
    let activityHTML = '<p>Statistics for this giveaway:</p><ul style="margin-top: 1rem;">';
    activityHTML += `<li>Total entries submitted: ${data.totalEntries}</li>`;
    activityHTML += `<li>Winners selected: ${data.selectedEntries}</li>`;
    activityHTML += `<li>Prize categories: ${data.prizeCounts.length}</li>`;
    activityHTML += '</ul>';
    
    document.getElementById('activityMessage').innerHTML = activityHTML;
  } catch (error) {
    console.error('Error loading overview:', error);
    document.getElementById('activityMessage').textContent = 'Error loading data';
  }
}

// Load entries
async function loadEntries() {
  try {
    const response = await fetchWithAuth(`${API_URL}/entries`);
    const entries = await response.json();
    
    const tbody = document.getElementById('entriesTable');
    
    if (entries.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No entries yet</td></tr>';
      return;
    }
    
    tbody.innerHTML = entries.map(entry => `
      <tr>
        <td>${entry.name}</td>
        <td>${entry.email}</td>
        <td>${entry.phone}</td>
        <td>${formatDate(entry.createdAt)}</td>
        <td>${entry.selected ? '<span style="color: green; font-weight: bold;">✓ Winner</span>' : '<span style="color: gray;">Pending</span>'}</td>
        <td>
          <button class="btn btn-small btn-success" onclick="markAsWinner('${entry._id}')">Mark Winner</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading entries:', error);
    document.getElementById('entriesTable').innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading entries</td></tr>';
  }
}

// Load prizes
async function loadPrizes() {
  try {
    const response = await fetchWithAuth(`${API_URL}/prizes`);
    const prizes = await response.json();
    
    const tbody = document.getElementById('prizesTable');
    
    if (prizes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No prizes added yet</td></tr>';
      return;
    }
    
    tbody.innerHTML = prizes.map(prize => `
      <tr>
        <td>${prize.title}</td>
        <td>${prize.category}</td>
        <td>$${prize.value ? prize.value.toLocaleString() : '0'}</td>
        <td>${prize.quantity || 1}</td>
        <td><span style="color: green;">Active</span></td>
        <td>
          <button class="btn btn-small btn-danger" onclick="deletePrize('${prize._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading prizes:', error);
    document.getElementById('prizesTable').innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading prizes</td></tr>';
  }
}

// Select random winner
async function selectWinner() {
  try {
    const response = await fetchWithAuth(`${API_URL}/admin/select-winner`, {
      method: 'POST'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to select winner');
    }
    
    const winnerResult = document.getElementById('winnerResult');
    const winnerInfo = document.getElementById('winnerInfo');
    
    winnerInfo.innerHTML = `
      <p><strong>Name:</strong> ${data.winner.name}</p>
      <p><strong>Email:</strong> ${data.winner.email}</p>
      <p><strong>Phone:</strong> ${data.winner.phone}</p>
      <p><strong>Selected at:</strong> ${formatDate(data.winner.updatedAt)}</p>
    `;
    
    winnerResult.style.display = 'block';
    showNotification('Winner selected successfully!');
    
    // Reload entries
    setTimeout(() => loadEntries(), 1500);
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Mark entry as winner
async function markAsWinner(entryId) {
  try {
    const response = await fetchWithAuth(`${API_URL}/entries/${entryId}`, {
      method: 'PUT',
      body: JSON.stringify({ selected: true })
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark as winner');
    }
    
    showNotification('Entry marked as winner!');
    loadEntries();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Export entries to CSV
async function exportEntries() {
  try {
    const response = await fetchWithAuth(`${API_URL}/admin/export/entries`);
    
    if (!response.ok) {
      throw new Error('Failed to export entries');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'entries.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showNotification('Entries exported successfully!');
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Delete prize
async function deletePrize(prizeId) {
  if (!confirm('Are you sure you want to delete this prize?')) return;
  
  try {
    const response = await fetchWithAuth(`${API_URL}/prizes/${prizeId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete prize');
    }
    
    showNotification('Prize deleted successfully!');
    loadPrizes();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Show add prize form
function showAddPrizeForm() {
  const html = `
    <div style="background: var(--light-bg); padding: 2rem; border-radius: 8px; margin: 1.5rem 0;">
      <h3>Add New Prize</h3>
      <form id="addPrizeForm" style="display: grid; gap: 1rem; margin-top: 1rem;">
        <input type="text" placeholder="Prize Title" id="prizeTitle" required>
        <input type="text" placeholder="Category" id="prizeCategory" required>
        <input type="number" placeholder="Prize Value ($)" id="prizeValue" required>
        <input type="number" placeholder="Quantity" id="prizeQuantity" value="1" required>
        <textarea placeholder="Description" id="prizeDescription" rows="3" required></textarea>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <button type="submit" class="btn btn-success">Add Prize</button>
          <button type="button" class="btn" style="background: #94a3b8;" onclick="this.closest('form').parentElement.remove()">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  const prizesTable = document.getElementById('prizesTable').closest('.table-wrapper');
  prizesTable.insertAdjacentHTML('beforebegin', html);
  
  document.getElementById('addPrizeForm').addEventListener('submit', addPrize);
}

// Add prize
async function addPrize(e) {
  e.preventDefault();
  
  const prizeData = {
    title: document.getElementById('prizeTitle').value,
    category: document.getElementById('prizeCategory').value,
    value: parseInt(document.getElementById('prizeValue').value),
    quantity: parseInt(document.getElementById('prizeQuantity').value),
    description: document.getElementById('prizeDescription').value
  };
  
  try {
    const response = await fetchWithAuth(`${API_URL}/prizes`, {
      method: 'POST',
      body: JSON.stringify(prizeData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add prize');
    }
    
    showNotification('Prize added successfully!');
    e.target.closest('div').remove();
    loadPrizes();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Handle logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    logout();
  }
}

// Load initial data
loadOverview();

console.log('Admin dashboard loaded');
