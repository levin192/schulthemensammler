import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react/lib/DetailsList";
import { TextField } from "@fluentui/react/lib/TextField";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import { ComboBox } from "@fluentui/react/lib/ComboBox";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Spinner } from "@fluentui/react/lib/Spinner";
// import { registerOnThemeChangeCallback } from "@fluentui/style-utilities";

class UserAdministration extends React.Component {
  constructor(props) {
    super(props);
    this.fb = props.fireBase;
    this.state = {
      userItems: this.createUserList(props.userList),

      isSaving: false,
      hasChanges: false,
      currentUserComboBox: undefined,
      changesList: [],
      isFilterActive: false,
    };

    this.allSchoolClasses = props.schoolClassList
      .filter((schoolClass) => schoolClass.name.length > 0) // filter empty
      .map((schoolClass) => {
        return {
          key: schoolClass.name,
          text: schoolClass.name,
        };
      });

    console.log("this.allSchoolClasses", this.allSchoolClasses);

    this.columns = [
      {
        key: "userNameCol",
        name: "Username",
        fieldName: "userName",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: "fullNameCol",
        name: "Vor-/Nachname",
        fieldName: "fullName",
        minWidth: 100,
        maxWidth: 300,
        isResizable: true,
      },
      {
        key: "emailCol",
        name: "E-Mail",
        fieldName: "value",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },
      {
        key: "adminCol",
        name: "Admin",
        fieldName: "admin",
        minWidth: 50,
        maxWidth: 50,
        isResizable: true,
      },
      {
        key: "schoolClassCol",
        name: "Klasse/n",
        fieldName: "SchoolClassSelect",
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
      },
    ];
  }

  createUserList = (userList) => {
    return userList
      .filter((userObj) => userObj.username) // filter out users who have not set username
      .map((userObj, index) => {
        // For readability and add key
        return {
          key: index,
          userName: userObj.username,
          firstName: userObj.firstname,
          lastName: userObj.lastname,
          email: userObj.email,
          admin: userObj.isAdmin,
          schoolClasses: userObj.schoolClasses,
        };
      });
  };

  onFilterChanged = (element) => {
    const originalItems = this.createUserList(this.props.userList);

    const searchText = element.target.value.toLowerCase();
    this.setState((state) => {
      state.isFilterActive = searchText === "" ? false : true;
      state.userItems = searchText
        ? originalItems.filter(
            (userItem) =>
              userItem.userName.toLowerCase().indexOf(searchText) > -1 ||
              userItem.firstName.toLowerCase().indexOf(searchText) > -1 ||
              userItem.lastName.toLowerCase().indexOf(searchText) > -1
          )
        : originalItems;

      return state;
    });
  };

  emptyEntry = () => {
    return <span style={{ color: "lightgray" }}>nicht gesetzt</span>;
  };

  renderItemColumn = (user, index, column) => {
    switch (column.key) {
      case "userNameCol":
        return user.userName ? <span>{user.userName}</span> : this.emptyEntry();
      case "fullNameCol":
        return user.firstName || user.lastName ? (
          <span>
            {user.firstName}&nbsp;{user.lastName}
          </span>
        ) : (
          this.emptyEntry()
        );
      case "emailCol":
        return user.email ? (
          <a href={"mailto:" + user.email}>{user.email}</a>
        ) : (
          this.emptyEntry()
        );
      case "adminCol":
        return user.admin ? (
          <Checkbox
            id={user.userName}
            defaultChecked
            onChange={this.onAdminChange}
          />
        ) : (
          <Checkbox id={user.userName} onChange={this.onAdminChange} />
        );
      case "schoolClassCol":
        return (
          <div className="combo-wrapper" data-user-ref={user.userName}>
            <ComboBox
              multiSelect
              autoComplete="on"
              options={this.allSchoolClasses}
              onChange={() => this.onSchoolClassesChange(user.userName)}
              defaultSelectedKey={user.schoolClasses}
              onMenuDismiss={this.onSchoolClassesChangeFinished}
            />
          </div>
        );
      default:
        return null;
    }
  };

