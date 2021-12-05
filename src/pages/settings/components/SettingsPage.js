import React from "react";
import { Store } from "../../../helpers/Store";
import {
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import UserAdministration from "./functions/UserAdministration";
import SchoolClassAdministration from "./SchoolClassAdministration";

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
      allSchoolClassesNames: undefined,
      isFormChanged: false,
      messageBarType: null,
    };
  }
  componentDidMount = () => {
    document.title = "📅 | Einstellungen ✏️";
    this.setLocaleUserDocStates();
    this.getAllUserDocs();
    this.setAllSchoolClassesNames();
  };

  getAllUserDocs = async () => {
    const unsubscribeRealtimeListenerForUsers = await this.fb.firebase
      .firestore()
      .collection("Users")
      .onSnapshot((querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => doc.data());

        this.setState((state) => {
          state.allUserDocs = docs;
          return state;
        });
      });
  };

  getAllSchoolClassesNames = async () => {
    const snapshot = await this.fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .get();

    return snapshot.docs.map((doc) => {
      return {
        name: doc.data().name,
        id: doc.id,
        availableSchoolDays: doc.data().availableSchoolDays,
      };
    });
  };

  setAllSchoolClassesNames = () => {
    this.getAllSchoolClassesNames().then((docs) => {
      console.log("docs", docs);

      this.setState((state) => {
        state.allSchoolClassesNames = docs;
        return state;
      });
    });
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

  render() {
    if (this.context.loggedIn) {
      return (
        <div className="full-width">
          <div>
            <Pivot aria-label="Settings Pivot" className="settings-pivot">
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
              </PivotItem>
              {this.context.userDoc.isAdmin ? (
                <PivotItem headerText="Nutzer Verwaltung" itemIcon="People">
                  <UserAdministration
                    fireBase={this.fb}
                    userList={this.state.allUserDocs}
                    schoolClassList={this.state.allSchoolClassesNames}
                    currentUserName={this.context.userDoc.username}
                  />
                </PivotItem>
              ) : null}
              {this.context.userDoc.isAdmin ? (
                <PivotItem
                  headerText="Klassen Verwaltung"
                  itemIcon="Dictionary"
                >
                  <SchoolClassAdministration
                    fireBase={this.fb}
                    schoolClassList={this.state.allSchoolClassesNames}
                  />
                </PivotItem>
              ) : null}
              <PivotItem headerText="Statistiken" itemIcon="Diagnostic">
                <h1>Statistiken</h1>
                <ul>
                  <li>
                    Nutzer Gesamt:{" "}
                    {this.state.allUserDocs
                      ? this.state.allUserDocs.length
                      : null}
                  </li>
                  <li>
                    Klassen Gesamt:{" "}
                    {this.state.allSchoolClassesNames
                      ? this.state.allSchoolClassesNames.length
                      : null}
                  </li>
                </ul>
              </PivotItem>
            </Pivot>
          </div>
        </div>
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
