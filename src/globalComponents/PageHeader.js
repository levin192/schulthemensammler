import React from "react";
import { UserActions } from "./actions/UserActions";
import { ReactComponent as LogoSVG } from "../svg/logo.svg";

class PageHeader extends React.Component {
  render() {
    return (
      <>
        <header className="content-container" style={{ marginBottom: "15px" }}>
          <div className="header-container">
            <div className="header-title">
              <a href="/">
                <LogoSVG />
                <span>
                  Schulthemen-
                  <br />
                  sammler
                </span>
              </a>
            </div>
            <div className="header-classes">
              {this.props.userDoc?
                this.props.userDoc.schoolClasses.length > 0
                ? "Deine Klasse/n: " +
                  this.props.userDoc.schoolClasses.join(", ")
                : null : null
              }
            </div>
            <div className="header-actions">
              <UserActions />
            </div>
          </div>
        </header>
      </>
    );
  }
}

export default PageHeader;
