import * as React from "react";
import {DetailsList, DetailsListLayoutMode, SelectionMode} from "@fluentui/react/lib/DetailsList";
// eslint-disable-next-line
import {useEffect, useState} from "react";
import {PrimaryButton} from "@fluentui/react/lib/Button";
import {AddNewSchoolClassName} from "./AddNewSchoolClassName";
import {Dropdown, DropdownMenuItemType} from "@fluentui/react";
import {Checkbox} from "@fluentui/react/lib/Checkbox";
// import SchoolDayPicker from "../SchoolDayPicker";

class SchoolClassAdministration extends React.Component {
    construc
    const fb = props.fireBase

    const allSchoolClasses = props.schoolClassList
        .filter((schoolClass) => schoolClass.name.length > 0) // filter empty
        .map((schoolClass) => {
            return {
                key: schoolClass.name,
                text: schoolClass.name,
            };
        });
    // eslint-disable-next-line
    const handleChangeDropdownChange = (x, item) => {
        this.updateSchoolClassAvailableDays(item.key, item.selected);
    };

    const getSchoolClass = async (className) => {
        const response = await fb.firebase
            .firestore()
            .collection("SchoolClasses")
            .where("name", "==", className)
            .get();

        if (response.docs.length !== 0) {
            return response.docs[0];
        } else {
            return undefined;
        }
    };
    // eslint-disable-next-line
    const [days, setDays] = useState([])
    const [availableSchoolDays, setAvailableSchoolDays] = useState([]);
    // eslint-disable-next-line
    const onComboboxSelection = async (y, item) => {
        if (item === "") return null;

        const schoolClassName = item.text;
        const schoolClassDataRaw = await this.getSchoolClass(schoolClassName);

        console.log(schoolClassDataRaw)

        if (schoolClassDataRaw === undefined) {
            this.setState((state) => {
                state.selectedClass = null;
                return state;
            });

            this.setState((state) => {
                state.showMessageBar = true;
                state.messageBarType = "error";
                state.messageBarText = "Klasse exisitiert nicht.";

                return state;
            });
        } else {
            this.setState((state) => {
                state.showMessageBar = false;
                state.messageBarText = "";

                return state;
            });
            const schoolClassData = schoolClassDataRaw.data();

            const days = [
                { key: "dayHeader", text: "Tage", itemType: DropdownMenuItemType.Header },
                { key: "monday", text: "Montag" },
                { key: "tuesday", text: "Dienstag" },
                { key: "wednesday", text: "Mittwoch" },
                { key: "thursday", text: "Donnerstag" },
                { key: "friday", text: "Freitag" },
                { key: "-", text: "-", itemType: DropdownMenuItemType.Divider },
                { key: "saturday", text: "Samstag" },
                { key: "sunday", text: "Sonntag" }
            ];

            for (const [key, value] of Object.entries(
                schoolClassData.availableSchoolDays
            )) {
                if (value) {
                    setAvailableSchoolDays(key);
                }
            }

            this.setState((state) => {
                state.selectedClass = schoolClassData;
                state.days = days;
                state.schoolClassDocId = schoolClassDataRaw.id;
                state.dropdownDisabled = false;
                state.availableSchoolDays = availableSchoolDays;
                return state;
            });
        }
    };

    const [classItems] = useState(allSchoolClasses);
    const columns = [
        {
            key: "classNameCol",
            name: "Klasse",
            fieldName: "className",
            minWidth: 100,
            maxWidth: 200,
            isResizable: true
        },
        {
            key: "optionCol",
            name: "Option",
            fieldName: "SchoolClassSelect",
            minWidth: 50,
            maxWidth: 150,
            isResizable: true
        },
        {
            key: "availableSchoolDaysCol",
            name: "Schultage Verwalten",
            fieldName: "SchoolClassSelect",
            minWidth: 150,
            maxWidth: 150,
            isResizable: true
        }
    ];

    const renderItemColumn = (user, index, column) => {
        switch (column.key) {
            case "classNameCol":
                return user.text
            case "optionCol":
                return <Checkbox
                    // onChange={onAdminChange}
                />
            case "availableSchoolDaysCol":
                return (
                    <Dropdown
                        placeholder="Select options"
                        multiSelect
                        // disabled={this.state.dropdownDisabled}
                        defaultSelectedKeys={availableSchoolDays}
                        options={days}
                        // onChange={this.handleChangeDropdownChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <h1>Schulklassen verwalten</h1>

            <p>Neue Klasse hinzufügen</p>
            <AddNewSchoolClassName
                getSchoolClass={getSchoolClass}
                fireBase={fb}
            />
            <DetailsList
                items={classItems}
                compact={false}
                columns={columns}
                selectionMode={SelectionMode.none}
                onRenderItemColumn={renderItemColumn}
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
            />
            <PrimaryButton>
                Änderungen speichern
            </PrimaryButton>
        </>
    );
}
