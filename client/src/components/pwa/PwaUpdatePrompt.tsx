import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

type Notice = 'update' | 'offline' | null;

/** Registers the service worker and shows an update / offline-ready toast. */
export default function PwaUpdatePrompt() {
  const [notice, setNotice] = useState<Notice>(null);
  const [applyUpdate, setApplyUpdate] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const update = registerSW({
      onNeedRefresh: () => setNotice('update'),
      onOfflineReady: () => setNotice('offline'),
    });
    setApplyUpdate(() => () => update(true));
  }, []);

  // The offline-ready notice is informational: auto-dismiss so it never
  // lingers. Update notices stay until the user acts on them.
  useEffect(() => {
    if (notice !== 'offline') return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  if (!notice) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 top-3 z-[100] mx-auto flex max-w-md items-center gap-3 rounded-xl border border-border bg-card p-3 text-foreground shadow-lg"
      style={{ marginTop: 'env(safe-area-inset-top)' }}
    >
      <p className="flex-1 text-sm">
        {notice === 'update' ? 'Update available' : 'Ready to work offline'}
      </p>
      {notice === 'update' && (
        <button
          type="button"
          onClick={() => applyUpdate?.()}
          className="min-h-[48px] min-w-[48px] rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Reload
        </button>
      )}
      <button
        type="button"
        onClick={() => setNotice(null)}
        aria-label="Dismiss"
        className="min-h-[48px] min-w-[48px] rounded-lg px-3 text-sm text-muted-foreground"
      >
        {notice === 'update' ? 'Later' : 'OK'}
      </button>
    </div>
  );
}
