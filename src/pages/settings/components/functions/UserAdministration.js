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
import { useState } from "react";

export const UserAdministration = (props) => {
  const fb = props.fireBase;
  const userList = () =>
      props.userList
          .filter((userObj) => userObj.username) // filter out users who have not set username
          .filter((userObj) => userObj.username !== props.currentUserName) // filter out self
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
  const allSchoolClasses = props.schoolClassList
      .filter((schoolClass) => schoolClass.length > 0) // filter empty
      .map((schoolClass) => {
        return {
          key: schoolClass,
          text: schoolClass,
        };
      });
  const [userItems, setUserItems] = useState(userList);
  const [originalItems] = useState(userItems);
  const [filteredItems] = useState(userItems);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUserComboBox, setCurrentUserComboBox] = useState(undefined);
  const columns = [
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
  const changesList = [];
  const onFilterChanged = (element) => {
    const searchText = element.target.value.toLowerCase();
    setUserItems(
        searchText
            ? filteredItems.filter(
            (i) =>
                i.userName.toLowerCase().indexOf(searchText) > -1 ||
                i.firstName.toLowerCase().indexOf(searchText) > -1 ||
                i.lastName.toLowerCase().indexOf(searchText) > -1,
            )
            : originalItems,
    );
  };
  const emptyEntry = () => {
    return <span style={{color: "lightgray"}}>nicht gesetzt</span>;
  };
  const renderItemColumn = (user, index, column) => {
    switch (column.key) {
      case "userNameCol":
        return user.userName ? <span>{user.userName}</span> : emptyEntry();
      case "fullNameCol":
        return user.firstName || user.lastName ? (
            <span>
            {user.firstName}&nbsp;{user.lastName}
          </span>
        ) : (
            emptyEntry()
        );
      case "emailCol":
        return user.email ? (
            <a href={"mailto:" + user.email}>{user.email}</a>
        ) : (
            emptyEntry()
        );
      case "adminCol":
        return user.admin ? (
            <Checkbox
                id={user.userName}
                defaultChecked
                onChange={onAdminChange}
            />
        ) : (
            <Checkbox id={user.userName} onChange={onAdminChange}/>
        );
      case "schoolClassCol":
        return (
            <div className="combo-wrapper" data-user-ref={user.userName}>
              <ComboBox
                  multiSelect
                  //autoComplete="on"
                  options={allSchoolClasses}
                  onChange={() => onSchoolClassesChange(user.userName)}
                  defaultSelectedKey={user.schoolClasses}
                  onMenuDismiss={onSchoolClassesChangeFinished}
              />
            </div>
        );
      default:
        return null;
    }
  };
  const onAdminChange = (e) => {
    const userName = e.target.id;
    const isAdmin = e.target.checked;
    const unsavedChange = changesList.find((x) => x.userName === userName); // If is in Array already, so we only need to update the isAdmin prop in the object
    if (unsavedChange) {
      unsavedChange.isAdmin = isAdmin;
    } else {
      changesList.push({
        userName: userName,
        isAdmin: isAdmin,
      });
    }
  };
  const onSchoolClassesChange = (userRef) => {
    setCurrentUserComboBox(userRef);
  };
  const onSchoolClassesChangeFinished = () => {
    if (window.document) {
      const schoolClasses = window.document
          .querySelector("[data-user-ref=\"" + currentUserComboBox + "\"]")
          .querySelector("input")
          .value
          .replace(/\s+/g, "")
          .split(",");
      const unsavedChange = changesList.find((x) => x.userName === currentUserComboBox); // If is in Array already
      if (unsavedChange) {
        unsavedChange.schoolClasses = schoolClasses;
      } else {
        changesList.push({
              userName: currentUserComboBox,
              schoolClasses: schoolClasses,
            },
        );
      }
    }
  };
  const hideSavingSpinner = () => {
    // Timeout so the user has some feedback
    setTimeout(() => {
      setIsSaving(false);
    }, 2500);
  };
  const onSave = async (e) => {
    e.preventDefault();
    if (changesList.length > 0) {
      setIsSaving(true);
      changesList.forEach((item) => {
        const isAdmin = item.isAdmin;
        const schoolClasses = item.schoolClasses;
        fb.firebase
            .firestore()
            .collection("Users")
            .where("username", "==", item.userName)
            .get()
            .then((r) => {
              const x = fb.firebase.firestore().collection("Users").doc(r.docs[0].id);
              if (item.hasOwnProperty("isAdmin") && item.hasOwnProperty("schoolClasses")) {
                x.update({
                  isAdmin,
                  schoolClasses: schoolClasses,
                }).then(hideSavingSpinner);
              } else {
                if (item.hasOwnProperty("isAdmin")) {
                  x.update({
                    isAdmin,
                  }).then(hideSavingSpinner);
                }
                if (item.hasOwnProperty("schoolClasses")) {
                  x.update({
                    schoolClasses: schoolClasses,
                  }).then(hideSavingSpinner);
                }
              }
            });
      });
    }
  };
  return (
      <>
        <TextField
            label={"Liste filtern:"}
            onChange={onFilterChanged}
        />
        <div className="user-admin-list-wrap">
          <div className="user-admin-list-content">
            <DetailsList
                items={userItems}
                compact={false}
                columns={columns}
                selectionMode={SelectionMode.none}
                onRenderItemColumn={renderItemColumn}
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
            />
          </div>
          <div
              className={
                isSaving
                    ? "user-admin-list-spinner visible"
                    : "user-admin-list-spinner"
              }
          >
            <Spinner label="Speichern..."/>
          </div>
        </div>
        <PrimaryButton onClick={onSave} disabled={isSaving}>
          Änderungen speichern
        </PrimaryButton>
      </>
  );
};
