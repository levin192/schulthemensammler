import React from "react";
import { Store } from "../../../helpers/Store";
import {
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  PrimaryButton,
  TextField
} from "@fluentui/react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import SchoolDayPicker from "./SchoolDayPickerComponent";
import { UserAdministration } from "./UserAdministration";

class SettingsPage extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {
      username: "",
      oldUsername: "",
      firstname: "",
      lastname: "",
      email: "",
      isAdmin: false,
      showMessageBar: false,
      messageBarText: "",
      usernameUsed: false,
      allUserDocs: undefined,
      isFormChanged: false
    };
  }
  componentDidMount = () => {
    document.title = "📅 | Einstellungen ✏️";
    this.setLocaleUserDocStates();
    this.setAllUserDocs();
  };

  getAllUserDocs = async () => {
    const snapshot = await this.fb.firebase
      .firestore()
      .collection("Users")
      .get();
    return snapshot.docs.map((doc) => doc.data());
  };

  setAllUserDocs = () => {
    this.getAllUserDocs().then((docs) =>
      this.setState((state) => {
        state.allUserDocs = docs;
        console.log(this.state.allUserDocs);
        return state;
      })
    );
  };

  handleInputChange = (inputEl) => {
    this.setState((state) => {
      state[inputEl.target.id] = inputEl.target.value;
      state.isFormChanged = true;
      return state;
    });
  };

  setLocaleUserDocStates = () => {
    this.setState((state) => {
      state.username = this.context.userDoc.username;
      state.firstname = this.context.userDoc.firstname;
      state.lastname = this.context.userDoc.lastname;
      state.email = this.context.userDoc.email;
      state.isAdmin = this.context.userDoc.isAdmin;
      return state;
    });
  };

  isUsernameAlreadyTaken = async (username) => {
    if (username === this.context.userDoc.username) {
      return false;
    }

    const x = await this.fb.firebase
      .firestore()
      .collection("Users")
      .where("username", "==", username)
      .get();
    return x.docs.length !== 0;
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
        state.showMessageBar = "Error";
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
          email
        })
        .then(
          () => {
            this.setState((state) => {
              state.showMessageBar = true;
              state.messageBarText = "Daten erfolgreich gespeichert!";
              return state;
            });
          },
          (error) => {
            this.setState((state) => {
              state.showMessageBar = "Error";
              state.messageBarText = error.message;
              console.error(error.message);
              return state;
            });
          }
        );
    }
  };

  render() {
    if (this.context.loggedIn) {
      return (
        <>
          <Pivot aria-label="Settings Pivot">
            <PivotItem headerText="Daten" itemIcon="PlayerSettings">
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

              {this.state.showMessageBar === "Error" ? (
                <MessageBar messageBarType={MessageBarType.error}>
                  {this.state.messageBarText}
                </MessageBar>
              ) : this.state.showMessageBar ? (
                <MessageBar messageBarType={MessageBarType.success}>
                  {this.state.messageBarText}
                </MessageBar>
              ) : null}
            </PivotItem>
            {this.state.isAdmin ? (
              <PivotItem
                headerText="Administration"
                itemIcon="CalendarSettings"
              >
                <h1>Kalender Einstellungen</h1>
                <SchoolDayPicker />
                <UserAdministration userList={this.state.allUserDocs} />
              </PivotItem>
            ) : null}
            <PivotItem headerText="Statistiken" itemIcon="Diagnostic">
              <h1>Statistiken</h1>
            </PivotItem>
          </Pivot>
        </>
      );
    }
    return (
      <>
        <h1>tba</h1>
      </>
    );
  }
  static contextType = Store;
}

export default SettingsPage;
