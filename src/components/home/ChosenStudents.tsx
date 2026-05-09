import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useFilledFormData } from "@/hooks/useFilledFormData";

export default function ChosenPriorityTable() {
  const data = useFilledFormData();

  return (
    <Card className="w-full rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Choosen Priority Order
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
              {[data?.p1, data?.p2, data?.p3, data?.p4].map(
                (student, index) => (
                  <TableRow key={index}>
                    <TableCell>Priority {index + 1}</TableCell>
                    <TableCell>{student?.name ?? "-"}</TableCell>
                    <TableCell>{student?.branch ?? "-"}</TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
