defmodule Trivia.GameServer do

  use GenServer

  require Logger

  @timeout :timer.hours(3)

  def start_link(game_code, questions) do
    GenServer.start_link(__MODULE__, 
                         {game_code, questions}, 
                         name: via_tuple(game_code))
  end

  def game_state(game_code) do
    GenServer.call(via_tuple(game_code), :game_state)
  end

  def game_start(game_code) do
    GenServer.call(via_tuple(game_code), :game_start)
  end

  def player_new(game_code, player) do
    GenServer.call(via_tuple(game_code), {:player_new, player})
  end

  def player_submit(game_code, submission) do
    GenServer.call(via_tuple(game_code), {:player_submit, submission})
  end

  def player_endorse(game_code, name, submission_id) do
    GenServer.call(via_tuple(game_code), {:player_endorse, name, submission_id})
  end

  def game_pid(game_code) do
    game_code
    |> via_tuple
    |> GenServer.whereis
  end

  def via_tuple(game_code) do
    {:via, Registry, {Trivia.GameRegistry, game_code}}
  end

  def init({game_code, questions}) do
    game = case :ets.lookup(:games_table, game_code) do
      [] ->
        game = Trivia.Game.new(questions, [])
        :ets.insert(:games_table, {game_code, game})
        game

      [{^game_code, game}] ->
        game
    end

    Logger.info("Spawned game server process named '#{game_code}'.")

    {:ok, game, @timeout}
  end

  def get_game_state(game) do
    current_act = Enum.at(game.acts, game.act - 1)
    %{question: question, answer: answer} = current_act

    %{
      act: game.act,
      scene: game.scene,
      players: game.players,
      question: question,
      answer: answer,
      submissions: current_act.submissions
    }
  end

  def handle_call(:game_state, _from, game) do
    {:reply, get_game_state(game), game, @timeout}
  end

  def handle_call({:player_new, player}, _from, game) do
    updated_game = Trivia.Game.player_new(game, player)

    :ets.insert(:games_table, {my_game_code(), updated_game})

    {:reply, get_game_state(updated_game), updated_game, @timeout}
  end

  def handle_call({:player_submit, submission}, _from, game) do
    updated_game = Trivia.Game.player_submit(game, submission)

    :ets.insert(:games_table, {my_game_code(), updated_game})

    {:reply, get_game_state(updated_game), updated_game, @timeout}
  end

  def handle_call({:player_endorse, name, submission_id}, _from, game) do
    updated_game = Trivia.Game.player_endorse(game, name, submission_id)

    :ets.insert(:games_table, {my_game_code(), updated_game})

    {:reply, get_game_state(updated_game), updated_game, @timeout}
  end


  def handle_call(:game_start, _from, game) do
    updated_game = Trivia.Game.start(game)

    :ets.insert(:games_table, {my_game_code(), updated_game})

    {:reply, get_game_state(updated_game), updated_game, @timeout}
  end

  defp my_game_code do
    Registry.keys(Trivia.GameRegistry, self()) |> List.first
  end
end
