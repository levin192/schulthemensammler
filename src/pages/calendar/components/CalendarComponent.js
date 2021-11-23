import React from 'react';
import {Calendar, ICalendarDayProps, defaultCalendarStrings, TextField} from '@fluentui/react';
import {StackItem} from "@fluentui/react";
import {IStackStyles} from "@fluentui/react";

function getTextField() {
    return (
        <>
            <h1>Themen Eintragen</h1>
            <StackItem horizontal styles={stackStyles}>
                <TextField
                    id={'eintragen'}
                    label="ITN (Nee)"
                    multiline
                    autoAdjustHeight
                />
                <TextField
                    id={'eintragen'}
                    label="AWE (Schwandt)"
                    multiline
                    autoAdjustHeight
                />
            </StackItem>
        </>
    )
}

const stackStyles: Partial<IStackStyles> = { root: { width: '100%' } };

export default class CalendarComponent extends React.Component {

    render() {
        return (
            <StackItem horizontal styles={stackStyles}>
                <Calendar
                    highlightSelectedMonth
                    showGoToToday
                    calendarDayProps={calendarDayProps}
                    // Calendar uses English strings by default. For localized apps, you must override this prop.
                    strings={defaultCalendarStrings}
                />
                {getTextField()}
            </StackItem>
        );
    }
};

const calendarDayProps: Partial<ICalendarDayProps> = {
    customDayCellRef: (element, date, classNames) => {
        if (element) {
            element.title = 'custom title from customDayCellRef: ' + date.toString();
            if (date.getDay() !== 3 && date.getDay() !== 5) {
                classNames.dayOutsideBounds && element.classList.add(classNames.dayOutsideBounds);
            }
            if (date.getDay() === 3 || date.getDay() === 5) {
                getTextField();
            }
        }
    },
};
