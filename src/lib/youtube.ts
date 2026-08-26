import { VideoResult } from "./mock-data";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

interface YouTubeSearchResult {
    id: { videoId: string };
    snippet: {
        title: string;
        channelTitle: string;
        channelId: string;
        description: string;
        publishedAt: string;
        thumbnails: { high: { url: string } };
    };
}

interface YouTubeVideoDetails {
    id: string;
    statistics: {
        viewCount: string;
        likeCount: string;
        commentCount: string;
    };
    snippet: {
        channelId: string;
        tags?: string[];
    };
}

interface YouTubeChannelDetails {
    id: string;
    statistics: {
        subscriberCount: string;
    };
}

/**
 * Normalizes a value between 0 and 1, applying a logarithmic scale for large numbers like views if needed.
 */
function normalizeLog(value: number, maxExpected: number): number {
    if (value <= 0) return 0;
    const logVal = Math.log10(value);
    const logMax = Math.log10(maxExpected);
    return Math.min(Math.max(logVal / logMax, 0), 1);
}

/**
 * Calculates credibility score based on a 33/33/33 weighting system using proxies.
 */
function calculateCredibilityScore(video: YouTubeVideoDetails, channel: YouTubeChannelDetails): number {
    const views = parseInt(video.statistics.viewCount || "0", 10);
    const likes = parseInt(video.statistics.likeCount || "0", 10);
    const comments = parseInt(video.statistics.commentCount || "0", 10);
    const subscribers = parseInt(channel.statistics.subscriberCount || "0", 10);

    // 1. View Factor (33%): Normalized against 1,000,000 views max for educational content baseline.
    const viewScore = normalizeLog(views, 1000000) * 33.33;

    // 2. Retention Proxy (33%): Engagement Rate = (Likes + Comments) / Views
    // Baseline: 5% engagement rate is considered phenomenal on YouTube.
    const engagementRate = views > 0 ? (likes + comments) / views : 0;
    const retentionScore = Math.min((engagementRate / 0.05), 1) * 33.33;

    // 3. Loyalty/Revisiting Proxy (33%): Views to Subscribers Ratio
    // Baseline: If a video gets 20% of the channel's subscriber count in views, it shows great loyal viewership.
    const viewsToSubRatio = subscribers > 0 ? views / subscribers : 0;
    const loyaltyScore = Math.min((viewsToSubRatio / 0.20), 1) * 33.33;

    const totalScore = Math.round(viewScore + retentionScore + loyaltyScore);

    // Guarantee a minimum score of 10 and max of 100
    return Math.max(10, Math.min(totalScore, 100));
}

function formatViews(viewCount: string): string {
    const views = parseInt(viewCount, 10);
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
    return viewCount.toString();
}

export async function searchYouTubeVideos(query: string, maxResults = 40): Promise<VideoResult[]> {
    if (!YOUTUBE_API_KEY) {
        console.warn("YouTube API Key is missing. Returning empty array.");
        return [];
    }

    try {
        // 1. Search for videos (Filter out #shorts)
        const searchQuery = query + " -#shorts";
        const searchRes = await fetch(
            `${YOUTUBE_API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoSyndicated=true&key=${YOUTUBE_API_KEY}&maxResults=${maxResults}`
        );
        const searchData = await searchRes.json();

        if (!searchData.items || searchData.items.length === 0) return [];

        const videoIds = searchData.items.map((item: YouTubeSearchResult) => item.id.videoId).join(",");
        const channelIds = Array.from(new Set(searchData.items.map((item: YouTubeSearchResult) => item.snippet.channelId))).join(",");

        // 2. Get detailed video stats (views, likes)
        const videoStatsRes = await fetch(
            `${YOUTUBE_API_BASE_URL}/videos?part=statistics,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        const videoStatsData = await videoStatsRes.json();

        // 3. Get detailed channel stats (subscribers)
        const channelStatsRes = await fetch(
            `${YOUTUBE_API_BASE_URL}/channels?part=statistics&id=${channelIds}&key=${YOUTUBE_API_KEY}`
        );
        const channelStatsData = await channelStatsRes.json();

        // 4. Map and Calculate Scores
        return searchData.items.map((item: YouTubeSearchResult): VideoResult => {
            const videoStat = videoStatsData.items.find((v: YouTubeVideoDetails) => v.id === item.id.videoId);
            const channelStat = channelStatsData.items.find((c: YouTubeChannelDetails) => c.id === item.snippet.channelId);

            const score = (videoStat && channelStat) ? calculateCredibilityScore(videoStat, channelStat) : 30; // Default low score if missing data

            return {
                id: item.id.videoId,
                type: "video",
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.high.url,
                views: videoStat ? formatViews(videoStat.statistics.viewCount) : "0",
                publishedAt: item.snippet.publishedAt.split("T")[0],
                summary: item.snippet.description,
                credibilityScore: score,
                url: `https://youtube.com/watch?v=${item.id.videoId}`,
                tags: videoStat?.snippet?.tags || [],
            };
        })
            .filter((v: VideoResult) => v.credibilityScore >= 65)
            // Aggressively strip out Shorts that bypassed the API parameter filter
            .filter((v: VideoResult) => {
                const searchStr = (v.title + " " + v.summary).toLowerCase();
                return !searchStr.includes("#short") && !searchStr.includes("shorts");
            })
            .sort((a: VideoResult, b: VideoResult) => b.credibilityScore - a.credibilityScore);

    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        return [];
    }
}

