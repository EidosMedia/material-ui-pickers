import * as React from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { makeStyles, fade } from '@material-ui/core/styles';

const positions: Record<number, [number, number]> = {
  0: [0, 40],
  1: [55, 19.6],
  2: [94.4, 59.5],
  3: [109, 114],
  4: [94.4, 168.5],
  5: [54.5, 208.4],
  6: [0, 223],
  7: [-54.5, 208.4],
  8: [-94.4, 168.5],
  9: [-109, 114],
  10: [-94.4, 59.5],
  11: [-54.5, 19.6],
  12: [0, 5],
  13: [36.9, 49.9],
  14: [64, 77],
  15: [74, 114],
  16: [64, 151],
  17: [37, 178],
  18: [0, 188],
  19: [-37, 178],
  20: [-64, 151],
  21: [-74, 114],
  22: [-64, 77],
  23: [-37, 50],
};

export interface ClockNumberProps {
  index: number;
  label: string;
  selected: boolean;
  isInner?: boolean;
  disabled: boolean;
}

export const useStyles = makeStyles(
  theme => {
    const size = theme.spacing(4);
    const clockNumberColor =
      theme.palette.type === 'light' ? theme.palette.text.primary : theme.palette.text.hint;

    return {
      clockNumber: {
        width: size,
        height: 32,
        userSelect: 'none',
        position: 'absolute',
        left: `calc((100% - ${typeof size === 'number' ? `${size}px` : size}) / 2)`,
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        color: clockNumberColor,
      },
      clockNumberSelected: {
        color: theme.palette.primary.contrastText,
      },
      clockNumberDisabled: {
        pointerEvents: 'none',
        color: fade(clockNumberColor, 0.2),
      },
    };
  },
  { name: 'MuiPickersClockNumber' }
);

export const ClockNumber: React.FC<ClockNumberProps> = ({
  selected,
  label,
  index,
  isInner,
  disabled,
}) => {
  const classes = useStyles();
  const className = clsx(classes.clockNumber, {
    [classes.clockNumberSelected]: selected,
    [classes.clockNumberDisabled]: disabled,
  });

  const transformStyle = React.useMemo(() => {
    const position = positions[index];

    return {
      transform: `translate(${position[0]}px, ${position[1]}px`,
    };
  }, [index]);

  return (
    <Typography
      component="span"
      className={className}
      variant={isInner ? 'body2' : 'body1'}
      style={transformStyle}
      children={label}
      tabIndex={disabled ? -1 : 0}
    />
  );
};

export default ClockNumber;
