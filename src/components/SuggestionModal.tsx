import { Box, Button, Heading, Layer, Text } from 'grommet';
import { Github } from 'grommet-icons';
import './SuggestionModal.css';

interface SuggestionModalProps {
  onClose: () => void;
  colors: {
    text: string;
    background: string;
    border: string;
    secondaryText: string;
  };
}

function SuggestionModal({ onClose, colors }: SuggestionModalProps) {
  return (
    <Layer
      onEsc={onClose}
      onClickOutside={onClose}
      className="suggestion-modal-layer"
      style={{
        '--text-color': colors.text,
        '--bg-color': colors.background,
        '--border-color': colors.border,
        '--secondary-text-color': colors.secondaryText,
      } as React.CSSProperties}
    >
      <Box gap="medium" className="suggestion-modal-content">
        <Heading level="3" margin="none" className="suggestion-modal-title">
          🌟 Sugerencias
        </Heading>

        <Text className="suggestion-modal-text">
          Puedes mandarme tu sugerencia por{' '}
          <a
            href="mailto:mrioscristian@gmail.com?subject=Sugerencia App Pomodoro"
            className="suggestion-modal-link"
          >
            email
          </a>
          {' '}para agregar al pomodoro! {':)'}
        </Text>

        <Text className="suggestion-modal-text">
          O también puedes agregar issues o PRs en el repositorio de GitHub:
        </Text>

        <Button
          icon={<Github size="medium" />}
          label="pomodoro"
          href="https://github.com/rioscris/pomodoro"
          target="_blank"
          rel="noopener noreferrer"
          className="suggestion-github-button"
        />

        <Box direction="row" justify="end">
          <Button
            label="Cerrar"
            onClick={onClose}
            className="suggestion-close-button"
          />
        </Box>
      </Box>
    </Layer>
  );
}

export default SuggestionModal;
