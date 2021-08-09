import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import sample from "lodash/sample";
import Sheet from "react-modal-sheet";
import { theme, useIsDesktop } from "styles/theme";
import { bounceIn, bounceOut, fadeUpIn, drawIn } from "styles/animations";
import { StepProps, GameState, SceneAnswer } from "features/game/gameSlice";
import { Instruction } from "features/game/components/Instruction";
import { Question } from "features/game/components/Question";
import { Answer } from "features/game/components/Answer";
import {
  Player,
  PlayersGrid,
  NextButton,
} from "features/game/components/PlayerGrid";
import { AnimationSprite } from "components";
import { useTimeout } from "styles/animations";

const sprites = {
  correct: ["wineGlassClinking", "checkMark", "bubbleLike"],
  wrong: ["crossMark", "bubbleCryEmoji"],
};

const compareAnswer = (answer: string, answerToCompare: string) => {
  return answer.trim().toLowerCase() === answerToCompare.trim().toLowerCase();
};

export const Step2 = ({ gameState, broadcast, name }: StepProps) => {
  const desktop = useIsDesktop();
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [animationSpriteName, setAnimationSpriteName] = useState<any>(null);

  const [firstPlayer] = gameState.players;
  const correctAnswer = gameState.sceneAnswers.find(
    (sceneAnswer) => sceneAnswer.isCorrect
  )!;

  useTimeout(() => {
    const isCurrentPlayerCorrect = compareAnswer(
      gameState.submissions.find((s) => s.name === name)?.content || "",
      correctAnswer.content
    );

    if (isCurrentPlayerCorrect) {
      setAnimationSpriteName(sample(sprites.correct));
    } else {
      setAnimationSpriteName(sample(sprites.wrong));
    }
  }, 500);

  useTimeout(() => {
    if (gameState.submissions.length > 1) {
      setShowSubmissions(true);
    }
  }, 2000);

  return (
    <>
      {animationSpriteName && <CorrectSprite name={animationSpriteName} />}
      {desktop ? (
        <>
          <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
          {showSubmissions && (
            <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
          )}
        </>
      ) : (
        <>
          <AnswerResult
            gameState={gameState}
            sceneAnswer={correctAnswer}
            onAnswerContainerClick={() => setShowSubmissions(true)}
          />
          <StyledSheet
            isOpen={showSubmissions}
            onClose={() => setShowSubmissions(false)}
          >
            <StyledSheet.Container>
              <StyledSheet.Content>
                <Submissions
                  gameState={gameState}
                  sceneAnswer={correctAnswer}
                />
              </StyledSheet.Content>
            </StyledSheet.Container>
            <StyledSheet.Backdrop onClick={() => setShowSubmissions(false)} />
          </StyledSheet>
        </>
      )}
      {firstPlayer && (
        <NextButton
          disabled={firstPlayer.name !== name}
          onClick={() => broadcast("step:next")}
          autoFocus
        >
          {firstPlayer.name === name
            ? "Next"
            : `Waiting for ${firstPlayer.name}`}
        </NextButton>
      )}
    </>
  );
};

const StyledSheet = styled(Sheet)`
  z-index: 1 !important;
  .react-modal-sheet-container {
    background-color: ${theme.ui.background} !important;
  }
`;

export const Step2Spectate = ({ gameState }: StepProps) => {
  const correctAnswer = gameState.sceneAnswers?.find(
    (sceneAnswer) => sceneAnswer.isCorrect
  )!;

  return (
    <>
      <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
      <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
    </>
  );
};

type SubmissionProps = {
  gameState: GameState;
  sceneAnswer: SceneAnswer;
  onAnswerContainerClick?: () => void;
};

const AnswerResult = ({
  gameState,
  onAnswerContainerClick,
}: SubmissionProps) => {
  return (
    <>
      <Instruction instruction={gameState.instruction} />
      <Question
        question={gameState.question}
        questionType={gameState.questionType}
      />
      <AnswerContainer onClick={onAnswerContainerClick}>
        {gameState.sceneAnswers?.map((sceneAnswer) => (
          <Answer
            key={sceneAnswer.id}
            sceneAnswer={sceneAnswer}
            answerType={gameState.answerType}
            onSubmit={() => {}}
            submitted
            displayMode
          />
        ))}
      </AnswerContainer>
    </>
  );
};

const AnswerContainer = styled.div`
  .answer-display {
    animation: ${bounceOut} 1s;
    animation-fill-mode: forwards;

    &.correct {
      animation: none;
      > svg {
        stroke: ${theme.colors.green};
        stroke-width: 5px;
        > path {
          animation: ${drawIn} 0.6s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        }
      }
    }

    &.answer-text {
      overflow: visible;
      text-align: center;
      background-color: ${theme.ui.backgroundGrey};
      padding-top: ${theme.spacings(6)};
      transform: scale(0);
      animation: ${bounceIn} 1s 0.1s forwards;

      &::before {
        content: "answer";
        position: absolute;
        top: ${theme.spacings(-3)};
        left: 50%;
        width: 100px;
        margin-left: -50px;
        padding: ${theme.spacings(1)} 0;
        border-radius: 4px;
        border: 2px solid ${theme.ui.borderColor};
        background-color: ${theme.ui.background};
      }
    }
  }
`;

const Submissions = ({ gameState, sceneAnswer }: SubmissionProps) => {
  const players = gameState.submissions.map((submission) => {
    const isCorrect = compareAnswer(submission.content, sceneAnswer.content);
    return (
      <Player
        key={submission.name}
        playerName={submission.name}
        playerContent={`: "${submission.content}"`}
      >
        {isCorrect && (
          <>
            <div className="correct">
              <Image
                src="/illustrations/correct.svg"
                alt="Correct answer"
                width="50"
                height="70"
              />
            </div>
            <Stars name="blinkingStars2" />
          </>
        )}
      </Player>
    );
  });

  return <SubmissionsContainer>{players}</SubmissionsContainer>;
};

const SubmissionsContainer = styled(PlayersGrid)`
  padding: ${theme.spacings(5)};

  .correct {
    position: absolute;
    top: ${theme.spacings(-3)};
    left: 0;
  }

  .name {
    text-align: center;
  }

  ${theme.breakpoints.desktop} {
    padding: 0 ${theme.spacings(5)};
    animation: ${fadeUpIn} 0.8s cubic-bezier(0.77, 0.13, 0.46, 1.22) forwards;
  }
`;

const Stars = styled(AnimationSprite)`
  top: 40px;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.5);

  ${theme.breakpoints.desktop} {
    top: 20px;
  }
`;

const CorrectSprite = styled(AnimationSprite)`
  left: 50%;
  transform: translateX(-50%);
`;
