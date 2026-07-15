import { useEffect, useState } from 'react';

export type TimerPhase = 'reading' | 'answering' | 'expired';

export interface TimerState {
  phase: TimerPhase;
  remaining: number; // whole seconds left in the current phase
}

/**
 * Derives the interview phase and remaining time from the SERVER's served_at
 * timestamp — never from a local countdown. Because everything is computed from
 * served_at + the wall clock, a page refresh resumes at the correct time and the
 * timer cannot be reset by reloading. This is the anti-cheat guarantee.
 */
export function computeTimerState(
  servedAt: string,
  readSeconds: number,
  answerSeconds: number,
  now: number = Date.now()
): TimerState {
  const served = new Date(servedAt).getTime();
  const elapsed = (now - served) / 1000;

  if (elapsed < readSeconds) {
    return { phase: 'reading', remaining: Math.ceil(readSeconds - elapsed) };
  }
  if (elapsed < readSeconds + answerSeconds) {
    return {
      phase: 'answering',
      remaining: Math.ceil(readSeconds + answerSeconds - elapsed),
    };
  }
  return { phase: 'expired', remaining: 0 };
}

/**
 * Ticks once a second for display, but the source of truth is always served_at.
 * Returns the current phase and remaining seconds.
 */
export function useInterviewTimer(
  servedAt: string | null,
  readSeconds: number,
  answerSeconds: number
): TimerState {
  const [state, setState] = useState<TimerState>(() =>
    servedAt
      ? computeTimerState(servedAt, readSeconds, answerSeconds)
      : { phase: 'reading', remaining: readSeconds }
  );

  useEffect(() => {
    if (!servedAt) return;

    const update = () => {
      setState(computeTimerState(servedAt, readSeconds, answerSeconds));
    };

    update(); // initial update
    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [servedAt, readSeconds, answerSeconds]);

  return state;
}
