import { DefaultButton, PrimaryButton } from "@fluentui/react";
import React from "react";
import { Link } from "react-router-dom";

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <h1>Placeholder home</h1>
        <Link to="/login">
          <PrimaryButton text="Login" />
        </Link>
        <Link to="/register">
          <DefaultButton text="Register" />
        </Link>
      </div>
    );
  }
}

export default HomePage;
