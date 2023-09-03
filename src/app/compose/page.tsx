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
    <form className="container">
      <div className="flex flex-col gap-y-3">
        <h2 className="font-semibold text-sm">joe</h2>

        <Textarea
          required
          maxLength={500}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="type your message here."
          className="max-h-[300px]"
        />

        <Button type="submit" disabled={text.length === 0} className="w-full">
          Post
        </Button>

        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Switch id="hide-username" />
            <Label htmlFor="hide-username">Hide Username</Label>
          </div>

          <p className="text-muted-foreground text-sm mb-2 text-right">
            {text.length}/500
          </p>
        </div>
      </div>

      <Menu />
    </form>
  );
}
