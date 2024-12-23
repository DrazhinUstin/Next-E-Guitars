import { Button, type ButtonProps } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Props extends ButtonProps {
  loading?: boolean;
}

export default function LoadingButton({ children, loading, ...props }: Props) {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}
