import * as React from 'react';
import {DetailsList, DetailsListLayoutMode, SelectionMode} from '@fluentui/react/lib/DetailsList';
import {TextField} from '@fluentui/react/lib/TextField';
import {useState} from 'react';

export const UserAdministration: React.FunctionComponent = (props) => {
  const populateList = () => props.userList.map((name, index) => {
    if (name.length > 0) {
      return {
        key: index,
        name: name,
        value: 'dein Vadder'
      }
    }
    return {
      key: index,
      name: 'NAME NICHT GESETZT',
      value: 'dein Vadder'
    }
  })
  const [items, setItems] = useState(populateList)
  const [searchText, setSearchText] = useState('')
  console.log(items)
  const columns = [
    {key: 'column1', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true},
    {key: 'column2', name: 'Value', fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true},
  ]
  const originalItems = items
  const onFilterChanged = (element) => {
    setSearchText(element.target.value)
    setItems(searchText ? originalItems.filter(i => i.name.toLowerCase().indexOf(searchText) > -1) : items,)
  };
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
            // getKey={this._getKey}
            // setKey="none"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            //onItemInvoked={console.log('invokeme')}
        />
      </>
  )
}