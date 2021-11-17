import React from 'react';


class PageFooter extends React.Component {


  render() {
    return (
        <>
          <footer>
            <div className="content-container">
              <div style={{textAlign: 'center', width: '100%'}}>
                <i>gemacht {new Date().getFullYear()}</i>
              </div>
            </div>
          </footer>
        </>
    );
  }
}

export default PageFooter;