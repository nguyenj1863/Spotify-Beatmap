/** General purpose banner type used for notifications, alerts, and errors */
export type BannerKind = "info" | "success" | "warning" | "error";

/** Represents the state of a banner/alert shown in the UI */
export interface BannerState {
  /** Visual style (color/icon) based on severity or intent */
  type: BannerKind;

  /** Message displayed to the user */
  text: string;

  /** Optional duration (ms) for auto-dismissal; if undefined, stays visible */
  timeoutMs?: number;
}

/** Reusable loading states for async components or hooks */
export interface LoadingState {
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string | null;
}

/** Generic modal or drawer visibility control */
export interface ModalState {
  isOpen: boolean;
  title?: string;
  description?: string;
}

/** Toast / ephemeral message configuration */
export interface Toast {
  id: string;
  message: string;
  type?: BannerKind;
  duration?: number;
}
