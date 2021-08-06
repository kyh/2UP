import styled from "styled-components";
import { theme } from "styles/theme";
import { Container } from "features/game/components/Question";

type InstructionProps = {
  instruction: string;
};

export const Instruction = ({ instruction }: InstructionProps) => {
  return (
    <InstructionContainer className="instruction">
      {instruction}
    </InstructionContainer>
  );
};

export const InstructionContainer = styled(Container)`
  height: 50px;
  color: ${theme.ui.textGrey};
`;
