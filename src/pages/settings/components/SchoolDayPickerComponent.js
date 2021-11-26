import React from "react";
import { Dropdown, DropdownMenuItemType } from "@fluentui/react/lib/Dropdown";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import { TextField } from "@fluentui/react";

export default class SchoolDayPicker extends React.Component {
  constructor() {
    super();
    this.fb = new FirebaseDataProvider();
    this.state = {
      selectedClass: null,
      days: [
        {
          key: "dayHeader",
          text: "Tage",
          itemType: DropdownMenuItemType.Header
        },
        { key: "0", text: "Montag" },
        { key: "1", text: "Dienstag" },
        { key: "2", text: "Mittwoch" },
        { key: "3", text: "Donnerstag" },
        { key: "4", text: "Freitag" },
        { key: "-", text: "-", itemType: DropdownMenuItemType.Divider },
        { key: "5", text: "Samstag" },
        { key: "6", text: "Sonntag" }
      ]
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
      .collection("Classes")
      .where("name", "==", className)
      .get();

    if (response.docs.length !== 0) {
      return response.docs[0].data();
    } else {
      return undefined;
    }
  };

  loadSchoolClass = async (inputEl) => {
    const schoolClassName = inputEl.target.value;
    const schoolClassData = await this.getSchoolClass(schoolClassName);

    if (schoolClassData === undefined) {
      this.setState((state) => {
        state.selectedClass = null;
        return state;
      });
      alert("Klasse existiert nicht!");
    } else {
      console.log({ schoolClassData });

      const updatedDays = [
        {
          key: "dayHeader",
          text: "Tage",
          itemType: DropdownMenuItemType.Header
        },
        { key: "0", text: "Montag", selected: true },
        {
          key: "1",
          text: "Dienstag",
          selected: schoolClassData.schoolDays[1]
        },
        {
          key: "2",
          text: "Mittwoch",
          selected: schoolClassData.schoolDays[2]
        },
        {
          key: "3",
          text: "Donnerstag",
          selected: schoolClassData.schoolDays[3]
        },
        {
          key: "4",
          text: "Freitag",
          selected: schoolClassData.schoolDays[4]
        },
        { key: "-", text: "-", itemType: DropdownMenuItemType.Divider },
        {
          key: "5",
          text: "Samstag",
          selected: schoolClassData.schoolDays[5]
        },
        { key: "6", text: "Sonntag", selected: schoolClassData.schoolDays[6] }
      ];

      this.setState((state) => {
        state.selectedClass = schoolClassData;
        // TODO: React re-rendert nicht wenn man arrays neu im state überschreibt. => Lösung finden.
        state.days = updatedDays;
        return state;
      });
    }
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
          options={this.state.days}
          // styles={dropdownStyles}
          onChange={this.handleChange}
        />
      </>
    );
  }
}
