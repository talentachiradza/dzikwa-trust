// Load news articles for homepage
function loadNewsArticles(containerId, limit = 3) {
    const dbRef = firebase.database().ref('news').orderByChild('date').limitToLast(limit);
    const container = document.getElementById(containerId);
    
    dbRef.once('value').then((snapshot) => {
        container.innerHTML = '';
        const newsData = [];
        
        snapshot.forEach((childSnapshot) => {
            newsData.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        
        // Sort by date (newest first)
        newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        newsData.forEach(news => {
            const newsDate = new Date(news.date);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            
            const newsCard = `
                <div class="col-lg-4 col-md-6" data-aos="fade-up">
                    <div class="news-card h-100">
                        <div class="news-image">
                            <img src="${news.imageUrl}" alt="${news.title}" class="img-fluid">
                            <div class="news-date">
                                <span class="day">${newsDate.getDate()}</span>
                                <span class="month">${monthNames[newsDate.getMonth()]}</span>
                            </div>
                        </div>
                        <div class="news-content p-4">
                            <h3><a href="news-detail.html?id=${news.id}">${news.title}</a></h3>
                            <p>${news.summary}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <a href="news-detail.html?id=${news.id}" class="read-more">Read More <i class="fas fa-arrow-right ms-2"></i></a>
                                <span class="badge bg-primary">${news.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', newsCard);
        });
    }).catch((error) => {
        console.error("Error loading news:", error);
        container.innerHTML = '<div class="col-12 text-center py-4"><p>Unable to load news at this time.</p></div>';
    });
}

// Load more news for news.html page
function loadMoreNews(containerId) {
    // Similar to loadNewsArticles but with pagination
}

// Load single news article for news-detail.html
function loadNewsArticle(newsId) {
    const dbRef = firebase.database().ref(`news/${newsId}`);
    
    dbRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const news = snapshot.val();
            const newsDate = new Date(news.date);
            
            document.getElementById('news-title').textContent = news.title;
            document.getElementById('breadcrumb-title').textContent = news.title;
            document.getElementById('news-date').textContent = `Posted on: ${newsDate.toLocaleDateString()}`;
            document.getElementById('news-full-date').textContent = `Posted on: ${newsDate.toLocaleDateString()}`;
            document.getElementById('news-category').textContent = news.category;
            document.getElementById('news-detail-image').src = news.imageUrl;
            document.getElementById('news-detail-image').alt = news.title;
            document.getElementById('news-full-content').innerHTML = news.content;
        } else {
            window.location.href = 'news.html';
        }
    });
}

// Load comments for a news article
function loadComments(newsId) {
    const dbRef = firebase.database().ref(`newsComments/${newsId}`).orderByChild('approved').equalTo(true);
    const container = document.getElementById('comments-container');
    
    dbRef.once('value').then((snapshot) => {
        container.innerHTML = '';
        
        if (!snapshot.exists()) {
            container.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
            return;
        }
        
        snapshot.forEach((childSnapshot) => {
            const comment = childSnapshot.val();
            const commentDate = new Date(comment.timestamp * 1000);
            
            const commentHtml = `
                <div class="comment mb-4">
                    <div class="d-flex justify-content-between mb-2">
                        <strong>${comment.name}</strong>
                        <small class="text-muted">${commentDate.toLocaleDateString()}</small>
                    </div>
                    <p>${comment.comment}</p>
                    <hr>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', commentHtml);
        });
    });
}

// Submit a new comment
function submitComment(newsId) {
    const name = document.getElementById('comment-name').value;
    const email = document.getElementById('comment-email').value;
    const comment = document.getElementById('comment-text').value;
    
    if (!name || !comment) return;
    
    const newComment = {
        name,
        email: email || '',
        comment,
        timestamp: Math.floor(Date.now() / 1000),
        approved: false // Set to true if you want auto-approval
    };
    
    const dbRef = firebase.database().ref(`newsComments/${newsId}`).push();
    dbRef.set(newComment)
        .then(() => {
            alert('Thank you for your comment! It will be visible after approval.');
            document.getElementById('comment-form').reset();
            loadComments(newsId);
        })
        .catch((error) => {
            console.error("Error submitting comment:", error);
            alert('There was an error submitting your comment. Please try again.');
        });
}

// Load reactions for a news article
function loadReactions(newsId) {
    const dbRef = firebase.database().ref(`newsReactions/${newsId}`);
    
    dbRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const reactions = snapshot.val();
            document.getElementById('like-count').textContent = reactions.like || 0;
            document.getElementById('love-count').textContent = reactions.love || 0;
            document.getElementById('celebrate-count').textContent = reactions.celebrate || 0;
        }
    });
}

// Submit a reaction
function submitReaction(newsId, reactionType) {
    const dbRef = firebase.database().ref(`newsReactions/${newsId}/${reactionType}`);
    
    dbRef.transaction((currentValue) => {
        return (currentValue || 0) + 1;
    }).then(() => {
        loadReactions(newsId);
    });
}

// Admin functions
function loadAdminNews() {
    const dbRef = firebase.database().ref('news').orderByChild('date');
    const tableBody = document.querySelector('#news-table tbody');
    
    dbRef.once('value').then((snapshot) => {
        tableBody.innerHTML = '';
        
        snapshot.forEach((childSnapshot) => {
            const news = childSnapshot.val();
            const newsDate = new Date(news.date);
            
            const row = `
                <tr>
                    <td>${news.title}</td>
                    <td><span class="badge bg-primary">${news.category}</span></td>
                    <td>${newsDate.toLocaleDateString()}</td>
                    <td><span class="badge ${news.status === 'published' ? 'bg-success' : 'bg-warning'}">${news.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-news" data-id="${childSnapshot.key}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-news" data-id="${childSnapshot.key}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            
            tableBody.insertAdjacentHTML('beforeend', row);
        });
        
        // Set up edit buttons
        document.querySelectorAll('.edit-news').forEach(button => {
            button.addEventListener('click', function() {
                const newsId = this.getAttribute('data-id');
                editNewsArticle(newsId);
            });
        });
        
        // Set up delete buttons
        document.querySelectorAll('.delete-news').forEach(button => {
            button.addEventListener('click', function() {
                const newsId = this.getAttribute('data-id');
                showDeleteConfirmation(newsId);
            });
        });
    });
}

function saveNewsArticle() {
    // Implementation for saving/updating news articles
}

function editNewsArticle(newsId) {
    // Implementation for editing news articles
}

function showDeleteConfirmation(newsId) {
    // Implementation for delete confirmation
}