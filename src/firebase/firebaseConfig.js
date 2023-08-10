import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA_FBxy9EzX9idb_talGEHrpoHMqssgfGk",
    authDomain: "react-blog-app-dc7f0.firebaseapp.com",
    databaseURL: "https://react-blog-app-dc7f0-default-rtdb.firebaseio.com",
    projectId: "react-blog-app-dc7f0",
    storageBucket: "react-blog-app-dc7f0.appspot.com",
    messagingSenderId: "566162356677",
    appId: "1:566162356677:web:9fa4cef62b52343b5633ac"
};

const app = initializeApp(firebaseConfig);

const database = getFirestore();

const auth = getAuth();

export {database as default, auth, signInWithEmailAndPassword}