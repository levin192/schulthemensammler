import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/register/components/RegisterPage";
import LoginPage from "./pages/login/components/LoginPage";
import PageHeader from "./globalComponents/PageHeader";
import PageFooter from "./globalComponents/PageFooter";
import { Store } from "./helpers/Store";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedIn: true
    };
  }

  render() {
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
                    <div>
                      <RegisterPage></RegisterPage>
                    </div>
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
                path="/kalender"
                exact
                element={
                  <>
                    <div>
                      <h1>Placeholder kalender</h1>
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
