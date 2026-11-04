import { youtubeEmbedUrl } from './youtube';

export default function YoutubeEmbed({
  youtubeId,
  title = 'YouTube',
  autoplay = false,
  className = '',
  compact = false,
  fill = false,
}: {
  youtubeId: string;
  title?: string;
  autoplay?: boolean;
  className?: string;
  compact?: boolean;
  /** Full-bleed live stage (absolute inset-0) */
  fill?: boolean;
}) {
  if (fill) {
    return (
      <div className={`absolute inset-0 overflow-hidden bg-black ${className}`}>
        <iframe
          title={title}
          src={youtubeEmbedUrl(youtubeId, autoplay)}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? `overflow-hidden rounded-lg border border-white/10 bg-black ${className}`
          : `overflow-hidden rounded-[14px] border border-white/10 bg-black aspect-video ${className}`
      }
      style={compact ? { width: 160, height: 90 } : undefined}
    >
      <iframe
        title={title}
        src={youtubeEmbedUrl(youtubeId, autoplay)}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
