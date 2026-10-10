# CozWELL Neural Companion — UI & Art Theme Style Analysis for iOS

**Date:** 2026-10-10  
**Analyst:** Grok (expert opto-mechanical / thermal design aesthetic + Art Deco / ASML-inspired presentation)  
**Live site:** https://catalystozwell.com  
**Repo:** coz355/CatalystOzwell  
**Sessions:** Multiple instrumented user-testing visits (10–24 s dwell, ≥30 s cadence)

## Executive Summary

Live interface presents a high-end *telemetry dashboard* aesthetic: obsidian ground (`#0A0A0A`), champagne-gold metrics, surgical glass panels, and monospaced chronograph typography. It successfully evokes TAG Heuer / LVMH luxury instrumentation while remaining functional for location-aware lifestyle, scripture, and local-AI companion features. The visual language is immediately translatable to a native SwiftUI iOS app.

## Visual Identity & Art Theme

### Color System (Luxury Palette)
| Token | Hex | Role |
|-------|-----|------|
| lux-black | `#0A0A0A` | Primary ground |
| lux-gunmetal | `#1C1C1C` | Panel fill |
| lux-red | `#E30613` | Accent / alert |
| lux-gold | `#C9A227` | Primary metric / border |
| lux-gold-light | `#E8D5A3` | Soft highlight |
| lux-white | `#F5F5F5` | Primary text |
| lux-gray | `#8A8A8A` | Secondary labels |

**Art Deco resonance:** Gold-on-black with geometric precision, thin borders, and uppercase tracking mirrors 1920s–1930s instrument panels and ASML-style clean engineering documentation. Gothic blackletter is reserved for the Sacred Reader, creating a deliberate sacred/profane contrast.

### Typography
- Display / headings: Space Grotesk (tight tracking)
- Telemetry / numbers: JetBrains Mono (tabular, uppercase, 0.08–0.12 em tracking)
- Body: Inter
- Sacred mode: Cinzel + UnifrakturMaguntia (blackletter)

### Surface Language
- Glass morphism: `rgba(28,28,28,0.85)` + 24 px blur + gold hairline borders
- Hover lift: 1 px translateY + border intensification
- Rounded 2xl/3xl corners on cards
- Subtle planet-eclipse canvas background (opacity 0.6)

## Functional Inventory (User Testing)

| Module | Status | Notes |
|--------|--------|-------|
| Location selector + Detect + Refresh | Works | Defaults to Washington when geo denied; updates forecast |
| 3-Day Forecast | Works | wttr.in, no key |
| AQI / UV | Works | Static demo values observed |
| Lifestyle Protocol | Works | Context-aware clothing / hydration |
| Wisdom & Scripture | Works | Rotating quotes + external Bible links |
| Sacred Texts Reader | Excellent | Full KJV Genesis–Isaiah, blackletter, Random Verse, book chips |
| Local AI Companions | Partial | EduMentor / Vitalis / Forge cards; local status "Local" |
| Music / Ambient | Present | Track list + external public-domain radios |
| Faith Telemetry | Present | Population stats, regional bars, milestones |
| Settings | Present | Language + 6 themes (Neon + Art Deco variants) |
| Theme switcher | Works | Labeled "Neon" / orb controls |

## iOS Architecture Recommendations

### Information Architecture
```
Tab Bar
├── Home (dashboard: weather, AQI, lifestyle, quotes)
├── Companions (EduMentor · Vitalis · Forge)
├── Sacred (Gothic reader + audio)
├── Insights (Faith telemetry + location intelligence)
└── Settings (theme jewels, language, local AI status)
```

### SwiftUI Mapping
- `Color` assets exactly matching the luxury palette
- `GlassCard` modifier: ultraThinMaterial + gold stroke
- Custom `TelemetryFont` (monospaced + tracking)
- Sacred mode: optional `.environment(\.fontDesign, .serif)` + blackletter for headings
- Circular theme jewels (already present on web) map cleanly to SF Symbols or custom shapes
- Location via CoreLocation + WeatherKit or wttr.in fallback
- Local AI: MLX / llama.cpp bridge or on-device Mistral/Gemma

### Art Direction Continuity
Preserve the *instrument panel* density and champagne-gold hierarchy. Avoid generic iOS blue. Use large tabular numerals for temperatures and AQI. Keep the DEMO watermark as a build flag only.

## Issues Observed
- DEMO • UNDER CONSTRUCTION chrome on production domain
- Tailwind via CDN (should be purged/built)
- Some external calls (ipapi, wttr) rate-limited
- Theme button label occasionally truncated ("The")
- Version skew: README references V33, live console references V35

## Next Steps for iOS
1. Extract design tokens into an Asset Catalog + Swift package
2. Prototype Home + Sacred tabs in SwiftUI
3. Implement local model status indicator
4. Add haptic feedback on telemetry refresh
5. Sacred reader: full KJV offline + audio narration

---
*Analysis performed with repeated live visits, DOM inspection, style extraction, and repository cross-check. Ready for SwiftUI translation.*
