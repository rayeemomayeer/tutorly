
"use client";
import {
  useBanUserMutation,
  useUnbanUserMutation,
  usePromoteUserMutation,
  useDemoteUserMutation,
} from "./adminApi";
import { Button } from "@/components/ui/button";

export default function UserActions({ id, isBanned }: { id: string; isBanned: boolean }) {
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();
  const [promoteUser] = usePromoteUserMutation();
  const [demoteUser] = useDemoteUserMutation();

  return (
    <div className="flex gap-2">
      {isBanned ? (
        <Button onClick={() => unbanUser(id)}>Unban</Button>
      ) : (
        <Button variant="destructive" onClick={() => banUser(id)}>Ban</Button>
      )}
      <Button onClick={() => promoteUser(id)}>Promote</Button>
      <Button onClick={() => demoteUser(id)}>Demote</Button>
    </div>
  );
}