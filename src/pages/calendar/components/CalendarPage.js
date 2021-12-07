import {
  ActionButton,
  DefaultButton,
  DetailsList,
  Dialog,
  DialogFooter,
  Dropdown,
  IconButton,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  TextField,
  Toggle,
} from '@fluentui/react';
import React from 'react';
import FirebaseDataProvider from '../../../helpers/Firebasedataprovider';
import {Store} from '../../../helpers/Store';
import CalendarComponent from './CalendarComponent';
import {SelectionMode} from '@fluentui/utilities';

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
      currentSchoolClasses: [],
      isTodaySchoolDay: false,
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
        copiedTextMessage: "Kopieren",
        dialogContentProps: {
          title: "Eintrag bearbeiten",
          // closeButtonAriaLabel: "Close",
          // subText: "Do you want to send this message without a subject?",
        },
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
            key: "post",
            name: "Eintrag",
            fieldName: "post",
            minWidth: 50,
            maxWidth: 350,
            isResizable: true,
          },
          {
            key: "editPost",
            name: "",
            fieldName: "editPost",
            minWidth: 30,
            maxWidth: 50,
            isResizable: false,
          },
          {
            key: "createdBy",
            name: "Erstellt von",
            fieldName: "createdBy",
            minWidth: 50,
            maxWidth: 100,
            isResizable: true,
          },
          {
            key: "createdAt",
            name: "Erstellt am",
            fieldName: "createdAt",
            minWidth: 50,
            maxWidth: 100,
            isResizable: true,
          },
        ],
      },
      classesDropdownOptions: [],
      classesDropdown: {
        options: [],
        selectedKey: 0,
        placeholder: "Klasse wählen",
      },

      currentSchoolClassListener: null,
    };
    this.selectedDay = null
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
        console.log("successfully edited post", data);
      })
      .catch((err) => {
        console.log("error while editing post", err);
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
    await this.loadSchoolClassDocumentAndPosts();
  };

  onCalenderClick = (date) => {
    const dayId = this.getDayId(date);
    const selectedDay = new Date(date)
    const selectedDayName = selectedDay.toLocaleDateString("en-US",
        {weekday: 'long'}).toLowerCase()
    this.selectedDay = selectedDayName
    this.setState((state) => {
      state.currentSelectedDayId = dayId;
      return state;
    });

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

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.context.userDoc.schoolClasses.length !==
      this.state.currentSchoolClasses.length
    ) {
      this.setState(
        (state) => {
          state.currentSchoolClasses = this.context.userDoc.schoolClasses;
          return state;
        },
        async () => {
          await this.loadSchoolClassDocumentAndPosts();
        }
      );
    }
  };

  loadSchoolClassDocumentAndPosts = async () => {
    const isUserInASchoolClass = () => {
      return this.context.userDoc.schoolClasses[0] !== undefined;
    };

    if (this.state.currentSchoolClassListener !== null) {
      this.state.currentSchoolClassListener();
    }

    if (!isUserInASchoolClass()) {
      this.setState((state) => {
        state.classesDropdown.placeholder = "Keine Klasse zugeordnet";
        state.currentSchoolClasses = [];
        state.listConfig.posts = [];
        state.listConfig.groups = [];

        return state;
      });

      return null;
    } else {
      this.setState((state) => {
        state.currentSchoolClasses = this.context.userDoc.schoolClasses;
        return state;
      });
    }

    const unsubscribeListener = await this.fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .where(
        "name",
        "==",
        this.context.userDoc.schoolClasses[
          this.state.classesDropdown.selectedKey
        ]
      )
      .onSnapshot(async (querySnapshot) => {
        await this.setState((state) => {
          state.schoolClassDocument = querySnapshot.docs[0];
          return state;
        }, this.loadCurrentSelectedDayPosts);
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
      });

    await this.setState({ currentSchoolClassListener: unsubscribeListener });
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

  loadCurrentSelectedDayPosts = () => {
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
    dayId = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;

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
    if (this.state.schoolClassDocument === null) {
      this.setState((state) => {
        state.listConfig.posts = [];

        return state;
      });
      return null;
    }

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
          // liste leeren. Sonst würden die alten posts drinne bleiben
          this.setState((state) => {
            state.listConfig.posts = [];

            return state;
          });

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
            editPost: (
              <IconButton
                iconProps={{ iconName: "Edit" }}
                onClick={() => this.showPostPopup(doc.data().text, doc.id)}
              />
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
    await this.isSchoolDay()
  };

  getSchoolClassListForDropdown = () => {
    if (this.context.userDoc.schoolClasses.length === 0) {
      // this.setState((state) => {
      //   state.classesDropdown.selectedKey = 0;
      //   return state;
      // });
    }

    return this.context.userDoc.schoolClasses.map((value, index) => {
      return {
        key: index,
        text: value,
      };
    });
  };

  handleClassesDropdownChange = async (x, i) => {
    this.setState(
      (state) => {
        state.classesDropdown.selectedKey = i.key;
        return state;
      },
      async () => {
        await this.loadSchoolClassDocumentAndPosts();
        await this.loadPosts(this.state.currentSelectedDayId);
      }
    );
  };

  isSchoolDay = () => {
    let availableDays = this.state.schoolClassDocument !== null
        ? this.state.schoolClassDocument.data().availableSchoolDays
        : null;
    if (availableDays) {
        const today = new Date()
        const todayDayName = (this.selectedDay)?this.selectedDay:today.toLocaleDateString("en-US", {weekday: 'long'}).toLowerCase()
        this.setState((state) => {
          state.isTodaySchoolDay = availableDays[todayDayName];
          return state;
        });
    }
  }

  render() {
    if (this.context.loggedIn) {
      return (
        <>
          <div>
            <h1>Kalender</h1>
            <Dropdown
              placeholder={this.state.classesDropdown.placeholder}
              label="Klasse"
              options={this.getSchoolClassListForDropdown()}
              selectedKey={this.state.classesDropdown.selectedKey}
              onChange={this.handleClassesDropdownChange}
              style={{ maxWidth: "300px" }}
            />
            <div id="calendar" className="calendar">
              <CalendarComponent
                restrictedDays={
                  this.state.schoolClassDocument !== null
                    ? this.state.schoolClassDocument.data().availableSchoolDays
                    : null
                }
                onCalenderClick={this.onCalenderClick}
              />
              <div className={(this.state.isTodaySchoolDay)?"subject-editing-allowed":"subject-editing-disabled"}>
                <Dropdown
                  disabled={!this.state.isTodaySchoolDay}
                  placeholder="Fach wählen"
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
                  disabled={this.state.selectedSubject === null}
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
          </div>
          <div className="visible-mobile subject-details-list">
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
              //indentWidth={0}
            />
          </div>
          <Dialog
              maxWidth={375}
              dialogContentProps={
                this.state.postPopupSettings.dialogContentProps
              }
              hidden={this.state.postPopupSettings.isHidden}
          >

            <div className="subject-dialog">
              <TextField
                  onChange={(x, newText) => {
                    this.setState((state) => {
                      state.postPopupSettings.postText = newText;

                      return state;
                    });
                  }}
                  defaultValue={this.state.postPopupSettings.postText}
                  multiline
                  style={{minWidth: 325 + 'px',width:100+"%",minHeight: 115 + "px"}}
                  disabled={this.state.postPopupSettings.postTextFieldDisabled}
              />
              <div className="subject-dialog-toggle">
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
              </div>
              <div className="subject-dialog-copy">
                <ActionButton
                    style={{margin:"auto 0 0 auto"}}
                    iconProps={{iconName: 'Copy'}}
                    onClick={() => {
                      navigator.clipboard.writeText(
                          this.state.postPopupSettings.postText,
                      );

                      this.setState((state) => {
                        state.postPopupSettings.copiedTextMessage = 'Kopiert!';
                        return state;
                      });
                    }}
                >
                  {this.state.postPopupSettings.copiedTextMessage}
                </ActionButton>
              </div>
            </div>

            <DialogFooter>
              <PrimaryButton
                  disabled={
                    this.state.postPopupSettings.postTextFieldDisabled
                  }
                  onClick={this.editPost}
                  text="Änderungen speichern"
              />
              <DefaultButton
                  onClick={() => {
                    this.setState((state) => {
                      // clear all popup states
                      state.postPopupSettings.isHidden = true;
                      state.postPopupSettings.postTextFieldDisabled = true;
                      state.postPopupSettings.postText = true;
                      state.postPopupSettings.docId = true;
                      state.postPopupSettings.copiedTextMessage = 'Kopieren';
                      return state;
                    });
                  }}
                  text="Verwerfen"
              />
            </DialogFooter>
          </Dialog>
        </>
      );
    } else {
    }
  }

  static contextType = Store;
}
export default CalendarPage;
