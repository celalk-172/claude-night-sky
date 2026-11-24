import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import type { Meter } from '../types'
import { makeColors } from './make-colors.js'

// Dark only: deep blue-black surfaces, soft starlight text.
const { theme, problems } = makeColors({
  label: 'Night sky',
  only: 'dark',
  roles: { accent: '#7aa7e8', danger: '#e0606a', success: '#6fcf97', warning: '#e0b25a', pro: '#a99be8' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#080c18',
        'surface-1': '#0e1424',
        'surface-2': '#141b2e',
        'surface-3': '#161e33',
        'text-primary': '#e8edf8',
        'text-secondary': '#bcc6dc',
        'text-muted': '#97a3be',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'night-sky', glass: { blur: 8, tint: '#080c18', opacity: 0.35 } },
}

// Small seeded generator so the stars are the same on every load.
let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

const stars = Array.from({ length: 140 }, () => {
  const x = Math.round(rand() * 1600)
  const y = Math.round(rand() * 760)
  const r = (0.6 + rand() * 1.4).toFixed(1)
  const base = (0.35 + rand() * 0.45).toFixed(2)
  const cls = rand() < 0.5 ? 'tw1' : rand() < 0.5 ? 'tw2' : 'tw3'
  const delay = (rand() * 8).toFixed(1)
  return `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}" fill="#dfe8ff" opacity="${base}" style="animation-delay:-${delay}s"/>`
}).join('')

// A small airliner seen from the side, nose to the right, with a contrail behind.
const PLANE = `<rect x="-200" y="-1" width="150" height="2" fill="url(#contrail)"/>
<polygon points="-42,-3 -52,-22 -40,-22 -24,-5" fill="#9aa6c0"/>
<polygon points="-40,3 -50,9 -40,9 -28,4" fill="#8e99b3"/>
<path d="M-44,-3 L30,-7 Q47,-6 47,0 Q47,5 30,6 L-38,4 Z" fill="#c9d2e4"/>
<polygon points="-4,4 -28,19 -17,19 14,5" fill="#8e99b3"/>
<rect x="-10" y="13" width="13" height="5" rx="2.5" fill="#76819b"/>
<circle cx="-22" cy="-2" r="1.1" fill="#ffe9b0"/><circle cx="-14" cy="-2" r="1.1" fill="#ffe9b0"/><circle cx="-6" cy="-2" r="1.1" fill="#ffe9b0"/><circle cx="2" cy="-2" r="1.1" fill="#ffe9b0"/><circle cx="10" cy="-3" r="1.1" fill="#ffe9b0"/><circle cx="18" cy="-3" r="1.1" fill="#ffe9b0"/>
<path d="M30,-5 Q38,-5 40,-2 L30,-2 Z" fill="#6f7c99"/>
<circle class="blink" cx="-26" cy="19" r="2.2" fill="#ff5a5a"/>
<circle cx="-50" cy="-22" r="1.4" fill="#ffffff"/>`

// A small rocket pointing up, with a flame and an exhaust trail below it.
const ROCKET = `<rect x="-3" y="12" width="6" height="320" fill="url(#trail)"/>
<polygon points="-5,16 5,16 0,48" fill="#ffb347" class="flame"/>
<rect x="-7" y="-26" width="14" height="44" rx="3" fill="#dfe6f5"/>
<polygon points="-7,-26 7,-26 0,-46" fill="#e0606a"/>
<polygon points="-7,2 -15,20 -7,14" fill="#8e99b3"/>
<polygon points="7,2 15,20 7,14" fill="#8e99b3"/>
<circle cx="0" cy="-8" r="3.5" fill="#7aa7e8"/>`

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#04060f"/>
<stop offset="0.6" stop-color="#0a1128"/>
<stop offset="1" stop-color="#16213f"/>
</linearGradient>
<radialGradient id="moonglow">
<stop offset="0" stop-color="#cfd9ff" stop-opacity="0.35"/>
<stop offset="1" stop-color="#cfd9ff" stop-opacity="0"/>
</radialGradient>
<linearGradient id="moonface" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#f7f9ff"/>
<stop offset="1" stop-color="#c9d4f2"/>
</linearGradient>
<linearGradient id="trail" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#ffd9a0" stop-opacity="0.8"/>
<stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/>
</linearGradient>
<linearGradient id="contrail" x1="1" y1="0" x2="0" y2="0">
<stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</linearGradient>
</defs>
<style>
.tw1{animation:tw 5s ease-in-out infinite}
.tw2{animation:tw 7s ease-in-out infinite}
.tw3{animation:tw 9s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:0.3}50%{opacity:0.9}}
.plane1{opacity:0;animation:fly1 35s linear infinite;animation-delay:-30s}
@keyframes fly1{0%{transform:translateX(-200px);opacity:0}3%{opacity:1}29%{opacity:1}31%{transform:translateX(1800px);opacity:0}100%{transform:translateX(1800px);opacity:0}}
.plane2{opacity:0;animation:fly2 50s linear infinite;animation-delay:-40s}
@keyframes fly2{0%{transform:translateX(1800px);opacity:0}2%{opacity:1}20%{opacity:1}22%{transform:translateX(-200px);opacity:0}100%{transform:translateX(-200px);opacity:0}}
.blink{animation:blink 1.6s steps(1) infinite}
@keyframes blink{0%{opacity:1}12%{opacity:0}100%{opacity:0}}
.rocket{opacity:0;animation:launch 55s ease-in infinite;animation-delay:-45s}
@keyframes launch{0%{transform:translateY(0);opacity:0}1%{opacity:1}23%{transform:translateY(-1150px);opacity:1}24%{transform:translateY(-1150px);opacity:0}100%{transform:translateY(-1150px);opacity:0}}
.flame{animation:flame 0.5s ease-in-out infinite alternate}
@keyframes flame{0%{opacity:0.7}100%{opacity:1}}
.shoot{opacity:0;animation:shoot 36s linear infinite;animation-delay:-30s}
@keyframes shoot{0%{transform:translate(0,0);opacity:0}1%{opacity:0.9}5%{transform:translate(-260px,150px);opacity:0}100%{transform:translate(-260px,150px);opacity:0}}
</style>
<rect width="1600" height="900" fill="url(#sky)"/>
${stars}
<circle cx="1330" cy="170" r="150" fill="url(#moonglow)"/>
<circle cx="1330" cy="170" r="46" fill="#1b2744" opacity="0.28"/>
<path d="M1339.05,124.9 A46,46 0 1 0 1364.3,200.66 A40,40 0 0 1 1339.05,124.9 Z" fill="url(#moonface)"/>
<g transform="translate(1180 80) scale(1)"><g class="shoot" style="animation-delay:-30s"><line x1="0" y1="0" x2="70" y2="-40" stroke="#ffffff" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round"/></g></g>
<g transform="translate(720 110) scale(0.8)"><g class="shoot" style="animation-delay:-18s"><line x1="0" y1="0" x2="70" y2="-40" stroke="#ffffff" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round"/></g></g>
<g transform="translate(430 50) scale(1.2)"><g class="shoot" style="animation-delay:-6s"><line x1="0" y1="0" x2="70" y2="-40" stroke="#ffffff" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round"/></g></g>
<g transform="translate(0 210)"><g class="plane1">${PLANE}</g></g>
<g transform="translate(0 340) scale(0.7)"><g class="plane2"><g transform="scale(-1 1)">${PLANE}</g></g></g>
<g transform="translate(260 880) rotate(8)"><g class="rocket">${ROCKET}</g></g>
<g transform="translate(1340 880) rotate(-8)"><g class="rocket" style="animation-delay:-17s">${ROCKET}</g></g>
</svg>`

const meter = atom({ plugin: 'night-sky', key: 'meter' } as const, { contextPercent: null, limits: [] } as Meter)

type Reading = { label: string; percent: number | null; note: string }

// Soft blue while there is room, amber past 60, warm red past 85.
const tone = (percent: number) => (percent >= 85 ? '#f2958c' : percent >= 60 ? '#f0cf8a' : '#cfdcff')

// Mid tones that read on a dark or a light terminal.
const termTone = (percent: number) => (percent >= 85 ? '#e5635a' : percent >= 60 ? '#e0a93a' : '#6f9bf0')

// The filled cells of a bar, grouped into runs of one color, each cell colored by its place on the bar.
const runs = (filled: number, width: number) => {
  const out: { from: number; length: number; color: string }[] = []

  for (let i = 0; i < filled; i++) {
    const color = termTone(((i + 0.5) / width) * 100)
    const last = out[out.length - 1]

    if (last !== undefined && last.color === color) {
      last.length += 1
    } else {
      out.push({ from: i, length: 1, color })
    }
  }

  return out
}

const compact = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n))

const LABELS: Record<string, string> = { five_hour: '5h', seven_day: '7d', spend_limit: 'spend' }

const until = (iso: string | undefined, now: number) => {
  const minutes = iso === undefined ? NaN : Math.round((Date.parse(iso) - now) / 60000)

  if (!(minutes > 0)) {
    return ''
  }

  return minutes >= 1440
    ? `${Math.floor(minutes / 1440)}d${Math.floor((minutes % 1440) / 60)}h`
    : minutes >= 60
      ? `${Math.floor(minutes / 60)}h${minutes % 60}m`
      : `${minutes}m`
}

// The moon, lit from the right by `percent`: new moon at 0, full at 100.
const phase = (r: number, percent: number) => {
  const lit = Math.min(Math.max(percent, 0), 100) / 100

  if (lit < 0.02) {
    return ''
  }

  if (lit > 0.98) {
    return `<circle r="${r}" fill="${tone(percent)}"/>`
  }
  const rx = (r * Math.abs(1 - 2 * lit)).toFixed(2)
  const sweep = lit <= 0.5 ? 0 : 1

  return `<path d="M0,${-r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 ${sweep} 0,${-r} Z" fill="${tone(percent)}"/>`
}

const CELL = 200
const TRACK = 130

const meterSvg = (readings: Reading[]) => {
  const cells = readings
    .map((item, i) => {
      const x = i * CELL
      const percent = item.percent
      const shown = percent === null ? '—' : `${Math.round(percent)}%`
      const color = percent === null ? '#97a3be' : tone(percent)
      const fill = percent === null ? 0 : (TRACK * Math.min(percent, 100)) / 100
      const note = item.note === '' ? '' : `<tspan fill="#97a3be"> · ${item.note}</tspan>`

      return `<g transform="translate(${x} 0)">
