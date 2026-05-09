import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Triplet } from "@/types";

export default function ResultsStack({triplets}: {triplets:Triplet[]}) {

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {triplets.map((result, index) => (
        <Card key={index} className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              Triplet #{index + 1}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <div className="font-medium">
                {result.student_1.name} ({result.student_1.branch})
              </div>

              <Separator />

              <div className="font-medium">
                {result.student_2.name} ({result.student_2.branch})
              </div>

              <Separator />

              <div className="font-medium">
                {result.student_3.name} ({result.student_3.branch})
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}