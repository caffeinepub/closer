export const SOUND_OPTIONS = [
  { id: "beep", label: "Beep / Mlio" },
  { id: "bell", label: "Kengele / Bell" },
  { id: "chime", label: "Chime / Mlio Mzuri" },
  { id: "double", label: "Double / Mara Mbili" },
];

export function playNotificationSound(type: string) {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();

    const playTone = (
      freq: number,
      start: number,
      duration: number,
      decay?: number,
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + start + (decay ?? duration),
      );
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    if (type === "bell") {
      playTone(1047, 0, 0.8, 0.8);
    } else if (type === "chime") {
      playTone(880, 0, 0.3);
      playTone(1047, 0.35, 0.3);
    } else if (type === "double") {
      playTone(660, 0, 0.15);
      playTone(660, 0.25, 0.15);
    } else {
      // beep (default)
      playTone(880, 0, 0.4);
    }
  } catch {
    // ignore audio errors
  }
}

// Keep old export for compatibility
export function playNotificationBeep() {
  playNotificationSound("beep");
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export async function showBackgroundNotification(
  title: string,
  body: string,
  soundType = "beep",
): Promise<void> {
  playNotificationSound(soundType);

  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration?.active) {
        registration.active.postMessage({
          type: "SHOW_NOTIFICATION",
          title,
          body,
        });
        return;
      }
    } catch {
      // fall through
    }
  }

  try {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag: "closer-order",
    });
  } catch {
    // ignore
  }
}
