import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDwGqfOJ1i-z0pYSz_TQw6kcZ9tGQkspQ4",
  authDomain: "hr-management-f4891.firebaseapp.com",
  projectId: "hr-management-f4891",
  storageBucket: "hr-management-f4891.appspot.com",
  messagingSenderId: "951614092840",
  appId: "1:951614092840:web:f1318720f2852e6214a71d",
  measurementId: "G-MJXSJLKP21"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, analytics };