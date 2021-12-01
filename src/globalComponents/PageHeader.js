import React from "react";
import { UserActions } from "./actions/UserActions";

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
                  {" "}
                  <img
                      style={{width: "32px", height: "32px"}}
                      alt=""
                      src="data:image/png;base64,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"
                  />
                </a>
              </div>
              ()
              <div className="header-classes">

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
