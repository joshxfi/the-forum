"use client";

import { useState } from "react";
import { Menu } from "@/components/menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Compose() {
  const [text, setText] = useState("");

  return (
    <form className="mt-24 container">
      <div className="flex flex-col gap-y-3">
        <div className="text-sm flex justify-between">
          <h2 className="font-semibold">joe</h2>
          <p className="text-muted-foreground">{text.length}/500</p>
        </div>

        <Textarea
          required
          maxLength={500}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="type your message here."
          className="max-h-[500px]"
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Switch id="hide-username" />
            <Label htmlFor="hide-username">Hide Username</Label>
          </div>

          <Button
            type="submit"
            disabled={text.length === 0}
            className="self-end"
          >
            Post
          </Button>
        </div>
      </div>

      <Menu />
    </form>
  );
}
