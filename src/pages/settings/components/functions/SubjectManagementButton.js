import * as React from "react";
import {
  Callout,
  mergeStyleSets,
  FontWeights,
  DirectionalHint,
  TextField,
  TooltipHost,
  List,
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
  const descriptionId = useId("callout-description");
  const buttonId = useId("callout-button");
  const labelId = useId("callout-label");
  const toolTipId = useId("tooltip-label");
  const calloutProps = { gapSpace: 0 };
  const fb = props.fireBase;
  const currentClassId = props.schoolClass;
  const getSubjects = () => {
    const classDoc = fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .doc(currentClassId);
    classDoc
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
        <span>{item.text}</span>
        <IconButton
          iconProps={iconRemove}
          title="Entfernen"
          onClick={() => updateSubject(currentClassId, item.text, true)}
        />
      </>
    );
  };
  const updateSubject = (currentClass, subjectName, removeItem) => {
    // allSubjects.filter(item => item.text === subjectName) // wip
    if (true) {
      setIsSaving(true);
      const x = fb.firebase
        .firestore()
        .collection("SchoolClasses")
        .doc(currentClass);
      x.get()
        .then((r) => {
          let subjects = r.data().subjects;
          if (removeItem) {
            subjects = subjects.filter((item) => item !== subjectName);
          } else {
            subjects.push(subjectName);
            setNewSubject("");
          }
          x.update({
            subjects,
          });
        })
        .then(getSubjects);
    } else {
      //console.log((allSubjects.filter(item => item.text === subjectName).length < 0));
    }
  };
  return (
    <>
      <DefaultButton
        id={buttonId}
        onClick={toggleIsCalloutVisible}
        text={isCalloutVisible ? "Schließen" : "Fächer anzeigen"}
        className={styles.button}
      />
      {isCalloutVisible && (
        <Callout
          onLayerMounted={getSubjects}
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
              <h2>Themen</h2>
              {allSubjects.length > 0 && (
                <>
                  <List items={allSubjects} onRenderCell={renderCells} />
                </>
              )}
              <div className="new-subject-wrap">
                <TextField
                  label={"Neues Thema/Fach"}
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
                <TooltipHost
                  content="Hinzufügen"
                  // This id is used on the tooltip itself, not the host
                  // (so an element with this id only exists when the tooltip is shown)
                  id={toolTipId}
                  calloutProps={calloutProps}

                  // styles={hostStyles}
                >
                  <IconButton
                    iconProps={iconAdd}
                    title="Emoji"
                    ariaLabel="Emoji"
                    onClick={() => updateSubject(currentClassId, newSubject)}
                  />
                </TooltipHost>
              </div>
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
    width: 375,
    maxWidth: "90%",
    padding: "20px 24px",
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight,
  },
});
