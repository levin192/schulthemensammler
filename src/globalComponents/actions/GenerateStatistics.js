import FirebaseDataProvider from '../../helpers/Firebasedataprovider';

const getToday = () => {
  const todayDate = new Date();
  const day = dayHelper(todayDate.getUTCDate());
  const month = todayDate.getUTCMonth() + 1;
  const year = todayDate.getUTCFullYear();
  return '' + year + month + day;
};

const dayHelper = (day) => {
  return (day < 10) ? '0' + day : day;
};

const fb = new FirebaseDataProvider();
const todayID = getToday();
const statsCollection = fb.firebase.firestore().collection('Statistics');
const todayDoc = statsCollection.doc(todayID);

const createNewStatsDoc = async () => {
  const statsAmount = await getStatsAmount();
  todayDoc.set({
    userAmount: statsAmount.u,
    classAmount: statsAmount.s,
  }).then(() => {
    // success set error catching ?
  });
};

const getStatsAmount = async () => {
  let userDocs;
  let schoolClass;
  userDocs = await fb.firebase.firestore().collection('Users').get();
  schoolClass = await fb.firebase.firestore().collection('SchoolClasses').get();
  return {
    u: userDocs.docs.length,
    s: schoolClass.docs.length,
  };
};

export const GenerateStatistics = () => {
  todayDoc.get().then((doc) => {
    if (!doc.exists) {
      createNewStatsDoc().then(() => {
            console.log('Successfully updated the Statistics!');
          },
      );
    }
  }).catch((error) => {
    console.error('Error getting stats document:', error);
  });
};