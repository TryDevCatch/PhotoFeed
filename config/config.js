import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAzcj_tNAc7yfY_nDJX3xXw092tw3Zp2Sc",
    authDomain: "photo-feed-d3565.firebaseapp.com",
    projectId: "photo-feed-d3565",
    storageBucket: "photo-feed-d3565.appspot.com",
    messagingSenderId: "29680218424",
    appId: "1:29680218424:web:cbb5a5c2bb9c0d5f0011cd",
    measurementId: "G-5PL4J2LXFN",
    databaseURL: "https://photo-feed-d3565-default-rtdb.firebaseio.com/"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const f = firebase;
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();