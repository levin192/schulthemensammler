import {
  PrimaryButton,
  TextField,
  MessageBar,
  MessageBarType
} from "@fluentui/react";
import React, { useState } from "react";

export const AddNewSchoolClass = (props) => {
  const fb = props.fireBase;
  const [newClassName, setNewClassName] = useState("");
  const [showMessageBar, setShowMessageBar] = useState(false);
  const [messageBarType, setMessageBarType] = useState(null);
  const [messageBarText, setMessageBarText] = useState(null);
  const newClassConstructor = (name) => {
    return {
      name,
      subjects: [],
      availableSchoolDays: {
        friday: false,
        monday: false,
        saturday: false,
        sunday: false,
        thursday: false,
        tuesday: false,
        wednesday: false
      }
    };
  };

  const getSchoolClass = async (className) => {
    const response = await fb.firebase
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

  const saveNewClassName = async () => {
    const regExPattern = /^[A-Za-z0-9_-]*$/;
    if (newClassName.length > 0) {
      if (newClassName.match(regExPattern)) {
        const classExists = await getSchoolClass(newClassName);
        if (!classExists) {
          fb.firebase
            .firestore()
            .collection("SchoolClasses")
            .add(newClassConstructor(newClassName))
            .then(() => {
              setMessageBarType("success");
              setMessageBarText("Klasse erfolgreich gespeichert!");
              window.location.reload()
            });
        } else {
          setMessageBarType("error");
          setMessageBarText("Klasse existiert bereits!");
        }
      } else {
        setMessageBarType("error");
        setMessageBarText("Nur Buchstaben und Zahlen verwenden!");
      }
      setShowMessageBar(true);
    }
  };
  return (
    <>
      <TextField
        id="newClassName"
        placeholder="Name der neuen Klasse"
        onChange={(e) => setNewClassName(e.target.value)}
      />
      <PrimaryButton text="Neue Klasse speichern" onClick={saveNewClassName} />
      {showMessageBar ? (
        <MessageBar
          messageBarType={
            messageBarType === "error"
              ? MessageBarType.error
              : MessageBarType.success
          }
        >
          {messageBarText}
        </MessageBar>
      ) : null}
    </>
  );
};
