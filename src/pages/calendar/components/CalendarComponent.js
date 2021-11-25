import React, { useState } from "react";
import { Calendar, defaultCalendarStrings, TextField } from "@fluentui/react";

const GetTextField = () => {
  const [selectedDate, setSelectedDate] = useState();

  const onSelectDate = (dateObj) => {
    window.alert(dateObj);
    const dateString =
      "" + dateObj.getDate() + dateObj.getMonth() + dateObj.getFullYear();
    setSelectedDate(dateString);

    console.log(selectedDate);
  };

  return (
    <>
      <h1>Themen Eintragen</h1>

      <TextField
        id={"eintragen"}
        label="ITN (Nee)"
        multiline
        autoAdjustHeight
      />
      <TextField
        id={"eintragen"}
        label="AWE (Schwandt)"
        multiline
        autoAdjustHeight
      />

      <Calendar
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
