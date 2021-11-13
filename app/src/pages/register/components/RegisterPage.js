import React from "react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";

class RegisterPage extends React.Component {
  constructor(params) {
    super(params);
    this.fb = new FirebaseDataProvider();
    this.state = {
      email: "",
      password: "",
    };
  }

  componentDidMount = () => {};

  registerUser = async () => {
    const email = this.state.email;
    const password = this.state.password;

    const data = await this.fb.register({ email, password });

    console.log(data);
  };

  handleInputChange = (inputEl) => {
    this.setState((state) => {
      state[inputEl.target.id] = inputEl.target.value;

      return state;
    });
  };

  render() {
    return (
      <>
        <h1>Schulthemensammler</h1>
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
      </>
    );
  }
}

export default RegisterPage;
