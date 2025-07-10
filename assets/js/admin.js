// Initialize IndexedDB for offline caching
const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('DzikwaTrustDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('donors')) {
          db.createObjectStore('donors', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('leaderboard')) {
          db.createObjectStore('leaderboard', { keyPath: 'rank' });
        }
      };
      
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };
  
  // Cache data for offline use
  const cacheDonorData = async (data) => {
    try {
      const db = await openDB();
      const tx = db.transaction('leaderboard', 'readwrite');
      const store = tx.objectStore('leaderboard');
      
      data.forEach((donor, index) => {
        store.put({
          rank: index + 1,
          ...donor,
          cachedAt: new Date().getTime()
        });
      });
      
      return new Promise((resolve) => {
        tx.oncomplete = () => resolve();
      });
    } catch (error) {
      console.error('Caching failed:', error);
    }
  };
  
  // Load cached data
  const loadCachedLeaderboard = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('leaderboard', 'readonly');
      const store = tx.objectStore('leaderboard');
      const request = store.getAll();
      
      return new Promise((resolve) => {
        request.onsuccess = () => {
          if (request.result.length > 0) {
            document.getElementById('offlineRow').classList.remove('d-none');
            resolve(request.result);
          } else {
            resolve(null);
          }
        };
      });
    } catch (error) {
      return null;
    }
  };
  
  // Leaderboard rendering
  const renderLeaderboard = (data) => {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    data.forEach((donor) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${donor.rank}</td>
        <td>
          <div class="d-flex align-items-center">
            <div class="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
              ${donor.name.charAt(0)}
            </div>
            ${donor.name}
            ${donor.isRecurring ? '<span class="badge bg-success ms-2"><i class="fas fa-sync-alt"></i> Recurring</span>' : ''}
          </div>
        </td>
        <td>$${donor.total.toLocaleString()}</td>
        <td>${Math.floor(donor.total / 30)}</td>
        <td>${new Date(donor.since).toLocaleDateString()}</td>
      `;
      tbody.appendChild(row);
    });
  };
  
  // Online/offline toggle
  document.getElementById('offlineMode').addEventListener('change', function() {
    if (this.checked) {
      loadCachedLeaderboard().then(data => {
        if (data) renderLeaderboard(data);
      });
    } else {
      document.getElementById('offlineRow').classList.add('d-none');
      fetchLiveLeaderboard();
    }
  });
  
  // Fetch live data
  const fetchLiveLeaderboard = () => {
    database.ref('donors')
      .orderByChild('total')
      .limitToLast(10)
      .once('value')
      .then((snapshot) => {
        const donors = [];
        snapshot.forEach((child) => {
          donors.push(child.val());
        });
        
        // Sort descending and rank
        const sorted = donors.sort((a, b) => b.total - a.total)
          .map((donor, index) => ({
            ...donor,
            rank: index + 1
          }));
        
        renderLeaderboard(sorted);
        cacheDonorData(sorted);
      });
  };
  
  // Initialize
  fetchLiveLeaderboard();
  
  // Network status detection
  window.addEventListener('online', () => {
    if (!document.getElementById('offlineMode').checked) {
      fetchLiveLeaderboard();
    }
  });
  
  window.addEventListener('offline', () => {
    const offlineMode = document.getElementById('offlineMode');
    if (!offlineMode.checked) {
      offlineMode.checked = true;
      loadCachedLeaderboard().then(data => {
        if (data) renderLeaderboard(data);
      });
    }
  });

  // Enhanced chart initialization
const initHistoricalTrendsChart = () => {
    const ctx = document.getElementById('trendsChart').getContext('2d');
    
    database.ref('donations').once('value').then((snapshot) => {
      const donationsData = snapshot.val() || {};
      const historyData = Object.entries(donationsData)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12); // Last 12 months
      
      const labels = historyData.map(([month]) => 
        new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      
      const amounts = historyData.map(([, amount]) => amount / 100);
      const childrenSponsored = amounts.map(amount => Math.floor(amount / 30));
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Donation Amount ($)',
              data: amounts,
              borderColor: '#00529B',
              backgroundColor: 'rgba(0, 82, 155, 0.1)',
              yAxisID: 'y',
              tension: 0.3
            },
            {
              label: 'Children Sponsored',
              data: childrenSponsored,
              borderColor: '#28A745',
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              yAxisID: 'y1',
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: { display: true, text: 'Donation Amount ($)' }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: { display: true, text: 'Children Sponsored' },
              grid: { drawOnChartArea: false }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  if (context.datasetIndex === 0) {
                    label += `$${context.raw.toLocaleString()}`;
                  } else {
                    label += `${context.raw} children`;
                  }
                  return label;
                }
              }
            }
          }
        }
      });
    });
  };