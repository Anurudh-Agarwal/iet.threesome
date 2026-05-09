"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type ErrorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: string;
};

export default function ErrorDialog({
  open,
  onOpenChange,
  description,
}: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-destructive text-xl">
            ERROR
          </DialogTitle>

          <DialogDescription className="pt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Example Usage

/*
const [open, setOpen] = useState(true);

<ErrorDialog
  open={open}
  onOpenChange={setOpen}
  description="Unable to generate room allocation results. Please try again later."
/>
*/
