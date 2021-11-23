import React from 'react';
import {UserActions} from './actions/UserActions';


class PageHeader extends React.Component {
  render() {
    return (
        <>
          <header className="content-container">
            <div style={{width: 100 + '%', paddingTop: 15 + 'px', paddingBottom: 15 + 'px'}} className="header-container">
              <div className="header-title"><a href="/">SchulthemenSammler</a></div>
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