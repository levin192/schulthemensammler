import * as React from 'react';
import {Calendar, ICalendarDayProps, defaultCalendarStrings} from '@fluentui/react';

export const CalendarInlineCustomDayCellRefExample: React.FunctionComponent = () => {

  return (
      <div style={{height: 'auto'}}>
        <Calendar
            highlightSelectedMonth
            showGoToToday
            calendarDayProps={calendarDayProps}
            // Calendar uses English strings by default. For localized apps, you must override this prop.
            strings={defaultCalendarStrings}
        />
      </div>
  );
};

const calendarDayProps: Partial<ICalendarDayProps> = {
    customDayCellRef: (element, date, classNames) => {
        if (element) {
            element.title = 'custom title from customDayCellRef: ' + date.toString();
            if (date.getDay() !== 3 && date.getDay() !== 5) {
                classNames.dayOutsideBounds && element.classList.add(classNames.dayOutsideBounds);
                // (element.children[0] as HTMLButtonElement).disabled = true;
            }
        }
    },
};
