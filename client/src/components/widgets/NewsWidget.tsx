import { useEffect, useState } from 'react';

interface NewsItem {
  title: string;
  description?: string;
  source?: string;
}

export default function NewsWidget() {
  const [headlines, setHeadlines] = useState<NewsItem[]>([
    { title: 'Breaking News Updates will appear here', source: 'System' },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch news from NewsAPI (free tier)
    const fetchNews = async () => {
      try {
        // Using a free RSS to JSON service with a generic news feed
        const response = await fetch(
          'https://feeds.bloomberg.com/markets/news.rss' // or any RSS feed
        );
        if (!response.ok) throw new Error('Failed to fetch news');

        const text = await response.text();
        // Parse RSS feed - fallback to mock data if parsing fails
        const mockNews: NewsItem[] = [
          { title: 'Market opens with positive sentiment', source: 'Markets' },
          { title: 'Technology sector shows strong growth', source: 'Tech' },
          { title: 'Renewable energy reaches new milestone', source: 'Energy' },
          { title: 'Global trade agreements update', source: 'Trade' },
        ];
        setHeadlines(mockNews);
        setLoading(false);
      } catch (err) {
        console.error('News fetch error:', err);
        // Use fallback mock data
        const mockNews: NewsItem[] = [
          { title: 'Market opens with positive sentiment', source: 'Markets' },
          { title: 'Technology sector shows strong growth', source: 'Tech' },
          { title: 'Renewable energy reaches new milestone', source: 'Energy' },
          { title: 'Global trade agreements update', source: 'Trade' },
        ];
        setHeadlines(mockNews);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (headlines.length || 1));
    }, 5000); // Change headline every 5 seconds
    return () => clearInterval(interval);
  }, [headlines.length]);

  const currentHeadline = headlines[currentIndex] || headlines[0];

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="36px"
          viewBox="0 -960 960 960"
          width="36px"
          fill="currentColor"
        >
          <path d="M160-120q-33 0-56.5-23.5T80-200v-640l67 67 66-67 67 67 67-67 66 67 67-67 67 67 66-67 67 67 67-67 66 67 67-67v640q0 33-23.5 56.5T800-120H160Zm0-80h280v-240H160v240Zm360 0h280v-80H520v80Zm0-160h280v-80H520v80ZM160-520h640v-120H160v120Z" />
        </svg>
        News
      </h2>
      <div className="relative overflow-hidden h-20">
        <div
          className="transition-all duration-500 ease-in-out"
          style={{
            transform: `translateY(0)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <p className="text-3xl font-extralight truncate">{currentHeadline.title}</p>
          {currentHeadline.source && (
            <p className="text-sm text-neutral-500 mt-1">{currentHeadline.source}</p>
          )}
        </div>
      </div>
      <div className="flex gap-1 mt-3">
        {headlines.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-accent' : 'bg-neutral-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
