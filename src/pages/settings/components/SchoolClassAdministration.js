import React from "react";
import { AddNewSchoolClass } from "./functions/AddNewSchoolClass";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  DropdownMenuItemType,
  Dropdown,
  TextField
} from "@fluentui/react/";

class SchoolClassAdministration extends React.Component {
  constructor(props) {
    super(props);
    this.fb = this.props.fireBase;
    this.state = { allSchoolClasses: [], filteredItems: [], originalItems: [] };

    this.columns = [
      {
        key: "classNameCol",
        name: "Klasse",
        fieldName: "className",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      },

      {
        key: "availableSchoolDaysCol",
        name: "Schultage Verwalten",
        fieldName: "SchoolClassSelect",
        minWidth: 150,
        maxWidth: 150,
        isResizable: true
      }
    ];
  }

  componentDidMount = () => {
    this.setAllSchoolClasses();
  };

  setAllSchoolClasses = () => {
    const allSchoolClasses = this.props.schoolClassList.map((schoolClass) => {
      console.log("ewaaa", schoolClass);

      return {
        key: schoolClass.name,
        text: schoolClass.name,
        id: schoolClass.id,
        availableSchoolDays: schoolClass.availableSchoolDays
      };
    });

    console.log("allSchoolClasses", allSchoolClasses);
    this.setState((state) => {
      state.allSchoolClasses = allSchoolClasses;
      return state;
    });
  };

  onFilterChanged = (element) => {
    const searchText = element.target.value.toLowerCase();
    this.setState((state) => {
      state.allSchoolClasses = searchText
        ? this.state.filteredItems.filter(
            (item) =>
              item.userName.toLowerCase().indexOf(searchText) > -1 ||
              item.firstName.toLowerCase().indexOf(searchText) > -1 ||
              item.lastName.toLowerCase().indexOf(searchText) > -1
          )
        : this.state.originalItems;

      return state;
    });
  };

  updateSchoolClassAvailableDays = (dayName, value, docId) => {
    this.fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .doc(docId)
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
        console.log(error);

        this.setState((state) => {
          state.showMessageBar = true;
          state.messageBarType = "error";
          state.messageBarText = error.message;

          return state;
        });
      });
  };

  renderItemColumn = (schoolClass, index, column) => {
    const handleChangeDropdownChange = (x, item) => {
      this.updateSchoolClassAvailableDays(
        item.key,
        item.selected,
        schoolClass.id
      );
    };

    console.log("schoolClass", schoolClass);

    const availableSchoolDaysConverter = () => {
      const result = [];

      for (const [key, value] of Object.entries(
        schoolClass.availableSchoolDays
      )) {
        if (value) {
          result.push(key);
        }
      }

      return result;
    };

    const days = [
      { key: "dayHeader", text: "Tage", itemType: DropdownMenuItemType.Header },
      { key: "monday", text: "Montag" },
      { key: "tuesday", text: "Dienstag" },
      { key: "wednesday", text: "Mittwoch" },
      { key: "thursday", text: "Donnerstag" },
      { key: "friday", text: "Freitag" },
      { key: "-", text: "-", itemType: DropdownMenuItemType.Divider },
      { key: "saturday", text: "Samstag" },
      { key: "sunday", text: "Sonntag" }
    ];

    switch (column.key) {
      case "classNameCol":
        return schoolClass.text;

      case "availableSchoolDaysCol":
        return (
          <Dropdown
            placeholder="Setze Schultage"
            multiSelect
            // disabled={this.state.dropdownDisabled}
            defaultSelectedKeys={availableSchoolDaysConverter()}
            options={days}
            // styles={dropdownStyles}
            onChange={handleChangeDropdownChange}
            style={{ marginBottom: "15px" }}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <>
        <AddNewSchoolClass fireBase={this.props.fireBase} />
        <TextField label={"Liste filtern:"} onChange={this.onFilterChanged} />

        <DetailsList
          items={this.state.allSchoolClasses}
          compact={false}
          columns={this.columns}
          selectionMode={SelectionMode.none}
          onRenderItemColumn={this.renderItemColumn}
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
        />
      </>
    );
  }
}
export default SchoolClassAdministration;