  onAdminChange = (e) => {
    this.setState({ hasChanges: true });

    const userName = e.target.id;
    const isAdmin = e.target.checked;
    const unsavedChange = this.state.changesList.find(
      (item) => item.userName === userName
    ); // If is in Array already, so we only need to update the isAdmin prop in the object
    if (unsavedChange) {
      unsavedChange.isAdmin = isAdmin;
    } else {
      this.state.changesList.push({
        userName: userName,
        isAdmin,
      });
    }
  };

  onSchoolClassesChange = (userRef) => {
    this.setState({ currentUserComboBox: userRef });
  };

  onSchoolClassesChangeFinished = () => {
    this.setState({ hasChanges: true });

    if (
      window.document.querySelector(
        '[data-user-ref="' + this.state.currentUserComboBox + '"]'
      )
    ) {
      const schoolClasses = window.document
        .querySelector(
          '[data-user-ref="' + this.state.currentUserComboBox + '"]'
        )
        .querySelector("input")
        .value.replace(/\s+/g, "")
        .split(",");
      const unsavedChange = this.state.changesList.find(
        (x) => x.userName === this.state.currentUserComboBox
      ); // If is in Array already
      if (unsavedChange) {
        unsavedChange.schoolClasses = schoolClasses;
      } else {
        this.state.changesList.push({
          userName: this.state.currentUserComboBox,
          schoolClasses: schoolClasses,
        });
      }
    }
  };

  hideSavingSpinner = () => {
    // Timeout so the user has some feedback
    setTimeout(() => {
      this.setState({ isSaving: false });
    }, 1500);
  };

  onSave = async (e) => {
    e.preventDefault();
    if (this.state.changesList.length > 0) {
      this.setState({ isSaving: true });

      this.state.changesList.forEach((item) => {
        const isAdmin = item.isAdmin;
        const schoolClasses = item.schoolClasses;
        this.fb.firebase
          .firestore()
          .collection("Users")
          .where("username", "==", item.userName)
          .get()
          .then((r) => {
            const response = this.fb.firebase
              .firestore()
              .collection("Users")
              .doc(r.docs[0].id);

            if (
              item.hasOwnProperty("isAdmin") &&
              item.hasOwnProperty("schoolClasses")
            ) {
              response
                .update({
                  isAdmin,
                  schoolClasses: schoolClasses,
                })
                .then(this.hideSavingSpinner);
            } else {
              if (item.hasOwnProperty("isAdmin")) {
                response
                  .update({
                    isAdmin,
                  })
                  .then(this.hideSavingSpinner);
              }
              if (item.hasOwnProperty("schoolClasses")) {
                response
                  .update({
                    schoolClasses: schoolClasses,
                  })
                  .then(this.hideSavingSpinner);
              }
            }
          });
      });
    }
  };
  render() {
    return (
      <>
        <TextField label={"Nutzer filtern:"} onChange={this.onFilterChanged} />
        <div className="user-admin-list-wrap">
          <div className="user-admin-list-content">
            <DetailsList
              items={
                this.state.isFilterActive
                  ? this.state.userItems
                  : this.createUserList(this.props.userList)
              }
              compact={false}
              columns={this.columns}
              selectionMode={SelectionMode.none}
              onRenderItemColumn={this.renderItemColumn}
              layoutMode={DetailsListLayoutMode.justified}
              isHeaderVisible={true}
            />
          </div>
          <div
            className={
              this.state.isSaving
                ? "user-admin-list-spinner visible"
                : "user-admin-list-spinner"
            }
          >
            <Spinner label="Speichern..." />
          </div>
        </div>
        <PrimaryButton onClick={this.onSave} disabled={!this.state.hasChanges}>
          Änderungen speichern
        </PrimaryButton>
      </>
    );
  }
}

export default UserAdministration;
