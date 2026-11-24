export type MeterLimit = { kind: string; percentUsed: number; resetsAt?: string }
export type Meter = { contextPercent: number | null; contextTokens?: number; contextWindow?: number; limits: MeterLimit[] }

declare module 'claude-code' {
  interface PluginState {
    'night-sky': { meter: Meter }
  }
}
