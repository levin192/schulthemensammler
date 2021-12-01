import {TextField} from "@fluentui/react/lib/TextField";
import * as React from "react";
import {DetailsList, DetailsListLayoutMode, SelectionMode} from "@fluentui/react/lib/DetailsList";
import {useState} from "react";
import {Checkbox} from "@fluentui/react/lib/Checkbox";
import {ComboBox} from "@fluentui/react/lib/ComboBox";
import {PrimaryButton} from "@fluentui/react/lib/Button";

export const SchoolClassAdministration = (props) => {
    console.log(props)
    const fb = props.fireBase
    const allSchoolClasses = props.schoolClassList
        .filter((schoolClass) => schoolClass.name.length > 0) // filter empty
        .map((schoolClass) => {
            return {
                key: schoolClass.name,
                text: schoolClass.name,
            };
        });

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
                        id={user.userName}
                />
            case "availableSchoolDaysCol":
                return (
                    <div className="combo-wrapper" data-user-ref={user.userName}>
                        <ComboBox
                            multiSelect
                            //autoComplete="on"
                            options={allSchoolClasses}
                            // onChange={() => onSchoolClassesChange(user.userName)}
                            defaultSelectedKey={user.schoolClasses}
                            // onMenuDismiss={onSchoolClassesChangeFinished}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <h1>Schulklassen verwalten</h1>

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
