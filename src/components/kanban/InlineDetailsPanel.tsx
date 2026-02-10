import { cn } from "@/lib/utils";
import { DealExpandedPanel } from "@/components/DealExpandedPanel";
import { Deal } from "@/types/deal";

type TransitionState = 'idle' | 'expanding' | 'expanded' | 'collapsing';

interface InlineDetailsPanelProps {
  deal: Deal;
  transition: TransitionState;
  onClose: () => void;
  onOpenActionItemModal?: (actionItem?: any) => void;
}

export function InlineDetailsPanel({
  deal,
  transition,
  onClose,
  onOpenActionItemModal,
}: InlineDetailsPanelProps) {
  const isEntering = transition === 'expanding';
  const isExiting = transition === 'collapsing';

  return (
    <div 
      className={cn(
        'flex flex-col overflow-y-auto',
        isEntering && 'inline-details-entering',
        isExiting && 'inline-details-exiting'
      )}
      style={{ 
        animationDuration: '300ms',
        height: 'calc(100vh - 160px)',
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
