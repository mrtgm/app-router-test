import Image from "next/image";
import NoteRSS from "./components/RSS";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NoteRSS rssUrl="https://note.com/npaka/rss" />
    </main>
  );
}
