"use server";

import { XMLParser } from "fast-xml-parser";
import Image from "next/image";
import { format } from "date-fns";
import { headers } from "next/headers";

type NoteRSSProps = {
  rssUrl: string;
};

const fetchRSS = async (rssUrl: string) => {
  const host = headers().get("host");
  const protocol = process?.env.NODE_ENV === "development" ? "http" : "https";
  console.log("host", host, protocol, `${protocol}://${host}/api/note?rssUrl=${rssUrl}`);
  const response = await fetch(`${protocol}://${host}/api/note?rssUrl=${rssUrl}`, {
    cache: "no-store",
  });
  const xml = await response.text();

  return xml;
};

export default async function NoteRSS(props: NoteRSSProps) {
  const data = await fetchRSS(props.rssUrl);
  let json = null;

  try {
    const parser = new XMLParser();
    json = parser.parse(data);
  } catch (e) {
    return <div>fetch error</div>;
  }

  if (!json || !json.rss || !json.rss.channel || !json.rss.channel.item) {
    console.log("No Data", data, json);
    return <div>No Data</div>;
  }

  const items = json.rss.channel.item.slice(0, 4);

  return (
    <div>
      {items.map((item: { link: string; title: string; "media:thumbnail": string; pubDate: string }) => (
        <div key={item.link}>
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <div className="relative aspect-square">
              <img alt="thumbnail" className="object-cover" src={item["media:thumbnail"]} />
            </div>
            <p className="body md:mt-2.5 sm:mt-3">{item.title}</p>
            <p className="caption md:mt-2.5 sm:mt-3 text-secondary">{format(item.pubDate, "yyyy.MM.dd")}</p>
          </a>
        </div>
      ))}
    </div>
  );
}
