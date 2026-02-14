import { createAccessControl } from "better-auth/plugins";


const statement = {
  user: ["create", "read", "update", "delete"],
  tutor: ["create", "read", "update", "delete"],
  booking: ["create", "read", "update", "delete", "cancel", "complete"],
  review: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
} as const;


export const ac = createAccessControl(statement);

// Roles
export const studentRole = ac.newRole({
  tutor: ["read"], 
  booking: ["create", "read", "cancel"], 
  review: ["create", "read"], 
  user: ["read", "update"],
});

export const tutorRole = ac.newRole({
  tutor: ["create", "read", "update"], 
  booking: ["read", "complete"], 
  review: ["read"], 
  user: ["read", "update"],
  category: ["read"], 
});

export const adminRole = ac.newRole({
  user: ["create", "read", "update", "delete"], 
  tutor: ["create", "read", "update", "delete"], 
  booking: ["create", "read", "update", "delete", "cancel", "complete"], 
  review: ["read", "delete"], 
  category: ["create", "read", "update", "delete"], 
});