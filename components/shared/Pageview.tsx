"use client";

import * as React from "react";
import { AnimatePresence, Easing, motion, Variants } from "framer-motion";
import { useViewOrchestrator} from "@/hooks/use-pageView";

/**
 * Represents a single view definition in the orchestrator
 */
export interface ViewDefinition<TViewId extends string = string> {
  /** Unique identifier for this view */
  id: TViewId;
  /** The React component or element to render for this view */
  content: React.ReactNode;
  /** Optional: Custom animation variants for this specific view */
  variants?: Variants;
}

/**
 * Configuration for transition animations
 */
export interface TransitionConfig {
  /** Duration of the transition in seconds */
  duration?: number;
  /** Easing function */
  ease?: string | number[];
}

/**
 * Props for the ViewOrchestrator component
 */
export interface ViewOrchestratorProps<TViewId extends string = string> {
  /** Array of view definitions */
  views: ViewDefinition<TViewId>[];
  /** The currently active view ID */
  activeViewId: TViewId;
  /** Direction of navigation: forward (swipe left) or backward (swipe right) */
  direction?: "forward" | "backward";
  /** Callback when view changes (for external state management) */
  onViewChange?: (viewId: TViewId) => void;
  /** Optional: Custom transition configuration */
  transitionConfig?: TransitionConfig;
  /** Optional: Enable/disable animations (default: true) */
  enableAnimations?: boolean;
}

/**
 * Default animation variants for view transitions
 * Forward: swipe left (enter from right, exit to left)
 * Backward: swipe right (enter from left, exit to right)
 */
const createDefaultVariants = (direction: "forward" | "backward"): Variants => {
  // Forward: swipe left (enter from right +100, exit to left -100)
  // Backward: swipe right (enter from left -100, exit to right +100)
  const enterX = direction === "forward" ? 100 : -100;
  const exitX = direction === "forward" ? -100 : 100;
  return {
    initial: { opacity: 0, x: enterX },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: exitX },
  };
};

/**
 * ViewOrchestrator Component
 *
 * A state-driven, in-route view orchestration component with animated transitions.
 * Enables page-level content swapping within a single route without URL changes.
 *
 * @example
 * ```tsx
 * const { activeViewId, navigateTo, navigateBack, canGoBack } = useViewOrchestrator("overview");
 *
 * const views = [
 *   { id: "overview", content: <OverviewPage onEdit={() => navigateTo("form")} /> },
 *   { id: "form", content: <FormPage onBack={navigateBack} /> },
 * ];
 *
 * return <ViewOrchestrator views={views} activeViewId={activeViewId} />;
 * ```
 */
export const ViewOrchestrator = <TViewId extends string = string>({
  views,
  activeViewId,
  direction = "forward",
  onViewChange,
  transitionConfig = {},
  enableAnimations = true,
}: ViewOrchestratorProps<TViewId>) => {
  const { duration = 0.3, ease = [0.4, 0, 0.2, 1] } = transitionConfig;

  // Find the active view
  const activeView = React.useMemo(
    () => views.find((view) => view.id === activeViewId),
    [views, activeViewId]
  );

  // Track last view ID for change detection
  const [lastViewId, setLastViewId] = React.useState<TViewId | null>(null);

  // Update last view ID when active view changes
  React.useEffect(() => {
    if (activeViewId !== lastViewId) {
      setLastViewId(activeViewId);
      onViewChange?.(activeViewId);
    }
  }, [activeViewId, lastViewId, onViewChange]);

  if (!activeView) {
    return (
      <div className="w-full flex-bg-destructive border-destructive">
        {`ViewOrchestrator: No view found with id "${activeViewId}". Available views: ${views.map((v) => v.id)}`}
      </div>
    );
  }

  const variants = activeView.variants || createDefaultVariants(direction);

  if (!enableAnimations) {
    return <>{activeView.content}</>;
  }

  return (
    <AnimatePresence
      mode="wait"
      initial={false}>
      <motion.div
        key={activeViewId}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration, ease: ease as Easing }}>
        {activeView.content}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Alternative: ViewOrchestrator with built-in state management
 * Use this when you don't need external control over the view state
 */
export interface SelfManagedViewOrchestratorProps<TViewId extends string = string> extends Omit<
  ViewOrchestratorProps<TViewId>,
  "activeViewId"
> {
  /** Initial view ID */
  initialViewId: TViewId;
  /** Optional: Render prop to access navigation controls */
  children?: (controls: {
    navigateTo: (viewId: TViewId) => void;
    navigateBack: () => void;
    canGoBack: boolean;
    reset: () => void;
    activeViewId: TViewId;
  }) => React.ReactNode;
}

export const SelfManagedViewOrchestrator = <TViewId extends string = string>({
  initialViewId,
  views,
  children,
  ...props
}: SelfManagedViewOrchestratorProps<TViewId>) => {
  const controls = useViewOrchestrator(initialViewId);

  return (
    <>
      {children?.(controls)}
      <ViewOrchestrator
        {...props}
        views={views}
        activeViewId={controls.activeViewId}
      />
    </>
  );
};