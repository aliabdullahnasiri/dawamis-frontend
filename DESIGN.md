# EMS interface direction

EMS is an exchange-management workspace. Prioritize account confidence, task clarity,
readable financial data, and equally usable English, Dari, and Pashto layouts.

## Reference and interpretation

Reference: https://www.instagram.com/reel/DfqWmHCmU9p/ (buildwithomar).
Reviewed the downloaded video key frames and full post caption. Applicable principles:
clear type scale, one surface language, grouped hierarchy, actions near their context,
restrained interaction feedback, consolidated navigation, and a command palette.
The reel's desert wallpaper is an aesthetic example; EMS keeps its existing palette.
The navbar already implements a working Ctrl/Cmd+K page palette.

## Tokens

- Ink: #0f172a; secondary text: #64748b; divider: #e2e8f0.
- Canvas: #f8fafc; surface: #ffffff; action: #256ae0.
- Dark mode uses existing neutral surfaces and #60a5ff for actions.
- Public Sans for English, Vazirmatn for Dari, Noto Naskh Arabic for Pashto.
- Heading scale: 36, 30, 26, 24, 20, 18 px; body: 15 px; small: 13 px.
- Surfaces: 16 px corners, a subtle border, no decorative gradients or repeated shadows.
- Inputs/buttons: 10 px corners; visible focus; floating labels; no required asterisks.

## Workspace composition

Content follows reading direction. The header contains the title, a short explanation,
and one primary account action. One account surface groups profile and security links;
a separate access surface explains the actual organization connection. No invented
revenue, activity, notifications, or other unsupported financial statistics.

    Workspace title / explanation                Primary action
    Account identity and account actions         Workspace access

Review: avoid a generic dashboard card grid. The existing home is an account/workspace
shell, so use real account and organization data with grouped rows rather than dummy
metrics. Keep global navigation flat, and use motion only to explain interaction.

## Motion

Use 120 ms for press feedback, 160–180 ms for control states, and 220–240 ms for
page panels and overlays. Page panels enter together once the skeleton finishes;
menus, dialogs, collapses, inputs, checkboxes and feedback respond to interactions.
Do not animate static copy or add idle loops. Reduced-motion preferences disable
transforms and shorten both CSS and JavaScript transition durations.
