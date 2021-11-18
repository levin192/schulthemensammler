import * as React from 'react';
import {Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption} from '@fluentui/react/lib/Dropdown';

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: {width: 300},
};

const options: IDropdownOption[] = [
    {key: 'dayHeader', text: 'Tage', itemType: DropdownMenuItemType.Header},
    {key: '1', text: 'Montag'},
    {key: '2', text: 'Dienstag'},
    {key: '3', text: 'Mittwoch'},
    {key: '4', text: 'Donnerstag'},
    {key: '6', text: 'Freitag'},
    {key: '-', text: '-', itemType: DropdownMenuItemType.Divider},
    {key: '7', text: 'Samstag'},
    {key: '0', text: 'Sonntag'},
];

const handleChange = (e, selectedOption) => {
    this.setState({ day:selectedOption.text });
    console.log(selectedOption.text);
}

export const SchoolDayPicker = () => {
    return (
        <>
            <Dropdown
                placeholder="Select options"
                label="Schultage auswählen"
                multiSelect
                options={options}
                styles={dropdownStyles}
                onChange={handleChange}
            />
        </>
    );
};

