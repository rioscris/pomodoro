import { Box, Heading, MaskedInput, Page, PageContent, Text } from 'grommet';

const DigitsRegex = /[0-9]$/

const TimeInput = () => (
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
	/>
)

function Configurations() {
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
							<TimeInput />
						</Box>
						<Box direction="row" gap="medium" align='center' justify='between'>
							<Text>Short break</Text>
							<TimeInput />
						</Box>
						<Box direction="row" gap="medium" align='center' justify='between'>
							<Text>Long break</Text>
							<TimeInput />
						</Box>
					</Box>
				</PageContent>
			</Page>
		</>
	)
}

export default Configurations; 