import { useCallback, useMemo, useState } from "react";

/**
 * Hook for managing view orchestration state with history
 */
export function useViewOrchestrator<TViewId extends string = string>(initialViewId: TViewId) {
  const [activeViewId, setActiveViewId] = useState<TViewId>(initialViewId);
  const [history, setHistory] = useState<TViewId[]>([initialViewId]);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  /**
   * Navigate to a specific view (adds to history)
   */
  const navigateTo = useCallback((viewId: TViewId) => {
    setDirection("forward");
    setActiveViewId(viewId);
    setHistory((prev) => [...prev, viewId]);
  }, []);

  /**
   * Navigate back to the previous view in history
   */
  const navigateBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev;

      const newHistory = prev.slice(0, -1);
      const previousView = newHistory[newHistory.length - 1];

      setDirection("backward");
      setActiveViewId(previousView);

      return newHistory;
    });
  }, []);

  /**
   * Check if back navigation is available
   */
  const canGoBack = useMemo(() => history.length > 1, [history.length]);

  /**
   * Reset to the initial view and clear history
   */
  const reset = useCallback(() => {
    setDirection("forward");
    setActiveViewId(initialViewId);
    setHistory([initialViewId]);
  }, [initialViewId]);

  /**
   * Replace the current view without adding to history
   */
  const replaceView = useCallback((viewId: TViewId) => {
    setDirection("forward");
    setActiveViewId(viewId);
    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1] = viewId;
      return newHistory;
    });
  }, []);

  return {
    activeViewId,
    navigateTo,
    navigateBack,
    canGoBack,
    reset,
    replaceView,
    history,
    direction,
  };
}


