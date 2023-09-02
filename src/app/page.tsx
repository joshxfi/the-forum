import { Message } from "@/components/message";

export default function Home() {
  return (
    <section className="mt-24">
      <Message
        username="joe"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis iure dolor dolorem quos blanditiis quibusdam aut pariatur ex quisquam vitae vel odit ratione labore, consequatur quasi quaerat aliquid! Impedit, sunt?"
        timestamp="2021-01-01"
        upvoteCount={10}
        replyCount={2}
      />
    </section>
  );
}
