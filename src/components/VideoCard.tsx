import { VideoResult } from "@/lib/mock-data";
import { CredibilityBadge } from "./CredibilityBadge";
import { ExternalLink, Play } from "lucide-react";

export function VideoCard({ video }: { video: VideoResult }) {
  const isShort = video.type === "short";

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex rounded-xl border bg-card transition-all duration-200 hover:shadow-card-hover hover:border-accent/20 overflow-hidden ${isShort ? "flex-col" : "gap-4 p-4"
        }`}
    >
      <div className={`relative shrink-0 overflow-hidden bg-muted ${isShort ? "w-full aspect-[9/16]" : "w-44 h-24 rounded-lg"
        }`}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="h-8 w-8 text-accent-foreground fill-accent-foreground" />
        </div>
      </div>
      <div className={`flex flex-col flex-1 min-w-0 ${isShort ? "p-3" : ""}`}>
        <h3 className={`font-medium text-foreground leading-snug group-hover:text-accent transition-colors ${isShort ? "line-clamp-3 text-sm" : "line-clamp-2"
          }`}>
          {video.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{video.channel} · {video.views} views</p>
        {!isShort && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{video.summary}</p>}
        <div className={`mt-auto flex items-center justify-between ${isShort ? "pt-4" : "pt-2"}`}>
          <CredibilityBadge score={video.credibilityScore} size="sm" />
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </a>
  );
}
