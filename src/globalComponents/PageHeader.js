import React from 'react';
import {UserActions} from './actions/UserActions';

class PageHeader extends React.Component {
  render() {
    return (
        <>
          <header className="content-container" style={{marginBottom: '25px'}}>
            <div className="header-container">
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