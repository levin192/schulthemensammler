import React from "react";
import {Store} from "../../../helpers/Store";
import {PrimaryButton} from "@fluentui/react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import {Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles} from "@fluentui/react/lib/Dropdown";

class SettingsPage extends React.Component {
    constructor() {
        super();
        this.fb = new FirebaseDataProvider();
        this.state = {
            montag: false,
            dienstag: false,
            mittwoch: false,
            donnerstag: false,
            freitag: false,
            samstag: false,
            sonntag: false,
        };
    }

    render() {
        if (this.context.loggedIn) {
            return (
                <>
                    <h1>Settings</h1>

                    <Dropdown
                        placeholder="Select options"
                        label="Schultage auswählen"
                        // defaultSelectedKeys={['1', '3']}
                        multiSelect
                        options={options}
                        styles={dropdownStyles}
                        selectedKeys
                        onChange={this.handleInputChange}
                    />

                    <PrimaryButton text="Anmelden" type="submit"/>
                </>
            );
        }
        return (
            <>
                <h1>tba</h1>
            </>
        )
    }

    static contextType = Store;
}
export default SettingsPage;

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
};

const options: IDropdownOption[] = [
    { key: 'dayHeader', text: 'Tage', itemType: DropdownMenuItemType.Header },
    { key: '1', text: 'Montag', selected: false },
    { key: '2', text: 'Dienstag', selected: false },
    { key: '3', text: 'Mittwoch', selected: false },
    { key: '4', text: 'Donnerstag', selected: false },
    { key: '6', text: 'Freitag', selected: false },
    { key: '-', text: '-', itemType: DropdownMenuItemType.Divider },
    { key: '7', text: 'Samstag', selected: false },
    { key: '0', text: 'Sonntag', selected: false },
];


