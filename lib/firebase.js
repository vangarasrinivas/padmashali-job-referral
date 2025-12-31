
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXjzRF_SN1TlG6fqBmjoD7inHhwJRlxMs",
  authDomain: "padmashali-job-referral-415ee.firebaseapp.com",
  projectId: "padmashali-job-referral-415ee",
  storageBucket: "padmashali-job-referral-415ee.firebasestorage.app",
  messagingSenderId: "577969713162",
  appId: "1:577969713162:web:df47ffcd501a719eaa2ff3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
console.log({ auth })

export { db, auth };

