import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'night-sky',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 10, bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {} },
} as const

test('the meter band draws on the terminal and on the desktop', async ($, on) => {
  on('clock.now', () => ({ value: 1_700_000_000_000 }))
  on('state.get', () => ({
    value: { value: { contextPercent: 42, contextTokens: 207000, contextWindow: 1000000, limits: [{ kind: 'five_hour', percentUsed: 73 }] }, version: 1 },
  }))

  const terminal = await $.ui.mount({ ...BAND, surface: 'terminal' })
  const context = await terminal.find({ type: 'Text', text: /context/ })
  expect(context?.text).toMatch(/42%/)
  expect(context?.text).toMatch(/207k\/1000k/)
  expect((await terminal.find({ type: 'Text', text: /5h/ }))?.text).toMatch(/73%/)
  await terminal.unmount()

  const desktop = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await desktop.find({ type: 'Svg' })).toBeDefined()
  await desktop.unmount()
})
