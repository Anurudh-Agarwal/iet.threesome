"use client";

import { useState } from "react";
import { SearchBar } from "@/components/results/SearchBar";
import ResultsStack from "@/components/shared/results/ResultsStack";
import ResultsTable from "@/components/shared/results/ResultsTable";
import { useIsMobile } from "@/hooks/useIsMobile";
import useTriplets from "@/hooks/useTriplets";
import { Spinner } from "@/components/ui/spinner";
import ErrorDialog from "@/components/errors/ErrorDialogBox";
import { type Triplet } from "@/types";

export default function ResultsPage() {
  const { triplets, isLoading, error } = useTriplets();
  const isMobile = useIsMobile();
  const [filtered, setFiltered] = useState<Triplet[] | null>(null);
  const [errorOpen, setErrorOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDialog
        open={errorOpen}
        onOpenChange={setErrorOpen}
        description={error.message}
      />
    );
  }

  if (triplets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-lg">
          Results are yet to be announced 🕐
        </p>
      </div>
    );
  }

  const hasSearched = filtered !== null;
  const displayTriplets = hasSearched && filtered!.length > 0 ? filtered! : triplets;

  return (
    <main className="flex flex-col gap-6 px-4 py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold">
        Room Allocation Results
      </h1>

      <SearchBar
        triplets={triplets}
        onSearch={(result) => setFiltered(result)}
      />

      {hasSearched && filtered!.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No student found 🔍
        </p>
      ) : (
        isMobile
          ? <ResultsStack triplets={displayTriplets} />
          : <ResultsTable triplets={displayTriplets} />
      )}
    </main>
  );
}
