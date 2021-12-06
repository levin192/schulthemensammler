import {
  DefaultButton,
  DetailsList,
  Dialog,
  DialogContent,
  DialogFooter,
  Dropdown,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  TextField,
  Toggle,
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
      unsubscribeRealtimeListenerForPosts: null,
      detailsListMessageBar: {
        showMessageBar: false,
        messageBarType: "",
        messageBarText: "",
      },
      postPopupSettings: {
        isHidden: true,
        postTextFieldDisabled: true,
        postText: "",
        docId: null,
      },
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
            minWidth: 50,
            maxWidth: 200,
          },
          {
            key: "createdBy",
            name: "Erstellt von",
            fieldName: "createdBy",
            minWidth: 50,
            maxWidth: 150,
          },
          {
            key: "createdAt",
            name: "Erstellt am",
            fieldName: "createdAt",
            minWidth: 50,
            maxWidth: 200,
          },
        ],
      },
    };
  }

  editPost = () => {
    const docId = this.state.postPopupSettings.docId;
    const text = this.state.postPopupSettings.postText;

    this.fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .doc(this.state.schoolClassDocument.id)
      .collection("Posts")
      .doc(docId)
      .update({
        text: text,
        createdBy: this.context.userDoc.username,
      })
      .then((data) => {
        this.setState((state) => {
          state.postPopupSettings.isHidden = true;
          state.postPopupSettings.postTextFieldDisabled = true;
          state.postPopupSettings.postText = true;
          state.postPopupSettings.docId = true;

          state.detailsListMessageBar.showMessageBar = true;
          state.detailsListMessageBar.messageBarType = "success";
          state.detailsListMessageBar.messageBarText =
            "Eintrag erfolgreich bearbeitet.";

          return state;
        });
        console.log("success", data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

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

    //delete old items
    this.deleteListItemsAndGroups();

    this.loadPosts(dayId);
  };

  deleteListItemsAndGroups = () => {
    this.setState((state) => {
      state.listConfig.posts = [];
      state.listConfig.groups = [];

      return state;
    });
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
        createdAt: +new Date(),
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
    let dayId;
    dayId = `${date.getDate()}${
        date.getMonth() + 1
    }${date.getFullYear()}`;

    return dayId;
  };

  showPostPopup = (text, docId) => {
    this.setState((state) => {
      state.postPopupSettings.isHidden = false;
      state.postPopupSettings.docId = docId;
      state.postPopupSettings.postText = text;

      return state;
    });
  };

  loadPosts = async (dayId) => {
    // first unsubscribe to the old listiner. Its reference is saved in the state
    if (this.state.unsubscribeRealtimeListenerForPosts !== null)
      this.state.unsubscribeRealtimeListenerForPosts();

    const unsubscribeRealtimeListenerForPosts = this.fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .doc(this.state.schoolClassDocument.id)
      .collection("Posts")
      .where("dayId", "==", dayId)
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.docs.length === 0) {
          console.log("No Posts available!");
          return null;
        }

        const array = [];

        querySnapshot.forEach((doc) => {
          const documentTimestamp = new Date(doc.data().createdAt);

          array.push({
            subject: doc.data().subject,
            post: (
              <div onClick={() => this.showPostPopup(doc.data().text, doc.id)}>
                {doc.data().text}
              </div>
            ),
            createdBy: doc.data().createdBy,
            createdAt: `${documentTimestamp.getDate()}.${
              documentTimestamp.getMonth() + 1
            }.${documentTimestamp.getFullYear()}`,
          });
        });

        this.setState((state) => {
          state.listConfig.posts = array;
          return state;
        });

        this.sortPostsAndGroups();
      });

    this.setState((state) => {
      state.unsubscribeRealtimeListenerForPosts =
        unsubscribeRealtimeListenerForPosts;

      return state;
    });
  };

  render() {
    if (this.context.loggedIn) {
      return (
        <>
          <div>
            <h1>Kalender</h1>

            <div id="calendar" className="calendar">
              <Dialog hidden={this.state.postPopupSettings.isHidden}>
                <DialogContent>
                  <TextField
                    onChange={(x, newText) => {
                      this.setState((state) => {
                        state.postPopupSettings.postText = newText;
                        return state;
                      });
                    }}
                    defaultValue={this.state.postPopupSettings.postText}
                    multiline
                    disabled={
                      this.state.postPopupSettings.postTextFieldDisabled
                    }
                />

                  <Toggle
                    onChange={(x, isOn) => {
                      this.setState((state) => {
                        state.postPopupSettings.postTextFieldDisabled = !isOn;

                        return state;
                      });
                    }}
                    label="Bearbeitung aktivieren"
                    onText="An"
                    offText="Aus"
                  />
                </DialogContent>
                <DialogFooter>
                  <PrimaryButton
                    disabled={
                      this.state.postPopupSettings.postTextFieldDisabled
                    }
                    onClick={this.editPost}
                    text="Save changes"
                  />
                  <DefaultButton
                    onClick={() => {
                      this.setState((state) => {
                        // clear all popup states
                        state.postPopupSettings.isHidden = true;
                        state.postPopupSettings.postTextFieldDisabled = true;
                        state.postPopupSettings.postText = true;
                        state.postPopupSettings.docId = true;

                        return state;
                      });
                    }}
                    text="Cancel"
                  />
                </DialogFooter>
              </Dialog>

              <CalendarComponent onCalenderClick={this.onCalenderClick} />
              <Dropdown
                placeholder="Fach auswählen"
                options={this.state.schoolClassSubjects}
                onChange={this.handleChangeDropdownChange}
                label="Fach"
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
            {this.state.detailsListMessageBar.showMessageBar ? (
              <MessageBar
                messageBarType={
                  this.state.detailsListMessageBar.messageBarType === "error"
                    ? MessageBarType.error
                    : MessageBarType.success
                }
              >
                {this.state.detailsListMessageBar.messageBarText}
              </MessageBar>
            ) : null}
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
