import * as React from 'react';
import {DetailsList, DetailsListLayoutMode, SelectionMode} from '@fluentui/react/lib/DetailsList';
import {TextField} from '@fluentui/react/lib/TextField';
import {Checkbox} from '@fluentui/react/lib/Checkbox';
import {ComboBox} from '@fluentui/react/lib/ComboBox';
import {useState} from 'react';

export const UserAdministration: React.FunctionComponent = (props) => {
  const populateList = () => props.userList.map((name, index) => {
    if (name.length > 0) {
      return {
        key: index,
        name: name,
        email: 'mail@example.com',
        admin: false,
        className: null
      }
    }
    return {
      key: index,
      name: null,
      email: 'mail@example.com',
      admin: false,
      className: null
    }
  })
  const [items, setItems] = useState(populateList)
  const [searchText, setSearchText] = useState('')
  console.log(items)
  const columns = [
    {key: 'nameCol', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true},
    {key: 'emailCol', name: 'E-Mail', fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true},
    {key: 'adminCol', name: 'Admin', fieldName: 'admin', minWidth: 50, maxWidth: 200, isResizable: true},
    {key: 'classCol', name: 'Klasse', fieldName: 'classSelect', minWidth: 150, maxWidth: 200, isResizable: true},
  ]
  const originalItems = items
  const onFilterChanged = (element) => {
    setSearchText(element.target.value)
    //setItems(searchText ? originalItems.filter(i => i.name.toLowerCase().indexOf(searchText) > -1) : items,)
  };
  const renderItemColumn = (item, index, column) => {
    console.log(item)
    console.log(index)
    switch (column.key) {
      case 'nameCol':
        return (!item.name)?(<span style={{color: 'red'}}>NAME NICHT GESETZT</span>):(<span>{item.name}</span>)
      case 'emailCol':
        return (<a href={'mailto:' + item.email}>{item.email}</a>)
      case 'adminCol':
        return (<Checkbox/>)
      case 'classCol':
        return (<ComboBox options={[  { key: 'A', text: 'Option A' },
          { key: 'B', text: 'Option B' },
          { key: 'C', text: 'Option C' },
          { key: 'D', text: 'Option D' },
        ]}/>)
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
            items={items}
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