import React from "react";
import { calendarStrings } from "./data/calendarStrings";
import { Calendar, DayOfWeek } from "@fluentui/react";

const GetTextField = (props) => {
  const onSelectDate = (dateObj) => {
    const dateId =
      ("0" + dateObj.getDate()).slice(-2) +
      ("0" + dateObj.getMonth()).slice(-2) +
      dateObj.getFullYear();

    props.onCalenderClick(dateObj, dateId);
  };

  const getRestrictedDays = (restrictedDays) => {
    if (restrictedDays === null) {
      return [];
    }

    const DAYS = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const restrictedDaysNew = [];
    for (const [day, isNotDayResstricted] of Object.entries(restrictedDays)) {
      if (!isNotDayResstricted) restrictedDaysNew.push(DAYS.indexOf(day));
    }

    return restrictedDaysNew;
  };

  const restrictedDays = getRestrictedDays(props.restrictedDays);

  const isDateInFuture = (date) => {
    console.log(
      "Date i got:",
      date,
      "is in future:",
      +new Date(date) > +new Date()
    );

    return +new Date(date) > +new Date();
  };

  const restricedDaysGenerator = (element, date, classNames) => {
    if (restrictedDays.includes(date.getDay()) || isDateInFuture(date)) {
      try {
        classNames.dayOutsideBounds &&
          element.classList.add(classNames.dayOutsideBounds);
        element.children[0].disabled = true;
      } catch (e) {}
    }
  };

  return (
    <>
      <p>Schultag auswählen</p>
      <Calendar
        calendarDayProps={{
          customDayCellRef: restricedDaysGenerator,
        }}
        // restrictedDates={generateNextDates(5000)}
        showWeekNumbers
        firstDayOfWeek={DayOfWeek.Monday}
        highlightSelectedMonth
        showGoToToday={true}
        onSelectDate={onSelectDate}
        strings={calendarStrings}
      />
    </>
  );
};

export default GetTextField;
