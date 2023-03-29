import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyB8EDS-ZvZUE5hYeCyd0LBMpQsLjZss3ls',
  authDomain: 'ironpeer-3d00e.firebaseapp.com',
  databaseURL: 'https://ironpeer-3d00e-default-rtdb.firebaseio.com',
  projectId: 'ironpeer-3d00e',
  storageBucket: 'ironpeer-3d00e.appspot.com',
  messagingSenderId: '148723689497',
  appId: '1:148723689497:web:8cb4245489baf450d7a288',
  measurementId: 'G-YZPCXRZLX2',
};

const fireBaseApp = firebase.initializeApp(firebaseConfig);
const db = fireBaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = fireBaseApp.storage();

export { auth, provider, db, storage };
