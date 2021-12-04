import React from "react";
import { UserActions } from "./actions/UserActions";
import { ReactComponent as LogoSVG } from "../svg/logo.svg";

class PageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSchoolClasses: [],
    };
  }

  componentDidMount() {
    if (this.props.userDoc) {
      console.log(this.props.userDoc.schoolClasses);
      this.setState((state) => {
        state.userSchoolClasses = this.props.userDoc.schoolClasses;
        return state;
      });
    }
  }

  render() {
    return (
        <>
          <header className="content-container" style={{marginBottom: "15px"}}>
            <div className="header-container">

              <div className="header-title">
                <a href="/">
                  <LogoSVG/>
                  <span>Schulthemen-<br/>sammler</span>
                </a>
              </div>

              <div className="header-classes">
                {(this.state.userSchoolClasses.length > 0) ? "Deine Klasse/n: " + this.props.userDoc.schoolClasses.join(", ") : null}
              </div>
              <div className="header-actions">
                <UserActions/>
              </div>
            </div>
          </header>
        </>
    );
  }
}

export default PageHeader;
