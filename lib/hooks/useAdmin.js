"use client";

import { useAuth } from "./useAuth";

// Permission matrix: which roles can access which sections
const PERMISSIONS = {
  dashboard: ["admin", "editor"],
  products: ["admin", "editor"],
  orders: ["admin"],
  users: ["admin"],
  stock: ["admin", "editor"],
  settings: ["admin"],
  blog: ["admin", "editor"],
};

export function useAdmin() {
  const { user, loading, isLoggedIn, isAdmin, isEditor, hasAdminAccess } = useAuth();

  const can = (section) => {
    if (!user?.role) return false;
    const allowed = PERMISSIONS[section];
    return allowed ? allowed.includes(user.role) : false;
  };

  return {
    user,
    loading,
    isLoggedIn,
    isAdmin,
    isEditor,
    hasAdminAccess,
    can,
  };
}
