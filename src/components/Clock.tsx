import React from 'react';
import { useTimer } from 'react-timer-hook';

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
            <button onClick={toggleTimer} style={{ fontSize: '2em', padding: '10px 20px' }}>
                {timeToString(minutes)}:{timeToString(seconds)}
            </button>
        </div>
    );
};

export default Clock;