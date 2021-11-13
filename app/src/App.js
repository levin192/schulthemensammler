import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/register/components/RegisterPage";
import LoginPage from "./pages/login/components/LoginPage";

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
