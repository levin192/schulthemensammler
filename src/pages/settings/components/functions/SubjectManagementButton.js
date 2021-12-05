import * as React from "react";
import {
  Callout,
  mergeStyleSets,
  FontWeights,
  DirectionalHint,
  TextField,
  TooltipHost,
  List,
  MessageBar,
  MessageBarType
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { useState } from "react";
import { Spinner } from "@fluentui/react/lib/Spinner";

export const SubjectManagementButton = (props) => {
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);
  const descriptionId = useId("callout-description");
  const buttonId = useId("callout-button");
  const labelId = useId("callout-label");
  const toolTipId = useId("tooltip-label");
  const calloutProps = { gapSpace: 0 };
  const fb = props.fireBase;
  const currentClassId = props.schoolClass;

  const getSubjects = () => {
    fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .doc(currentClassId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setAllSubjects(
            doc.data().subjects.map((subject, index) => {
              return {
                key: index,
                text: subject,
              };
            })
          );
        } else {
          console.log("No such document!");
        }
        setTimeout(() => {
          setIsSaving(false);
        }, 1500);
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const iconAdd = { iconName: "Add" };
  const iconRemove = { iconName: "Delete" };

  const renderCells = (item) => {
    return (
      <>
        <div className="subject-cell">
          <div className="subject-cell-text">
            {item.text}
          </div>
          <div className="subject-cell-icon">
            <IconButton
              iconProps={iconRemove}
              title="Entfernen"
              onClick={() => updateSubject(currentClassId, item.text, true)}
            />
          </div>
        </div>
      </>
    );
  };
  const updateSubject = (currentClass, subjectName, removeItem) => {
    setIsSaving(true);

    const currentSchoolClassRef = fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .doc(currentClass);

    if (!removeItem) {
      if (!allSubjects.find(item => item.text === subjectName)&&subjectName.length > 0) {
      currentSchoolClassRef
        .update({
          subjects: fb.firebase.firestore.FieldValue.arrayUnion(subjectName),
        })
        .then(getSubjects);
        setHasError(false) // Remove Messagebar
        setNewSubject("") // Empty Input on successful addition#
    } else {
        setHasError(true)
        setIsSaving(false)
      }

    }

    if (removeItem) {
      currentSchoolClassRef
        .update({
          subjects: fb.firebase.firestore.FieldValue.arrayRemove(subjectName),
        })
        .then(getSubjects);
    }
  };

  return (
    <>
      <DefaultButton
        id={buttonId}
        onClick={() => {
          toggleIsCalloutVisible();
          getSubjects();
        }}
        text={isCalloutVisible ? "Schließen" : "Fächer anzeigen"}
        className={styles.button}
      />
      {isCalloutVisible && (
        <Callout
          className={styles.callout}
          ariaLabelledBy={labelId}
          ariaDescribedBy={descriptionId}
          gapSpace={0}
          target={`#${buttonId}`}
          onDismiss={() => {
            toggleIsCalloutVisible();
            setNewSubject("");
          }}
          setInitialFocus
          directionalHint={DirectionalHint.rightCenter}
        >
          <div className="user-admin-list-wrap">
            <div className="user-admin-list-content">
              <h2 className={styles.title}>Fächer {props.schoolClassName}</h2>
              {allSubjects.length > 0 && (
                <>
                  <List items={allSubjects} onRenderCell={renderCells} />
                </>
              )}
              <div className="new-subject-wrap" style={{marginBottom:"15px"}}>
                <TextField
                  label={"Neues Thema/Fach"}
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
                <TooltipHost
                  content="Hinzufügen"
                  id={toolTipId}
                  calloutProps={calloutProps}
                >
                  <IconButton
                    iconProps={iconAdd}
                    title="Hinzufügen"
                    ariaLabel="Hinzufügen"
                    onClick={() => updateSubject(currentClassId, newSubject)}
                  />
                </TooltipHost>
              </div>
              {(hasError)?(
                  <MessageBar
                      messageBarType={MessageBarType.error}
                      isMultiline={false}
                      onDismiss={()=>{
                        setHasError(false)
                      }}
                      dismissButtonAriaLabel="Close"
                  >
                    Keine doppelten oder leeren Fächer
                  </MessageBar>
              ):null}
            </div>
            <div
              className={
                isSaving
                  ? "user-admin-list-spinner visible"
                  : "user-admin-list-spinner"
              }
            >
              <Spinner label="Speichern..." />
            </div>
          </div>
        </Callout>
      )}
    </>
  );
};
const styles = mergeStyleSets({
  button: {
    width: 130,
    margin: "0 !important",
  },
  callout: {
    width: 245,
    maxWidth: "90%",
    padding: "20px 24px",
  },
  title: {
    marginBottom: 12,
    marginTop: 0,
    fontWeight: FontWeights.semilight,
  },
});
