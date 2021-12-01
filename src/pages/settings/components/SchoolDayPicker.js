import React from "react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import {
  MessageBar,
  MessageBarType,
  TextField,
  Dropdown,
  DropdownMenuItemType,
  ComboBox
} from "@fluentui/react";
import { AddNewSchoolClassName } from "./functions/AddNewSchoolClassName";

export default class SchoolDayPicker extends React.Component {
  constructor(props) {
    super(props);
    this.fb = new FirebaseDataProvider();
    this.state = {
      selectedClass: null,
      schoolClassDocId: null,
      days: [],
      availableSchoolDays: [],
      dropdownDisabled: true,
      showMessageBar: false,
      messageBarType: null,
      messageBarText: "",
      allSchoolClasses: []
    };
  }

  componentDidMount = () => {
    this.setAllSchoolClasses();
  };

  setAllSchoolClasses = () => {
    const allSchoolClasses = this.props.allSchoolClassesNames.map(
      (schoolClass) => {
        return {
          key: schoolClass.name,
          text: schoolClass.name,
          id: schoolClass.id
        };
      }
    );

    this.setState((state) => {
      state.allSchoolClasses = allSchoolClasses;
      return state;
    });
  };

  getSchoolClass = async (className) => {
    const response = await this.fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .where("name", "==", className)
      .get();

    if (response.docs.length !== 0) {
      return response.docs[0];
    } else {
      return undefined;
    }
  };

  onComboboxSelection = async (y, item) => {
    if (item === "") return null;

    const schoolClassName = item.text;
    const schoolClassDataRaw = await this.getSchoolClass(schoolClassName);

    if (schoolClassDataRaw === undefined) {
      this.setState((state) => {
        state.selectedClass = null;
        return state;
      });

      this.setState((state) => {
        state.showMessageBar = true;
        state.messageBarType = "error";
        state.messageBarText = "Klasse exisitiert nicht.";

        return state;
      });
    } else {
      this.setState((state) => {
        state.showMessageBar = false;
        state.messageBarText = "";

        return state;
      });
      const schoolClassData = schoolClassDataRaw.data();

      const days = [
        {
          key: "dayHeader",
          text: "Tage",
          itemType: DropdownMenuItemType.Header
        },
        { key: "monday", text: "Montag" },
        {
          key: "tuesday",
          text: "Dienstag"
        },
        {
          key: "wednesday",
          text: "Mittwoch"
        },
        {
          key: "thursday",
          text: "Donnerstag"
        },
        {
          key: "friday",
          text: "Freitag"
        },
        { key: "-", text: "-", itemType: DropdownMenuItemType.Divider },
        {
          key: "saturday",
          text: "Samstag"
        },
        { key: "sunday", text: "Sonntag" }
      ];

      const availableSchoolDays = [];

      for (const [key, value] of Object.entries(
        schoolClassData.availableSchoolDays
      )) {
        if (value) {
          availableSchoolDays.push(key);
        }
      }

      this.setState((state) => {
        state.selectedClass = schoolClassData;
        state.days = days;
        state.schoolClassDocId = schoolClassDataRaw.id;
        state.dropdownDisabled = false;
        state.availableSchoolDays = availableSchoolDays;
        return state;
      });
    }
  };

  handleChangeDropdownChange = (x, item) => {
    this.updateSchoolClassAvailableDays(item.key, item.selected);
  };

  updateSchoolClassAvailableDays = (dayName, value) => {
    this.fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .doc(this.state.schoolClassDocId)
      .update({ ["availableSchoolDays." + dayName]: value })
      .then(() => {
        this.setState((state) => {
          state.showMessageBar = true;
          state.messageBarType = "success";
          state.messageBarText = "Schultag erfolgreich aktualisiert.";

          return state;
        });
      })
      .catch((error) => {
        this.setState((state) => {
          state.showMessageBar = true;
          state.messageBarType = "error";
          state.messageBarText = error.message;

          return state;
        });
      });
  };

  render() {
    return (
      <>
        <div className="calendar-settings-container">
          <div>
            <p>Schultage anpassen</p>
            <ComboBox
              //autoComplete="on"
              options={this.state.allSchoolClasses}
              onChange={this.onComboboxSelection}

              // onMenuDismiss={onSchoolClassesChangeFinished}
            />

            <TextField
              id="class"
              label={
                "Klasse: " +
                (this.state.selectedClass === null
                  ? "(Keine Klasse Ausgewählt)"
                  : this.state.selectedClass.name)
              }
              placeholder={"Klasse"}
              onBlur={this.loadSchoolClass}
              required
            />
            <Dropdown
              placeholder="Select options"
              label="Schultage auswählen"
              multiSelect
              disabled={this.state.dropdownDisabled}
              defaultSelectedKeys={this.state.availableSchoolDays}
              options={this.state.days}
              // styles={dropdownStyles}
              onChange={this.handleChangeDropdownChange}
              style={{ marginBottom: "15px" }}
            />
            {this.state.showMessageBar ? (
              <MessageBar
                messageBarType={
                  this.state.messageBarType === "error"
                    ? MessageBarType.error
                    : MessageBarType.success
                }
              >
                {this.state.messageBarText}
              </MessageBar>
            ) : null}
          </div>
          <div>
            <p>Neue Klasse hinzufügen</p>
            <AddNewSchoolClassName
              getSchoolClass={this.getSchoolClass}
              fireBase={this.fb}
            />
          </div>
        </div>
      </>
    );
  }
}
