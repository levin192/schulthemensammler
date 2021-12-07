import {
  PrimaryButton,
  DefaultButton,
  Dropdown,
  TextField,
  // MessageBar,
  // MessageBarType,
} from '@fluentui/react';
import { SharedColors } from '@fluentui/theme';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import React, {useState} from 'react';
import {useBoolean} from '@fluentui/react-hooks';

export const DeleteSchoolClass = (props) => {
  const fb = props.fireBase;

  const [toBeDeleted, setTobeDeleted] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmDeleteText, setConfirmDeleteText] = useState('')
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [disabledButton, setDisabledButton] = useState(true);


  const setDeleteSchoolClassByName = (target) => {
    setTobeDeleted(target)
    setDisabledButton(false)
  };

  const asyncGetClassToDelete = async (className) => {
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

  const triggerDeletion = async () => {
    if (confirmDeleteText === toBeDeleted) {
      setErrorMessage("")
      toggleHideDialog()
      await asyncGetClassToDelete(toBeDeleted).then(doc => deleteByClassById(doc.id))
    } else {
      setErrorMessage("Namen stimmen nicht überein!")
    }
  };

  const deleteByClassById = (documentId) => {
    fb.firebase
      .firestore()
      .collection("SchoolClasses")
      .doc(documentId)
      .delete()
  }

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Klasse löschen',
    closeButtonAriaLabel: 'Close',
    subText: 'Bitte den Namen der Klasse eingeben:\n',
  };

  return (
      <>
        <Dropdown
            id="deleteExistingClass"
            placeholder="Name der Klasse"
            style={{maxWidth:"300px"}}
            onChange={(e,option) => setDeleteSchoolClassByName(option.key)}
            options={props.allSchoolClasses}/>
        <DefaultButton onClick={toggleHideDialog} text="Löschen" disabled={disabledButton}/>
        <Dialog
            hidden={hideDialog}
            onDismiss={toggleHideDialog}
            dialogContentProps={dialogContentProps}
        >
          <b style={{display: 'block',margin: "-15px 0 15px 0"}}>{toBeDeleted}</b>
          <TextField
              id="confirmDeletion"
              placeholder=""
              onChange={(e,text)=> {setConfirmDeleteText(text)}}
              errorMessage={errorMessage}
          />
          <DialogFooter>
            <PrimaryButton text="Klasse löschen"
                           style={{ backgroundColor: SharedColors.red10, borderColor: SharedColors.red10 }}
                           onClick={triggerDeletion}/>
            <DefaultButton onClick={toggleHideDialog} text="Verwerfen" />
          </DialogFooter>
        </Dialog>

      </>
  );
};
