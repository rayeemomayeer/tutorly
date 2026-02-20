// src/features/adminCategories/CategoryActions.tsx
"use client";
import { useState } from "react";
import { useUpdateCategoryMutation, useDeleteCategoryMutation } from "./adminCategoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CategoryActions({ id, currentName }: { id: string; currentName: string }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentName);
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleUpdate = () => {
    updateCategory({ id, name });
    setEditing(false);
  };

  return (
    <div className="flex gap-2">
      {editing ? (
        <>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={handleUpdate}>Save</Button>
          <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
        </>
      ) : (
        <>
          <Button onClick={() => setEditing(true)}>Edit</Button>
          <Button variant="destructive" disabled={id === "temp-id"} onClick={() => deleteCategory(id)}>Delete</Button>
        </>
      )}
    </div>
  );
}