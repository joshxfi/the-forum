import { formatDistanceToNow } from "date-fns";

import { PostData } from "@/types";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { ModTags } from "./mod-tags";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Omit<PostData, "comments">;

export function ContentMod({ open, setOpen, ...rest }: Props) {
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader className="text-left border-b border-muted pb-4">
            <p className="font-medium leading-none">Content Moderation</p>
            <p className="text-muted-foreground text-sm leading-none">
              Manage tags on this post
            </p>
          </DialogHeader>

          <div className="flex justify-between items-center text-sm">
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
          </div>

          <p className="break-words whitespace-pre-wrap text-sm">
            {rest.content}
          </p>

          <ModTags open={open} setOpen={setOpen} {...rest} />
        </DialogContent>
      </Dialog>
    </>
  );
}
