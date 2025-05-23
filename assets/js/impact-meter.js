document.addEventListener('DOMContentLoaded', function() {
    // Reference to Firebase nodes
    const donationsRef = firebase.database().ref('donations');
    const goalsRef = firebase.database().ref('goals/current');
    
    // Current month key (e.g. "2023-11")
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Initialize with default goal
    let currentGoal = 100; // Default fallback
    
    // Fetch current goal
    goalsRef.on('value', (snapshot) => {
      currentGoal = snapshot.val() || 100;
      updateImpactMeter();
    });
    
    // Listen for real-time donation updates
    donationsRef.child(currentMonth).on('value', (snapshot) => {
      const monthlyTotal = snapshot.val() || 0;
      updateImpactMeter(monthlyTotal);
    });
    
    // Handle new donations
    function logDonation(amount) {
      const updates = {};
      updates[`donations/${currentMonth}`] = firebase.database.ServerValue.increment(amount);
      
      firebase.database().ref().update(updates)
        .then(() => console.log("Donation logged"))
        .catch((error) => console.error("Error logging donation:", error));
    }
    
    // Update meter display
    function updateImpactMeter(total = 0) {
      const percentage = Math.min(Math.floor((total / (currentGoal * 30)) * 100, 100));
      const progressBar = document.getElementById('impactProgress');
      const percentageDisplay = document.getElementById('impactPercentage');
      
      // Smooth animation
      let currentWidth = parseInt(progressBar.style.width) || 0;
      const animate = () => {
        currentWidth += (percentage - currentWidth) * 0.1; // Easing
        progressBar.style.width = `${currentWidth}%`;
        percentageDisplay.textContent = `${Math.round(currentWidth)}%`;
        
        if (Math.abs(currentWidth - percentage) > 0.5) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
      
      // Update goal text
      const childrenSponsored = Math.floor(total / 30);
      document.getElementById('impactGoal').innerHTML = `
        <i class="fas fa-bullseye"></i> 
        ${childrenSponsored}/${currentGoal} children sponsored this month
        <span class="badge bg-success ms-2">LIVE</span>
      `;
    }
    
    // Connect to donation form
    document.getElementById('donationForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('amount').value);
      logDonation(amount);
      // ... process payment ...
    });
  });