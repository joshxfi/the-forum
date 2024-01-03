import { Badge } from "./badge";

const styles = (name: string) => {
  if (name === "you") return "bg-gray-900";
  if (name === "story") return "bg-cyan-900";
  if (name === "insight") return "bg-lime-900";
  if (name === "rant") return "bg-amber-900";
  if (name === "confession") return "bg-fuchsia-900";
  if (name === "question") return "bg-indigo-900";
};

export function DisplayBadge({ name }: { name: string }) {
  return <Badge className={styles(name)}>{name}</Badge>;
}
