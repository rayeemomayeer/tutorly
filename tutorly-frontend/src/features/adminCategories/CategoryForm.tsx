// src/features/adminCategories/CategoryForm.tsx
"use client";
import { useState } from "react";
import { useCreateCategoryMutation } from "./adminCategoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createCategory({ name });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="New category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}