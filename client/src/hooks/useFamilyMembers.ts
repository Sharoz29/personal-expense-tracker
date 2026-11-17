import { useState, useEffect, useCallback } from "react";
import { familyMembersApi } from "../api/family-members.api";
import type { FamilyMember } from "../types";

interface CreateFamilyMemberPayload {
  name: string;
  relationship: string;
  date_of_birth?: string;
}

export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await familyMembersApi.getAll();
      setMembers(data);
    } catch {
      setError("Failed to load family members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateFamilyMemberPayload) => {
    const created = await familyMembersApi.create(data);
    await fetch();
    return created;
  };

  const update = async (id: number, data: CreateFamilyMemberPayload) => {
    const updated = await familyMembersApi.update(id, data);
    await fetch();
    return updated;
  };

  const remove = async (id: number) => {
    await familyMembersApi.delete(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return { members, loading, error, create, update, remove, refetch: fetch };
}
