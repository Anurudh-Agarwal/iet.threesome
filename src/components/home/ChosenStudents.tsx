"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { fetchChosenPriorities } from "@/services/fetchChosenPriorities";
import { Spinner } from "@/components/ui/spinner";

interface Student {
  roll_no: string;
  name: string;
  branch: string;
}

interface ChosenPriorities {
  p1: Student;
  p2: Student;
  p3: Student;
  p4: Student;
}

export default function ChosenPriorityTable() {
  const { user, isLoaded } = useUser();
  const roll_no = user?.primaryEmailAddress?.emailAddress?.split("@")[0];
  const [data, setData] = useState<ChosenPriorities | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !roll_no) return;

    const load = async () => {
      try {
        const result = await fetchChosenPriorities(roll_no);

          if (!result) { 
      setData(null);
      return;
    }
        setData({
          p1: Array.isArray(result.p1) ? result.p1[0] : result.p1,
          p2: Array.isArray(result.p2) ? result.p2[0] : result.p2,
          p3: Array.isArray(result.p3) ? result.p3[0] : result.p3,
          p4: Array.isArray(result.p4) ? result.p4[0] : result.p4,
        });
      } catch {
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [roll_no, isLoaded]);

  if (isLoading) return <Spinner />;
  if (!data) return null;

  return (
    <Card className="w-full rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Chosen Priority Order
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Branch</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {[data.p1, data.p2, data.p3, data.p4].map((student, index) => (
                <TableRow key={index}>
                  <TableCell>Priority {index + 1}</TableCell>
                  <TableCell>{student?.name ?? "-"}</TableCell>
                  <TableCell>{student?.branch ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
