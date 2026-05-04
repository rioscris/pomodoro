import { useEffect, useRef, useState } from 'react';

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  getPlayerState: () => number;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: any) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        UNSTARTED: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YouTubeQueueItem {
  id: string;
  videoId: string;
  title: string;
  url: string;
}

export const useYouTubePlayer = (shouldPlay: boolean, isEnabled: boolean) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<YouTubeQueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasManuallyInteracted = useRef(false); // Track if user has manually interacted

  // Load YouTube IFrame API
  useEffect(() => {
    if (!isEnabled || import.meta.env.MODE === 'test') return;

    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    window.onYouTubeIframeAPIReady = () => {
      setIsReady(true);
    };

    if (window.YT && window.YT.Player) {
      setIsReady(true);
    }
  }, [isEnabled]);

  // Create player when API is ready and we have videos in queue
  useEffect(() => {
    if (!isEnabled) return;

    if (isReady && queue.length > 0 && !playerRef.current) {
      const firstVideo = queue[currentIndex];
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: firstVideo.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            setIsPlayerReady(true);
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);

            // Auto-play next video when current ends
            if (event.data === window.YT.PlayerState.ENDED) {
              playNext();
            }
          },
        },
      });
    }
  }, [isEnabled, isReady, queue.length]);

  // Handle play/pause based on timer state (only when timer state changes)
  useEffect(() => {
    if (!isEnabled) return;

    console.log('Timer sync effect:', {
      hasManuallyInteracted: hasManuallyInteracted.current,
      isPlayerReady,
      queueLength: queue.length,
      shouldPlay,
      isPlaying
    });
    // Only sync with timer if user has manually started playback
    if (hasManuallyInteracted.current && isPlayerReady && playerRef.current && queue.length > 0) {
      console.log('Syncing with timer...');
      if (shouldPlay && !isPlaying) {
        console.log('Playing video (timer)');
        playerRef.current.playVideo();
      } else if (!shouldPlay && isPlaying) {
        console.log('Pausing video (timer)');
        playerRef.current.pauseVideo();
      }
    }
    // Note: queue.length and isPlaying are intentionally NOT in dependencies
    // to avoid auto-play when adding items and conflicts with manual controls
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, shouldPlay, isPlayerReady]);

  // Load new video when current index changes
  useEffect(() => {
    if (!isEnabled) return;

    if (isPlayerReady && playerRef.current && queue.length > 0) {
      const currentVideo = queue[currentIndex];
      if (currentVideo) {
        // Use cueVideoById instead of loadVideoById to prevent auto-play
        playerRef.current.cueVideoById(currentVideo.videoId);
      }
    }
  }, [isEnabled, currentIndex, isPlayerReady]);

  const togglePlayPause = () => {
    if (!isEnabled) return;

    console.log('togglePlayPause called');
    if (playerRef.current && isPlayerReady) {
      hasManuallyInteracted.current = true; // Mark that user has interacted
      console.log('Setting hasManuallyInteracted to true');
      if (isPlaying) {
        console.log('Pausing video (manual)');
        playerRef.current.pauseVideo();
      } else {
        console.log('Playing video (manual)');
        playerRef.current.playVideo();
      }
    }
  };

  const addToQueue = (item: YouTubeQueueItem) => {
    if (!isEnabled) return;

    console.log('addToQueue llamado con:', item);
    setQueue((prev) => {
      // Check if item with same id already exists
      const exists = prev.some((existingItem) => existingItem.id === item.id);
      if (exists) {
        console.log('Item ya existe en la cola, no se agrega:', item.id);
        return prev;
      }
      const newQueue = [...prev, item];
      console.log('Nueva cola:', newQueue);
      return newQueue;
    });
  };

  const removeFromQueue = (id: string) => {
    if (!isEnabled) return;

    setQueue((prev) => {
      const newQueue = prev.filter((item) => item.id !== id);
      // Adjust current index if needed
      const removedIndex = prev.findIndex((item) => item.id === id);
      if (removedIndex < currentIndex) {
        setCurrentIndex((idx) => Math.max(0, idx - 1));
      } else if (removedIndex === currentIndex && newQueue.length > 0) {
        // If we're removing the current video, stay at same index or adjust if at end
        if (currentIndex >= newQueue.length) {
          setCurrentIndex(newQueue.length - 1);
        }
      } else if (newQueue.length === 0) {
        setCurrentIndex(0);
      }
      return newQueue;
    });
  };

  const clearQueue = () => {
    if (!isEnabled) return;

    setQueue([]);
    setCurrentIndex(0);
    if (playerRef.current && isPlayerReady) {
      playerRef.current.stopVideo();
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (!isEnabled) return;

    if (queue.length > 0 && currentIndex < queue.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      const nextVideo = queue[currentIndex + 1];
      if (playerRef.current && isPlayerReady) {
        // Use loadVideoById for next video - we want it to continue playing
        playerRef.current.loadVideoById(nextVideo.videoId);
      }
    }
  };

  const playAtIndex = (index: number) => {
    if (!isEnabled) return;

    if (queue.length > 0 && index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      const video = queue[index];
      if (playerRef.current && isPlayerReady) {
        // Use cueVideoById to load without auto-playing
        playerRef.current.cueVideoById(video.videoId);
      }
    }
  };

  return {
    playerRef,
    isPlaying,
    isPlayerReady,
    queue,
    currentIndex,
    currentVideo: queue[currentIndex] || null,
    togglePlayPause,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playAtIndex,
  };
};
