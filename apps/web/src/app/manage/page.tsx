"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { gql } from "@tf/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DisplayBadge } from "@/components/display-badge";
import { ConfirmButton } from "@/components/confirm-button";

const GET_TAGS = gql(`
query GetTags {
  getTags {
    id
    name
  }
}
`);

const ADD_TAG = gql(`
mutation AddTag($name: String!) {
  addTag(name: $name) {
    id
    name
  }
}
`);

const REMOVE_TAG = gql(`
mutation RemoveTag($tagId: ID!) {
  removeTag(id: $tagId)
}
`);

export default function Manage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const hasAccess =
    process.env.NEXT_PUBLIC_ALLOW_ACCESS === session?.user?.username;

  const { data: tagsData, refetch } = useQuery(GET_TAGS, {
    skip: !hasAccess,
  });
  const [addTag, { loading: addTagLoading }] = useMutation(ADD_TAG);
  const [removeTag, { loading: removeTagLoading }] = useMutation(REMOVE_TAG);

  const [tagName, setTagName] = useState("");

  if (!hasAccess) {
    return null;
  }

  const handleAddTag = () => {
    addTag({
      variables: {
        name: tagName,
      },
      onCompleted: () => {
        setTagName("");
        refetch();
        toast({
          title: "Success",
          description: `Added ${tagName} tag`,
        });
      },
    });
  };

  const handleRemoveTag = (tagId: string) => {
    removeTag({
      variables: {
        tagId,
      },
      onCompleted: () => {
        refetch();
        toast({
          title: "Success",
          description: `Tag removed`,
        });
      },
    });
  };

  return (
    <section className="container">
      <h1 className="text-2xl font-medium">Available Tags</h1>
      <p className="text-muted-foreground text-sm">Click on a tag to remove</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {tagsData?.getTags.map((tag) => (
          <ConfirmButton
            key={tag.id}
            title="Remove tag"
            body={`Are you sure you want to remove the tag "${tag.name}"?`}
            onConfirm={() => handleRemoveTag(tag.id)}
          >
            <button disabled={removeTagLoading}>
              <DisplayBadge name={tag.name} />
            </button>
          </ConfirmButton>
        ))}
      </div>

      <div className="space-y-4 mt-12">
        <div className="grid gap-2">
          <Label htmlFor="password">Add a new tag</Label>
          <Input
            value={tagName}
            disabled={addTagLoading}
            onChange={(e) => setTagName(e.target.value)}
            className="max-w-[300px]"
            placeholder="Enter tag name"
          />
        </div>
        <ConfirmButton
          title="Add Tag"
          body={`Are you sure you want to add the tag "${tagName}"?`}
          onConfirm={handleAddTag}
        >
          <Button disabled={!tagName || addTagLoading}>Proceed</Button>
        </ConfirmButton>
      </div>
    </section>
  );
}
