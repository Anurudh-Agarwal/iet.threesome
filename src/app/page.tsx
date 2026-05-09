"use client";

import IntroDialog from "@/components/Introduction";
import { PriorityForm } from "@/components/home/PriorityForm";
import { ResultCard } from "@/components/home/ResultCard";
import ChosenPriorityTable from "@/components/home/ChosenStudents";
import { fetchAllStudents } from "@/services/fetchAllStudents";
import { useFilledFormData } from "@/hooks/useFilledFormData";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type RamanujanStudent } from "@/types";

export default function Home() {
  const data = useFilledFormData();
  const [students, setStudents] = useState<RamanujanStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllStudents()
      .then((s) => setStudents(s ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <IntroDialog />
      <main className="flex flex-col items-center gap-8 px-4 py-12 max-w-2xl mx-auto min-h-screen">

        <div className="flex gap-4 text-sm text-muted-foreground w-full justify-end">
          <Link href="/results" className="hover:text-foreground transition-colors">
            Results →
          </Link>
          <Link href="/algo" className="hover:text-foreground transition-colors">
            Algorithm →
          </Link>
        </div>

        {data ? (
          <>
            <ChosenPriorityTable />
            <ResultCard />
          </>
        ) : (
          <PriorityForm students={students} />
        )}

      </main>
    </>
  );
}