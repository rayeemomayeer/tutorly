"use client";

import { useState } from "react";
import { useCreateCategoryMutation } from "./adminCategoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const t = toast.loading("Adding category...");

    try {
      await createCategory({ name }).unwrap();
      setName("");
      toast.success("Category added.", { id: t });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add category.", { id: t });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e5e3de] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-end"
    >
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-xs font-medium text-[#6b6b66]">
          Category name
        </label>
        <Input
          placeholder="e.g. Mathematics"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {isLoading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}