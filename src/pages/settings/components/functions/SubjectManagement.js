import * as React from "react";
import {
  Callout,
  mergeStyleSets,
  FontWeights,
  DetailsList,
  DetailsListLayoutMode, SelectionMode, MarqueeSelection, DirectionalHint, TextField,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { useState } from "react";

export const SubjectManagement = (props) => {
  const [isCalloutVisible, {toggle: toggleIsCalloutVisible}] = useBoolean(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selection, setSelection] = useState([]);
  const buttonId = useId("callout-button");
  const labelId = useId("callout-label");
  const descriptionId = useId("callout-description");
  const fb = props.fireBase;
  const currentClassId = props.schoolClass;
  const getSubjects = () => {
    const classDoc = fb.firebase.firestore().collection("SchoolClasses").doc(currentClassId);
    classDoc.get().then((doc) => {
      if (doc.exists) {
        setAllSubjects(doc.data().subjects.map((subject, index) => {
              return {
                key: index,
                text: subject,
              };
            },
        ));
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
    console.log(allSubjects);
  };
  const columns = [
    {
      key: "subjectCol",
      name: "Thema",
      fieldName: "subjectName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
  ];
  const renderItemColumn = (item) => {
    return (<span>{item.text}</span>);
  };
  const saveSubjects = (e) => {
    console.log(e);
  };
  return (
      <>
        <DefaultButton
            id={buttonId}
            onClick={toggleIsCalloutVisible}
            text={isCalloutVisible ? "Schliessen" : "Fächer anzeigen"}
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
                onDismiss={toggleIsCalloutVisible}
                setInitialFocus
                directionalHint={DirectionalHint.rightCenter}
            >
              <h2>Themen</h2>
              {(allSubjects.length > 0) && (
                  <MarqueeSelection selection={setSelection}>
                    <DetailsList
                        items={allSubjects}
                        compact={true}
                        columns={columns}
                        selectionMode={SelectionMode.multiple}
                        onRenderItemColumn={renderItemColumn}
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        setKey="set"
                        // selection={setSelection}
                        selectionPreservedOnEmptyClick={true}
                        ariaLabelForSelectionColumn="Toggle selection"
                        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                        checkButtonAriaLabel="select row"
                    />
                  </MarqueeSelection>
              )}
              <TextField
                  label={"Neues Thema/Fach"}
                  //onChange={this.onFilterChanged}
              />
              <PrimaryButton onClick={saveSubjects}>Speichern</PrimaryButton>
              <span>{selection}</span>
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
