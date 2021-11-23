import React from 'react';
import {Dropdown, DropdownMenuItemType, IDropdownOption} from '@fluentui/react/lib/Dropdown';
import FirebaseDataProvider from "../../../helpers/Firebasedataprovider";


const options: IDropdownOption[] = [
    {key: 'dayHeader', text: 'Tage', itemType: DropdownMenuItemType.Header},
    {key: 'keyMonday', text: 'Montag'},
    {key: '2', text: 'Dienstag'},
    {key: '3', text: 'Mittwoch'},
    {key: '4', text: 'Donnerstag'},
    {key: '6', text: 'Freitag'},
    {key: '-', text: '-', itemType: DropdownMenuItemType.Divider},
    {key: '7', text: 'Samstag'},
    {key: '0', text: 'Sonntag'},
];

export default class SchoolDayPicker extends React.Component {
    constructor() {
        super();
        this.fb = new FirebaseDataProvider();
        this.state = {
            monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false
        };
    }

    componentDidMount = () => {
        this.getSchooldays()
    }

    // handleChange = (inputEl) => {
    //     this.setState((state) => {
    //         state[inputEl.target.id] = inputEl.target.value;
    //         console.log(state)
    //         console.log(inputEl.currentTarget.id)
    //         console.log(inputEl.currentTarget.value)
    //         return state;
    //     });
    // }

    getSchooldays = () => {
       // const userId = this.fb.firebase.auth().currentUser.uid

        this.fb.firebase.firestore().collection('settings').doc('schultage').onSnapshot((querySnapshot) => {
            const schooldays = querySnapshot.data()
            this.setState(state => {
                state.monday = schooldays.montag
                state.tuesday = schooldays.dienstag
                state.wednesday = schooldays.mittwoch
                state.thursday = schooldays.donnerstag
                state.friday = schooldays.freitag
                state.saturday = schooldays.samstag
                state.sunday = schooldays.sonntag
                return state;
            })
        })
    }

    render () {
        return (
            <Dropdown
                placeholder="Select options"
                label="Schultage auswählen"
                multiSelect
                options={options}
                // styles={dropdownStyles}
                onChange={this.handleChange}
            />
        )
    }
};

