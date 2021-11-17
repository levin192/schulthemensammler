import React from 'react';
import FirebaseDataProvider from '../../../helpers/Firebasedataprovider';
import {Calendar, ICalendarDayProps, defaultCalendarStrings} from '@fluentui/react';
import {Store} from '../../../helpers/Store'
import {CalendarInlineCustomDayCellRefExample} from './CalendarComponent'

class CalendarPage extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.customDays = (element, date, classNames) => {
      console.log(element + ' ' + date + ' ' + classNames)
      if (element) {
        element.title = 'custom title from customDayCellRef: ' + date.toString();
        if (date.getDay() === 0 || date.getDay() === 6) {
          classNames.dayOutsideBounds && element.classList.add(classNames.dayOutsideBounds);
          console.log(element)
          //(element.children[0] as HTMLButtonElement).disabled = true;
        }
      }
    };
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
            <CalendarInlineCustomDayCellRefExample/>
            <div id="borris" className=" calendar">

              <Calendar
                  highlightSelectedMonth
                  showGoToToday
                  onSelectDate={console.log('Borans Mudder sagt Hallo')}
                  strings={defaultCalendarStrings}
                  calendarDayProps={this.customDays}
              />
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
