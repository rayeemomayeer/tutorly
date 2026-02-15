import { createAccessControl } from "better-auth/plugins";


const statement = {
  auth: ["sign-up", "sign-in", "logout"],
  user: ["read", "update", "list", "ban", "unban", "promote", "demote"],
  tutor: ["create", "read", "update", "delete"],
  booking: ["create", "read", "cancel", "complete", "list", "delete"],
  review: ["create", "read", "delete"],
  category: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const studentRole = ac.newRole({
  auth: ["sign-up", "sign-in", "logout"],
  user: ["read", "update"],
  tutor: ["read"],
  booking: ["create", "read", "cancel"],
  review: ["create", "read"],
  category: ["read"],
});

export const tutorRole = ac.newRole({
  auth: ["sign-up", "sign-in", "logout"],
  user: ["read", "update"],
  tutor: ["create", "read", "update"],
  booking: ["read", "cancel","complete"],
  review: ["read"],
  category: ["read"],
});

export const adminRole = ac.newRole({
  auth: ["sign-up", "sign-in", "logout"],
  user: ["read", "update", "list", "ban", "unban", "promote", "demote"],
  tutor: ["create", "read", "update", "delete"],
  booking: ["create", "read", "cancel", "complete", "list", "delete"],
  review: ["read", "delete"],
  category: ["create", "read", "update", "delete"],
});