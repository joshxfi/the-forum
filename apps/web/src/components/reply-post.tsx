import { GetMessagesQuery } from "@tf/codegen/__generated__/graphql";
import { formatDistanceToNow } from "date-fns";
import { Icons } from "./icons";

type Reply = NonNullable<GetMessagesQuery["getMessages"][0]["replies"]>[0] & {
  upvoteCount?: number;
};

export function ReplyPost({ upvoteCount, ...rest }: Reply) {
  return (
    <div className="border-b border-muted pb-8 max-w-screen-sm mx-auto">
      <div className="text-sm containe pl-10 pt-8">
        <div className="flex gap-x-2 mb-2">
          <h2 className="font-semibold">{rest.user.username}</h2>
          <p className="text-muted-foreground">
            {formatDistanceToNow(new Date(rest.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        <p>{rest.content}</p>

        <div className="mt-2 flex gap-x-2 items-center">
          <div className="flex gap-x-1 items-center">
            <button>
              <Icons.arrowUp className="w-6 h-6" />
            </button>

            <p className="text-muted-foreground">{upvoteCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
