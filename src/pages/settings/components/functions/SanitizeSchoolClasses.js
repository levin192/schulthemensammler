/**
 * Checks if current user has deleted classes associated. If true, connect to firestore & delete nonexistent items from current user.
 */

export const SanitizeSchoolClasses = (fireBase, userDoc, schoolClasses) => {
  const fb = fireBase;
  const userClasses = userDoc.schoolClasses;
  const uid = userDoc.uid
  const deletedSchoolClasses = userClasses.filter(
      fromUser => !schoolClasses.some(
        fromSchoolClasses => fromUser === fromSchoolClasses.name),
      );

  if (deletedSchoolClasses.length > 0) {
    const userRef = fb.firebase
      .firestore()
      .collection("Users")
      .doc(uid)
    deletedSchoolClasses.forEach(item => {
      userRef.update({
        schoolClasses: fb.firebase.firestore.FieldValue.arrayRemove(item)
      })
    })
  } else {
    return null;
  }

};
