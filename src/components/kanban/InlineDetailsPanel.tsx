import { cn } from "@/lib/utils";
import { DealExpandedPanel } from "@/components/DealExpandedPanel";
import { Deal } from "@/types/deal";

type TransitionState = 'idle' | 'expanding' | 'expanded' | 'collapsing';

interface InlineDetailsPanelProps {
  deal: Deal;
  transition: TransitionState;
  onClose: () => void;
  onOpenActionItemModal?: (actionItem?: any) => void;
  topOffset?: number;
}

export function InlineDetailsPanel({
  deal,
  transition,
  onClose,
  onOpenActionItemModal,
  topOffset = 0,
}: InlineDetailsPanelProps) {
  const isEntering = transition === 'expanding';
  const isExiting = transition === 'collapsing';

  return (
    <div 
      className={cn(
        'flex flex-col',
        isEntering && 'inline-details-entering',
        isExiting && 'inline-details-exiting'
      )}
      style={{ 
        animationDuration: '300ms',
        marginTop: topOffset > 0 ? `${topOffset}px` : undefined,
        maxHeight: topOffset > 0 ? `calc(100vh - ${topOffset + 120}px)` : undefined,
        minHeight: '400px',
        transition: 'margin-top 0.3s ease-out',
      }}
    >
      <DealExpandedPanel 
        deal={deal} 
        onClose={onClose}
        onOpenActionItemModal={onOpenActionItemModal}
      />
    </div>
  );
}
