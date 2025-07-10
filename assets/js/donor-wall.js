
document.addEventListener('DOMContentLoaded', function() {
    const donorWall = document.getElementById('donorWallContainer');
    let page = 1;
    
    function fetchDonors() {
        fetch(`api/donors.php?page=${page}`)
            .then(response => response.json())
            .then(data => {
                data.donors.forEach(donor => {
                    donorWall.innerHTML += `
                        <div class="col-6 col-md-3 mb-4">
                            <div class="donor-card text-center p-3">
                                <div class="donor-avatar bg-primary text-white rounded-circle mx-auto mb-3">
                                    ${donor.initials}
                                </div>
                                <h3 class="h6 mb-1">${donor.name}</h3>
                                <p class="small text-muted mb-1">$${donor.amount}</p>
                                <p class="small text-muted">${donor.time_ago}</p>
                            </div>
                        </div>
                    `;
                });
                
                if (!data.has_more) {
                    document.getElementById('loadMoreDonors').style.display = 'none';
                }
            });
    }
    
    document.getElementById('loadMoreDonors').addEventListener('click', function() {
        page++;
        fetchDonors();
    });
    
    // Initial load
    fetchDonors();
    
    // Simulate live updates (in real app, use WebSockets)
    setInterval(() => {
        if (page === 1) fetchDonors();
    }, 30000);
});