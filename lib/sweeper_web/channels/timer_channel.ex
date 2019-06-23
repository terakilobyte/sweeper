defmodule SweeperWeb.TimerChannel do
  use Phoenix.Channel

  def join("timer:update", _msg, socket) do
    {:ok, socket}
  end

  def handle_in("new_time", msg, socket) do
    push(socket, "new_time", msg)
    {:noreply, socket}
  end

  def handle_in("start_timer", _msg, socket) do
    SweeperWeb.Endpoint.broadcast("timer:start", "start_timer", %{})
    {:noreply, socket}
  end

  def handle_in("stop_timer", _msg, socket) do
    SweeperWeb.Endpoint.broadcast("timer:stop", "stop_timer", %{})
    {:noreply, socket}
  end

  def handle_in("reset_timer", _msg, socket) do
    {:noreply, socket}
  end
end
