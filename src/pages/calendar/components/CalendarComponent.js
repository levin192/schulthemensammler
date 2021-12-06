import React from "react";
import {calendarStrings} from './data/calendarStrings';
import { Calendar, DayOfWeek } from "@fluentui/react";

const GetTextField = (props) => {
  const onSelectDate = (dateObj) => {
    const dateId =
      ("0" + dateObj.getDate()).slice(-2) +
      ("0" + dateObj.getMonth()).slice(-2) +
      dateObj.getFullYear();

    props.onCalenderClick(dateObj, dateId);
  };


  return (
    <>
      <p>Schultag auswählen</p>
      <Calendar
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