export async function searchYouTubeShorts(query: string, maxResults = 24): Promise<VideoResult[]> {
    if (!YOUTUBE_API_KEY) {
        console.warn("YouTube API Key is missing. Returning empty array.");
        return [];
    }

    try {
        // 1. Search for shorts by appending #shorts and enforcing short videoDuration
        const searchRes = await fetch(
            `${YOUTUBE_API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(query + ' #shorts')}&type=video&videoDuration=short&key=${YOUTUBE_API_KEY}&maxResults=${maxResults}`
        );
        const searchData = await searchRes.json();

        if (!searchData.items || searchData.items.length === 0) return [];

        const videoIds = searchData.items.map((item: YouTubeSearchResult) => item.id.videoId).join(",");
        const channelIds = Array.from(new Set(searchData.items.map((item: YouTubeSearchResult) => item.snippet.channelId))).join(",");

        // 2. Get detailed video stats (views, likes)
        const videoStatsRes = await fetch(
            `${YOUTUBE_API_BASE_URL}/videos?part=statistics,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        const videoStatsData = await videoStatsRes.json();

        // 3. Get detailed channel stats (subscribers)
        const channelStatsRes = await fetch(
            `${YOUTUBE_API_BASE_URL}/channels?part=statistics&id=${channelIds}&key=${YOUTUBE_API_KEY}`
        );
        const channelStatsData = await channelStatsRes.json();

        // 4. Map and Calculate Scores
        return searchData.items.map((item: YouTubeSearchResult): VideoResult => {
            const videoStat = videoStatsData.items.find((v: YouTubeVideoDetails) => v.id === item.id.videoId);
            const channelStat = channelStatsData.items.find((c: YouTubeChannelDetails) => c.id === item.snippet.channelId);

            // Shorts have lower engagement rate expectations and higher baseline views, but we'll use the same credibility calculation
            // with a slightly lower threshold to ensure we get shorts.
            const score = (videoStat && channelStat) ? calculateCredibilityScore(videoStat, channelStat) : 30;

            return {
                id: item.id.videoId,
                type: "short",
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.high.url,
                views: videoStat ? formatViews(videoStat.statistics.viewCount) : "0",
                publishedAt: item.snippet.publishedAt.split("T")[0],
                summary: item.snippet.description,
                credibilityScore: score,
                url: `https://youtube.com/watch?v=${item.id.videoId}`,
                tags: videoStat?.snippet?.tags || [],
            };
        })
            .filter((v: VideoResult) => v.credibilityScore >= 50) // Lower threshold for Shorts due to different watch patterns
            .sort((a: VideoResult, b: VideoResult) => b.credibilityScore - a.credibilityScore);

    } catch (error) {
        console.error("Error fetching YouTube shorts:", error);
        return [];
    }
}
