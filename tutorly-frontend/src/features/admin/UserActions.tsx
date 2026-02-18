
"use client";
import {
  useBanUserMutation,
  useUnbanUserMutation,
  usePromoteUserMutation,
  useDemoteUserMutation,
} from "./adminApi";
import { Button } from "@/components/ui/button";

export default function UserActions({
  id,
  currentRole,
  isBanned,
}: {
  id: string;
  currentRole: "student" | "tutor" | "admin";
  isBanned: boolean;
}) {
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();
  const [promoteUser] = usePromoteUserMutation();
  const [demoteUser] = useDemoteUserMutation();


   const handlePromote = () => {
    let nextRole: "tutor" | "admin" | null = null;
    if (currentRole === "student") nextRole = "tutor";
    else if (currentRole === "tutor") nextRole = "admin";

    if (nextRole) {
      promoteUser({ id, role: nextRole });
    }
  };
   const handleDemote = () => {
    let nextRole: "tutor" | "student" | null = null;
    if (currentRole === "admin") nextRole = "tutor";
    else if (currentRole === "tutor") nextRole = "student";

    if (nextRole) {
      demoteUser({ id, role: nextRole });
    }
  };


  return (
    <div className="flex gap-2">
      {isBanned ? (
        <Button onClick={() => unbanUser(id)}>Unban</Button>
      ) : (
        <Button variant="destructive" onClick={() => banUser(id)}>Ban</Button>
      )}

      {currentRole !== "admin" && (
        <Button onClick={handlePromote}>Promote</Button>
      )}
      
      {currentRole !== "student" && (
        <Button onClick={handleDemote}>Demote</Button>
      )}


    </div>
  );
}