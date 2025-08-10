import { Box, Heading, MaskedInput, Page, PageContent, Text, type MaskedInputExtendedProps } from 'grommet';
import { useEffect, useState } from 'react';

const DigitsRegex = /[0-9]$/

const TimeInput = (props: MaskedInputExtendedProps) => (
	<MaskedInput
		mask={[
			{
				length: 2,
				placeholder: 'hh',
				regexp: DigitsRegex
			},
			{
				fixed: ':'
			},
			{
				length: 2,
				placeholder: 'mm',
				regexp: DigitsRegex
			}
		]}
		{...props}
	/>
)

function getInitialTime(key: string, fallback: string) {
	if (typeof window !== 'undefined') {
		return localStorage.getItem(key) || fallback;
	}
	return fallback;
}

function Configurations() {
	const [pomodoro, setPomodoro] = useState(() => getInitialTime('pomodoro', '25:00'));
	const [shortBreak, setShortBreak] = useState(() => getInitialTime('shortBreak', '05:00'));
	const [longBreak, setLongBreak] = useState(() => getInitialTime('longBreak', '15:00'));

	useEffect(() => {
		localStorage.setItem('pomodoro', pomodoro);
	}, [pomodoro]);
	useEffect(() => {
		localStorage.setItem('shortBreak', shortBreak);
	}, [shortBreak]);
	useEffect(() => {
		localStorage.setItem('longBreak', longBreak);
	}, [longBreak]);

	function handlePomodoroChange(e: React.ChangeEvent<HTMLInputElement>) {
		setPomodoro(e.currentTarget.value);
	}
	function handleShortBreakChange(e: React.ChangeEvent<HTMLInputElement>) {
		setShortBreak(e.currentTarget.value);
	}
	function handleLongBreakChange(e: React.ChangeEvent<HTMLInputElement>) {
		setLongBreak(e.currentTarget.value);
	}

	return (
		<>
			<Page kind='full'>
				<PageContent align='center'>
					<Heading>
						Tiempos del Pomodoro
					</Heading>
					<Box gap="medium">
						<Box direction="row" gap="medium" align='center' justify='between'>
							<Text>Pomodoro</Text>
							<TimeInput value={pomodoro} onChange={handlePomodoroChange} />
						</Box>
						<Box direction="row" gap="medium" align='center' justify='between'>
							<Text>Short break</Text>
							<TimeInput value={shortBreak} onChange={handleShortBreakChange} />
						</Box>
						<Box direction="row" gap="medium" align='center' justify='between'>
							<Text>Long break</Text>
							<TimeInput value={longBreak} onChange={handleLongBreakChange} />
						</Box>
					</Box>
				</PageContent>
			</Page>
		</>
	)
}

export default Configurations; 