<circle cx="16" cy="16" r="15" fill="url(#halo)"/>
<circle cx="16" cy="16" r="9" fill="#1b2744" stroke="#34436b" stroke-width="0.6"/>
<g transform="translate(16 16)">${percent === null ? '' : phase(9, percent)}</g>
<text x="36" y="13" font-size="11" fill="#bcc6dc" font-family="system-ui, sans-serif">${item.label}  <tspan fill="${color}" font-weight="600">${shown}</tspan>${note}</text>
<rect x="36" y="20" width="${TRACK}" height="3" rx="1.5" fill="#1b2744"/>
<rect x="36" y="20" width="${fill.toFixed(1)}" height="3" rx="1.5" fill="url(#heat)" opacity="0.9"/>
<circle cx="${(36 + fill).toFixed(1)}" cy="21.5" r="2.4" fill="${color}"/>
</g>`
    })
    .join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${readings.length * CELL}" height="32" viewBox="0 0 ${readings.length * CELL} 32">
<defs><linearGradient id="heat" gradientUnits="userSpaceOnUse" x1="36" y1="0" x2="${36 + TRACK}" y2="0"><stop offset="0.52" stop-color="#cfdcff"/><stop offset="0.62" stop-color="#f0cf8a"/><stop offset="0.8" stop-color="#f0cf8a"/><stop offset="0.9" stop-color="#f2958c"/></linearGradient><radialGradient id="halo"><stop offset="0" stop-color="#cfd9ff" stop-opacity="0.22"/><stop offset="1" stop-color="#cfd9ff" stop-opacity="0"/></radialGradient></defs>
${cells}
</svg>`
}

