export type Member = {
  id: string;
  name: string;
  color?: string | null;
  avatar?: string | null;
};

export type StatusValue = "green" | "yellow" | "red";

export type StatusEntry = {
  id: string;
  memberId: string;
  status: StatusValue;
  title: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StatusResponse = {
  date: string;
  entries: StatusEntry[];
};

export type UpsertStatusEntry = {
  memberId: string;
  status: StatusValue;
  title?: string | null;
  comment?: string | null;
};

export type UpsertStatusPayload = {
  date: string;
  entries: UpsertStatusEntry[];
};

export type UpsertStatusResponse = {
  updated: number;
};

export type SeverityPeriod = {
  startDate: string;
  endDate: string;
  status: "yellow" | "red";
};

export type PeriodComment = {
  date: string;
  comment: string;
};

export type SickPeriod = {
  memberId: string;
  startDate: string;
  endDate: string | null;
  status: "yellow" | "red";
  title: string | null;
  severityPeriods: SeverityPeriod[];
  comments: PeriodComment[];
};

export type SickPeriodsResponse = {
  periods: SickPeriod[];
};
