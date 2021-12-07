import React from "react";
import { Store } from "../../../helpers/Store";
import {
  Pivot,
  PivotItem,
} from "@fluentui/react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import UserAdministration from "./UserAdministration";
import SchoolClassAdministration from "./SchoolClassAdministration";
import UserSettingsAdministration from "./UserSettingsAdministration";

import {SanitizeSchoolClasses} from "./functions/SanitizeSchoolClasses";

class SettingsPage extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {
      isAdmin: false,
      allUserDocs: undefined,
      allSchoolClassesNames: undefined,
      updatedKey: 1,
    };
  }
  componentDidMount = () => {
    document.title = "📅 | Einstellungen ✏️";
    this.getAllUserDocs();
    this.setAllSchoolClassesNames();
    this.getAllSchoolClassesNames()
      .then(() => {
        SanitizeSchoolClasses(this.fb, this.context.userDoc, this.state.allSchoolClassesNames)
      })
  };

  getAllUserDocs = () => {
    this.fb.firebase
      .firestore()
      .collection("Users")
      .onSnapshot((querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => doc.data());
        const newKey = Math.floor(Math.random() * 100)
        this.setState((state) => {
          state.allUserDocs = docs;
          state.updatedKey = newKey
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
      this.setState((state) => {
        state.allSchoolClassesNames = docs;
        return state;
      });
    });
  };


  render() {
    if (this.context.loggedIn) {
      return (
        <div className="full-width">
          <div>
            <Pivot aria-label="Settings Pivot" className="settings-pivot">
              <PivotItem headerText="Daten" itemIcon="PlayerSettings">
                <UserSettingsAdministration
                    fireBase={this.fb}
                />
              </PivotItem>
              {this.context.userDoc.isAdmin ? (
                <PivotItem headerText="Nutzer Verwaltung" itemIcon="People">
                  <UserAdministration
                    key={this.state.updatedKey}
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
