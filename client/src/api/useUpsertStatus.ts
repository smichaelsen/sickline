import { useState } from "react";
import { apiFetch } from "./client";
import type { UpsertStatusPayload, UpsertStatusResponse } from "./types";

type State = {
  loading: boolean;
  error: Error | null;
};

type UseUpsertStatus = State & {
  mutate: (payload: UpsertStatusPayload) => Promise<UpsertStatusResponse>;
};

export function useUpsertStatus(): UseUpsertStatus {
  const [state, setState] = useState<State>({ loading: false, error: null });

  async function mutate(
    payload: UpsertStatusPayload,
  ): Promise<UpsertStatusResponse> {
    setState({ loading: true, error: null });
    try {
      const result = await apiFetch<UpsertStatusResponse>("/api/status", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setState({ loading: false, error: null });
      return result;
    } catch (error) {
      setState({ loading: false, error: error as Error });
      throw error;
    }
  }

  return { ...state, mutate };
}
