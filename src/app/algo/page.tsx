"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ErrorDialog from "@/components/errors/ErrorDialogBox";

const CODE = `interface StudentPriority {
  roll_no: string;
  priorities: string[];
}

const SCORES = [6, 4, 2, 1];

const getCompatibilityScore = (
  a: string,
  b: string,
  preferences: Map<string, string[]>
): number => {
  const aPrefs = preferences.get(a) ?? [];
  const bPrefs = preferences.get(b) ?? [];
  const aIdx = aPrefs.indexOf(b);
  const bIdx = bPrefs.indexOf(a);
  const aScore = aIdx !== -1 ? SCORES[aIdx] : 0;
  const bScore = bIdx !== -1 ? SCORES[bIdx] : 0;
  return aScore + bScore;
};

const getTripletScore = (
  a: string, b: string, c: string,
  preferences: Map<string, string[]>
): number => {
  return (
    getCompatibilityScore(a, b, preferences) +
    getCompatibilityScore(b, c, preferences) +
    getCompatibilityScore(a, c, preferences)
  );
};

const prefersOver = (
  student: string,
  newPartner: string,
  currentPartner: string,
  preferences: Map<string, string[]>
): boolean => {
  const prefs = preferences.get(student) ?? [];
  const newIdx = prefs.indexOf(newPartner);
  const curIdx = prefs.indexOf(currentPartner);
  const newScore = newIdx === -1 ? 0 : SCORES[newIdx];
  const curScore = curIdx === -1 ? 0 : SCORES[curIdx];
  return newScore > curScore;
};

const isTripletStable = (
  triplet: { student_1: string; student_2: string; student_3: string },
  allTriplets: { student_1: string; student_2: string; student_3: string }[],
  preferences: Map<string, string[]>
): boolean => {
  const members = [triplet.student_1, triplet.student_2, triplet.student_3];
  for (const otherTriplet of allTriplets) {
    if (otherTriplet === triplet) continue;
    const otherMembers = [
      otherTriplet.student_1, otherTriplet.student_2, otherTriplet.student_3,
    ];
    for (const member of members) {
      const currentPartners = members.filter((m) => m !== member);
      for (const other1 of otherMembers) {
        for (const other2 of otherMembers) {
          if (other1 === other2) continue;
          const otherCurrentPartners = otherMembers.filter(
            (m) => m !== other1 && m !== other2
          );
          const memberWants =
            (prefersOver(member, other1, currentPartners[0], preferences) &&
              prefersOver(member, other2, currentPartners[1], preferences)) ||
            (prefersOver(member, other1, currentPartners[1], preferences) &&
              prefersOver(member, other2, currentPartners[0], preferences));
          const other1Wants = prefersOver(
            other1, member, otherCurrentPartners[0], preferences
          );
          const other2Wants = prefersOver(
            other2, member, otherCurrentPartners[0], preferences
          );
          if (memberWants && other1Wants && other2Wants) return false;
        }
      }
    }
  }
  return true;
};

export const calculateTriplets = (
  students: StudentPriority[]
): { student_1: string; student_2: string; student_3: string }[] => {
  const preferences = new Map<string, string[]>();
  for (const s of students) preferences.set(s.roll_no, s.priorities);

  const unmatched = new Set(students.map((s) => s.roll_no));
  let triplets: { student_1: string; student_2: string; student_3: string }[] = [];

  while (unmatched.size >= 3) {
    const remaining = Array.from(unmatched);
    let bestScore = -1;
    let bestTriplet = { student_1: "", student_2: "", student_3: "" };
    for (let i = 0; i < remaining.length; i++) {
      for (let j = i + 1; j < remaining.length; j++) {
        for (let k = j + 1; k < remaining.length; k++) {
          const score = getTripletScore(
            remaining[i], remaining[j], remaining[k], preferences
          );
          if (score > bestScore) {
            bestScore = score;
            bestTriplet = {
              student_1: remaining[i],
              student_2: remaining[j],
              student_3: remaining[k],
            };
          }
        }
      }
    }
    unmatched.delete(bestTriplet.student_1);
    unmatched.delete(bestTriplet.student_2);
    unmatched.delete(bestTriplet.student_3);
    triplets.push(bestTriplet);
  }

  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < triplets.length; i++) {
      for (let j = i + 1; j < triplets.length; j++) {
        const t1 = triplets[i];
        const t2 = triplets[j];
        const t1m = [t1.student_1, t1.student_2, t1.student_3];
        const t2m = [t2.student_1, t2.student_2, t2.student_3];
        const cur =
          getTripletScore(t1.student_1, t1.student_2, t1.student_3, preferences) +
          getTripletScore(t2.student_1, t2.student_2, t2.student_3, preferences);
        for (let a = 0; a < 3; a++) {
          for (let b = 0; b < 3; b++) {
            const n1 = [...t1m], n2 = [...t2m];
            [n1[a], n2[b]] = [n2[b], n1[a]];
            const next =
              getTripletScore(n1[0], n1[1], n1[2], preferences) +
              getTripletScore(n2[0], n2[1], n2[2], preferences);
            if (next > cur) {
              triplets[i] = { student_1: n1[0], student_2: n1[1], student_3: n1[2] };
              triplets[j] = { student_1: n2[0], student_2: n2[1], student_3: n2[2] };
              improved = true;
            }
          }
        }
      }
    }
  }

  return triplets;
};`;

