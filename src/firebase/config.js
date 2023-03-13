import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAuYcsHdPw8u_pneEgaGf6RILcQkcGIrZM",
    authDomain: "muse-ic-blog.firebaseapp.com",
    projectId: "muse-ic-blog",
    storageBucket: "muse-ic-blog.appspot.com",
    messagingSenderId: "524723889720",
    appId: "1:524723889720:web:fdfb7644bae3312eaee8cd"
  };

//initialize firebase
firebase.initializeApp(firebaseConfig)

//init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

//timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { projectFirestore, projectAuth, projectStorage, timestamp }