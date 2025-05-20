import React, { useEffect, useState } from "react";

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
}

const NowPlaying: React.FC = () => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/now-playing");
        const data = await res.json();
        setIsPlaying(data.isPlaying);
        setTrack(data.isPlaying ? data : null);
      } catch (error) {
        setIsPlaying(false);
        setTrack(null);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isPlaying || !track) {
    return (
      <div className="text-sm text-gray-500 italic">
        Ahora mismo no escucho nada en Spotify.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-800">
      <span className="whitespace-nowrap">Mientras ves esta web, estoy escuchando:</span>
<a
  href={track.external_urls.spotify}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3" 
>
  <img
    src={track.album.images[2]?.url || track.album.images[0]?.url}
    alt="Album cover"
    className="w-6 h-6 rounded"
  />
  <span className="font-medium text-xs break-words whitespace-normal leading-tight max-w-[220px]">
  </span>
</a>


    </div>
  );
};

export default NowPlaying;
