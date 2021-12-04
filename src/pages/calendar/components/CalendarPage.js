import {
  DetailsList,
  Dropdown,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import React from "react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import { Store } from "../../../helpers/Store";
import CalendarComponent from "./CalendarComponent";
import { SelectionMode } from "@fluentui/utilities";

class CalendarPage extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {
      schoolClassSubjects: [],
      selectedSubject: null,
      currentSelectedDayId: null,
      schoolClassDocument: null,
      createNewPostConfig: {
        showMessageBar: false,
        messageBarType: "",
        messageBarText: "",
      },

      listConfig: {
        groups: [],
        posts: [],
        columns: [
          {
            key: "subject",
            name: "Fach",
            fieldName: "subject",
            minWidth: 50,
            maxWidth: 100,
            isResizable: true,
          },
          {
            key: "post",
            name: "Eintrag",
            fieldName: "post",
            minWidth: 100,
            maxWidth: 200,
          },
          {
            key: "createdBy",
            name: "Erstellt von",
            fieldName: "createdBy",
            minWidth: 100,
            maxWidth: 200,
          },
          {
            key: "createdAt",
            name: "Erstellt am",
            fieldName: "createdAt",
            minWidth: 100,
            maxWidth: 200,
          },
        ],
      },
    };
  }

  handleInputChange = (inputEl) => {
    this.setState((state) => {
      state[inputEl.target.id] = inputEl.target.value;
      state.isFormChanged = true;
      return state;
    });
  };

  componentDidMount = async () => {
    document.title = "📅 | Kalender 📆";
    this.setTodaysDayId();
    await this.loadSchoolClassDocument();
    this.loadTodaysPosts();
  };

  onCalenderClick = (date) => {
    const dayId = this.getDayId(date);

    this.setState((state) => {
      state.currentSelectedDayId = dayId;
      return state;
    });

    this.loadPosts(dayId);
  };

  sortPostsAndGroups = () => {
    const sortedPosts = this.state.listConfig.posts.sort((a, b) => {
      var nameA = a.subject.toUpperCase(); // Groß-/Kleinschreibung ignorieren
      var nameB = b.subject.toUpperCase(); // Groß-/Kleinschreibung ignorieren
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // Namen müssen gleich sein
      return 0;
    });

    const groups = [];

    let startIndex = 0;
    let currentCounter = 0;
    let currentSubject = sortedPosts[0].subject;

    sortedPosts.forEach((item, index) => {
      if (currentSubject !== item.subject) {
        // NEW SUBJECT!
        groups.push({
          key: currentSubject,
          name: currentSubject,
          level: 0,
          count: currentCounter,
          startIndex: startIndex,
        });

        startIndex += currentCounter;
        currentSubject = item.subject;
        currentCounter = 1;
      } else {
        currentCounter++;
      }

      if (index === sortedPosts.length - 1) {
        groups.push({
          key: currentSubject,
          name: currentSubject,
          level: 0,
          count: currentCounter,
          startIndex: startIndex,
        });
      }
    });

    this.setState((state) => {
      state.listConfig.groups = groups;

      return state;
    });
  };

  loadSchoolClassDocument = async () => {
    const isUserInASchoolClass = () => {
      return this.context.userDoc.schoolClasses[0] !== undefined;
    };

    if (!isUserInASchoolClass()) {
      console.log("user is not in a schoolclass");
      return null;
    }

    const response = await this.fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .where("name", "==", this.context.userDoc.schoolClasses[0])
      .get();

    this.setState((state) => {
      state.schoolClassDocument = response.docs[0];
      return state;
    });

    const array = [];
    this.state.schoolClassDocument.data().subjects.forEach((subject) => {
      array.push({
        key: subject,
        text: subject,
      });
    });

    this.setState((state) => {
      console.log("settings subjects", array);
      state.schoolClassSubjects = array;
      return state;
    });

    return null;
  };

  setTodaysDayId = () => {
    const today = new Date();

    const todaysDayId = this.getDayId(today);

    this.setState((state) => {
      state.currentSelectedDayId = todaysDayId;
      return state;
    });
  };

  loadTodaysPosts = () => {
    this.loadPosts(this.state.currentSelectedDayId);
  };

  addNewPost = () => {
    const selectedSubject = this.state.selectedSubject;
    const postText = this.state.postText;
    const dayId = this.state.currentSelectedDayId;

    this.fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .doc(this.state.schoolClassDocument.id)
      .collection("Posts")
      .doc()
      .set({
        dayId: dayId,
        subject: selectedSubject,
        text: postText,
        createdBy: this.context.userDoc.username,
      })
      .then(() => {
        this.setState((state) => {
          state.createNewPostConfig.showMessageBar = true;
          state.createNewPostConfig.messageBarType = "success";
          state.createNewPostConfig.messageBarText =
            "Neuen Eintrag erfolgreich hinzugefügt.";

          return state;
        });
      })
      .catch((error) => {
        this.setState((state) => {
          state.createNewPostConfig.showMessageBar = true;
          state.createNewPostConfig.messageBarType = "error";
          state.createNewPostConfig.messageBarText = error.message;

          return state;
        });
      });
  };

  handleChangeDropdownChange = (x, item) => {
    this.setState((state) => {
      state.selectedSubject = item.text;
      return state;
    });
  };

  getDayId = (date) => {
    const dayId = `${date.getDate()}${
      date.getMonth() + 1
    }${date.getFullYear()}`;

    return dayId;
  };

  loadPosts = async (dayId) => {
    const response = await this.fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .doc(this.state.schoolClassDocument.id)
      .collection("Posts")
      .where("dayId", "==", dayId)
      .get();

    if (response.docs.length === 0) {
      console.log("No Posts available!");
      return null;
    }

    const array = [];
    response.forEach((docs) => {
      array.push({
        subject: docs.data().subject,
        post: docs.data().text,
        createdBy: docs.data().createdBy,
        createdAt: "placeholder",
      });
    });

    this.setState((state) => {
      state.listConfig.posts = array;
      return state;
    });

    this.sortPostsAndGroups();
  };

  render() {
    if (this.context.loggedIn) {
      return (
        <>
          <div>
            <h1>Kalender</h1>
            <div id="calendar" className="calendar">
              <CalendarComponent onCalenderClick={this.onCalenderClick} />
              <Dropdown
                options={this.state.schoolClassSubjects}
                onChange={this.handleChangeDropdownChange}
                label="Fach auswählen"
                style={{ maxWidth: "300px" }}
              />
              <TextField
                disabled={this.state.selectedSubject === null}
                id={"postText"}
                label="Neuer Eintrag"
                onChange={this.handleInputChange}
                multiline
                autoAdjustHeight
              />

              <PrimaryButton
                text="Neuen Eintrag hinzufügen"
                onClick={this.addNewPost}
              />
              {this.state.createNewPostConfig.showMessageBar ? (
                <MessageBar
                  messageBarType={
                    this.state.messageBarType === "error"
                      ? MessageBarType.error
                      : MessageBarType.success
                  }
                >
                  {this.state.createNewPostConfig.messageBarText}
                </MessageBar>
              ) : null}
            </div>
          </div>
          <div className="visible-mobile">
            <h1>Themen</h1>
            <DetailsList
              selectionMode={SelectionMode.none}
              ariaLabel="Einträge"
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
