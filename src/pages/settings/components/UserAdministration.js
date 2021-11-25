import * as React from 'react';
import {DetailsList, DetailsListLayoutMode, SelectionMode} from '@fluentui/react/lib/DetailsList';
import {TextField} from '@fluentui/react/lib/TextField';
import {Checkbox} from '@fluentui/react/lib/Checkbox';
import {ComboBox} from '@fluentui/react/lib/ComboBox';
import {useState} from 'react';

export const UserAdministration: React.FunctionComponent = (props) => {
  console.log(props.userList)
  const populateList = () => props.userList.map((userObj, index) => {
    console.log(userObj)
    if (userObj) {
      return {
        key: index,
        userName: userObj.username,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        admin: userObj.isAdmin,
        className: null
      }
    }
    return {
      key: index,
      userName: null,
      firstName: null,
      lastName: null,
      email: null,
      admin: false,
      className: null
    }
  })
  // eslint-disable-next-line
  const [userItems, setUserItems] = useState(populateList)
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState('')
  console.log(userItems)
  const columns = [
    {key: 'userNameCol', name: 'Username', fieldName: 'userName', minWidth: 100, maxWidth: 200, isResizable: true},
    {key: 'fullNameCol', name: 'Vor-/Nachname', fieldName: 'fullName', minWidth: 100, maxWidth: 200, isResizable: true},
    {key: 'emailCol', name: 'E-Mail', fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true},
    {key: 'adminCol', name: 'Admin', fieldName: 'admin', minWidth: 50, maxWidth: 200, isResizable: true},
    {key: 'classCol', name: 'Klasse', fieldName: 'classSelect', minWidth: 150, maxWidth: 200, isResizable: true},
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
        return (user.userName)?(<span>{user.userName}</span>):(emptyEntry())
      case 'fullNameCol':
        return (user.firstName || user.lastName)?(<span>{user.firstName}&nbsp;{user.lastName}</span>):(emptyEntry())
      case 'emailCol':
        return (user.email)?(<a href={'mailto:' + user.email}>{user.email}</a>):(emptyEntry())
      case 'adminCol':
        return (<Checkbox checked={user.admin}/>)
      case 'classCol':
        return (<ComboBox options={[  { key: 'A', text: 'Option A' },
          { key: 'B', text: 'Option B' },
          { key: 'C', text: 'Option C' },
          { key: 'D', text: 'Option D' },
        ]}/>)
      default:
        return null
    }
  }
  return (
      <>
        <TextField
            label={'Filter by name'}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={onFilterChanged}
        />
        <DetailsList
            items={userItems}
            compact={false}
            columns={columns}
            selectionMode={SelectionMode.none}
            onRenderItemColumn={renderItemColumn}
            // getKey={this._getKey}
            // setKey="none"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            //onItemInvoked={console.log('invokeme')}
        />
      </>
  )
}