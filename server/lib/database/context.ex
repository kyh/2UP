defmodule Database.Context do
  defmacro __using__(_) do
    quote do
      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      alias Database.Repo

      alias Database.Accounts.User

      alias Database.Catalog.{
        ActTag,
        Act,
        AnswerType,
        QuestionType,
        Tag
      }

      alias Database.Live.{
        Category,
        PackAct,
        PackCategory,
        Pack,
        Play
      }
    end
  end
end
