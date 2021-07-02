import { makeVar } from "@apollo/client";
import { Hotkey } from "@react-hook/hotkey";
import { SceneUpdateMutation_sceneUpdate_scene } from "./__generated__/SceneUpdateMutation";

export enum VisibleQATypeMenu {
  None,
  Question,
  Answer,
}

export const visibleQATypeMenuVar = makeVar(VisibleQATypeMenu.None);
export const savingSceneVar = makeVar(false);
export const packScenesVar = makeVar<any[]>([]);

export const getRandomAnswer = () => {
  const packScenes = packScenesVar();
  const { sceneAnswers } = packScenes[
    Math.floor(Math.random() * packScenes.length)
  ];
  const randomAnswer =
    sceneAnswers[Math.floor(Math.random() * sceneAnswers.length)];
  return randomAnswer;
};

export const scenesToCsv = (
  scenes: Pick<
    SceneUpdateMutation_sceneUpdate_scene,
    | "externalId"
    | "instruction"
    | "question"
    | "questionType"
    | "sceneAnswers"
    | "answerType"
  >[]
) => {
  return scenes
    .map((s) => {
      const sceneAnswers = s.sceneAnswers?.map((a) => {
        return `${a?.content || ""},${a?.isCorrect ? "TRUE" : ""}`;
      });
      return [
        s.externalId,
        s.instruction,
        s.questionType.slug,
        s.question,
        s.answerType.slug,
        ...(sceneAnswers || []),
      ].join();
    })
    .join("\n");
};

export const fileToCsv = (file: File) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      if (reader.result) {
        const csvText = reader.result.toString();
        resolve(csvText);
      }
    };
  });
};

type Keybindings = {
  [key: string]: {
    hotkey: Hotkey[];
    display: string;
    description: string;
  };
};

export const keybindings: Keybindings = {
  showShortcuts: {
    hotkey: ["mod", "/"],
    display: "⌘ + /",
    description: "Show keyboard shortcuts",
  },
  previousScene: {
    hotkey: ["up"],
    display: "Up arrow",
    description: "Select previous Scene",
  },
  nextScene: {
    hotkey: ["down"],
    display: "Down arrow",
    description: "Select next Scene",
  },
  addNewScene: {
    hotkey: ["mod", "d"],
    display: "⌘ + d",
    description: "Add new Scene",
  },
  focusScene: {
    hotkey: ["mod", "a"],
    display: "⌘ + a",
    description: "Update Scene properties",
  },
  testPlay: {
    hotkey: ["mod", "enter"],
    display: "⌘ + Enter",
    description: "Test play pack",
  },
};

export const instructionElementAttribute = "instruction-input";
