defmodule Web.GraphQL.Types.CatalogTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias Database.Catalog.Scene
  alias Database.Catalog.QuestionType
  alias Database.Catalog.AnswerType

  import Absinthe.Resolution.Helpers, only: [dataloader: 1]

  node object(:scene) do
    field :question, non_null(:string)
    field :answer, :string
    field :instruction, :string

    field :question_type, non_null(:question_type), resolve: dataloader(QuestionType)
    field :answer_type, non_null(:answer_type), resolve: dataloader(AnswerType)
  end

  connection(node_type: :scene)

  node object(:question_type) do
    field :slug, non_null(:string)
  end

  node object(:answer_type) do
    field :slug, non_null(:string)
  end

  object(:pack_scene) do
    field :id, :id
    field :order, non_null(:string)
  end
end
