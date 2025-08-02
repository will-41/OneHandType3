import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  activeAudioElements: HTMLAudioElement[];
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  cleanup: () => void;
  removeAudioElement: (element: HTMLAudioElement) => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: true, // Start muted by default
  activeAudioElements: [], // Track active audio elements to prevent memory leaks
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  // Remove an audio element from tracking array when it's done
  removeAudioElement: (element) => {
    const { activeAudioElements } = get();
    set({ 
      activeAudioElements: activeAudioElements.filter(el => el !== element)
    });
  },
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    // Just update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted, activeAudioElements } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      
      // Track this audio element to prevent memory leaks
      set({ activeAudioElements: [...activeAudioElements, soundClone] });
      
      // Add event listener to clean up when done playing
      soundClone.addEventListener('ended', () => {
        get().removeAudioElement(soundClone);
      });
      
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
        // Clean up immediately if there was an error
        get().removeAudioElement(soundClone);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted, activeAudioElements } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      // For success sound, we can reuse the same element instead of cloning
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  // Cleanup method to prevent memory leaks
  cleanup: () => {
    const { activeAudioElements, backgroundMusic, hitSound, successSound } = get();
    
    // Stop and release all active audio elements
    activeAudioElements.forEach(audio => {
      try {
        audio.pause();
        audio.src = '';
      } catch (e) {
        console.warn('Error cleaning up audio element:', e);
      }
    });
    
    // Clean up main audio elements
    [backgroundMusic, hitSound, successSound].forEach(audio => {
      if (audio) {
        try {
          audio.pause();
          audio.src = '';
        } catch (e) {
          console.warn('Error cleaning up main audio:', e);
        }
      }
    });
    
    // Clear the tracking array
    set({ activeAudioElements: [] });
    
    console.log('Audio resources cleaned up');
  }
}));
