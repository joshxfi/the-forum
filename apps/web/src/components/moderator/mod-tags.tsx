import { nanoid } from "nanoid";
import { produce } from "immer";
import { useCallback, useMemo, useState } from "react";
import { PostData } from "@/types";
import { useMutation } from "@apollo/client";
import { gql } from "@tf/codegen/__generated__";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

const ADD_TAG_TO_POST = gql(`
mutation AddTagToPost($postId: ID!, $tagName: String!) {
  addTagToPost(postId: $postId, tagName: $tagName) {
    id
    name
  }
}
`);

const REMOVE_TAG_ON_POST = gql(`
mutation RemoveTagOnPost($postId: ID!, $tagName: String!) {
  removeTagOnPost(postId: $postId, tagName: $tagName)
}
`);

const GET_TAGS = gql(`
query GetTags {
  getTags {
    id
    name
  }
}
`);

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Omit<PostData, "comments">;

export function ModTags({ open, setOpen, ...rest }: Props) {
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<
    {
      name: string;
      add: boolean;
    }[]
  >([]);

  const { data: allTags } = useQuery(GET_TAGS);
  const [addTagToPost, { loading: addLoading }] = useMutation(ADD_TAG_TO_POST);
  const [removeTagOnPost, { loading: removeLoading }] =
    useMutation(REMOVE_TAG_ON_POST);

  const handleSave = () => {
    toast({
      title: "Please wait",
      description: "Modifying tags on post...",
    });

    selectedTags.forEach((tag) => {
      const exists = rest.tags?.some((t) => t.name === tag.name);
      if (tag.add && !exists) {
        addTagToPost({
          variables: {
            postId: rest.id,
            tagName: tag.name,
          },
          onError: (err) => {
            console.log(err);
          },
        });
      }

      if (!tag.add && exists) {
        removeTagOnPost({
          variables: {
            postId: rest.id,
            tagName: tag.name,
          },
          onError: (err) => {
            console.log(err);
          },
        });
      }
    });

    toast({
      title: "Success",
      description: "Tags have been modified",
    });

    setOpen(false);
  };

  const handleAdd = useCallback((tagName: string) => {
    setSelectedTags(
      produce((draft) => {
        const tag = draft.find((t) => t.name === tagName);
        if (!!tag) {
          tag.add = true;
        } else {
          draft.push({
            name: tagName,
            add: true,
          });
        }
      })
    );
  }, []);

  const handleRemove = useCallback((tagName: string) => {
    setSelectedTags(
      produce((draft) => {
        const tag = draft.find((t) => t.name === tagName);
        if (!!tag) {
          tag.add = false;
        } else {
          draft.push({
            name: tagName,
            add: false,
          });
        }
      })
    );
  }, []);

  const parentTags = useMemo(
    () =>
      rest.tags
        ?.filter(
          (t) =>
            !selectedTags
              .filter((_tf) => _tf.add === true)
              .some((_t) => t.name === _t.name)
        )
        ?.filter(
          (t) =>
            !selectedTags
              .filter((_tf) => _tf.add === false)
              .some((_t) => t.name === _t.name)
        ),
    [rest.tags, selectedTags]
  );

  const choicesTags = useMemo(
    () =>
      allTags?.getTags
        .filter(
          (t) =>
            !selectedTags
              .filter((_t) => _t.add === true)
              .some((_t) => _t.name === t.name)
        )
        .filter((t) => !parentTags?.some((_t) => t.name === _t.name)),
    [parentTags, selectedTags, allTags?.getTags]
  );

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {selectedTags
          ?.filter((t) => t.add === true)
          .map((t) => (
            <button key={nanoid()} onClick={() => handleRemove(t.name)}>
              <Badge name={t.name} withRemove />
            </button>
          ))}

        {parentTags?.map((t) => (
          <button key={t.id} onClick={() => handleRemove(t.name)}>
            <Badge name={t.name} withRemove />
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-2 border-t border-muted pt-4">
        {choicesTags?.map((t) => (
          <button key={t.id} type="button" onClick={() => handleAdd(t.name)}>
            <Badge name={t.name} />
          </button>
        ))}
      </div>

      <Button
        disabled={addLoading || removeLoading || !selectedTags.length}
        onClick={handleSave}
      >
        {addLoading || removeLoading ? "Loading..." : "Save changes"}
      </Button>
    </>
  );
}
