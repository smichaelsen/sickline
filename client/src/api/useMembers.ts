import { useEffect, useState } from "react";
import { apiFetch } from "./client";
import type { Member } from "./types";

type State = {
  data: Member[] | null;
  loading: boolean;
  error: Error | null;
};

export function useMembers(): State {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    setState({ data: null, loading: true, error: null });

    apiFetch<Member[]>("/api/members")
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
