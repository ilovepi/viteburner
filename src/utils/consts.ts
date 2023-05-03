import { RunOptions } from '@ns';

export const second_ms = 1000;
export const minute_ms = 60 * second_ms;
export const hour_ms = 60 * minute_ms;

export function default_opts() {
  const opts: RunOptions = { preventDuplicates: true, threads: 1, temporary: true };
  return opts;
}
