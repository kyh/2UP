import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { useAlert } from "react-alert";
import { SCENE_FRAGMENT } from "features/packs/sceneFragments";
import { savingSceneVar } from "features/packs/packService";

import { SceneUpdateMutation } from "./__generated__/SceneUpdateMutation";
import { SceneCreateMutation } from "./__generated__/SceneCreateMutation";
import { SceneDeleteMutation } from "./__generated__/SceneDeleteMutation";
import { SceneOrderUpdateMutation } from "./__generated__/SceneOrderUpdateMutation";
import { SceneFragment } from "./__generated__/SceneFragment";

export const useUpdateScene = (scene: SceneFragment) => {
  const alert = useAlert();
  const [sceneUpdate] = useMutation<SceneUpdateMutation>(SCENE_UPDATE);

  const updateScene = async (updatedScene = {}) => {
    savingSceneVar(true);
    const newScene = { ...scene, ...updatedScene };
    console.log("Update new Scene:", newScene);
    try {
      await sceneUpdate({
        variables: {
          input: {
            id: newScene.id || "",
            instruction: newScene.instruction,
            questionTypeSlug: newScene.questionType.slug,
            question: newScene.question,
            answerTypeSlug: newScene.answerType.slug,
            sceneAnswers: newScene.sceneAnswers,
          },
        },
      });
      savingSceneVar(false);
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  return { updateScene };
};

const SCENE_UPDATE = gql`
  mutation SceneUpdateMutation($input: SceneUpdateInput!) {
    sceneUpdate(input: $input) {
      scene {
        ...SceneFragment
      }
    }
  }
  ${SCENE_FRAGMENT}
`;

export const useCreateScene = () => {
  const alert = useAlert();
  const [sceneCreate] = useMutation<SceneCreateMutation>(SCENE_CREATE);
  const createScene = async (
    packId: string,
    order: number,
    selectedScene?: SceneFragment
  ) => {
    const input = {
      packId: packId,
      instruction: selectedScene ? selectedScene.instruction : "",
      questionTypeSlug: selectedScene
        ? selectedScene.questionType.slug
        : "text",
      question: selectedScene ? selectedScene.question : "Question?",
      answerTypeSlug: selectedScene ? selectedScene.answerType.slug : "text",
      sceneAnswers: selectedScene
        ? selectedScene.sceneAnswers
        : [{ content: "Answer!", isCorrect: true }],
      order,
    };

    try {
      savingSceneVar(true);
      const { data } = await sceneCreate({
        variables: { input },
      });
      const newScene = data?.sceneCreate?.scene;
      savingSceneVar(false);
      return newScene;
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  return { createScene };
};

const SCENE_CREATE = gql`
  mutation SceneCreateMutation($input: SceneCreateInput!) {
    sceneCreate(input: $input) {
      scene {
        id
      }
    }
  }
`;

export const useDeleteScene = () => {
  const alert = useAlert();
  const [sceneDelete] = useMutation<SceneDeleteMutation>(SCENE_DELETE);
  const deleteScene = async (sceneId: string, index: number) => {
    try {
      savingSceneVar(true);
      const { data } = await sceneDelete({
        variables: {
          input: {
            id: sceneId,
          },
        },
      });
      savingSceneVar(false);
      const deletedScene = data?.sceneDelete?.scene;
      return deletedScene;
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  return { deleteScene };
};

const SCENE_DELETE = gql`
  mutation SceneDeleteMutation($input: SceneDeleteInput!) {
    sceneDelete(input: $input) {
      scene {
        id
      }
    }
  }
`;

export const useUpdateSceneOrder = () => {
  const alert = useAlert();
  const [sceneOrderUpdate] = useMutation<SceneOrderUpdateMutation>(
    SCENE_ORDER_UPDATE
  );
  const updateSceneOrder = async (
    sceneId: string,
    beforeSceneId?: string,
    afterSceneId?: string
  ) => {
    try {
      savingSceneVar(true);
      await sceneOrderUpdate({
        variables: {
          input: {
            id: sceneId,
            beforeId: beforeSceneId,
            afterId: afterSceneId,
          },
        },
      });
      savingSceneVar(false);
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  return { updateSceneOrder };
};

const SCENE_ORDER_UPDATE = gql`
  mutation SceneOrderUpdateMutation($input: SceneOrderUpdateInput!) {
    sceneOrderUpdate(input: $input) {
      scene {
        id
        order
      }
    }
  }
`;
