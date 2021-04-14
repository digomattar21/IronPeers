import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBqS08nO70uPezbz9dR6NJN1877rif3X7w",
    authDomain: "irondump-2e48e.firebaseapp.com",
    projectId: "irondump-2e48e",
    storageBucket: "irondump-2e48e.appspot.com",
    messagingSenderId: "1008020923960",
    appId: "1:1008020923960:web:54c68e9f52ee74c66168cd",
    measurementId: "G-L1F0XLBBDC"
  };

const fireBaseApp = firebase.initializeApp(firebaseConfig);
const db = fireBaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider, db};