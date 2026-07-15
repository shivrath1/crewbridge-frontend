import { computeTimerState } from '../useInterviewTimer';

const READ = 30;
const ANSWER = 90;

// A fixed served_at; we vary "now" to simulate elapsed time.
const servedAt = '2026-07-15T00:00:00.000Z';
const served = new Date(servedAt).getTime();
const at = (secondsElapsed: number) => served + secondsElapsed * 1000;

describe('computeTimerState', () => {
  it('is in the reading phase at the start', () => {
    const s = computeTimerState(servedAt, READ, ANSWER, at(0));
    expect(s.phase).toBe('reading');
    expect(s.remaining).toBe(30);
  });

  it('counts down the reading phase', () => {
    const s = computeTimerState(servedAt, READ, ANSWER, at(10));
    expect(s.phase).toBe('reading');
    expect(s.remaining).toBe(20);
  });

  it('is still reading at 29 seconds', () => {
    expect(computeTimerState(servedAt, READ, ANSWER, at(29)).phase).toBe(
      'reading'
    );
  });

  it('switches to answering just after the read window', () => {
    const s = computeTimerState(servedAt, READ, ANSWER, at(31));
    expect(s.phase).toBe('answering');
    expect(s.remaining).toBe(89);
  });

  it('is answering in the middle of the answer window', () => {
    const s = computeTimerState(servedAt, READ, ANSWER, at(75));
    expect(s.phase).toBe('answering');
    expect(s.remaining).toBe(45);
  });

  it('is still answering at 119 seconds', () => {
    expect(computeTimerState(servedAt, READ, ANSWER, at(119)).phase).toBe(
      'answering'
    );
  });

  it('expires once the full window has passed', () => {
    const s = computeTimerState(servedAt, READ, ANSWER, at(121));
    expect(s.phase).toBe('expired');
    expect(s.remaining).toBe(0);
  });

  it('resumes at the correct time after a simulated refresh', () => {
    // Whatever "now" is, the phase is derived from served_at — not a local count.
    const s = computeTimerState(servedAt, READ, ANSWER, at(50));
    expect(s.phase).toBe('answering');
    expect(s.remaining).toBe(70); // 30 + 90 - 50
  });
});
