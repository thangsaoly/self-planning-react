import { useState, useEffect, useCallback, useRef } from "react";

const QUEUE_KEY = "offline_queue";

/** Reads the pending offline queue from localStorage. */
const readQueue = () => {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
};

/** Writes the pending offline queue to localStorage. */
const writeQueue = (queue) => {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

/**
 * useOfflineSync — manages online/offline state and a pending operation queue.
 *
 * @param {Function} flushFn - async function(operation) that replays a single queued operation.
 *   Should return { success: boolean, serverId?: string } for "create" ops.
 *
 * @returns {{ isOnline, pendingCount, queueOperation, clearQueue }}
 */
export function useOfflineSync(flushFn) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [pendingCount, setPendingCount] = useState(() => readQueue().length);
  const flushFnRef = useRef(flushFn);
  const isFlushing = useRef(false);

  // Keep flushFn ref up-to-date without re-running effects
  useEffect(() => {
    flushFnRef.current = flushFn;
  }, [flushFn]);

  /** Flushes the queue sequentially. */
  const flushQueue = useCallback(async () => {
    if (isFlushing.current) return;
    isFlushing.current = true;

    let queue = readQueue();
    while (queue.length > 0) {
      const operation = queue[0];
      try {
        await flushFnRef.current(operation);
        queue = queue.slice(1);
        writeQueue(queue);
        setPendingCount(queue.length);
      } catch (err) {
        // If it fails, stop — retry next time we come online
        console.error("[OfflineSync] Failed to flush operation:", operation, err);
        break;
      }
    }

    isFlushing.current = false;
  }, []);

  // Listen to online/offline browser events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // If we boot online with a leftover queue (from a previous offline session), flush it
    if (navigator.onLine && readQueue().length > 0) {
      flushQueue();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [flushQueue]);

  /**
   * Adds a new operation to the pending queue.
   * @param {{ type: "create"|"update"|"delete", payload: object, tempId?: string }} operation
   */
  const queueOperation = useCallback((operation) => {
    const queue = readQueue();
    queue.push(operation);
    writeQueue(queue);
    setPendingCount(queue.length);
  }, []);

  /** Clears the entire pending queue. */
  const clearQueue = useCallback(() => {
    writeQueue([]);
    setPendingCount(0);
  }, []);

  return { isOnline, pendingCount, queueOperation, clearQueue };
}
