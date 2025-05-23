// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef1234567890"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Auth state listener
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // Check if user is admin
      firebase.database().ref(`admins/${user.uid}`).once('value')
        .then(snapshot => {
          if (snapshot.exists()) {
            loadAdminUI(snapshot.val().role);
          } else {
            window.location.href = '/unauthorized.html';
          }
        });
    } else {
      window.location.href = '/login.html';
    }
  });