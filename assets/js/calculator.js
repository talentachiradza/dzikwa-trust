document.addEventListener('DOMContentLoaded', function() {
    const amountSlider = document.getElementById('donationAmount');
    const amountValue = document.getElementById('amountValue');
    const frequencySelect = document.getElementById('donationFrequency');
    const impactResult = document.getElementById('calculatedImpact');
    const impactDescription = document.getElementById('impactDescription');
    const donateBtn = document.getElementById('donateNowBtn');

    const impacts = [
        { 
            threshold: 5, 
            unit: 'meal', 
            calc: amount => Math.floor(amount/2.5),
            descriptions: {
                'one-time': 'Will provide %count% %unit% for a child',
                'monthly': 'Every month will provide %count% %unit%',
                'quarterly': 'Every 3 months will provide %count% %unit%',
                'yearly': 'Every year will provide %count% %unit%'
            }
        },
        { 
            threshold: 25, 
            unit: 'school notebook', 
            calc: amount => Math.floor(amount/3),
            descriptions: {
                'one-time': 'Will supply %count% %unit%',
                'monthly': 'Monthly notebooks for %count% students',
                'quarterly': 'Quarterly notebooks for %count% classes',
                'yearly': 'Yearly notebooks for %count% grades'
            }
        },
        { 
            threshold: 50, 
            unit: 'uniform item', 
            calc: amount => Math.floor(amount/50),
            descriptions: {
                'one-time': 'Will provide %count% uniform %unit%',
                'monthly': 'Monthly uniform support for %count% children',
                'quarterly': 'Quarterly uniform support for %count% children',
                'yearly': 'Yearly uniform support for %count% children'
            }
        },
        { 
            threshold: 100, 
            unit: 'month of education', 
            calc: amount => Math.floor(amount/100),
            descriptions: {
                'one-time': 'Will fund %count% %unit% of schooling',
                'monthly': 'Monthly education support for %count% children',
                'quarterly': 'Quarterly education support for %count% children',
                'yearly': 'Yearly education support for %count% children'
            }
        },
        { 
            threshold: 300, 
            unit: 'full sponsorship', 
            calc: amount => Math.floor(amount/300),
            descriptions: {
                'one-time': 'Will partially sponsor %count% children',
                'monthly': 'Monthly full sponsorship for %count% children',
                'quarterly': 'Quarterly full sponsorship for %count% children',
                'yearly': 'Yearly full sponsorship for %count% children'
            }
        }
    ];

    function updateImpact() {
        const amount = parseInt(amountSlider.value);
        const frequency = frequencySelect.value;

        let displayAmount = amount;
        if (frequency === 'yearly') displayAmount *= 12;
        if (frequency === 'quarterly') displayAmount *= 3;

        let selectedImpact = impacts[0];
        for (let i = impacts.length - 1; i >= 0; i--) {
            if (displayAmount >= impacts[i].threshold) {
                selectedImpact = impacts[i];
                break;
            }
        }

        const count = selectedImpact.calc(displayAmount);
        const unit = count === 1 ? selectedImpact.unit : selectedImpact.unit + 's';

        impactResult.textContent = `${count} ${unit}`;

        const template = selectedImpact.descriptions[frequency];
        const description = template
            .replace('%count%', count)
            .replace('%unit%', unit);
        impactDescription.textContent = description;

        donateBtn.innerHTML = `Donate $${amount}`;
        if (frequency !== 'one-time') {
            const freqText = frequency.replace('ly', '');
            donateBtn.innerHTML += ` <small>per ${freqText}</small>`;
        }

        const amountField = document.getElementById('amount');
        if (amountField) amountField.value = amount;
    }

    amountSlider.addEventListener('input', function() {
        amountValue.textContent = `$${this.value}`;
        updateImpact();
    });

    frequencySelect.addEventListener('change', updateImpact);

    updateImpact();

    if (window.location.hash === '#calculator') {
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }
});

// Add to calculator.js
const recurringToggle = document.getElementById('recurringToggle');
const frequencyBtns = document.querySelectorAll('.frequency-btn');

