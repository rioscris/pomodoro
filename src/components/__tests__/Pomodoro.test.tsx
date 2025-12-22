import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Pomodoro from '../Pomodoro';
import { PomodoroProvider } from '../../contexts/PomodoroContext';
import { ColorModeProvider } from '../../contexts/ColorModeContext';

vi.mock('react-timer-hook', () => ({
  useTimer: () => ({
    minutes: 25,
    seconds: 0,
    pause: vi.fn(),
    isRunning: false,
    resume: vi.fn(),
    restart: vi.fn(),
  }),
}));

const renderPomodoro = () => {
  return render(
    <BrowserRouter>
      <ColorModeProvider>
        <PomodoroProvider>
          <Pomodoro />
        </PomodoroProvider>
      </ColorModeProvider>
    </BrowserRouter>
  );
};

describe('Pomodoro - Completed Pomodoros Input', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the completed pomodoros input with initial value', () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('0');
  });

  it('should accept valid numeric input', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '5' } });
    await waitFor(() => {
      expect(input.value).toBe('5');
    });
  });

  it('should reject negative numbers', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '-5' } });
    await waitFor(() => {
      expect(input.value).toBe('0');
    });
  });

  it('should reject letters', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'abc' } });
    await waitFor(() => {
      expect(input.value).toBe('0');
    });
  });

  it('should reject decimal numbers', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '3.5' } });
    await waitFor(() => {
      expect(input.value).toBe('0');
    });
  });

  it('should reject numbers above 99', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '100' } });
    await waitFor(() => {
      expect(input.value).toBe('0');
    });
  });

  it('should allow deleting the value', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '5' } });
    await waitFor(() => {
      expect(input.value).toBe('5');
    });

    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should restore previous value on blur if empty', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '7' } });
    await waitFor(() => {
      expect(input.value).toBe('7');
    });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input.value).toBe('7');
    });
  });

  it('should restore previous value on blur if invalid', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '3' } });
    await waitFor(() => {
      expect(input.value).toBe('3');
    });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input.value).toBe('3');
    });
  });

  it('should accept boundary values (0 and 99)', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '0' } });
    await waitFor(() => {
      expect(input.value).toBe('0');
    });

    fireEvent.change(input, { target: { value: '99' } });
    await waitFor(() => {
      expect(input.value).toBe('99');
    });
  });

  it('should reject special characters', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

    for (const char of specialChars) {
      fireEvent.change(input, { target: { value: char } });
      await waitFor(() => {
        expect(input.value).toBe('0');
      });
    }
  });

  it('should accept multiple digit numbers within range', async () => {
    renderPomodoro();
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;

    const validNumbers = ['1', '10', '25', '50', '75', '99'];

    for (const num of validNumbers) {
      fireEvent.change(input, { target: { value: num } });
      await waitFor(() => {
        expect(input.value).toBe(num);
      });
    }
  });
});