const moons = ['🌑', '🌒', '🌓', '🌔', '🌕']

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // While building: the line that would stop Desktop painting this look.
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const usage = await $.session.usage()
    await update($, meter, () => ({
      contextPercent: usage.context.percent ?? null,
      contextTokens: usage.context.tokens,
      contextWindow: usage.context.window,
      limits: usage.rateLimits,
    }))

    try {
      // Not drawn in a terminal: the theme stands and draws when a desktop app attaches.
      await $.theme.set(LOOK)
    } catch (error) {
      $.ui.toast(`night-sky: theme.set failed: ${String(error)}`)
    }

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    await update($, meter, () => ({
      contextPercent: e.context.percent ?? null,
      contextTokens: e.context.tokens,
      contextWindow: e.context.window,
      limits: e.rateLimits,
    }))

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) {
      return next(e)
    }
    const { contextPercent, contextTokens, contextWindow, limits } = await read($, meter)
    const now = await $.clock.now()
    const readings: Reading[] = [
      { label: 'context', percent: contextPercent, note: '' },
      ...limits.map(limit => ({
        label: LABELS[limit.kind] ?? limit.kind,
        percent: limit.percentUsed,
        note: until(limit.resetsAt, now),
      })),
    ]
    const alt = readings.map(r => `${r.label} ${r.percent === null ? 'unknown' : `${Math.round(r.percent)}%`}`).join(', ')

    if (e.surface === 'terminal') {
      const { Box, Text } = $.ui.resolve(e)
      const width = e.props.bodyColumns >= 90 ? 10 : 6
      const detail = contextTokens === undefined || contextWindow === undefined ? '' : `${compact(contextTokens)}/${compact(contextWindow)}`

      return (
        <Box>
          {readings.map((r, i) => {
            const percent = r.percent
            const color = percent === null ? undefined : termTone(percent)
            const filled = percent === null ? 0 : Math.round((Math.min(percent, 100) / 100) * width)
            const moon = moons[percent === null ? 0 : Math.min(4, Math.floor(percent / 25))]
            const note = i === 0 ? detail : r.note

            return (
              <Text key={r.label}>
                {moon} {r.label}{' '}
                {runs(filled, width).map(run => (
                  <Text key={`${run.from}`} color={run.color}>
                    {'━'.repeat(run.length)}
                  </Text>
                ))}
                <Text dimColor>{'─'.repeat(width - filled)}</Text>{' '}
                <Text color={color} bold={percent !== null && percent >= 85}>
                  {percent === null ? '—' : `${Math.round(percent)}%`}
                </Text>
                {note === '' ? '' : <Text dimColor> {note}</Text>}
                {'   '}
              </Text>
            )
          })}
        </Box>
      )
    }

    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={meterSvg(readings)} alt={alt} />
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A slow night sky with stars, a moon, and an occasional plane or rocket" />
  })
}
