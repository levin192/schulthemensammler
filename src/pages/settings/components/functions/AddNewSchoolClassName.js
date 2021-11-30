import { PrimaryButton, TextField, MessageBar, MessageBarType } from "@fluentui/react";
import React, { useState } from "react";

export const AddNewSchoolClassName = (props) => {
  const fb = props.fireBase;
  const getSchoolClass = props.getSchoolClass;
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
        wednesday: false,
      },
    };
  };
  const saveNewClassName = async () => {
    if (newClassName.length > 0) {
      const classExists = await getSchoolClass(newClassName);
      if (!classExists) {
        fb.firebase.firestore().collection("SchoolClasses").add(newClassConstructor(newClassName)).then(() => {
              setMessageBarType("success");
              setMessageBarText("Klasse erfolgreich gespeichert!");
            },
        );
      } else {
        setMessageBarType("error");
        setMessageBarText("Klasse existiert bereits!");
      }
      setShowMessageBar(true);
    }
  };
  return (
      <>
        <TextField id="newClassName" placeholder="Name der neuen Klasse"
                   onChange={(e) => setNewClassName(e.target.value)}/>
        <PrimaryButton text="Neue Klasse speichern" onClick={saveNewClassName}/>
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
