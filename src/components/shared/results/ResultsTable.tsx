import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Triplet } from "@/types";

export default function ResultsTable({triplets}: {triplets: Triplet[]}) {

  return (
    <Card className="w-full rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Room Allocation Results
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">#</TableHead>
                <TableHead>Student 1</TableHead>
                <TableHead>Student 2</TableHead>
                <TableHead>Student 3</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {triplets.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium"> {index + 1} </TableCell>
                  <TableCell>
                    {result.student_1.name} ({result.student_1.branch})
                  </TableCell>
                  <TableCell>
                    {result.student_2.name} ({result.student_2.branch})
                  </TableCell>
                  <TableCell>
                    {result.student_3.name} ({result.student_3.branch})
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
