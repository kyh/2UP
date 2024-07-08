"use client";

import { transferOwnershipInput } from "@2up/api/team/team-schema";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@2up/ui/alert-dialog";
import { Button } from "@2up/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@2up/ui/form";
import { If } from "@2up/ui/if";
import { Input } from "@2up/ui/input";
import { toast } from "@2up/ui/toast";

import { api } from "@/trpc/react";

export const TransferOwnershipDialog = ({
  isOpen,
  setIsOpen,
  targetDisplayName,
  accountId,
  userId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  accountId: string;
  userId: string;
  targetDisplayName: string;
}) => (
  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Transfer Ownership</AlertDialogTitle>

        <AlertDialogDescription>
          Transfer ownership of the team to another member.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <TransferOrganizationOwnershipForm
        accountId={accountId}
        userId={userId}
        targetDisplayName={targetDisplayName}
        setIsOpen={setIsOpen}
      />
    </AlertDialogContent>
  </AlertDialog>
);

const TransferOrganizationOwnershipForm = ({
  accountId,
  userId,
  targetDisplayName,
  setIsOpen,
}: {
  userId: string;
  accountId: string;
  targetDisplayName: string;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const transferOwnership = api.team.transferOwnership.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Ownership transfered successfully");
    },
    onError: () =>
      toast.error("Sorry, we couldn't transfer ownership of your team."),
  });

  const form = useForm({
    schema: transferOwnershipInput,
    defaultValues: {
      confirmation: "",
      accountId,
      userId,
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4 text-sm"
        onSubmit={form.handleSubmit((data) => {
          transferOwnership.mutate(data);
        })}
      >
        <p>
          You are transferring ownership of the selected team to{" "}
          <b>{targetDisplayName}</b>.
        </p>

        <FormField
          name="confirmation"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Please type TRANSFER to confirm the transfer of ownership.
                </FormLabel>

                <FormControl>
                  <Input autoComplete="off" type="text" required {...field} />
                </FormControl>

                <FormDescription>
                  By transferring ownership, you will no longer be the primary
                  owner of the team.
                </FormDescription>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div>
          <p className="text-muted-foreground">
            Are you sure you want to continue?
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            type="submit"
            variant="destructive"
            disabled={transferOwnership.isPending}
          >
            <If
              condition={transferOwnership.isPending}
              fallback="Transfer Ownership"
            >
              Transferring ownership...
            </If>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
};
