import { Icons } from "./icons";

type Props = {
  username: string;
  content: string;
  timestamp: string;
  upvoteCount?: number;
  replyCount?: number;
};

export function Message({
  username,
  content,
  timestamp,
  upvoteCount,
  replyCount,
}: Props) {
  return (
    <div className="border-b border-muted pb-8">
      <div className="text-sm container max-w-screen-sm">
        <div className="flex gap-x-2 mb-2">
          <h2 className="font-semibold">{username}</h2>
          <p className="text-muted-foreground">{timestamp}</p>
        </div>

        <p>{content}</p>

        <div className="mt-2 flex gap-x-2">
          <div className="flex gap-x-1 items-center">
            <button>
              <Icons.arrowUp className="w-6 h-6" />
            </button>

            <p className="text-muted-foreground">{upvoteCount}</p>
          </div>

          <div className="flex gap-x-1 items-center">
            <button>
              <Icons.reply className="w-6 h-6" />
            </button>

            <p className="text-muted-foreground">{replyCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
