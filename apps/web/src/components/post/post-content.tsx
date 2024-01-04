import { formatDistanceToNow } from "date-fns";

import { PostData } from "@/types";
import { Badge } from "../ui/badge";
import { usePostStore } from "@/store/usePostStore";
import { nanoid } from "nanoid";

type Props = {
  additionalTags?: React.ReactNode;
} & Omit<PostData, "comments">;

export function PostContent({ additionalTags, ...rest }: Props) {
  const tempTags = usePostStore((state) => state.tags[rest.id]);
  return (
    <section className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-x-2">
          <h2 className="font-semibold">
            {rest.isAnonymous ? (
              <span className="text-zinc-400">hidden</span>
            ) : (
              rest.author.username
            )}
          </h2>
          <p className="text-muted-foreground">
            {formatDistanceToNow(new Date(rest.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        {/**{session?.user?.role === Role.Moderator && (
          <ModButton />
        )}**/}
      </div>
      <p className="break-words whitespace-pre-wrap">{rest.content}</p>

      <div className="flex space-x-1">
        {additionalTags}
        {rest.tags?.map((tag) => (
          <Badge key={tag.id} name={tag.name} />
        ))}

        {tempTags?.map((tag) => (
          <Badge key={nanoid()} name={tag} />
        ))}
      </div>
    </section>
  );
}
