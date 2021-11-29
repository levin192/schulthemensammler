import React from "react";
import { Calendar, defaultCalendarStrings, DayOfWeek } from "@fluentui/react";

const GetTextField = (props) => {
  const onSelectDate = (dateObj) => {
    const dateId =
      ("0" + dateObj.getDate()).slice(-2) +
      ("0" + dateObj.getMonth()).slice(-2) +
      dateObj.getFullYear();

    const rawDate = dateObj;
    props.onCalenderClick(rawDate, dateId);
  };

  return (
    <>
      <h1>Themen Eintragen</h1>

      <Calendar
        firstDayOfWeek={DayOfWeek.Monday}
        highlightSelectedMonth
        showGoToToday
        // calendarDayProps={calendarDayProps}
        onSelectDate={onSelectDate}
        // Calendar uses English strings by default. For localized apps, you must override this prop.
        strings={defaultCalendarStrings}
      />
    </>
  );
};

export default GetTextField;
