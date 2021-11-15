import React from 'react';
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
      wasSuccessfull: true,
      shouldRedirect: false,
    };
  }

  handleInputChange = (inputEl) => {
    this.setState((state) => {
      state[inputEl.target.id] = inputEl.target.value;

      return state;
    });
  };

  loginUser = (event) => {
    event.preventDefault();
    console.log('ewa');

    const email = this.state.email;
    const password = this.state.password;

    this.fb.firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          console.log(userCredential);
          console.log('successfully logged in!');
          this.setState((state) => {
            state.shouldRedirect = true;

            return state;
          });
        })
        .catch((error) => {
          this.setState((state) => {
            state.wasSuccessfull = false;
            state.errorMessage = error.message;

            return state;
          });
        });
  };
  logoutUser = () => {
    this.fb.firebase.auth().signOut().then(() => {
      this.setState((state) => {
        state.shouldRedirect = true;
        return state;
      });
    })
  }

  render() {
    if (this.state.shouldRedirect) {
      return <Navigate to="/"></Navigate>;
    }
    if (!this.context.loggedIn) {
      return (
          <>
            <h1>Login</h1>
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

            {this.state.wasSuccessfull ? null : (
                <MessageBar messageBarType={MessageBarType.error}>
                  {this.state.errorMessage}
                </MessageBar>
            )}
          </>
      );
    }
    return (
        <>
          <h1>Login</h1>
          <PrimaryButton text="Abmelden" type="button" onClick={this.logoutUser}/>
        </>
    )
  }

  static contextType = Store;
}

export default LoginPage;
