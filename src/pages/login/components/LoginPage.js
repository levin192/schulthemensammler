import React from 'react';
import {ReactComponent as SideSVG} from '../../../svg/relax.svg';
import FirebaseDataProvider from '../../../helpers/Firebasedataprovider';
import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  TextField,
} from '@fluentui/react';
import {Navigate} from 'react-router';
import {Store} from '../../../helpers/Store'

class LoginPage extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {
      email: '',
      password: '',
      wasSuccessful: true,
      shouldRedirect: false,
    };
  }
  componentDidMount() {
    document.title = '📅 | Anmelden 🪵'
  }
  handleInputChange = (inputEl) => {
    this.setState((state) => {
      state[inputEl.target.id] = inputEl.target.value;
      return state;
    });
  };
  loginUser = (event) => {
    event.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    this.fb.firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          console.log('successfully logged in!');
          this.setState((state) => {
            state.shouldRedirect = true;
            return state;
          });
        })
        .catch((error) => {
          this.setState((state) => {
            state.wasSuccessful = false;
            state.errorMessage = error.message;
            return state;
          });
        });
  };
  logoutUser = () => {
    this.fb.firebase.auth().signOut().then(() => {
      this.context.loggedIn = false // Doesnt work? Bruder wie damit auch navbar ausgeloggt anzeigt...
      this.setState((state) => {
        state.shouldRedirect = true;
        return state;
      });
    })
  }
  render() {
    if (this.state.shouldRedirect) {
      return <Navigate to="/"/>;
    }
    return (
        <>
          <div>
            <h1>Login</h1>
            {(!this.context.isRegisteredUser) ? (
                <form onSubmit={this.loginUser}>
                  <TextField
                      label="E-Mail"
                      id="email"
                      autoComplete="new-email"
                      type="email"
                      required
                      onChange={this.handleInputChange}
                  />
                  <TextField
                      id="password"
                      required
                      autoComplete="current-password"
                      label="Passwort"
                      type="password"
                      canRevealPassword
                      revealPasswordAriaLabel="Passwort anzeigen"
                      onChange={this.handleInputChange}
                  />

                  <PrimaryButton text="Anmelden" type="submit"/>
                </form>
            ) : (<PrimaryButton text="Abmelden" type="button" onClick={this.logoutUser}/>)}
            {this.state.wasSuccessful ? null : (
                <MessageBar messageBarType={MessageBarType.error}>
                  {this.state.errorMessage}
                </MessageBar>
            )}
          </div>
          <div>
            <SideSVG/>
          </div>
        </>
    );
  }
  static contextType = Store;
}

export default LoginPage;
