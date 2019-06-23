defmodule Sweeper.Timer do
  use GenServer
  require Logger

  def start_link(_) do
    GenServer.start_link __MODULE__, %{}
  end

  ## SERVER ##

  def init(_state) do
    Logger.warn("timer server started")
    SweeperWeb.Endpoint.subscribe "timer:start", []
    SweeperWeb.Endpoint.subscribe "timer:stop", []
    state = %{timer_ref: nil, timer: nil}
    {:ok, state}
  end

  def handle_info(%{event: "start_timer"}, _) do
    start_time = 0
    timer_ref = schedule_timer 1000
    broadcast start_time, "started timer"
    {:noreply, %{timer_ref: timer_ref, timer: start_time}}
  end

  def handle_info(%{event: "start_timer"}, %{timer_ref: old_timer_ref}) do
    cancel_timer(old_timer_ref)
    timer_ref = schedule_timer 1000
    start_time = 0
    broadcast start_time, "started timer"
    {:noreply, %{timer_ref: timer_ref, timer: start_time}}
  end

  def handle_info(%{event: "stop_timer"}, _) do
    SweeperWeb.Endpoint.broadcast!("timer:update", "stop_time", %{time: 0})
    {:noreply, :end}
  end

  def handle_info(:update, :end) do
    {:noreply, :end}
  end

  def handle_info(%{event: "stop_timer"}, %{timer_ref: old_timer_ref}) do
    cancel_timer(old_timer_ref)
    {:noreply, 0}
  end

  def handle_info(:update, %{timer: time}) do
    time = time + 1
    broadcast(time, "tick tock")
    timer_ref = schedule_timer(1_000)
    {:noreply, %{timer_ref: timer_ref, timer: time}}
  end

  defp schedule_timer(interval) do
    Process.send_after(self(), :update, interval)
  end

  defp cancel_timer(nil), do: :ok
  defp cancel_timer(ref), do: Process.cancel_timer(ref)

  defp broadcast(time, response) do
    SweeperWeb.Endpoint.broadcast!("timer:update", "new_time", %{
      response: response,
      time: time
    })
  end
end
