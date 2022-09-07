// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { collection, query, where, doc, getDoc, setDoc, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "****************************",
  authDomain: "**************************",
  databaseURL: "***************************************",
  projectId: "*******************",
  storageBucket: "****************",
  messagingSenderId: "*****************",
  appId: "*************************",
  measurementId: "*****"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

export const auth = getAuth();

export const user = auth.currentUser;

export const queryUser = async(name) => {
    const q = query(collection(db, "players"), where("name", "==", name));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

export const getfirebase_items = async(uid) => {               
    const docRef = doc(db, "players", uid);
    const docSnap = await getDoc(docRef);
                        
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
    // doc.data() will be undefined in this case
        console.log("No such document!");
        return {}
    }
}

export const setNewFirebase_account = async (uid, data) => {
    await setDoc(doc(db, "players", uid), data);
}