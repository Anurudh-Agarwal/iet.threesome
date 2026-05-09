import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="w-full">
      <Separator />
      <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row md:px-8">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="text-sm font-medium">Threesome</span>
          <span className="text-xs text-muted-foreground">
            Room allocation for Ramanujan hostel students
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Threesome. All rights reserved.
        </p>
      </div>
    </footer>
  )
}