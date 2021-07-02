import { useEffect, useState, useRef } from "react";
import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import {
  useDynamicList,
  useDynamicListItem,
  calculateSwapDistance,
  arrayMove,
  getDragStateZIndex,
  DynamicListItemProps,
  getDragCursor,
} from "styles/animations";
import { theme } from "styles/theme";
import { useHotkeys } from "@react-hook/hotkey";
import { Button, Icon } from "components";
import { Question } from "features/game/components/Question";
import { Answer } from "features/game/components/Answer";
import { keybindings } from "features/packs/packService";
import {
  useCreateScene,
  useDeleteScene,
  useUpdateSceneOrder,
} from "features/packs/sceneService";
import { CsvImportButton } from "features/packs/components/PackCsvImport";

import { SceneFragment } from "../__generated__/SceneFragment";

type Props = {
  packId: string;
  packScenes: SceneFragment[];
  selectedSceneId?: string;
  selectScene: (scene: any) => void;
  refetch: () => void;
};

export const Sidebar = ({
  packId,
  packScenes,
  selectedSceneId,
  selectScene,
  refetch,
}: Props) => {
  const { createScene } = useCreateScene();
  const { deleteScene } = useDeleteScene();
  const { updateSceneOrder } = useUpdateSceneOrder();
  const [scenes, setScenes] = useState(packScenes);
  const draggingRef = useRef(false);

  // Remove this and just use packScenes
  useEffect(() => {
    if (draggingRef.current) return;
    if (JSON.stringify(scenes) !== JSON.stringify(packScenes)) {
      setScenes(packScenes);
    }
  }, [packScenes]);

  const onPositionUpdate = (startIndex: number, endIndex: number) => {
    draggingRef.current = true;
    const newOrder = arrayMove(scenes, startIndex, endIndex);
    setScenes(newOrder);
  };

  const onDragEnd = async (startIndex: number, endIndex: number) => {
    const sceneId = scenes[startIndex].id;
    let beforeSceneId;
    let afterSceneId;

    if (endIndex !== 0) {
      beforeSceneId = scenes[endIndex - 1].id;
    }

    if (endIndex !== scenes.length - 1) {
      afterSceneId = scenes[endIndex + 1].id;
    }

    await updateSceneOrder(sceneId, beforeSceneId, afterSceneId);
    draggingRef.current = false;
  };

  const itemProps = useDynamicList({
    items: scenes,
    swapDistance: calculateSwapDistance,
    onPositionUpdate,
    onDragEnd,
  });

  const onDeleteScene = async (sceneId: string, index: number) => {
    const deletedScene = await deleteScene(sceneId, index);
    if (deletedScene) {
      await refetch();
      if (sceneId === selectedSceneId) {
        const prev = scenes[index - 1];
        const next = scenes[index + 1];
        if (prev) {
          selectScene(prev.id);
        } else if (next) {
          selectScene(next.id);
        }
      }
    }
  };

  const onCreateScene = async () => {
    const selectedScene = scenes.find((s) => s.id === selectedSceneId);
    const order = (scenes?.length || 0) + 1;
    const newScene = await createScene(packId, order, selectedScene);
    await refetch();
    if (newScene) {
      selectScene(newScene.id);
    }
  };

  useHotkeys(window, [[keybindings.addNewScene.hotkey, onCreateScene]]);

  return (
    <>
      <SidebarHeader />
      <SidebarContent>
        {scenes.map((scene, index) => {
          return (
            <SidebarItem
              key={scene.id}
              index={index}
              itemProps={itemProps}
              scene={scene}
              isSelected={selectedSceneId === scene.id}
              selectScene={selectScene}
              onDeleteScene={onDeleteScene}
              showDelete={scenes.length > 1}
            />
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={onCreateScene} fullWidth>
          Add New Scene
        </Button>
        <CsvImportButton packId={packId} scenes={scenes} refetch={refetch} />
      </SidebarFooter>
    </>
  );
};

const SidebarHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacings(3)};
  h3 {
    margin: 0;
  }
`;

const SidebarContent = styled.ul`
  overflow: auto;
  padding: 0 ${theme.spacings(3)} 0 0;
  margin: 0;
`;

const SidebarFooter = styled.footer`
  padding: ${theme.spacings(3)};
`;

type SidebarItemProps = {
  index: number;
  scene: SceneFragment;
  isSelected: boolean;
  selectScene: (sceneId: string) => any;
  onDeleteScene: (sceneId: string, index: number) => any;
  showDelete: boolean;
  itemProps: DynamicListItemProps;
};

const SidebarItem = ({
  scene,
  index,
  isSelected,
  selectScene,
  onDeleteScene,
  showDelete,
  itemProps,
}: SidebarItemProps) => {
  const [dragState, ref, eventHandlers] = useDynamicListItem<HTMLLIElement>(
    index,
    "y",
    itemProps
  );

  useEffect(() => {
    if (ref && ref.current && isSelected) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [isSelected]);

  return (
    <QuestionItemContainer
      layout
      initial={false}
      drag="y"
      ref={ref}
      style={{
        zIndex: getDragStateZIndex(dragState),
        cursor: getDragCursor(dragState),
      }}
      {...eventHandlers}
    >
      <QuestionItem
        isSelected={isSelected}
        onClick={() => selectScene(scene.id)}
      >
        <div className="preview">
          <Question
            question={scene.question}
            instruction={scene.instruction || ""}
            questionType={scene.questionType.slug}
            displayMode
          />
          <div className="answers-container">
            {scene.sceneAnswers?.map((sceneAnswer) => {
              if (!sceneAnswer) return null;
              return (
                <Answer
                  key={sceneAnswer.id}
                  sceneAnswer={{
                    id: sceneAnswer.id,
                    content: sceneAnswer.content || "",
                    isCorrect: sceneAnswer.isCorrect,
                  }}
                  answerType={scene.answerType.slug}
                  onSubmit={() => {}}
                  submitted
                  displayMode
                />
              );
            })}
          </div>
        </div>
        {showDelete && (
          <button
            className="delete"
            onClick={() => onDeleteScene(scene.id, index)}
          >
            <Icon icon="trash" />
          </button>
        )}
      </QuestionItem>
    </QuestionItemContainer>
  );
};

const QuestionItemContainer = styled(motion.li)`
  padding: ${theme.spacings(1)} 0;
`;

const QuestionItem = styled.div<{ isSelected: boolean }>`
  position: relative;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: ${theme.spacings(2)};
  padding-left: ${theme.spacings(6)};
  transition: background 0.2s ease, box-shadow 0.2s ease;
  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: ${theme.ui.backgroundPurple};
      box-shadow: inset ${theme.spacings(1)} 0 0 0 ${theme.colors.purple};
    `}

  &:hover {
    .delete {
      display: block;
    }
    .preview {
      box-shadow: 0 0 3px 0 ${theme.colors.purple};
      border-color: ${theme.colors.purple};
    }
  }

  .preview {
    cursor: pointer;
    font-size: 0.4rem;
    background: ${theme.ui.background};
    padding: ${theme.spacings(2)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid ${theme.ui.borderColor};
    border-radius: ${theme.ui.borderWavyRadius};
    transition: border-color 0.1s ease, box-shadow 0.1s ease;
    > div:first-child {
      margin-bottom: ${theme.spacings(1)};
    }
    > img {
      object-fit: contain;
      max-width: 70px;
      height: 40px;
      display: block;
    }
    > h1 {
      font-size: 0.7rem;
    }
    .question {
      margin: 0 auto ${theme.spacings(2)};
    }
    .video-player {
      width: 70px !important;
      height: 40px !important;
    }
    .audio-player {
      transform: scale(0.5);
      transform-origin: 75px;
      margin: -20px 0;
      min-width: auto;
      .rhap_additional-controls,
      .rhap_volume-controls {
        display: none;
      }
    }
    .answers-container {
      display: grid;
      grid-template-columns: repeat(2, max-content);
      grid-gap: ${theme.spacings(1)};
    }
    .display-text {
      font-size: 0.4rem;
      padding: ${theme.spacings(1)} ${theme.spacings(2)};
      max-width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.correct {
        border-color: ${theme.colors.purple};
      }
    }
    > * {
      pointer-events: none;
    }
  }

  .delete {
    display: none;
    position: absolute;
    right: ${theme.spacings(-1)};
    top: ${theme.spacings(-1)};
  }
`;
