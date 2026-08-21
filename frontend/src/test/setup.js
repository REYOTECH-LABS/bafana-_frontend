import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * Shared setup for the frontend test suite.
 *
 * Storage is cleared between tests because the authentication tests assert on
 * exactly where the token lands — a token left behind by one test would make
 * the next one appear already signed in.
 */
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});
