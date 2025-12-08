import { Box, Heading, MaskedInput, Page, PageContent, Text, Button, RadioButtonGroup, type MaskedInputExtendedProps } from 'grommet';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Close, Mail } from 'grommet-icons';
import { useColorMode, type ColorTheme } from '../../contexts/ColorModeContext';
import { usePomodoroContext } from '../../contexts/PomodoroContext';
import { useCalculatedColors } from '../../hooks/useCalculatedColors';
import { getItemFromLocalStorage, setItemToLocalStorage } from '../../utils/localStorage';
import {
	DEFAULT_POMODORO_TIME,
	DEFAULT_SHORT_BREAK_TIME,
	DEFAULT_LONG_BREAK_TIME
} from '../../utils/pomodoro';
import SuggestionModal from '../SuggestionModal';
import './Configurations.css';

const DigitsRegex = /[0-9]$/

const TimeInput = (props: MaskedInputExtendedProps) => (
	<MaskedInput
		mask={[
			{
				length: 2,
				placeholder: 'mm',
				regexp: DigitsRegex
			},
			{
				fixed: ':'
			},
			{
				length: 2,
				placeholder: 'ss',
				regexp: DigitsRegex
			}
		]}
		className="time-input"
		{...props}
	/>
)

const colorThemeOptions = [
	{ label: 'Modo oscuro', value: 'grays' as ColorTheme, description: 'Escala de negros con tonos cada vez más claros' },
	{ label: 'Clásico', value: 'classic' as ColorTheme, description: 'Rojo para trabajo, azul y verde para descansos' },
];

function Configurations() {
	const [pomodoro, setPomodoro] = useState(() => getItemFromLocalStorage('pomodoro', DEFAULT_POMODORO_TIME));
	const [shortBreak, setShortBreak] = useState(() => getItemFromLocalStorage('shortBreak', DEFAULT_SHORT_BREAK_TIME));
	const [longBreak, setLongBreak] = useState(() => getItemFromLocalStorage('longBreak', DEFAULT_LONG_BREAK_TIME));
	const [showSuggestionModal, setShowSuggestionModal] = useState(false);

	const { colorTheme, setColorTheme } = useColorMode();
	const { setShouldPause, setShouldResume } = usePomodoroContext();
	const currentColors = useCalculatedColors();

	useEffect(() => {
		setShouldPause(true);
		return () => {
			setShouldResume(true);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setItemToLocalStorage('pomodoro', pomodoro);
	}, [pomodoro]);
	useEffect(() => {
		setItemToLocalStorage('shortBreak', shortBreak);
	}, [shortBreak]);
	useEffect(() => {
		setItemToLocalStorage('longBreak', longBreak);
	}, [longBreak]);

	const navigate = useNavigate();

	function validateAndNormalizeTime(value: string): string {
		const [mm, ss] = value.split(':').map(Number);

		if (isNaN(mm) || isNaN(ss)) {
			return '01:00';
		}

		let minutes = Math.max(0, Math.min(59, mm));
		let seconds = Math.max(0, Math.min(59, ss));

		if (minutes === 0 && seconds === 0) {
			seconds = 1;
		}

		const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;
		return `${pad(minutes)}:${pad(seconds)}`;
	}

	function handlePomodoroChange(e: React.ChangeEvent<HTMLInputElement>) {
		setPomodoro(e.currentTarget.value);
	}
	function handlePomodoroBlur() {
		setPomodoro(prev => validateAndNormalizeTime(prev));
	}

	function handleShortBreakChange(e: React.ChangeEvent<HTMLInputElement>) {
		setShortBreak(e.currentTarget.value);
	}
	function handleShortBreakBlur() {
		setShortBreak(prev => validateAndNormalizeTime(prev));
	}

	function handleLongBreakChange(e: React.ChangeEvent<HTMLInputElement>) {
		setLongBreak(e.currentTarget.value);
	}
	function handleLongBreakBlur() {
		setLongBreak(prev => validateAndNormalizeTime(prev));
	}

	return (
		<>
			<Page
				kind='full'
				className="configurations-page"
				style={{
					// @ts-expect-error - CSS variables
					'--text-color': currentColors.text,
					'--bg-color': currentColors.background,
					'--border-color': currentColors.border,
					'--secondary-text-color': currentColors.secondaryText,
				}}
			>
				<PageContent align='center' className="configurations-content">
					<Heading
						level="2"
						className="configurations-heading"
					>
						Configuración
					</Heading>

					<Box gap="medium" className="section-container">
						<Heading
							level="3"
							className="section-heading"
						>
							Paleta de colores
						</Heading>
						<RadioButtonGroup
							name="colorTheme"
							options={colorThemeOptions.map(opt => ({
								label: (
									<Box pad="small">
										<Text weight="bold" size="medium" className="radio-label-text">
											{opt.label}
										</Text>
										<Text size="small" className="radio-label-description">
											{opt.description}
										</Text>
									</Box>
								),
								value: opt.value,
							}))}
							value={colorTheme}
							onChange={(event) => setColorTheme(event.target.value as ColorTheme)}
							className="radio-group"
						/>
					</Box>

					<Box className="divider" />

					<Box className="time-settings-container">
						<Heading
							level="3"
							className="section-heading"
						>
							Duración de ciclos
						</Heading>
						<Box direction="row" gap="medium" align='center' className="time-setting-row">
							<Text className="time-label">
								Pomodoro
							</Text>
							<TimeInput
								value={pomodoro}
								onChange={handlePomodoroChange}
								onBlur={handlePomodoroBlur}
							/>
						</Box>
						<Box direction="row" gap="medium" align='center' className="time-setting-row">
							<Text className="time-label">
								Descanso corto
							</Text>
							<TimeInput
								value={shortBreak}
								onChange={handleShortBreakChange}
								onBlur={handleShortBreakBlur}
							/>
						</Box>
						<Box direction="row" gap="medium" align='center' className="time-setting-row">
							<Text className="time-label">
								Descanso largo
							</Text>
							<TimeInput
								value={longBreak}
								onChange={handleLongBreakChange}
								onBlur={handleLongBreakBlur}
							/>
						</Box>
					</Box>

					<Box
						margin={{ top: 'large' }}
						pad="medium"
						className="info-note"
					>
						<Text
							size="small"
							className="info-note-text"
						>
							💾 Los cambios se guardan automáticamente y se aplicarán en el próximo ciclo
						</Text>
					</Box>

					<Box margin={{ top: 'medium' }} align="center">
						<Button
							icon={<Mail size="small" />}
							label="Enviar sugerencia"
							onClick={() => setShowSuggestionModal(true)}
							className="suggestion-button"
						/>
					</Box>
				</PageContent>
			</Page>

			<Box className="close-button-container">
				<Button
					icon={<Close size="medium" color={currentColors.text} />}
					onClick={() => navigate('/')}
					plain
					className="close-button"
				/>
			</Box>

			{showSuggestionModal && (
				<SuggestionModal
					onClose={() => setShowSuggestionModal(false)}
					colors={{
						text: currentColors.text,
						background: currentColors.background,
						border: currentColors.border,
						secondaryText: currentColors.secondaryText,
					}}
				/>
			)}
		</>
	)
}

export default Configurations; 