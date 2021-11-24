import React from 'react';
import {Store} from '../../../helpers/Store';
import {MessageBar, MessageBarType, Pivot, PivotItem, PrimaryButton, TextField} from '@fluentui/react';
import FirebaseDataProvider from '../../../helpers/Firebasedataprovider';
import SchoolDayPicker from './SchoolDayPickerComponent';
import {UserAdministration} from './UserAdministration';

class SettingsPage extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {
      username: '',
      oldUsername: '',
      firstname: '',
      lastname: '',
      email: '',
      isAdmin: false,
      dataUpdated: false,
      messageBarText: '',
      usernameUsed: false,
      allUsernames: []
    }
  }
  componentDidMount = () => {
    document.title = '📅 | Einstellungen ✏️'
    this.asyncUser().then(r => this.getAllUsernames(), error => {
      this.setState((state) => {
        state.dataUpdated = 'Error'
        state.messageBarText = error.message
        console.error(error.message)
        return state;
      });
    })
  }
  asyncUser = async () => {
    return await this.getUser()
  }
  getUser() {
    return new Promise(resolve => {
      const userId = this.fb.firebase.auth().currentUser.uid
      const userEmail = this.fb.firebase.auth().currentUser.email
      const docRef = this.fb.firebase.firestore().collection('Users').doc(userId)
      docRef.get().then((thisDoc) => {
        if (thisDoc.exists) {
          const userDoc = thisDoc.data()
          this.setState(state => {
            state.username = userDoc.username
            state.oldUsername = userDoc.username
            state.firstname = userDoc.firstname
            state.lastname = userDoc.lastname
            state.isAdmin = userDoc.isAdmin
            state.email = userEmail
            return state;
          })
          resolve(true)
        }
      })
    });
  }
  handleInputChange = (inputEl) => {
    this.setState((state) => {
      state[inputEl.target.id] = inputEl.target.value;
      return state;
    });
  };
  getAllUsernames = () => {
    if (!this.state.allUsernames.includes(this.state.username)) {
      this.fb.firebase.firestore().collection('Users').get().then((snapshot) => {
        snapshot.forEach((userDoc) => {
          const username = userDoc.data().username
          this.state.allUsernames.push(username)
        })
      })
    }
  }
  saveSettings = (event) => {
    event.preventDefault();
    const userId = this.fb.firebase.auth().currentUser.uid
    const username = this.state.username
    const firstname = this.state.firstname
    const lastname = this.state.lastname
    const email = this.state.email
    const allUsernames = this.state.allUsernames
    if (allUsernames.includes(username) || this.state.oldUsername === username) {
      this.setState((state) => {
        state.dataUpdated = 'Error'
        state.messageBarText = 'Username bereits vergeben!'
        return state;
      });
    } else {
      this.fb.firebase.firestore().collection('Users').doc(userId).update({
        username,
        firstname,
        lastname,
        email,
      }).then(() => {
        this.state.allUsernames.filter(()=>{})
        this.state.allUsernames.push(username)
        this.setState((state) => {
          state.dataUpdated = true
          state.messageBarText = 'Daten erfolgreich gespeichert!'
          return state;
        });
      }, error => {
        this.setState((state) => {
          state.dataUpdated = 'Error'
          state.messageBarText = error.message
          console.error(error.message)
          return state;
        });
      })
    }
  }
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

                {this.state.dataUpdated === 'Error' ? (
                    <MessageBar messageBarType={MessageBarType.error}>
                      {this.state.messageBarText}
                    </MessageBar>
                ) : (this.state.dataUpdated ? (
                    <MessageBar messageBarType={MessageBarType.success}>
                      {this.state.messageBarText}
                    </MessageBar>
                ) : null)}
              </PivotItem>
              {this.state.isAdmin ? (
                  <PivotItem headerText="Administration" itemIcon="CalendarSettings">
                    <h1>Kalender Einstellungen</h1>
                    <SchoolDayPicker/>
                    <UserAdministration userList={this.state.allUsernames}/>
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
    )
  }
  static contextType = Store;
}

export default SettingsPage;

