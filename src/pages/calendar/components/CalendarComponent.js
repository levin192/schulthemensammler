import React from "react";
import { Calendar, DayOfWeek } from "@fluentui/react";

const GetTextField = (props) => {
  const onSelectDate = (dateObj) => {
    const dateId =
      ("0" + dateObj.getDate()).slice(-2) +
      ("0" + dateObj.getMonth()).slice(-2) +
      dateObj.getFullYear();

    props.onCalenderClick(dateObj, dateId);
  };

  const calendarStrings = {
    months: [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ],

    shortMonths: [
      "Jan",
      "Feb",
      "Mär",
      "Apr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dez",
    ],

    days: [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ],

    shortDays: ["SO", "MO", "DI", "MI", "DO", "FR", "SA"],

    goToToday: "Gehe zum aktuellen Monat",
    prevMonthAriaLabel: "Gehe zum vorherigen Monat",
    nextMonthAriaLabel: "Gehe zum nächsten Monat",
    prevYearAriaLabel: "Gehe zum vorherigen Jahr",
    nextYearAriaLabel: "Gehe zum nächsten Jahr",
  };

  return (
    <>
      <p>Schultag auswählen</p>
      <Calendar
        firstDayOfWeek={DayOfWeek.Monday}
        highlightSelectedMonth
        showGoToToday={true}
        // calendarDayProps={calendarDayProps}
        onSelectDate={onSelectDate}
        strings={calendarStrings}
      />
    </>
  );
};

export default GetTextField;
