import React from "react";
import { Dropdown, DropdownMenuItemType } from "@fluentui/react/lib/Dropdown";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import { MessageBar, MessageBarType, TextField } from "@fluentui/react";

export default class SchoolDayPicker extends React.Component {
  constructor() {
    super();
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
    };
  }

  componentDidMount = () => {
    this.getSchooldays();
  };

  getSchooldays = (className) => {
    // const userId = this.fb.firebase.auth().currentUser.uid
    // this.fb.firebase
    //   .firestore()
    //   .collection("klassen")
    //   .doc("6A") // KlassenID
    //   .onSnapshot((querySnapshot) => {
    //     const schooldays = querySnapshot.data();
    //     this.setState((state) => {
    //       state.monday = schooldays.montag;
    //       state.tuesday = schooldays.dienstag;
    //       state.wednesday = schooldays.mittwoch;
    //       state.thursday = schooldays.donnerstag;
    //       state.friday = schooldays.freitag;
    //       state.saturday = schooldays.samstag;
    //       state.sunday = schooldays.sonntag;
    //       return state;
    //     });
    //   });
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

  loadSchoolClass = async (inputEl) => {
    if (inputEl.target.value === "") return null;

    const schoolClassName = inputEl.target.value;
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
          itemType: DropdownMenuItemType.Header,
        },
        { key: "monday", text: "Montag" },
        {
          key: "tuesday",
          text: "Dienstag",
        },
        {
          key: "wednesday",
          text: "Mittwoch",
        },
        {
          key: "thursday",
          text: "Donnerstag",
        },
        {
          key: "friday",
          text: "Freitag",
        },
        { key: "-", text: "-", itemType: DropdownMenuItemType.Divider },
        {
          key: "saturday",
          text: "Samstag",
        },
        { key: "sunday", text: "Sonntag" },
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
      </>
    );
  }
}
