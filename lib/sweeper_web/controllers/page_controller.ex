defmodule SweeperWeb.PageController do
  use SweeperWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
