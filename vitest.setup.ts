import '@testing-library/jest-dom';

// Axios rejects on 4xx. Components handle these via Promise.allSettled /
// try-catch, but Vitest's unhandled-rejection watcher flags the raw promise
// before the handler attaches. Suppress that specific noise.
// process.on('unhandledRejection', () => {});
