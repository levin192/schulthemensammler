import React from 'react';
import {getTheme} from '@fluentui/react';
import {UserActions} from './actions/userControl';


class PageHeader extends React.Component {
  constructor() {
    super();
    this.theme = getTheme();
  }



  render() {
    return (
        <>
          <header style={{boxShadow: this.theme.effects.elevation8}} className="content-container">
            <div style={{width: 100 + '%', paddingTop: 15 + 'px', paddingBottom: 15 + 'px'}} className="header-container">
              <div className="header-title"><b>SchulthemenSammler</b></div>
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