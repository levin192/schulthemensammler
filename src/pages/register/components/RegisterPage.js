import React from "react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import { Navigate } from "react-router";
import { Store } from "../../../helpers/Store"

class RegisterPage extends React.Component {
   static contextType = Store;

   constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {
      email: "",
      password: "",
      wasSuccessful: true,
      errorMessage: "",
      shouldRedirect: false,
    };
  }

  registerUser = async (event) => {
    event.preventDefault();
    const email = this.state.email;
    const password = this.state.password;

    try {
      const data = await this.fb.register({ email, password });
      this.setState((state) => {
        state.shouldRedirect = true;
        return state;
      });
    } catch (error) {
      console.table(error);
      this.setState((state) => {
        state.wasSuccessful = false;
        state.errorMessage = error.message;

        return state;
      });
    }
  };

  handleInputChange = (inputEl) => {
    this.setState((state) => {
      state[inputEl.target.id] = inputEl.target.value;

      return state;
    });
  };

  render() {
    if (this.state.shouldRedirect) {
      return <Navigate to="/"></Navigate>;
    }

    return (
      <>
        <h1>Registrieren</h1>
        <form onSubmit={this.registerUser}>
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
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
            minlength="6"
            title="Mindestens eine Zahl, Groß- und Kleinbuchstaben und mindestens 6 Zeichen"
            required
            autoComplete="new-password"
            label="Passwort"
            type="password"
            canRevealPassword
            revealPasswordAriaLabel="Passwort anzeigen"
            onChange={this.handleInputChange}
          />
          <PrimaryButton text="Registrieren" type="submit" />
        </form>

        {this.state.wasSuccessful ? null : (
          <MessageBar messageBarType={MessageBarType.error}>
            {this.state.errorMessage}
          </MessageBar>
        )}
      </>
    );
  }
}

export default RegisterPage;
