import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegisterPage from './pages/register/components/RegisterPage';
import LoginPage from './pages/login/components/LoginPage';
import PageHeader from './globalComponents/PageHeader';
import PageFooter from './globalComponents/PageFooter';
import {Store} from './helpers/Store';
import FirebaseDataProvider from './helpers/Firebasedataprovider';
import {Navigate} from 'react-router';
import CalendarPage from './pages/calendar/components/CalendarPage';
import SettingsPage from './pages/settings/components/SettingsPage';

import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';

class App extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {
      loggedIn: false,
      isRegisteredUser: false,
      userName: null,
      userDoc: null,
      userDocChecked: false,
    };
  }
  componentDidMount = () => {
    this.checkUserAuth()
  }
  checkUserDoc = () => {
    const userId = this.fb.firebase.auth().currentUser.uid

    this.fb.firebase.firestore().collection('Users').doc(userId).onSnapshot((querySnapshot) => {
      // const userDoc = querySnapshot.data()
      // console.log(userDoc)
      this.setState(state => {
        state.userDocChecked = true
        return state;
      })
    })
  }
  checkUserAuth = () => {
    this.fb.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState((state) => {
          state.loggedIn = true
          state.userName = user.email
          state.isRegisteredUser = true
          return state;
        });
        this.checkUserDoc()
      } else {
        this.setState(state => {
          state.isRegisteredUser = false
          state.loggedIn = true;
          state.userDocChecked = true;
          return state;
        })
      }
    })
  }
  render() {
    // console.log(!(this.state.userDocChecked && this.state.loggedIn))
    if (!(this.state.userDocChecked && this.state.loggedIn)) {
      return <ProgressIndicator />
    }
    return (
        <Store.Provider value={this.state}>
          <Router>
            <PageHeader></PageHeader>
            <main className="content-container">
              <Routes>
                <Route
                    path="/register"
                    exact
                    element={
                      <>
                        {this.state.isRegisteredUser ? <Navigate to="/"></Navigate> : (
                            <div>
                              <RegisterPage></RegisterPage>
                            </div>
                        )}
                      </>
                    }
                ></Route>
                <Route
                    path="/login"
                    exact
                    element={
                      <>
                        <div>
                          <LoginPage></LoginPage>
                        </div>
                      </>
                    }
                ></Route>
                <Route
                    path="/"
                    exact
                    element={
                      <>
                        <div>
                          <h1>Placeholder home</h1>
                        </div>
                      </>
                    }
                ></Route>
                <Route
                    path="/calendar"
                    exact
                    element={
                      <>
                        <div>
                          <CalendarPage/>
                        </div>
                      </>
                    }
                ></Route>
                <Route
                    path="/settings"
                    exact
                    element={
                      <>
                        <div>
                          <SettingsPage/>
                        </div>
                      </>
                    }
                ></Route>
              </Routes>
            </main>
            <PageFooter></PageFooter>
          </Router>
        </Store.Provider>
    );
  }
}

export default App;
