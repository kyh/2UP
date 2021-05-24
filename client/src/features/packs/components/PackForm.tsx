import styled from "styled-components";
import { useForm } from "react-hook-form";
import { Button, TextField, AreaField } from "components";
import { TopbarPackFragment } from "./__generated__/TopbarPackFragment";

export type PackFormInputs = Omit<TopbarPackFragment, "id" | "__typename">;

type Props = {
  submitText?: string;
  loading?: boolean;
  defaultValues?: Object;
  onSubmit: any;
};

export const PackForm = ({
  submitText = "Create Pack",
  loading = false,
  defaultValues = {},
  onSubmit,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PackFormInputs>({
    defaultValues,
  });
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        labelText="Pack Name"
        id="name"
        {...register("name", { required: true })}
        placeholder="Who's that Pokemon?"
        error={!!errors.name}
        errorText="Pack name is required"
      />
      <AreaField
        labelText="Description"
        id="description"
        {...register("description", { required: true })}
        placeholder="The popular question-and-answer segment that is featured in numerous episodes of the Pokémon anime"
        error={!!errors.description}
        errorText="A short description is required"
      />
      <Button className="submit" type="submit" disabled={loading}>
        {submitText}
      </Button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;

  input,
  textarea {
    width: 100%;
  }

  button {
    margin: 0 auto;
  }
`;
