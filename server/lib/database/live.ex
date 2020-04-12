defmodule Database.Live do
  use Database.Context

  def category_create(attrs) do
    %Category{}
    |> Category.changeset(attrs)
    |> Repo.insert()
  end

  def pack_create(%User{} = user, attrs) do
    %Pack{}
    |> Pack.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:user, user)
    |> Repo.insert()
  end

  def pack_category_create(%Pack{} = pack, %Category{} = category) do
    %PackCategory{}
    |> PackCategory.changeset(%{})
    |> Ecto.Changeset.put_assoc(:pack, pack)
    |> Ecto.Changeset.put_assoc(:category, category)
    |> Repo.insert()
  end

  def tag_create(attrs) do
    %Tag{}
    |> Tag.changeset(attrs)
    |> Repo.insert()
  end

  def pack_act_create(%Pack{} = pack, %Act{} = act, attrs) do
    %PackAct{}
    |> PackAct.changeset(attrs)
    |> Ecto.Changeset.put_assoc(:pack, pack)
    |> Ecto.Changeset.put_assoc(:act, act)
    |> Repo.insert()
  end
end
