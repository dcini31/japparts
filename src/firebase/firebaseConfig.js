import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAeG4sPEBxEOhwKRMpc715_3fL6RlaxaBA',
  authDomain: 'japparts-store.firebaseapp.com',
  projectId: 'japparts-store',
  storageBucket: 'japparts-store.appspot.com',
  messagingSenderId: '986753404184',
  appId: '1:986753404184:web:75a5f69125db826e21626d'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)


export{
  db,
  auth
}


