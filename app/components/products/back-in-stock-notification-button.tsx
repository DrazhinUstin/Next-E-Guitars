'use-client';

import { Button, type ButtonProps } from '@/app/components/ui/button';
import type { products } from '@wix/stores';
import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import LoadingButton from '@/app/components/loading-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateBackInStockNotificationRequestMutation } from '@/app/hooks/back-in-stock-notifications';

type Props = {
  product: products.Product;
  selectedOptions: Record<string, string>;
};

export default function BackInStockNotificationButton({
  product,
  selectedOptions,
  ...props
}: Props & ButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <Button {...props} onClick={() => setIsDialogOpen(true)}>
        Notify when product back in stock
      </Button>
      {isDialogOpen && (
        <BackInStockNotificationDialog
          product={product}
          selectedOptions={selectedOptions}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}

function BackInStockNotificationDialog({
  product,
  selectedOptions,
  onClose,
}: Props & { onClose: () => void }) {
  const mutation = useCreateBackInStockNotificationRequestMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({ product, selectedOptions, email: values.email }, { onSuccess: onClose });
  }

  return (
    <Dialog open onOpenChange={(open) => !mutation.isPending && !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notify when product back in stock</DialogTitle>
          <DialogDescription>
            Enter you email and click notify to receive notifications when out-of-stock product
            become available.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={mutation.isPending}>
                  Close
                </Button>
              </DialogClose>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Notify
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  email: z.string().email(),
});
