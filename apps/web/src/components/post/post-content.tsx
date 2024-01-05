import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

import { PostData } from "@/types";
import { usePostStore } from "@/store/usePostStore";
import { Role } from "@tf/codegen/__generated__/graphql";

import { Icons } from "../icons";
import { Badge } from "../ui/badge";
import { ContentMod } from "../moderator/mod-dialog";

type Props = {
  additionalTags?: React.ReactNode;
} & Omit<PostData, "comments">;

export function PostContent({ additionalTags, ...rest }: Props) {
  const [modDialog, setModDialog] = useState(false);
  const _tempTags = usePostStore((state) => state.tags);
  const tempTags = useMemo(
    () =>
      _tempTags[rest.id]
        ? Object.entries(_tempTags[rest.id]).map(([k, v]) => ({
            name: k,
            hide: v,
          }))
        : [],
    [_tempTags, rest.id]
  );
  const { data: session } = useSession();

  const tagsToDisplay = useMemo(
    () => [
      ...(rest.tags
        ?.filter(
          (t) => !tempTags.some((_t) => t.name === _t.name && _t.hide === true)
        )
        .map((t) => t.name) ?? []),
      ...tempTags?.filter((t) => t.hide === false).map((t) => t.name),
    ],
    [rest.tags, tempTags]
  );

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

        {session?.user?.role === Role.Moderator && (
          <>
            <button type="button" onClick={() => setModDialog(true)}>
              <Icons.exclamation className="w-4 h-4" />
            </button>

            <ContentMod
              open={modDialog}
              setOpen={setModDialog}
              existingTags={tagsToDisplay}
              {...rest}
            />
          </>
        )}
      </div>
      <p className="break-words whitespace-pre-wrap">{rest.content}</p>

      <div className="flex gap-2 flex-wrap">
        {additionalTags}
        {tagsToDisplay.map((tag) => (
          <Badge key={nanoid()} name={tag} />
        ))}
      </div>
    </section>
  );
}
