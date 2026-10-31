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
      className="fixed inset-x-4 top-3 z-[100] mx-auto flex max-w-md items-center gap-2 rounded-lg border border-input bg-popover py-2 pl-4 pr-2 text-popover-foreground"
      style={{ marginTop: 'env(safe-area-inset-top)' }}
    >
      <p className="flex-1 text-base">
        {notice === 'update' ? 'Update available' : 'Ready to work offline'}
      </p>
      {notice === 'update' && (
        <button
          type="button"
          onClick={() => applyUpdate?.()}
          className="min-h-[48px] min-w-[48px] rounded-lg bg-primary px-4 text-base font-bold text-primary-foreground active:bg-primary/80"
        >
          Reload
        </button>
      )}
      <button
        type="button"
        onClick={() => setNotice(null)}
        aria-label="Dismiss"
        className="min-h-[48px] min-w-[48px] rounded-lg px-3 text-base font-medium text-muted-foreground active:bg-secondary"
      >
        {notice === 'update' ? 'Later' : 'OK'}
      </button>
    </div>
  );
}
