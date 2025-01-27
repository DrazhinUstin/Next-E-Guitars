import { useToast } from '@/app/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { updateLoggedInMember, type updateLoggedInMemberValues } from '@/app/lib/wix-api.members';
import { getWixBrowserClient } from '@/app/lib/wix-client.browser';
import { useRouter } from 'next/navigation';

export const useUpdateMemberMutation = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: updateLoggedInMemberValues) =>
      updateLoggedInMember(getWixBrowserClient(), values),
    onSuccess: () => {
      toast({ description: 'Profile was updated!' });
      setTimeout(router.refresh, 2000);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update a profile. Please try again.',
      });
    },
  });
};
