"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ErrorDialog from "@/components/errors/ErrorDialogBox";

export default function AlgoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const runAlgorithm = async () => {
  try {
    setIsLoading(true);
    setSuccess(false);

    const res = await fetch("/api/run-algorithm", { method: "POST" });
    const json = await res.json();

    if (!res.ok) throw new Error(json.error);

    setSuccess(true);
  } catch (err) {
    setErrorMessage((err as Error).message);
    setErrorOpen(true);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <ErrorDialog
        open={errorOpen}
        onOpenChange={setErrorOpen}
        description={errorMessage}
      />

      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
        <h1 className="text-2xl font-semibold">
          Triplet Algorithm
        </h1>

        <p className="text-muted-foreground text-center max-w-md">
          This will calculate optimal triplets based on
          student priorities and save them to the database.
        </p>

        {success && (
          <p className="text-green-500 text-center">
            Triplets calculated and saved successfully!
          </p>
        )}

        <Button
          onClick={runAlgorithm}
          disabled={isLoading}
          className="w-full max-w-xs"
        >
          {isLoading ? <Spinner /> : "Run Algorithm"}
        </Button>
      </div>
    </>
  );
}