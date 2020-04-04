import React from 'react';
import { AvatarImage, Button } from 'components';
import { SceneProps } from 'features/game/gameSlice';
import { hashCode } from 'utils/stringUtils';
import {
  TVQuestionConatiner,
  Question
} from 'features/game/components/Question';
import { SubmissionsContainer } from 'features/game/components/SubmissionsContainer';
import correctSvg from 'features/game/components/correct.svg';
import { renderContent } from 'features/game/components/Answer';

export const Scene3Remote = ({ state, broadcast, name }: SceneProps) => {
  const firstPlayer = state.players[0];
  return (
    <section>
      <SubmissionsContainer>
        {state.submissions.map(submission => {
          if (!submission.content) return null;
          const isRightAnswer = submission.content === state.answer;
          return (
            <div className="submission full" key={submission.id}>
              {isRightAnswer && (
                <img
                  className="correct"
                  src={correctSvg}
                  alt="Correct answer"
                />
              )}
              <Button disabled>{renderContent(state.pack, submission.content)}</Button>
              <div className="endorsement-container">
                {submission.endorsers.map(endorser => {
                  const avatar = hashCode(endorser.name, 10);
                  return (
                    <div className="endorsement" key={endorser.id}>
                      <AvatarImage avatar={avatar} />
                      {endorser.name}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </SubmissionsContainer>
      {firstPlayer && (
        <Button
          disabled={firstPlayer.name !== name}
          onClick={() => broadcast('scene:next')}
        >
          {firstPlayer.name === name ? 'Next' : `Waiting for ${firstPlayer.name}`}
        </Button>
      )}
    </section>
  );
};

export const Scene3TV = ({ state }: SceneProps) => {
  return (
    <section>
      <SubmissionsContainer>
        {state.submissions.map(submission => {
          if (!submission.content) return null;
          const isRightAnswer = submission.content === state.answer;
          return (
            <div className="submission" key={submission.id}>
              {isRightAnswer && (
                <img
                  className="correct"
                  src={correctSvg}
                  alt="Correct answer"
                />
              )}
              <Button disabled>{renderContent(state.pack, submission.content)}</Button>
              <div className="endorsement-container">
                {submission.endorsers.map(endorser => {
                  const avatar = hashCode(endorser.name, 10);
                  return (
                    <div className="endorsement" key={endorser.id}>
                      <AvatarImage avatar={avatar} />
                      {endorser.name}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </SubmissionsContainer>
    </section>
  );
};
