import React from 'react';
import FirebaseDataProvider from '../../../helpers/Firebasedataprovider';
import {Store} from '../../../helpers/Store'
import {CalendarComponent} from './CalendarComponent'
import {TextField} from "@fluentui/react";

class CalendarPage extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {};
  }

  componentDidMount = () => {
    // document.getElementById('borris').classList.remove('ani')
  }

  render() {
    if (this.context.loggedIn) {
      return (
          <>
            <h1>Kalender</h1>
            <div id="borris" className=" calendar">
                <h1>Schultage auswählen</h1>
                <CalendarComponent/>
            </div>
          </>
      );
    }
    return (
        <>
          <h1>tba</h1>
        </>
    )
  }

  static contextType = Store;
}
export default CalendarPage;
