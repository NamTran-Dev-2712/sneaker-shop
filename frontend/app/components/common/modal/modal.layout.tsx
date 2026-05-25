import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";

interface ModalLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
  className?: string;
  showCloseButton?: boolean;
}

export const ModalLayout = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  isLoading = false,
  className,
  showCloseButton = true,
}: ModalLayoutProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[500px]", className)}
        showCloseButton={showCloseButton && !isLoading}
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Spinner className="h-8 w-8" />
              <span className="text-sm text-muted-foreground">
                Đang xử lý...
              </span>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default ModalLayout;
