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
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      }
    };

    this.options = [
      { key: "dayHeader", text: "Tage", itemType: DropdownMenuItemType.Header },
      { key: "keyMonday", text: "Montag" },
      { key: "2", text: "Dienstag" },
      { key: "3", text: "Mittwoch" },
      { key: "4", text: "Donnerstag" },
      { key: "6", text: "Freitag" },
      { key: "-", text: "-", itemType: DropdownMenuItemType.Divider },
      { key: "7", text: "Samstag" },
      { key: "0", text: "Sonntag" }
    ];
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

  getCalss = async (className) => {
    const response = await this.fb.firebase
      .firestore()
      .collection("Classes")
      .where("name", "==", className)
      .get();

    if (response.docs.length !== 0) {
      return response.docs[0];
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
              ? "Keine Klasse Ausgewählt"
              : this.state.selectedClass)
          }
          placeholder={"Klasse"}
          onChange={console.log}
          required
        />
        <Dropdown
          placeholder="Select options"
          label="Schultage auswählen"
          multiSelect
          options={this.options}
          // styles={dropdownStyles}
          onChange={this.handleChange}
        />
      </>
    );
  }
}
