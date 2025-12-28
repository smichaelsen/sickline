import fs from "node:fs";
import path from "node:path";

export type Member = {
  id: string;
  name: string;
  color?: string;
  avatar?: string;
};

const defaultMembersPath = process.env.MEMBERS_PATH ?? path.resolve("config/members.json");

export function loadMembers(): Member[] {
  if (!fs.existsSync(defaultMembersPath)) {
    throw new Error(`Members config not found at ${defaultMembersPath}`);
  }
  const raw = fs.readFileSync(defaultMembersPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Members config must be an array of members");
  }
  return parsed.map((member) => {
    if (!member.id || !member.name) {
      throw new Error("Each member must have id and name");
    }
    return {
      id: String(member.id),
      name: String(member.name),
      color: member.color ? String(member.color) : undefined,
      avatar: member.avatar ? String(member.avatar) : undefined
    } satisfies Member;
  });
}