recurringToggle.addEventListener('change', function() {
    document.getElementById('recurringCalendar').style.display = 
        this.checked ? 'block' : 'none';
    updateImpact();
});

frequencyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        frequencyBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        frequencySelect.value = this.dataset.frequency;
        updateCalendarPreview();
        updateImpact();
    });
});

function updateCalendarPreview() {
    const nextDate = new Date();
    const frequency = document.querySelector('.frequency-btn.active').dataset.frequency;
    
    if (frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
    if (frequency === 'quarterly') nextDate.setMonth(nextDate.getMonth() + 3);
    if (frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
    
    document.querySelector('.calendar-date').textContent = 
        nextDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
}

// Add to calculator.js
function updateImpactMeter(amount) {
    const percentage = Math.min(Math.floor((amount / 3000) * 100), 100);
    const progressBar = document.getElementById('impactProgress');
    const percentageDisplay = document.getElementById('impactPercentage');
    
    // Animate progress
    let currentWidth = parseInt(progressBar.style.width) || 0;
    const animate = () => {
        currentWidth += 2;
        progressBar.style.width = `${currentWidth}%`;
        percentageDisplay.textContent = `${currentWidth}%`;
        
        if (currentWidth < percentage) {
            requestAnimationFrame(animate);
        }
    };
    
    animate();
    
    // Update goal text
    const childrenSponsored = Math.floor(amount / 30);
    document.getElementById('impactGoal').innerHTML = `
        <i class="fas fa-bullseye"></i> 
        ${childrenSponsored} child${childrenSponsored !== 1 ? 'ren' : ''} sponsored this month
    `;
}

// Call this within updateImpact():
updateImpactMeter(amount);

// Add to calculator.js or new file
function initAllocationChart() {
    const ctx = document.getElementById('allocationChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Education', 'Nutrition', 'Skills', 'Admin'],
            datasets: [{
                data: [60, 20, 15, 5],
                backgroundColor: [
                    '#00529B',
                    '#FFC107',
                    '#28A745',
                    '#6C757D'
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 20
                    }
                }
            }
        }
    });

    document.querySelectorAll('.allocation-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const category = this.dataset.category;
            const value = parseInt(this.value);
            document.querySelector(`.allocation-value[data-category="${category}"]`).textContent = `${value}%`;
            
            // Update chart
            const index = chart.data.labels.indexOf(category.charAt(0).toUpperCase() + category.slice(1));
            chart.data.datasets[0].data[index] = value;
            chart.update();
        });
    });
}

// Initialize on DOM load
initAllocationChart();

// Add to calculator.js
function updateMilestones(totalDonated) {
    const milestones = document.querySelectorAll('.milestone');
    let highestCompleted = 0;
    
    milestones.forEach(ms => {
        const amount = parseInt(ms.dataset.amount);
        if (totalDonated >= amount) {
            ms.classList.add('active');
            highestCompleted = amount;
        } else {
            ms.classList.remove('active');
        }
    });
    
    // Update progress bar
    const nextMilestone = document.querySelector('.milestone:not(.active)');
    const nextAmount = nextMilestone ? parseInt(nextMilestone.dataset.amount) : 5000;
    const progress = (totalDonated / nextAmount) * 100;
    document.querySelector('.milestone-progress .progress-bar').style.width = `${progress}%`;
    
    // Show message if new milestone reached
    if (highestCompleted > 0) {
        const message = document.getElementById('milestoneMessage');
        message.innerHTML = `<strong>Congratulations!</strong> `;
        
        if (highestCompleted === 1000) {
            message.innerHTML += `We've provided 1,000 meals together!`;
        } 
        // Add other milestone messages
        
        message.style.display = 'block';
        setTimeout(() => message.style.display = 'none', 5000);
    }
}

// Simulate total donated (in real app, fetch from server)
let totalDonated = 1250;
updateMilestones(totalDonated);

// Update on donation
function simulateCommunityImpact(amount) {
    totalDonated += amount;
    updateMilestones(totalDonated);
}