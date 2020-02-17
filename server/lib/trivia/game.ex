defmodule Trivia.Game do
  alias Trivia.{Act, Game, Player}

  defstruct act: 0, scene: 0, acts: [], players: []

  def new(question_sets, player_ids) do
    players = Enum.map player_ids, fn player_id ->
      %Player{id: player_id}
    end

    acts = Enum.map question_sets, fn question_set ->
      question = Enum.at(question_set, 0)
      answer = Enum.at(question_set, 1)
      %Act{ question: question, answer: answer }
    end

    %Game{acts: acts, players: players}
  end

  def player_new(game, player) do
    new_players = game.players ++ [player]
    %{game | players: new_players}
  end

  def start(game) do
    starting_act = Enum.at(game.acts, 0)
    %{question: question, answer: answer} = starting_act
    %{game | act: 1, scene: 1}
  end
end
