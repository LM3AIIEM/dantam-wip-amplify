import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingActionButton = ({ onClick, className }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50',
        'bg-primary hover:bg-primary-hover text-primary-foreground',
        'border-0 ring-2 ring-primary/20 hover:ring-primary/30',
        className
      )}
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};