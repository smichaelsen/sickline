import { useEffect, useState } from "react";
import { apiFetch } from "./client";
import type { StatusResponse } from "./types";

type State = {
  data: StatusResponse | null;
  loading: boolean;
  error: Error | null;
};

export function useStatus(date: string): State {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    setState({ data: null, loading: true, error: null });

    apiFetch<StatusResponse>(`/api/status?date=${encodeURIComponent(date)}`)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [date]);

  return state;
}
