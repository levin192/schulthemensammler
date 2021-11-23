import React from 'react';
import {Store} from '../../../helpers/Store';
import {PrimaryButton, TextField, Pivot, PivotItem, Spinner} from '@fluentui/react';
import FirebaseDataProvider from '../../../helpers/Firebasedataprovider';
import SchoolDayPicker from "./SchoolDayPickerComponent";

class SettingsPage extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      usernameUsed: false,
    }
    this.allUsernames = []
    console.log(this.allUsernames)
  }

  componentDidMount = () => {
    this.getUser()
    this.getAllUsernames()
  }

  getUser = () => {
    const userId = this.fb.firebase.auth().currentUser.uid
    const userEmail = this.fb.firebase.auth().currentUser.email

    this.fb.firebase.firestore().collection('Users').doc(userId).onSnapshot((querySnapshot) => {
      const userDoc = querySnapshot.data()

      this.setState(state => {
        state.username = userDoc.username
        state.firstname = userDoc.firstname
        state.lastname = userDoc.lastname
        state.email = userEmail
        return state;
      })
    })
  }

  handleInputChange = (inputEl) => {
    this.setState((state) => {
      state[inputEl.target.id] = inputEl.target.value;
      return state;
    });
  };

  getAllUsernames = () => {
    this.fb.firebase.firestore().collection('Users').get().then((snapshot) => {
      snapshot.forEach((userDoc) => {
        const username = userDoc.data().username
        this.allUsernames.push(username)
      })
    })
  }

  saveSettings = (event) => {
    event.preventDefault();
    const userId = this.fb.firebase.auth().currentUser.uid
    const username = this.state.username
    const firstname = this.state.firstname
    const lastname = this.state.lastname
    const email = this.state.email
    const allUsernames = this.allUsernames

    this.getAllUsernames()

    console.log(allUsernames)

    allUsernames.forEach((usernames) => {
      if (usernames === username) {
        alert('Username bereits vergeben')
      } else {
        this.fb.firebase.firestore().collection('Users').doc(userId).update({
          username,
          firstname,
          lastname,
          email,
        }).then(() => {})
      }
    })
  }


  render() {
    if (this.context.loggedIn) {
      return (
          <>
            <Pivot aria-label="Count and Icon Pivot Example">
              <PivotItem headerText="Daten" itemIcon="PlayerSettings">
                <h1>Benutzer Settings</h1>
                <form onSubmit={this.saveSettings}>
                  <TextField
                      id="username"
                      label={'Username'}
                      value={this.state.username}
                      onChange={this.handleInputChange}
                      placeholder={'Username'}
                  />
                  <TextField
                      id="firstname"
                      label={'Vorname'}
                      value={this.state.firstname}
                      onChange={this.handleInputChange}
                      placeholder={'Vorname'}
                  />
                  <TextField
                      id="lastname"
                      label={'Nachname'}
                      value={this.state.lastname}
                      placeholder={'Nachname'}
                      onChange={this.handleInputChange}
                  />
                  <TextField
                      id="email"
                      label={'E-Mail'}
                      value={this.state.email}
                      placeholder={'E-Mail'}
                      onChange={this.handleInputChange}
                  />

                  <br/>
                  <PrimaryButton text="Speichern" type="submit"/>

                </form>
              </PivotItem>
              <PivotItem headerText="Administration" itemIcon="CalendarSettings">
                <h1>Kalender Einstellungen</h1>
                <SchoolDayPicker/>
              </PivotItem>
            </Pivot>

          </>
      );
    }
    return (
        <>
          <h1>tba</h1>
        </>
    )
  }

  static contextType = Store;
}

export default SettingsPage;

