import { DetailsList, TextField } from "@fluentui/react";
import React from "react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import { Store } from "../../../helpers/Store";
import CalendarComponent from "./CalendarComponent";

class CalendarPage extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {
      currentSelectedDayString: null,
      currentSelectedDay: null,
      listConfig: {
        groups: [
          {
            key: "deutsch",
            name: "Deutsch",
            startIndex: 0,
            count: 2,
            level: 0,
          },
          {
            key: "englisch",
            name: "Englisch",
            startIndex: 2,
            count: 3,
            level: 0,
          },
        ],

        posts: [
          { key: "a", subject: "a", post: "red" },
          { key: "b", subject: "b", post: "red" },
          { key: "c", subject: "c", post: "blue" },
          { key: "d", subject: "d", post: "blue" },
          { key: "e", subject: "e", post: "blue" },
        ],

        columns: [
          {
            key: "subject",
            name: "Fach",
            fieldName: "subject",
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
          },
          {
            key: "post",
            name: "Eintrag",
            fieldName: "post",
            minWidth: 100,
            maxWidth: 200,
          },
        ],
      },
    };
  }

  componentDidMount() {
    document.title = "📅 | Kalender 📆";
  }

  onCalenderClick = () => {
    alert("ewa");
  };

  render() {
    if (this.context.loggedIn) {
      return (
        <>

          <div>
            <h1>Kalender</h1>
            <div id="calendar" className="calendar">
              <CalendarComponent onCalenderClick={this.onCalenderClick} />
              <TextField
                id={"eintragen"}
                label="Neuer Eintrag"
                multiline
                autoAdjustHeight
              />
            </div>
          </div>
          <div>
            <div>Ausgewählter Tag: {this.state.currentSelectedDayString}</div>
            <DetailsList
              items={this.state.listConfig.posts}
              groups={this.state.listConfig.groups}
              columns={this.state.listConfig.columns}
            />
          </div>
        </>
      );
    } else {
    }
  }

  static contextType = Store;
}
export default CalendarPage;
