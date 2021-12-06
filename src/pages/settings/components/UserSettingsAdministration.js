import React from "react";
import {
  PrimaryButton,
  TextField,
  MessageBar,
  MessageBarType,
} from "@fluentui/react/";
import { Store } from "../../../helpers/Store";


class UserSettingsAdministration extends React.Component {
  constructor(props) {
    super(props);
    this.fb = this.props.fireBase
    this.state = {
       username: "",
       firstname: "",
       lastname: "",
       email: "",
      showMessageBar: false,
      messageBarText: "",
      isFormChanged: false,
      messageBarType: null,
      usernameUsed: false,
    }
  }

  componentDidMount = () => {
    this.setLocaleUserDocStates();
  };


  setLocaleUserDocStates = () => {
    this.setState((state) => {
      state.username = this.context.userDoc.username;
      state.firstname = this.context.userDoc.firstname;
      state.lastname = this.context.userDoc.lastname;
      state.email = this.context.userDoc.email;
      return state;
    });
  };

  isUsernameAlreadyTaken = async (username) => {
    if (username === this.context.userDoc.username) {
      return false;
    }

    const response = await this.fb.firebase
    .firestore()
    .collection("Users")
    .where("username", "==", username)
    .get();

    return response.docs.length !== 0;
  };

  saveSettings = async (event) => {
    event.preventDefault();
    const userId = this.context.userDoc.uid;
    const username = this.state.username;
    const firstname = this.state.firstname;
    const lastname = this.state.lastname;
    const email = this.state.email;
    const isUsernameAlreadyTaken = await this.isUsernameAlreadyTaken(username);

    if (isUsernameAlreadyTaken) {
      this.setState((state) => {
        state.showMessageBar = true;
        state.messageBarType = "error";
        state.messageBarText = "Username bereits vergeben!";
        return state;
      });
    } else {
      this.fb.firebase
      .firestore()
      .collection("Users")
      .doc(userId)
      .update({
        username,
        firstname,
        lastname,
        email,
      })
      .then(
          () => {
            this.setState((state) => {
              state.showMessageBar = true;
              state.messageBarType = "success";
              state.messageBarText = "Daten erfolgreich gespeichert!";
              return state;
            });
          },
          (error) => {
            this.setState((state) => {
              state.showMessageBar = true;
              state.messageBarType = "error";
              state.messageBarText = error.message;
              return state;
            });
          }
      );
    }
  };

  handleInputChange = (inputEl) => {
    this.setState((state) => {
      state[inputEl.target.id] = inputEl.target.value;
      state.isFormChanged = true;
      return state;
    });
  };


  render() {
    return (
        <>
          <h1>Benutzer Settings</h1>
          <form onSubmit={this.saveSettings}>
            <TextField
                id="username"
                label={"Username"}
                value={this.state.username}
                onChange={this.handleInputChange}
                placeholder={"Username"}
                required
            />
            <TextField
                id="firstname"
                label={"Vorname"}
                value={this.state.firstname}
                onChange={this.handleInputChange}
                placeholder={"Vorname"}
                required
            />
            <TextField
                id="lastname"
                label={"Nachname"}
                value={this.state.lastname}
                placeholder={"Nachname"}
                onChange={this.handleInputChange}
                required
            />
            <TextField
                id="email"
                label={"E-Mail"}
                value={this.state.email}
                placeholder={"E-Mail"}
                onChange={this.handleInputChange}
            />
            <br />
            <PrimaryButton
                text="Speichern"
                type="submit"
                disabled={!this.state.isFormChanged}
            />
          </form>

          {this.state.showMessageBar ? (
              <MessageBar
                  messageBarType={
                    this.state.messageBarType === "error"
                        ? MessageBarType.error
                        : MessageBarType.success
                  }
              >
                {this.state.messageBarText}
              </MessageBar>
          ) : null}
        </>
    );
  }
  static contextType = Store;
}
export default UserSettingsAdministration;
