import React, { createContext, useContext, useRef, useState, useCallback, useMemo } from 'react';

interface SoundContextType {
  setAmbient: (scene: 'street' | 'road' | 'plane' | null) => void;
  playEffect: (effect: 'click') => void;
  muted: boolean;
  toggleMute: () => void;
  enabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  registerVideo: (video: HTMLVideoElement) => void;
  unregisterVideo: (video: HTMLVideoElement) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const AMBIENT_SOUNDS: Record<string, string> = {
  street: 'mp3/street.mp3',
  road: 'mp3/road.mp3',
  plane: 'mp3/plane.mp3',
};
const EFFECT_SOUNDS: Record<string, string> = {
  click: 'mp3/click.mp3',
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [muted, setMuted] = useState(false);
  const [, setCurrentAmbient] = useState<string | null>(null);
  const [enabled, setSoundEnabled] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const registeredVideos = useRef<Set<HTMLVideoElement>>(new Set());

  // Register video for mute control
  const registerVideo = useCallback((video: HTMLVideoElement) => {
    registeredVideos.current.add(video);
    video.muted = muted;
  }, [muted]);

  // Unregister video
  const unregisterVideo = useCallback((video: HTMLVideoElement) => {
    registeredVideos.current.delete(video);
  }, []);

  // Play ambient with fade in/out
  const setAmbient = useCallback((scene: 'street' | 'road' | 'plane' | null) => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    
    if (ambientAudioRef.current) {
      // Fade out current ambient
      const audio = ambientAudioRef.current;
      let vol = audio.volume;
      const fadeOut = () => {
        if (vol > 0.05) {
          vol -= 0.05;
          audio.volume = Math.max(vol, 0);
          fadeTimeoutRef.current = window.setTimeout(fadeOut, 30);
        } else {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 1;
          ambientAudioRef.current = null;
          if (scene && AMBIENT_SOUNDS[scene] && enabled && !muted) {
            playAmbient(scene);
          } else {
            setCurrentAmbient(null);
          }
        }
      };
      fadeOut();
    } else if (scene && AMBIENT_SOUNDS[scene] && enabled && !muted) {
      playAmbient(scene);
    } else {
      setCurrentAmbient(null);
    }
    // eslint-disable-next-line
  }, [enabled, muted]);

  const playAmbient = (scene: 'street' | 'road' | 'plane') => {
    if (!enabled || muted) return; // Prevent ambient if muted
    console.log("playAmbient", scene);
    const src = AMBIENT_SOUNDS[scene];
    const audio = new window.Audio(import.meta.env.BASE_URL + src);
    audio.loop = true;
    audio.volume = 0;
    audio.muted = muted;
    
    // iOS: Set preload and ensure audio stays active
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      audio.preload = 'auto';
      // iOS requires audio to be played in response to user interaction
      // We'll handle this in the unlock mechanism
    }
    
    audio.play().catch((error) => {
      console.log('Audio play failed, will retry:', error);
    });
    ambientAudioRef.current = audio;
    setCurrentAmbient(scene);
    // Fade in
    let vol = 0;
    const fadeIn = () => {
      if (vol < 1) {
        vol += 0.05;
        audio.volume = Math.min(vol, 1);
        fadeTimeoutRef.current = window.setTimeout(fadeIn, 30);
      } else {
        audio.volume = 1;
      }
    };
    fadeIn();
  };

  // Play effect (no fade, can overlap)
  const playEffect = useCallback((effect: 'click') => {
    if (!enabled) return;
    console.log("playEffect", effect);
    if (!EFFECT_SOUNDS[effect]) return;
    const audio = new window.Audio(import.meta.env.BASE_URL + EFFECT_SOUNDS[effect]);
    audio.volume = muted ? 0 : 0.2;
    audio.play();
  }, [muted, enabled]);

  // Mute/unmute all
  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const newMuted = !m;
      if (ambientAudioRef.current) ambientAudioRef.current.muted = newMuted;
      // Mute/unmute all registered videos
      registeredVideos.current.forEach(video => {
        video.muted = newMuted;
      });
      return newMuted;
    });
  }, []);

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current = null;
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  // React to mute state
  React.useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.muted = muted;
    }
    // Update all registered videos
    registeredVideos.current.forEach(video => {
      video.muted = muted;
    });
  }, [muted]);

  // iOS: Keep audio alive and resume if paused during scroll
  React.useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS) return;

    const checkAndResumeAudio = () => {
      if (ambientAudioRef.current && enabled && !muted) {
        const audio = ambientAudioRef.current;
        if (audio.paused && audio.readyState >= 2) {
          // Audio is paused but loaded - resume it
          audio.play().catch((error) => {
            console.log('Failed to resume audio on iOS:', error);
          });
          console.log('iOS: Resumed paused ambient audio');
        }
      }
    };

    // Check periodically to resume if paused (iOS may pause during scroll)
    const resumeInterval = setInterval(checkAndResumeAudio, 500);

    // Also check on scroll events
    const handleScroll = () => {
      checkAndResumeAudio();
    };

    // Check on visibility change (when tab becomes visible again)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(checkAndResumeAudio, 100);
      }
    };

    // Check on page show (iOS Safari specific)
    const handlePageShow = () => {
      setTimeout(checkAndResumeAudio, 100);
    };

    // iOS: Resume audio on any touch interaction (iOS requires user gesture to play audio)
    const handleTouch = () => {
      checkAndResumeAudio();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    // Listen to touch events to keep audio alive on iOS
    document.addEventListener('touchstart', handleTouch, { passive: true });
    document.addEventListener('touchend', handleTouch, { passive: true });

    return () => {
      clearInterval(resumeInterval);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('touchend', handleTouch);
    };
  }, [enabled, muted]);

  // Unlock audio on iOS/mobile after first user interaction
  React.useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isIOS && !isMobile) return; // Only needed for mobile/iOS

    let audioUnlocked = false;
    const unlockAudio = () => {
      if (audioUnlocked) return;
      audioUnlocked = true;

      // Create and play a silent audio to unlock audio context
      const silentAudio = new Audio();
      silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
      silentAudio.volume = 0.01;
      silentAudio.play().catch(() => {
        // Ignore errors
      });

      // Unmute all registered videos after user interaction
      setTimeout(() => {
        registeredVideos.current.forEach(video => {
          if (!muted) {
            video.muted = false;
          }
        });
        console.log('Audio unlocked on user interaction');
        
        // Also ensure ambient audio is playing if it should be
        if (ambientAudioRef.current && enabled && !muted) {
          const audio = ambientAudioRef.current;
          if (audio.paused) {
            audio.play().catch(() => {
              // Ignore errors
            });
          }
        }
      }, 100);
    };

    // Listen for first user interaction
    const events = ['touchstart', 'touchend', 'mousedown', 'click', 'keydown'];
    events.forEach(eventType => {
      document.addEventListener(eventType, unlockAudio, { once: true, passive: true });
    });

    return () => {
      events.forEach(eventType => {
        document.removeEventListener(eventType, unlockAudio);
      });
    };
  }, [muted, enabled]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    setAmbient,
    playEffect,
    muted,
    toggleMute,
    enabled,
    setSoundEnabled,
    registerVideo,
    unregisterVideo
  }), [setAmbient, playEffect, muted, toggleMute, enabled, setSoundEnabled, registerVideo, unregisterVideo]);

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within SoundProvider');
  return ctx;
};
