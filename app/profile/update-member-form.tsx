'use client';

import type { members } from '@wix/members';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import LoadingButton from '@/app/components/loading-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { useUpdateMemberMutation } from '@/app/hooks/members';

const formSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export default function UpdateMemberForm({ member }: { member: members.Member }) {
  const mutation = useUpdateMemberMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: member.loginEmail ?? '',
      firstName: member.contact?.firstName ?? '',
      lastName: member.contact?.lastName ?? '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  const wasAnyFormValueChanged = Object.entries(form.getValues()).some(
    ([key, value]) =>
      form.formState.defaultValues?.[key as keyof z.infer<typeof formSchema>] !== value
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-xl space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-md"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email address" disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="Øystein" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Aarseth" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          type="submit"
          className="w-full"
          loading={mutation.isPending}
          disabled={!wasAnyFormValueChanged}
        >
          Update profile
        </LoadingButton>
      </form>
    </Form>
  );
}
