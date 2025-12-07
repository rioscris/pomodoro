export const POMODOROS_BEFORE_LONG_BREAK = 3;

export const DEFAULT_POMODORO_TIME = '25:00';
export const DEFAULT_SHORT_BREAK_TIME = '05:00';
export const DEFAULT_LONG_BREAK_TIME = '15:00';

export const parseTime = (str: string): { minutes: number; seconds: number } => {
  const [mm, ss] = str.split(':').map(Number);
  return { minutes: mm || 0, seconds: ss || 0 };
};

export const timeToString = (number: number): string => {
  return number < 10 ? `0${number}` : `${number}`;
};

export const getExpiryDate = (minutes: number, seconds: number): Date => {
  const date = new Date();
  const totalSeconds = minutes * 60 + seconds;
  date.setSeconds(date.getSeconds() + totalSeconds);
  return date;
};
