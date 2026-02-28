import SkillCard from "./SkillCard";
import type { SkillResponse } from "@/types/skill";

interface Props {
  skills: SkillResponse[];
  emptyMessage?: string;
}

export default function SkillGrid({ skills, emptyMessage }: Props) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        {emptyMessage ?? "No skills found"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}
