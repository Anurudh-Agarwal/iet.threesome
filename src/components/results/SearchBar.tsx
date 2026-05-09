"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Triplet } from "@/types";

interface SearchBarProps {
  triplets: Triplet[];
  onSearch: (filtered: Triplet[]) => void;
}

export const SearchBar = ({ triplets, onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = triplets.filter((triplet) => {
      const students = [
        triplet.student_1,
        triplet.student_2,
        triplet.student_3,
      ];
      return students.some((student) =>
        student.name.toLowerCase().includes(value.toLowerCase())
      );
    });

    onSearch(filtered);
  };

  return (
    <Input
      type="text"
      placeholder="Search by name..."
      value={query}
      onChange={handleSearch}
      className="w-full"
    />
  );
};