import React, {useEffect, useState} from 'react';
import {Store} from '../../../helpers/Store';
import {PrimaryButton, TextField} from '@fluentui/react';
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
    }
  }

  componentDidMount = () => {
    this.getUser()
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

  saveSettings = (event) => {
    event.preventDefault();
    const userId = this.fb.firebase.auth().currentUser.uid
    const username = this.state.username
    const firstname = this.state.firstname
    const lastname = this.state.lastname
    const email = this.state.email

    this.fb.firebase.firestore().collection('Users').doc(userId).update({
      username,
      firstname,
      lastname,
      email,
    }).then(() => {
      this.setState((state) => {
        state.username = username
        state.firstname = firstname
        state.lastname = lastname
        state.email = email
        return state;
      });
      alert('Successfully updated data')
    })

  }


  render() {
    if (this.context.loggedIn) {
      return (
          <>
            <h1>Benutzer Settings</h1>
            <form onSubmit={this.saveSettings}>
              <TextField
                  id="username"
                  label={'Username'}
                  value={this.state.username}
                  onChange={this.handleInputChange}
                  placeholder={'username'}
              />
              <TextField
                  id="firstname"
                  label={'Vorname'}
                  value={this.state.firstname}
                  onChange={this.handleInputChange}
                  placeholder={'firstname'}
              />
              <TextField
                  id="lastname"
                  label={'Nachname'}
                  value={this.state.lastname}
                  placeholder={'lastname'}
                  onChange={this.handleInputChange}
              />
              <TextField
                  id="email"
                  label={'E-Mail'}
                  value={this.state.email}
                  placeholder={'E-Mail'}
                  onChange={this.handleInputChange}
              />

              {/*<TextField*/}
              {/*    label="E-Mail"*/}
              {/*    id="name"*/}
              {/*    autoComplete="new-email"*/}
              {/*    type="text"*/}
              {/*/>*/}

              <br/>
              <h1>Kalender Einstellungen</h1>

              <SchoolDayPicker/>

              <br/>
              <PrimaryButton text="Speichern" type="submit"/>

            </form>
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

