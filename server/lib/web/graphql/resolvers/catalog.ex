defmodule Web.GraphQL.Resolvers.Catalog do
  alias Database.Catalog
  alias Web.GraphQL.Errors

  def act_create(args, %{context: %{current_user: user}}) do
    case Catalog.act_create(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Act creation failed", details: Errors.error_details(changeset)
        }

      {:ok, act} ->
        {:ok, %{act: act}}
    end
  end

  def act_update(args, %{context: %{current_user: user}}) do
    case Catalog.act_update(user, args) do
      {:error, changeset} ->
        {
          :error,
          message: "Act update failed", details: Errors.error_details(changeset)
        }

      {:ok, act} ->
        {:ok, %{act: act}}
    end
  end

  def question_type_list(_, _, _) do
    {:ok, Catalog.question_type_list()}
  end

  def answer_type_list(_, _, _) do
    {:ok, Catalog.answer_type_list()}
  end

  def act_get_by_id(args, _) do
    act = Catalog.act_get_by_id(args.id)
    {:ok, act}
  end
end
