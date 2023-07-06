import * as React from 'react';
import ClockNumber from './ClockNumber';
import { IUtils } from '@date-io/core/IUtils';
import { MaterialUiPickersDate } from '../../typings/date';

export const getHourNumbers = ({
  ampm,
  utils,
  date,
  isDisabled,
}: {
  ampm: boolean;
  utils: IUtils<MaterialUiPickersDate>;
  date: MaterialUiPickersDate;
  isDisabled: (value: number) => boolean;
}) => {
  const currentHours = utils.getHours(date);

  const hourNumbers: JSX.Element[] = [];
  const startHour = ampm ? 1 : 0;
  const endHour = ampm ? 12 : 23;

  const isSelected = (hour: number) => {
    if (ampm) {
      if (hour === 12) {
        return currentHours === 12 || currentHours === 0;
      }

      return currentHours === hour || currentHours - 12 === hour;
    }

    return currentHours === hour;
  };

  for (let hour = startHour; hour <= endHour; hour += 1) {
    let label = hour.toString();

    if (hour === 0) {
      label = '00';
    }

    const props = {
      index: hour,
      label: utils.formatNumber(label),
      selected: isSelected(hour),
      isInner: !ampm && (hour === 0 || hour > 12),
    };

    hourNumbers.push(<ClockNumber key={hour} disabled={isDisabled(hour)} {...props} />);
  }

  return hourNumbers;
};

export const getMinutesNumbers = ({
  value,
  utils,
  isDisabled,
}: {
  value: number;
  utils: IUtils<MaterialUiPickersDate>;
  isDisabled: (value: number) => boolean;
}) => {
  const f = utils.formatNumber;

  return [
    <ClockNumber
      label={f('00')}
      selected={value === 0}
      index={12}
      key={12}
      disabled={isDisabled(0)}
    />,
    <ClockNumber
      label={f('05')}
      selected={value === 5}
      index={1}
      key={1}
      disabled={isDisabled(5)}
    />,
    <ClockNumber
      label={f('10')}
      selected={value === 10}
      index={2}
      key={2}
      disabled={isDisabled(10)}
    />,
    <ClockNumber
      label={f('15')}
      selected={value === 15}
      index={3}
      key={3}
      disabled={isDisabled(15)}
    />,
    <ClockNumber
      label={f('20')}
      selected={value === 20}
      index={4}
      key={4}
      disabled={isDisabled(20)}
    />,
    <ClockNumber
      label={f('25')}
      selected={value === 25}
      index={5}
      key={5}
      disabled={isDisabled(25)}
    />,
    <ClockNumber
      label={f('30')}
      selected={value === 30}
      index={6}
      key={6}
      disabled={isDisabled(30)}
    />,
    <ClockNumber
      label={f('35')}
      selected={value === 35}
      index={7}
      key={7}
      disabled={isDisabled(35)}
    />,
    <ClockNumber
      label={f('40')}
      selected={value === 40}
      index={8}
      key={8}
      disabled={isDisabled(40)}
    />,
    <ClockNumber
      label={f('45')}
      selected={value === 45}
      index={9}
      key={9}
      disabled={isDisabled(45)}
    />,
    <ClockNumber
      label={f('50')}
      selected={value === 50}
      index={10}
      key={10}
      disabled={isDisabled(50)}
    />,
    <ClockNumber
      label={f('55')}
      selected={value === 55}
      index={11}
      key={11}
      disabled={isDisabled(55)}
    />,
  ];
};
