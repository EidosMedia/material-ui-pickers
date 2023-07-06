import * as React from 'react';
import * as PropTypes from 'prop-types';
import Clock from './Clock';
import ClockType from '../../constants/ClockType';
import { pipe } from '../../_helpers/utils';
import { useUtils } from '../../_shared/hooks/useUtils';
import { ParsableDate } from '../../constants/prop-types';
import { MaterialUiPickersDate } from '../../typings/date';
import { useParsedDate } from '../../_shared/hooks/useParsedDate';
import { getHourNumbers, getMinutesNumbers } from './ClockNumbers';
import { useMeridiemMode } from '../../TimePicker/TimePickerToolbar';
import {
  convertToMeridiem,
  convertValueToMeridiem,
  getMeridiem,
  createIsAfterIgnoreDatePart,
} from '../../_helpers/time-utils';

export interface TimePickerViewProps {
  /** TimePicker value */
  date: MaterialUiPickersDate;
  /** Clock type */
  type: 'hours' | 'minutes' | 'seconds';
  /** 12h/24h clock mode */
  ampm?: boolean;
  /** Minutes step */
  minutesStep?: number;
  /** Min time, date part by default, will be ignored */
  minTime?: ParsableDate;
  /** Max time, date part by default, will be ignored */
  maxTime?: ParsableDate;
  /** Dynamically check if time is disabled or not */
  shouldDisableTime?: (timeValue: number, clockType: 'hours' | 'minutes' | 'seconds') => boolean;
  /** On hour change */
  onHourChange: (date: MaterialUiPickersDate, isFinish?: boolean) => void;
  /** On minutes change */
  onMinutesChange: (date: MaterialUiPickersDate, isFinish?: boolean) => void;
  /** On seconds change */
  onSecondsChange: (date: MaterialUiPickersDate, isFinish?: boolean) => void;
}

export const ClockView: React.FC<TimePickerViewProps> = ({
  type,
  onHourChange,
  onMinutesChange,
  onSecondsChange,
  ampm,
  date,
  minutesStep,
  minTime: unparsedMinTime,
  maxTime: unparsedMaxTime,
  shouldDisableTime,
}) => {
  const utils = useUtils();
  const minTime = useParsedDate(unparsedMinTime);
  const maxTime = useParsedDate(unparsedMaxTime);
  const { meridiemMode } = useMeridiemMode(date, ampm, () => {});

  const isTimeDisabled = React.useCallback(
    (rawValue: number, type: 'hours' | 'minutes' | 'seconds') => {
      const validateTimeValue = (
        getRequestedTimePoint: (when: 'start' | 'end') => MaterialUiPickersDate
      ) => {
        const isAfterComparingFn = createIsAfterIgnoreDatePart(utils);

        // prettier-ignore
        return Boolean(
          (minTime && isAfterComparingFn(minTime, getRequestedTimePoint('end'))) ||
          (maxTime && isAfterComparingFn(getRequestedTimePoint('start'), maxTime)) ||
          (shouldDisableTime && shouldDisableTime(rawValue, type))
        );
      };

      switch (type) {
        case 'hours':
          const hoursWithMeridiem = convertValueToMeridiem(rawValue, meridiemMode, Boolean(ampm));
          return validateTimeValue((when: 'start' | 'end') =>
            pipe(
              currentDate => utils.setHours(currentDate, hoursWithMeridiem),
              dateWithHours => utils.setMinutes(dateWithHours, when === 'start' ? 0 : 59),
              dateWithMinutes => utils.setSeconds(dateWithMinutes, when === 'start' ? 0 : 59)
            )(date)
          );
        case 'minutes':
          return validateTimeValue((when: 'start' | 'end') =>
            pipe(
              currentDate => utils.setMinutes(currentDate, rawValue),
              dateWithMinutes => utils.setSeconds(dateWithMinutes, when === 'start' ? 0 : 59)
            )(date)
          );
        case 'seconds':
          return validateTimeValue(() => utils.setSeconds(date, rawValue));
      }
    },
    [ampm, date, maxTime, meridiemMode, minTime, shouldDisableTime, utils]
  );

  const viewProps = React.useMemo(() => {
    switch (type) {
      case ClockType.HOURS:
        return {
          value: utils.getHours(date),
          children: getHourNumbers({
            date,
            utils,
            ampm: Boolean(ampm),
            isDisabled: value => isTimeDisabled(value, 'hours'),
          }),
          onChange: (value: number, isFinish?: boolean) => {
            const currentMeridiem = getMeridiem(date, utils);
            const updatedTimeWithMeridiem = convertToMeridiem(
              utils.setHours(date, value),
              currentMeridiem,
              Boolean(ampm),
              utils
            );

            onHourChange(updatedTimeWithMeridiem, isFinish);
          },
        };

      case ClockType.MINUTES:
        const minutesValue = utils.getMinutes(date);
        return {
          value: minutesValue,
          children: getMinutesNumbers({
            value: minutesValue,
            utils,
            isDisabled: value => isTimeDisabled(value, 'minutes'),
          }),
          onChange: (value: number, isFinish?: boolean) => {
            const updatedTime = utils.setMinutes(date, value);

            onMinutesChange(updatedTime, isFinish);
          },
        };

      case ClockType.SECONDS:
        const secondsValue = utils.getSeconds(date);
        return {
          value: secondsValue,
          children: getMinutesNumbers({
            value: secondsValue,
            utils,
            isDisabled: value => isTimeDisabled(value, 'seconds'),
          }),
          onChange: (value: number, isFinish?: boolean) => {
            const updatedTime = utils.setSeconds(date, value);

            onSecondsChange(updatedTime, isFinish);
          },
        };

      default:
        throw new Error('You must provide the type for TimePickerView');
    }
  }, [ampm, date, onHourChange, onMinutesChange, onSecondsChange, type, utils]);

  return (
    <Clock
      type={type}
      ampm={ampm}
      minutesStep={minutesStep}
      isTimeDisabled={isTimeDisabled}
      {...viewProps}
    />
  );
};

ClockView.displayName = 'TimePickerView';

ClockView.propTypes = {
  date: PropTypes.object.isRequired,
  onHourChange: PropTypes.func.isRequired,
  onMinutesChange: PropTypes.func.isRequired,
  onSecondsChange: PropTypes.func.isRequired,
  ampm: PropTypes.bool,
  minutesStep: PropTypes.number,
  type: PropTypes.oneOf(Object.keys(ClockType).map(key => ClockType[key as keyof typeof ClockType]))
    .isRequired,
} as any;

ClockView.defaultProps = {
  ampm: true,
  minutesStep: 1,
};

export default React.memo(ClockView);
