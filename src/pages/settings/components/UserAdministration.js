import * as React from 'react';
import {DetailsList, DetailsListLayoutMode, SelectionMode} from '@fluentui/react/lib/DetailsList';
import {TextField} from '@fluentui/react/lib/TextField';
import {Checkbox} from '@fluentui/react/lib/Checkbox';
import {ComboBox} from '@fluentui/react/lib/ComboBox';
import {PrimaryButton} from '@fluentui/react/lib/Button';
import {Spinner} from '@fluentui/react/lib/Spinner';
import {useState} from 'react';

export const UserAdministration: React.FunctionComponent = (props) => {
  const fb = props.fireBase
  const changesList = []
  const userList = () => props.userList
      .filter(userObj => userObj.username)
      .filter(userObj => userObj.username !== props.currentUserName) // filter out self
      .map((userObj, index) => {
        return {
          key: index,
          userName: userObj.username,
          firstName: userObj.firstname,
          lastName: userObj.lastname,
          email: userObj.email,
          admin: userObj.isAdmin,
        }
      })
  // const allSchoolClasses = ['1B','3A','7B','ITFO3','ExampleClass']
  // eslint-disable-next-line
  const [userItems, setUserItems] = useState(userList)
  const [isSaving, setIsSaving] = useState(false)
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState('')
  const columns = [
    {key: 'userNameCol', name: 'Username', fieldName: 'userName', minWidth: 100, maxWidth: 200, isResizable: true},
    {key: 'fullNameCol', name: 'Vor-/Nachname', fieldName: 'fullName', minWidth: 100, maxWidth: 300, isResizable: true},
    {key: 'emailCol', name: 'E-Mail', fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true},
    {key: 'adminCol', name: 'Admin', fieldName: 'admin', minWidth: 50, maxWidth: 50, isResizable: true},
    {key: 'classCol', name: 'Klasse', fieldName: 'classSelect', minWidth: 150, maxWidth: 150, isResizable: true},
  ]
  // eslint-disable-next-line
  const originalItems = userItems
  const onFilterChanged = (element) => {
    setSearchText(element.target.value)
    //setItems(searchText ? originalItems.filter(i => i.name.toLowerCase().indexOf(searchText) > -1) : items,)
  };
  const emptyEntry = () => {
    return (<span style={{color: 'lightgray'}}>nicht gesetzt</span>)
  }
  const renderItemColumn = (user, index, column) => {
    switch (column.key) {
      case 'userNameCol':
        return (user.userName) ? (<span>{user.userName}</span>) : (emptyEntry())
      case 'fullNameCol':
        return (user.firstName || user.lastName) ? (<span>{user.firstName}&nbsp;{user.lastName}</span>) : (emptyEntry())
      case 'emailCol':
        return (user.email) ? (<a href={'mailto:' + user.email}>{user.email}</a>) : (emptyEntry())
      case 'adminCol':
        return (user.admin) ? (
            <Checkbox id={user.userName} defaultChecked onChange={onAdminChange}/>
        ) : (
            <Checkbox id={user.userName} onChange={onAdminChange}/>
        )
      case 'classCol':
        return (<ComboBox options={[{key: 'A', text: 'Option A'},
          {key: 'B', text: 'Option B'},
          {key: 'C', text: 'Option C'},
          {key: 'D', text: 'Option D'},
        ]}/>)
      default:
        return null
    }
  }
  const onAdminChange = (e) => {
    const userName = e.target.id
    const isAdmin = e.target.checked
    const unsavedChange = changesList.find(x => x.userName === userName) // If is in Array already, so we only need to update the isAdmin prop in the object
    if (unsavedChange) {
      unsavedChange.isAdmin = isAdmin
    } else {
      changesList.push({
        userName: userName,
        isAdmin: isAdmin
      })
    }
    console.log(changesList)
  };
  const onSave = async (e) => {
    e.preventDefault();
    if (changesList.length > 0) {
      setIsSaving(true)
      changesList.forEach(item => {
        const isAdmin = item.isAdmin
        fb.firebase.firestore().collection('Users').where('username', '==', item.userName).get().then(r => {
          fb.firebase
              .firestore()
              .collection('Users')
              .doc(r.docs[0].id)
              .update({
                isAdmin
              }).then(
              // Timeout so the user has some feedback
              setTimeout(() => {
                setIsSaving(false)
              }, 2500)
          )
        })
      })
    }
  }
  return (
      <>
        <TextField
            label={'Filter by name'}
            // eslint-disable-next-line react/jsx-no-bind
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
          <div className={(isSaving) ? 'user-admin-list-spinner visible' : 'user-admin-list-spinner'}>
            <Spinner label="Speichern..."/>
          </div>
        </div>
        <PrimaryButton onClick={onSave} disabled={isSaving}>Änderungen speichern</PrimaryButton>
      </>
  )
}