import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Eye, X } from "lucide-react";
import thumb1 from "@/assets/video-thumb-1.jpg";
import thumb2 from "@/assets/video-thumb-2.jpg";
import thumb3 from "@/assets/video-thumb-3.jpg";

const videos = [
  {
    id: 1,
    title: "Guided Shoulder Recovery",
    description: "Top rehab exercises for shoulder labral tears and rotator cuff",
    thumbnail: thumb1,
    duration: "12:57",
    views: "1.5M",
    category: "Shoulder",
    youtubeId: "1Wy8jh4QQH8",
  },
  {
    id: 2,
    title: "VR Balance & Shoulder Fix",
    description: "The exercise that fixed shoulder pain for good — physio guided",
    thumbnail: thumb2,
    duration: "5:26",
    views: "522K",
    category: "Shoulder",
    youtubeId: "0icm6r9Kro4",
  },
  {
    id: 3,
    title: "Lower Back Pain Relief",
    description: "8 best exercises to treat lower back pain — step by step",
    thumbnail: thumb1,
    duration: "13:47",
    views: "543K",
    category: "Back",
    youtubeId: "HXSZHLGNSyU",
  },
  {
    id: 4,
    title: "Knee Pain Stretches",
    description: "How to fix back of knee pain with targeted stretches",
    thumbnail: thumb3,
    duration: "9:40",
    views: "799K",
    category: "Knee",
    youtubeId: "UqSHB6KS93s",
  },
];

const VideoShowcase = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="videos" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="outline" className="border-primary/30 text-primary font-medium px-4 py-1">
            <Play className="h-3 w-3 mr-1" /> Video Library
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Watch & Learn Techniques
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Professional physiotherapy sessions you can follow along at your own pace.
          </p>
        </div>

        {/* Featured video */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm animate-fade-in p-4">
            <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title="Physiotherapy Video"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 h-10 w-10 rounded-full bg-foreground/60 flex items-center justify-center text-primary-foreground hover:bg-foreground/80 transition-colors"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Video grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, i) => (
            <div
              key={video.id}
              className="group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => setActiveVideo(video.youtubeId)}
            >
              {/* Thumbnail */}
              <div className="relative rounded-xl overflow-hidden mb-4 shadow-card group-hover:shadow-hover transition-shadow duration-300">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={1024}
                  height={576}
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                    <Play className="h-6 w-6 text-primary-foreground ml-1" />
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-foreground/70 text-primary-foreground text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {video.duration}
                </div>
                {/* Category */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-primary/90 text-primary-foreground text-xs">{video.category}</Badge>
                </div>
              </div>

              {/* Info */}
              <h3 className="font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors mb-1">
                {video.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{video.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                {video.views} views
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
