import { useEffect, useState } from "react";
import { apiFetch } from "./client";
import type { SickPeriodsResponse } from "./types";

type State = {
  data: SickPeriodsResponse | null;
  loading: boolean;
  error: Error | null;
};

export function useSickPeriods(from: string, to: string): State {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    setState({ data: null, loading: true, error: null });

    const params = new URLSearchParams({ from, to });
    apiFetch<SickPeriodsResponse>(`/api/sick-periods?${params}`)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return state;
}
