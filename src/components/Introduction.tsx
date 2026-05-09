import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { hasSeenIntro , markAsSeenIntro} from "@/services/hasSeenIntro";

export default function IntroDialog() {
  if(hasSeenIntro()){
    return null;
  }
  return (
    <Dialog defaultOpen>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Welcome to Threesome</DialogTitle>
          <DialogDescription>
            Room allocation for Ramanujan hostel students
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Students moving to Aryabhatta next semester need to form 3-person
            rooms — and figuring out who to room with is awkward. No one wants
            to say no to someone's face, or be the one left out.
          </p>
          <p>
            Threesome fixes this. You privately submit your{" "}
            <span className="font-medium text-foreground">
              top 4 preferred roommates
            </span>{" "}
            in priority order. Our algorithm then processes everyone's
            preferences and outputs the most mutually satisfactory triplets —
            no awkward conversations needed.
          </p>
        </div>

        <Button className="w-full mt-2" onClick={markAsSeenIntro}>Continue</Button>
      </DialogContent>
    </Dialog>
  );
}