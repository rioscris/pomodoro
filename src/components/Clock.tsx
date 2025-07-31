import React from 'react';
import { Box, Button } from 'grommet';
import { useTimer } from 'react-timer-hook';
import { Play, Pause } from 'grommet-icons';

const Colors = {
  Text: '#fae5c5',
  Background: '#f08b4f',
};

const minutesFromNow = (minutes: number): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

const timeToString = (number: number): string => {
  return number < 10 ? `0${number}` : `${number}`;
}

const Clock: React.FC = () => {
  const defaultExpiryTimestamp = minutesFromNow(25);
  const onExpire = () => {
    console.warn("Timer expired!");
  }
  const { minutes, seconds, pause, isRunning, resume } = useTimer({ expiryTimestamp: defaultExpiryTimestamp, onExpire, autoStart: false })
  const toggleTimer = () => {
    if (isRunning) {
      pause();
    } else {
      resume();
    }
  }
  return (
    <div>
      <Box align="center" justify="center">
        <Button
          primary
          label={`${timeToString(minutes)}:${timeToString(seconds)}`}
          onClick={toggleTimer}
          color={Colors.Background}
          style={{
            fontSize: '3em',
            minWidth: '200px',
            minHeight: '200px',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            color: Colors.Text,
          }}
        />
      </Box>
    </div>
  );
};

export default Clock;