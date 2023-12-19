import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

export default function Info() {
  const markdown = `
# What is this?
TheForum is a place for the unheard voices; a place that gives you a voice. A place to share stories, rants, confessions, and more. 

If you are here, hello 👋
`;

  return (
    <section className="container prose prose-invert">
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </section>
  );
}
