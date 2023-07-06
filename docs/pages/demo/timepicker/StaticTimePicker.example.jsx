import React, { useState } from 'react';
import { TimePicker } from '@eidosmedia/material-ui-pickers';

const StaticTimePicker = () => {
  const [date, changeDate] = useState(new Date());
  const minTime = new Date(2023, 7, 5, 8, 0, 0);
  const maxTime = new Date(2023, 7, 5, 18, 0, 0);

  // prettier-ignore
  return (
    <>
      <TimePicker
        autoOk
        variant="static"
        openTo="hours"
        value={date}
        onChange={changeDate}
        minTime={minTime}
        maxTime={maxTime}
      />

      <TimePicker
        autoOk
        ampm={false}
        variant="static"
        orientation="landscape"
        openTo="minutes"
        value={date}
        onChange={changeDate}
      />
    </>
  );
};

export default StaticTimePicker;
