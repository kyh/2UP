defmodule Playhouse.Answer do
  use Ecto.Schema
  import Ecto.Changeset

  schema "answers" do
    belongs_to :question, Playhouse.Question
    has_many :endorsements, Playhouse.Endorsement

    field :content, :string

    timestamps()
  end

  def changeset(answer, attrs) do
    required_fields = [:content]

    answer
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:question)
  end
end
