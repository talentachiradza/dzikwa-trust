// Initialize Firebase (get config from Firebase console)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "dzikwa-trust.firebaseapp.com",
    databaseURL: "https://dzikwa-trust.firebaseio.com",
    projectId: "dzikwa-trust",
    storageBucket: "dzikwa-trust.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();