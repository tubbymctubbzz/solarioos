"use client";

import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, MoreHorizontal, Search, Shuffle, Repeat } from "lucide-react";

interface MusicAppProps {
  windowId: string;
  isDarkMode?: boolean;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
}

interface Playlist {
  id: string;
  name: string;
  count: number;
}

export default function MusicApp({ windowId, isDarkMode = false }: MusicAppProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [selectedPlaylist, setSelectedPlaylist] = useState("recent");
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  const playlists: Playlist[] = [
    { id: "recent", name: "Recently Played", count: 12 },
    { id: "favorites", name: "Favorites", count: 8 },
    { id: "discover", name: "Discover Weekly", count: 30 },
    { id: "chill", name: "Chill Vibes", count: 25 },
    { id: "workout", name: "Workout Mix", count: 18 }
  ];

  const sampleTracks: Track[] = [
    { id: "1", title: "Midnight Dreams", artist: "Luna Eclipse", album: "Nocturnal", duration: "3:42" },
    { id: "2", title: "Electric Pulse", artist: "Neon Waves", album: "Synthwave", duration: "4:15" },
    { id: "3", title: "Ocean Breeze", artist: "Coastal Sounds", album: "Serenity", duration: "3:28" },
    { id: "4", title: "Urban Lights", artist: "City Beats", album: "Metropolitan", duration: "3:55" },
    { id: "5", title: "Forest Path", artist: "Nature's Call", album: "Wilderness", duration: "4:02" },
    { id: "6", title: "Digital Love", artist: "Cyber Hearts", album: "Future Romance", duration: "3:33" },
    { id: "7", title: "Starlight Serenade", artist: "Cosmic Melody", album: "Galaxy", duration: "4:18" },
    { id: "8", title: "Morning Coffee", artist: "Jazz Café", album: "Daily Brew", duration: "3:47" }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleNext = () => {
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % sampleTracks.length;
    setCurrentTrack(sampleTracks[nextIndex]);
    setProgress(0);
  };

  const handlePrevious = () => {
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack?.id);
    const prevIndex = currentIndex === 0 ? sampleTracks.length - 1 : currentIndex - 1;
    setCurrentTrack(sampleTracks[prevIndex]);
    setProgress(0);
  };

  const formatTime = (percentage: number, duration: string) => {
    const [minutes, seconds] = duration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds);
    const currentMinutes = Math.floor(currentSeconds / 60);
    const remainingSeconds = currentSeconds % 60;
    return `${currentMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`h-full flex ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <div className={`w-64 border-r flex flex-col ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gray-100 border-gray-200'
      }`}>
        <div className="p-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search Library"
              className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-2">
            <h3 className={`text-sm font-semibold mb-3 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Library</h3>
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => setSelectedPlaylist(playlist.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                  selectedPlaylist === playlist.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : (isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-200')
                }`}
              >
                <span className="text-sm">{playlist.name}</span>
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{playlist.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Track List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Recently Played</h2>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>{sampleTracks.length} songs</p>
          </div>

          <div className="px-6 pb-6">
            <div className="space-y-1">
              {sampleTracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    currentTrack?.id === track.id 
                      ? (isDarkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200')
                      : (isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100')
                  }`}
                >
                  <div className="w-8 text-center text-sm text-gray-500">
                    {currentTrack?.id === track.id && isPlaying ? (
                      <div className="flex justify-center">
                        <div className="w-1 h-4 bg-blue-500 animate-pulse mx-px"></div>
                        <div className="w-1 h-4 bg-blue-500 animate-pulse mx-px" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-4 bg-blue-500 animate-pulse mx-px" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div className="flex-1 ml-4">
                    <div className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{track.title}</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{track.artist} • {track.album}</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className={`p-1 rounded ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}>
                      <Heart className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className={`text-sm w-12 text-right ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{track.duration}</span>
                    <button className={`p-1 rounded ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Now Playing Bar */}
        {currentTrack && (
          <div className={`border-t p-4 ${
            isDarkMode 
              ? 'border-gray-700 bg-gray-800' 
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center space-x-4">
              {/* Track Info */}
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">♪</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{currentTrack.title}</div>
                  <div className={`text-sm truncate ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>{currentTrack.artist}</div>
                </div>
                <Heart className="w-4 h-4 text-gray-400" />
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center space-y-2 flex-1">
                {/* Control Buttons */}
                <div className="flex items-center justify-center space-x-6">
                  <button 
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={`p-2 rounded-full transition-colors ${
                      isShuffled 
                        ? 'text-blue-600 bg-blue-50' 
                        : (isDarkMode 
                          ? 'text-gray-400 hover:bg-gray-700' 
                          : 'text-gray-600 hover:bg-gray-100')
                    }`}
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={handlePrevious}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode 
                        ? 'text-gray-400 hover:bg-gray-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>
                  
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <button 
                    onClick={handleNext}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode 
                        ? 'text-gray-400 hover:bg-gray-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => {
                      const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
                      const currentIndex = modes.indexOf(repeatMode);
                      setRepeatMode(modes[(currentIndex + 1) % modes.length]);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      repeatMode !== 'off' ? 'text-blue-600' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                    }`}
                  >
                    <Repeat className="w-5 h-5" />
                    {repeatMode === 'one' && <span className="absolute text-xs">1</span>}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className={`flex items-center space-x-2 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span>{currentTrack ? formatTime(progress, currentTrack.duration) : '0:00'}</span>
                  <div className={`flex-1 rounded-full h-1 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span>{currentTrack?.duration || '0:00'}</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-2 flex-1 justify-end">
                <Volume2 className={`w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <div className={`w-24 rounded-full h-1 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="bg-blue-500 h-1 rounded-full" 
                    style={{ width: `${volume}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
