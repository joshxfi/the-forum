import { gql } from "@tf/codegen/__generated__/";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "../ui/badge";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTag: React.Dispatch<React.SetStateAction<string>>;
};

const GET_TAGS = gql(`
query GetTags {
  getTags {
    id
    name
  }
}
`);

export function TagDialog({ open, setOpen, setSelectedTag }: Props) {
  const { data } = useQuery(GET_TAGS);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader className="text-left">
          <p className="font-medium leading-none">Tags</p>
          <p className="text-muted-foreground text-sm leading-none">
            Select a tag that applies to your post
          </p>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mt-4">
          {data?.getTags.map(({ id, name }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSelectedTag(name);
                setOpen(false);
              }}
            >
              <Badge name={name} />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
