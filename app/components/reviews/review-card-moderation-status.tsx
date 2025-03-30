import { reviews } from '@wix/reviews';
import { CircleAlertIcon, CircleCheckIcon, CircleXIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';

function getModerationStatusData(moderationStatus?: reviews.ModerationModerationStatus): {
  label: string;
  icon: React.ReactNode;
  tooltip: string;
} {
  if (moderationStatus === reviews.ModerationModerationStatus.APPROVED) {
    return {
      label: 'Approved',
      icon: <CircleCheckIcon className="size-4 text-green-500" />,
      tooltip: 'The review is approved by moderators and visible on the site',
    };
  }
  if (moderationStatus === reviews.ModerationModerationStatus.REJECTED) {
    return {
      label: 'Rejected',
      icon: <CircleXIcon className="size-4 text-red-500" />,
      tooltip: 'The review is rejected by moderators and not visible on the site',
    };
  }
  return {
    label: 'In moderation',
    icon: <CircleAlertIcon className="size-4 text-yellow-500" />,
    tooltip: 'The review is pending moderation and not visible on the site',
  };
}

export default function ReviewCardModerationStatus({ review }: { review: reviews.Review }) {
  const { label, icon, tooltip } = getModerationStatusData(review.moderation?.moderationStatus);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="flex w-max items-center gap-1 text-sm text-muted-foreground">
            {icon}
            {label}
          </p>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
