function loadAdminUI(role) {
    // Role-based UI rendering
    const db = firebase.database();
    
    // Common elements for all admins
    let html = `
      <h1>Dzikwa Trust Admin</h1>
      <div class="card">
        <h3>Donation Summary</h3>
        <div id="donation-stats"></div>
      </div>
    `;
    
    // Superadmin-only features
    if (role === 'superadmin') {
      html += `
        <div class="card">
          <h3>Admin Management</h3>
          <button id="add-admin">Add New Admin</button>
          <div id="admin-list"></div>
        </div>
      `;
    }
    
    document.getElementById('admin-content').innerHTML = html;
    
    // Load data based on permissions
    db.ref('donations').limitToLast(3).on('value', snapshot => {
      // Update donation stats
    });
    
    if (role === 'superadmin') {
      db.ref('admins').on('value', snapshot => {
        // Render admin list
      });
    }
  }