const PHASES = [
  {
    phase: "Phase 1",
    name: "Greedy matching",
    desc: "Every possible group of 3 is scored. The highest-scoring triplet is locked in, those students are removed, and the process repeats.",
  },
  {
    phase: "Phase 2",
    name: "Swap optimisation",
    desc: "Members are swapped between triplet pairs. A swap is accepted only if it raises the combined score of both groups.",
  },
  {
    phase: "Phase 3",
    name: "Stability check",
    desc: "A triplet is stable if no student inside it would mutually prefer two members from another triplet over their current partners.",
  },
];

const SCORES = [
  { rank: "1st choice", pts: 6 },
  { rank: "2nd choice", pts: 4 },
  { rank: "3rd choice", pts: 2 },
  { rank: "4th choice", pts: 1 },
];

export default function AlgoPage() {
  const { user, isLoaded } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState<
  { student_1: string; student_2: string; student_3: string }[] | null
>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const runAlgorithm = async () => {
  try {
    setIsLoading(true);
    setResults(null);
    const res = await fetch("/api/run-algorithm", { method: "POST" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    const triplets = Array.isArray(json.triplets) ? json.triplets : [];  // ← only this line changed
    setResults(triplets);
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

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Triplet matching algorithm</h1>
          <p className="text-muted-foreground text-sm mt-1">
            How your roommate groups are formed from your submitted priorities.
          </p>
        </div>

        {/* Phases */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PHASES.map(({ phase, name, desc }) => (
              <div key={phase} className="border rounded-xl p-4 space-y-1">
                <p className="text-xs text-muted-foreground">{phase}</p>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* Scoring */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Scoring
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SCORES.map(({ rank, pts }) => (
              <div key={rank} className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{rank}</p>
                <p className="text-xl font-medium">{pts}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Scores are mutual — if A ranks B 1st and B ranks A 2nd, that pair
            scores{" "}
            <code className="bg-muted px-1 rounded text-xs">6 + 4 = 10</code>.
            Max triplet score is{" "}
            <code className="bg-muted px-1 rounded text-xs">36</code>.
          </p>
        </div>

        <hr className="border-border" />

        {/* Code block */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Source code
          </p>
          <div className="border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
              <span className="font-mono text-xs text-muted-foreground">
                calculateTriplets.ts
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-muted-foreground border rounded px-2 py-1 flex items-center gap-1 hover:bg-background transition-colors"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed font-mono bg-background">
              <code>{CODE}</code>
            </pre>
          </div>
        </div>

        {/* Admin section */}
        {isLoaded && isAdmin && (
          <>
            <hr className="border-border" />
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Run algorithm</h2>
              <Button
                onClick={runAlgorithm}
                disabled={isLoading}
                className="w-full max-w-xs"
              >
                {isLoading ? <Spinner /> : "Run Algorithm"}
              </Button>

              {results && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {results.length} triplets formed
                  </p>
                  <div className="grid gap-2">
                    {results.map((triplet, i) => (
                      <div
                        key={i}
                        className="border rounded-lg px-4 py-3 flex items-center gap-3 text-sm"
                      >
                        <span className="text-muted-foreground font-mono w-6">
                          {i + 1}.
                        </span>
                        <span>{triplet.student_1}</span>
                        <span className="text-muted-foreground">·</span>
                        <span>{triplet.student_2}</span>
                        <span className="text-muted-foreground">·</span>
                        <span>{triplet.student_3}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
