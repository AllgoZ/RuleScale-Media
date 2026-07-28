import type { Access, FieldAccess } from "payload";

export const isAdmin: Access = ({ req }) => req.user?.role === "admin";

export const isAdminFieldLevel: FieldAccess = ({ req }) => req.user?.role === "admin";

export const isAdminOrEditor: Access = ({ req }) =>
  req.user?.role === "admin" || req.user?.role === "editor";

export const isAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false;
  if (req.user.role === "admin") return true;
  return { id: { equals: req.user.id } };
};
