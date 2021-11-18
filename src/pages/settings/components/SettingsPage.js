import React, {useEffect, useState} from "react";
import {Store} from "../../../helpers/Store";
import {PrimaryButton, TextField} from "@fluentui/react";
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";
import {Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles} from "@fluentui/react/lib/Dropdown";
import SettingsController from "./SettingsController";

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

class SettingsPage extends React.Component {
    constructor() {
        super();
        this.fb = new FirebaseDataProvider();
    }

    handleChange(e, selectedOption) {
        console.log(selectedOption.key);
    }

    render() {
        if (this.context.loggedIn) {
            return (
                <>
                    <h1>Settings</h1>
                    <Dropdown
                        placeholder="Select options"
                        label="Schultage auswählen"
                        multiSelect
                        options={options}
                        styles={dropdownStyles}
                        onChange={this.handleChange}
                    />

                    <TextField
                        label="E-Mail"
                        id="name"
                        autoComplete="new-email"
                        type="text"
                    />

                    <SettingsController/>

                    <h1>Hallo</h1>
                    <PrimaryButton text="Speichern" type="submit"/>
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

