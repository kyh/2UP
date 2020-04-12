defmodule Database.Catalog.Act do
  use Database.Model

  schema "acts" do
    belongs_to :user, Database.Accounts.User
    many_to_many :questions, Database.Catalog.Question,
      join_through: Database.Catalog.ActQuestion

    field :endorsement_type, :integer
    field :order, :integer

    timestamps()
  end

  def changeset(question, attrs) do
    required_fields = [:content]

    question
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:user)	
    |> assoc_constraint(:pack)	
  end
end
