interface StudentPriority {
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
  a: string,
  b: string,
  c: string,
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

// Check if a triplet is stable — no student in it would prefer to swap
// with someone outside. Fixed: memberWants now checks both orderings of
// currentPartners (unordered list), fixing the false-stability detection.
const isTripletStable = (
  triplet: { student_1: string; student_2: string; student_3: string },
  allTriplets: { student_1: string; student_2: string; student_3: string }[],
  preferences: Map<string, string[]>
): boolean => {
  const members = [triplet.student_1, triplet.student_2, triplet.student_3];

  for (const otherTriplet of allTriplets) {
    if (otherTriplet === triplet) continue;

    const otherMembers = [
      otherTriplet.student_1,
      otherTriplet.student_2,
      otherTriplet.student_3,
    ];

    for (const member of members) {
      const currentPartners = members.filter((m) => m !== member);

      for (const other1 of otherMembers) {
        for (const other2 of otherMembers) {
          if (other1 === other2) continue;

          // The one remaining in the other triplet once other1 + other2 leave
          const otherCurrentPartners = otherMembers.filter(
            (m) => m !== other1 && m !== other2
          );

          // FIX: currentPartners is unordered — check both permutations
          const memberWants =
            (prefersOver(member, other1, currentPartners[0], preferences) &&
              prefersOver(member, other2, currentPartners[1], preferences)) ||
            (prefersOver(member, other1, currentPartners[1], preferences) &&
              prefersOver(member, other2, currentPartners[0], preferences));

          const other1Wants = prefersOver(
            other1,
            member,
            otherCurrentPartners[0],
            preferences
          );

          // Only one partner remains in the other triplet, so [0] is correct for both
          const other2Wants = prefersOver(
            other2,
            member,
            otherCurrentPartners[0],
            preferences
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
  for (const s of students) {
    preferences.set(s.roll_no, s.priorities);
  }

  const unmatched = new Set(students.map((s) => s.roll_no));
  let triplets: { student_1: string; student_2: string; student_3: string }[] = [];

  // Phase 1 — initial greedy matching
  while (unmatched.size >= 3) {
    const remaining = Array.from(unmatched);
    let bestScore = -1;
    let bestTriplet = { student_1: "", student_2: "", student_3: "" };

    for (let i = 0; i < remaining.length; i++) {
      for (let j = i + 1; j < remaining.length; j++) {
        for (let k = j + 1; k < remaining.length; k++) {
          const score = getTripletScore(
            remaining[i],
            remaining[j],
            remaining[k],
            preferences
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

  // Phase 2 — stability improvement via swapping
  let improved = true;

  while (improved) {
    improved = false;

    for (let i = 0; i < triplets.length; i++) {
      for (let j = i + 1; j < triplets.length; j++) {
        const t1 = triplets[i];
        const t2 = triplets[j];

        const t1Members = [t1.student_1, t1.student_2, t1.student_3];
        const t2Members = [t2.student_1, t2.student_2, t2.student_3];

        const currentScore =
          getTripletScore(t1.student_1, t1.student_2, t1.student_3, preferences) +
          getTripletScore(t2.student_1, t2.student_2, t2.student_3, preferences);

        for (let a = 0; a < 3; a++) {
          for (let b = 0; b < 3; b++) {
            const newT1Members = [...t1Members];
            const newT2Members = [...t2Members];

            [newT1Members[a], newT2Members[b]] = [newT2Members[b], newT1Members[a]];

            const newScore =
              getTripletScore(newT1Members[0], newT1Members[1], newT1Members[2], preferences) +
              getTripletScore(newT2Members[0], newT2Members[1], newT2Members[2], preferences);

            if (newScore > currentScore) {
              triplets[i] = {
                student_1: newT1Members[0],
                student_2: newT1Members[1],
                student_3: newT1Members[2],
              };
              triplets[j] = {
                student_1: newT2Members[0],
                student_2: newT2Members[1],
                student_3: newT2Members[2],
              };
              improved = true;
            }
          }
        }
      }
    }
  }

  return triplets;
};
