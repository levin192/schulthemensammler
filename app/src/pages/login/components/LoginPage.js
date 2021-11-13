import React from "react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";

class LoginPage extends React.Component {
  constructor(params) {
    super(params);
    this.fb = new FirebaseDataProvider();
    this.state = {
      email: "",
      password: "",
    };
  }

  handleInputChange = (inputEl) => {
    this.setState((state) => {
      state[inputEl.target.id] = inputEl.target.value;

      return state;
    });
  };

  loginUser = () => {
    console.log("ewa");
  };

  render() {
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
            autoComplete="new-password"
            label="Passwort"
            type="password"
            canRevealPassword
            revealPasswordAriaLabel="Passwort anzeigen"
            onChange={this.handleInputChange}
          />

          <PrimaryButton text="Anmelden" type="submit" />
        </form>
      </>
    );
  }
}

export default LoginPage;
