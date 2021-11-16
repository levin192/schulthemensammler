import fbConfig from './firebaseconfig.json';
import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';


class FirebaseDataProvider {
  constructor() {
    this.config = fbConfig;
    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp(this.config);
    } else {
      this.firebaseApp = firebase.app();
    }

    this.firebase = firebase;
  }

  register = (data) => {
    const email = data.email;
    const password = data.password;
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  // loggedInStatus = () => {
  // }
}

export default FirebaseDataProvider;
