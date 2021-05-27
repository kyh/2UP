defmodule Game.GamePlay do
  @moduledoc """
  Question and answer game logic
  """

  alias Game.{Scene, GamePlay, Player}

  defstruct scene: 0, step: 0, scenes: [], players: [], pack: ""

  @doc """
  Initializes game play struct with scenes and players
  """
  def new(question_sets, player_ids) do
    players = Enum.map(player_ids, &%Player{id: &1})
    scenes = scenes_initialize(question_sets)

    %GamePlay{scenes: scenes, players: players}
  end

  @doc """
  Converts question sets into Scene structs
  """
  def scenes_initialize(question_sets) do
    Enum.map(question_sets, fn question_set ->
      %{
        question: question,
        scene_answers: scene_answers,
        pack: pack,
        instruction: instruction,
        question_type: question_type,
        answer_type: answer_type
      } = question_set

      %Scene{
        question: question,
        question_type: question_type,
        scene_answers: scene_answers,
        answer_type: answer_type,
        pack: pack,
        instruction: instruction,
        submissions: []
      }
    end)
  end

  @doc """
  Adds new player to game play struct if name is unique
  """
  def player_new(game, player) do
    new_players =
      (game.players ++ [player])
      |> Enum.uniq_by(fn player -> player.name end)

    %{game | players: new_players}
  end

  @doc """
  Moves to next step if all players have submitted
  """
  def next_step_get(game, submissions_length, player_count) do
    case submissions_length >= player_count do
      true -> game.step + 1
      false -> game.step
    end
  end

  @doc """
  Increment 100 points for each correct answer
  """
  def points_calculate(game, current_index, name, submission) do
    current_scene = Enum.at(game.scenes, current_index)

    correct_submission_count =
      current_scene.scene_answers
      |> Enum.filter(& &1.isCorrect)
      |> Enum.filter(&(&1.content == submission))
      |> Enum.count()

    case correct_submission_count > 0 do
      true ->
        player_score_add(game, name, 100)

      false ->
        game
    end
  end

  @doc """
  Update game play state with submission. Move to next step if all submissions received.
  """
  def submissions_update(game, current_index, submission, player_count) do
    current_scene = Enum.at(game.scenes, current_index)

    new_submissions = Enum.shuffle(current_scene.submissions ++ [submission])
    new_scenes = List.update_at(game.scenes, current_index, &%{&1 | submissions: new_submissions})
    current_step = next_step_get(game, length(new_submissions), player_count)
    %{game | scenes: new_scenes, step: current_step}
  end

  @doc """
  Update points and submissions with new submission
  """
  def player_submit(game, name, submission, player_count) do
    current_index = game.scene - 1

    game
    |> points_calculate(current_index, name, submission)
    |> submissions_update(current_index, submission, player_count)
  end

  @doc """
  Add points to player and update players list
  """
  def player_score_add(game, name, score) do
    player =
      Enum.filter(game.players, fn x -> x.name === name end)
      |> Enum.at(0)

    new_player = %{player | score: player.score + score}

    new_players =
      Enum.map(game.players, fn x ->
        case x.name == name do
          true -> new_player
          false -> x
        end
      end)

    %{game | players: new_players}
  end

  @doc """
  Moves to the next step
  """
  def step_next(game) do
    %{game | step: game.step + 1}
  end

  @doc """
  Move to next scene unless it's end of game
  """
  def scene_next(game) do
    case length(game.scenes) == game.scene do
      true -> %{game | scene: 0, step: 0}
      false -> %{game | scene: game.scene + 1, step: 1}
    end
  end

  @doc """
  Start game play with first scene and step
  """
  def start(game) do
    %{game | scene: 1, step: 1}
  end
end
