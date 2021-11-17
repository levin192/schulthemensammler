import * as React from 'react';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
};

const options: IDropdownOption[] = [
    { key: 'dayHeader', text: 'Tage', itemType: DropdownMenuItemType.Header },
    { key: '1', text: 'Montag' },
    { key: '2', text: 'Dienstag' },
    { key: '3', text: 'Mittwoch' },
    { key: '4', text: 'Donnerstag' },
    { key: '6', text: 'Freitag' },
    { key: '-', text: '-', itemType: DropdownMenuItemType.Divider },
    { key: '7', text: 'Samstag' },
    { key: '0', text: 'Sonntag' },
];

const stackTokens: IStackTokens = { childrenGap: 20 };

export const DayPicker: React.FunctionComponent = () => {

    return (
        <Stack tokens={stackTokens}>
            <Dropdown
                placeholder="Select options"
                label="Schultage auswählen"
                defaultSelectedKeys={['1', '2']}
                multiSelect
                options={options}
                styles={dropdownStyles}
            />
        </Stack>
    );
};
