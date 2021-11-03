import fbConfig from 'firebaseconfig.json'

class Firebasedataprovider {
  constructor() {
    this.config = fbConfig;
    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp(this.config);
    } else {
      this.firebaseApp = firebase.app();
    }
  }
}