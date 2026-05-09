import ResultsTable from "../shared/results/ResultsTable";
import ResultsStack from "../shared/results/ResultsStack";
import { useIsMobile } from "@/hooks/useIsMobile";
import useUserTriplet from "@/hooks/useUserTriplet";
import ErrorDialog from "../errors/ErrorDialogBox";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export const ResultCard = () => {
  const { error, triplet, isLoading } = useUserTriplet();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(true);

  if (isLoading) return <Spinner />;

  // No triplets assigned yet — show a friendly message
  if (!triplet && !error) {
    return (
      <div className="border rounded-2xl p-6 shadow-sm bg-card w-full max-w-xl mx-auto text-center text-muted-foreground">
        <p className="text-sm">Triplet results haven't been announced yet.</p>
        <p className="text-xs mt-1">Check back later!</p>
      </div>
    );
  }

  if (error) {
    return <ErrorDialog open={open} onOpenChange={setOpen} description={error.message} />;
  }

  return (
    <>
      {isMobile
        ? <ResultsStack triplets={[triplet!]} />
        : <ResultsTable triplets={[triplet!]} />
      }
    </>
  );
};