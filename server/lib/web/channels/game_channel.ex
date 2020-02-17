defmodule Web.GameChannel do
  use Web, :channel

  alias Trivia.{GameServer}

  def join("game:" <> game_code, _payload, socket) do
    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        send(self(), {:after_join, game_code})
        {:ok, socket}

      nil ->
        {:error, %{reason: "Game does not exist"}}
    end
  end

  def handle_info({:after_join, game_code}, socket) do
    game_state = GameServer.game_state(game_code)
    push(socket, "game_state", game_state)
    {:noreply, socket}
  end

  def handle_in("player_new", %{"name" => name}, socket) do
    "game:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        player = %{ id: Ecto.UUID.generate, name: name, coins: 0 }
        game_state = GameServer.player_new(game_code, player)
        broadcast!(socket, "game_state", game_state)
        {:noreply, socket}

      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  def handle_in("start", _payload, socket) do
    "game:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        game_state = GameServer.game_start(game_code)
        broadcast!(socket, "game_state", game_state)
        {:noreply, socket}

      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end

  def handle_in("submit", %{"name" => name, "submission" => submission}, socket) do
    "game:" <> game_code = socket.topic

    case GameServer.game_pid(game_code) do
      pid when is_pid(pid) ->
        submission = %{
          id: Ecto.UUID.generate,
          name: name,
          content: submission,
          endorsers: []
        }

        game_state = GameServer.player_submit(game_code, submission)
        broadcast!(socket, "game_state", game_state)
        {:noreply, socket}
      nil ->
        {:reply, {:error, %{reason: "Game does not exist"}}, socket}
    end
  end
end
