import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/register/components/RegisterPage";
import LoginPage from "./pages/login/components/LoginPage";
import PageHeader from "./globalComponents/PageHeader";
import PageFooter from "./globalComponents/PageFooter";
import { Store } from "./helpers/Store";
import FirebaseDataProvider from "./helpers/Firebasedataprovider";
import { Navigate } from "react-router";
import CalendarPage from "./pages/calendar/components/CalendarPage";
import SettingsPage from "./pages/settings/components/SettingsPage";
import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";
import HomePage from "./pages/home/components/HomePage";

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
    this.checkUserAuth();
  };

  checkUserDoc = () => {
    const userId = this.fb.firebase.auth().currentUser.uid;
    this.fb.firebase
      .firestore()
      .collection("Users")
      .doc(userId)
      .onSnapshot((doc) => {
        this.setState((state) => {
          state.userDoc = { ...state.userDoc, ...doc.data() };
          state.userDocChecked = true;
          return state;
        });
      });
  };

  checkUserAuth = () => {
    this.fb.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState((state) => {
          state.loggedIn = true;
          state.userName = user.email;
          state.isRegisteredUser = true;
          state.userDoc = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
          };
          return state;
        });
        this.checkUserDoc();
      } else {
        this.setState((state) => {
          state.isRegisteredUser = false;
          state.loggedIn = true;
          state.userDocChecked = true;
          return state;
        });
      }
    });
  };

  render() {
    if (!(this.state.userDocChecked && this.state.loggedIn)) {
      return <ProgressIndicator />;
    }
    return (
      <Store.Provider value={this.state}>
        <Router>
          <PageHeader userDoc={this.state.userDoc} />
          <main className="content-container main-container">
            <Routes>
              <Route
                path="/register"
                exact
                element={
                  <>
                    <RegisterPage />
                  </>
                }
              />
              <Route
                path="/login"
                exact
                element={
                  <>
                    <LoginPage />
                  </>
                }
              />
              <Route
                path="/"
                exact
                element={
                  <>
                    <HomePage />
                  </>
                }
              />
              <Route
                path="/calendar"
                exact
                element={
                  <>
                    {!this.state.isRegisteredUser ? (
                      <Navigate to="/" />
                    ) : (
                      <CalendarPage />
                    )}
                  </>
                }
              />
              <Route
                path="/settings"
                exact
                element={
                  <>
                    {!this.state.isRegisteredUser ? (
                      <Navigate to="/" />
                    ) : (
                      <SettingsPage />
                    )}
                  </>
                }
              />
            </Routes>
          </main>
          <PageFooter />
        </Router>
      </Store.Provider>
    );
  }
}

export default App;
