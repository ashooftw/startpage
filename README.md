# Ashoo Startpage

A personal Firefox new-tab startpage — glassmorphism dark UI with a live clock, ambient particles, search, todos, quick notes, and links to all your learning platforms.

---

## File Structure

```
ashoo/
├── index.html          ← markup only, no inline styles or scripts
├── .gitignore
└── src/
    ├── main.css        ← design tokens, layout, all components
    ├── animations.css  ← every keyframe and animation utility class
    └── app.js          ← all interactive logic in isolated modules
```

---

## Setting It as Your Firefox New Tab

1. Install the **New Tab Override** extension → [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)
2. In the extension settings choose **"Local file"** and point it at your `index.html`
3. Open a new tab — done.

---

## Features

| Feature | Details |
|---|---|
| Live clock | Updates every 10 seconds, shown in the nav pill |
| Omnibox search | Google, DuckDuckGo, YouTube, GitHub — pick from the dropdown and hit Enter |
| Quick-link pills | One-click shortcuts to GitHub, LinkedIn, Gmail, TryHackMe, HTB, YouTube, Discord |
| Learning cards | The Odin Project, LabEx, TryHackMe, MDN — hover for colour glow |
| Cert prep | Direct links to Professor Messer's Network+ and Security+ playlists |
| Roadmaps | Links to your local `roadmap.html` and `master-plan.html` pages |
| Todo widget | Add/complete/delete tasks, persisted in `localStorage` |
| Quick notes | Auto-saves as you type (debounced), manual Save button with visual feedback |
| Mini calendar | Current month with today highlighted |
| Daily quote | Cycles through 7 quotes based on the day of the month |
| Particle canvas | Lightweight floating dots, colour-matched to the accent palette |
| Keyboard shortcuts | See table below |

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `/` | Focus the search bar |
| `N` | Add a new todo (opens prompt) |
| `?` | Open the shortcuts modal |
| `Esc` | Close the modal |

---

## Customisation

### Adding or changing links

All links are plain `<a>` tags in `index.html`. Search for the section comment (e.g. `<!-- ── QUICK ACCESS ──`) and add a new `.qa-card` following the same pattern.

### Changing accent colours

Every colour is a CSS variable at the top of `src/main.css`:

```css
:root {
  --cyan:    #67e8f9;
  --violet:  #a78bfa;
  --emerald: #34d399;
  --red:     #f87171;
  --sky:     #38bdf8;
  /* … */
}
```

Change one variable and it propagates everywhere — glows, borders, badges, text.

### Adding a new card accent colour

In `src/main.css`, follow the `.card-cyan` pattern:

```css
.card-pink:hover {
  border-color: rgba(244, 114, 182, 0.4) !important;
  box-shadow: var(--shadow-card), 0 0 48px -8px rgba(244, 114, 182, 0.25);
  transform: translateY(-6px) scale(1.01);
}
```

Then add `card-pink` to any `.glass-card` element in the HTML.

### Changing the greeting

Edit the two lines in the hero section of `index.html`:

```html
<span>Welcome back, Ashoo</span>   <!-- badge text -->
…
Good to see you.<br>               <!-- h1 first line -->
```

### Adding quotes

In `src/app.js`, find the `QUOTES` array inside the `Quote` module and add your own strings.

---

## JS Module Overview

Each feature lives in its own IIFE module inside `src/app.js` — none of them share mutable state.

| Module | Responsibility |
|---|---|
| `Clock` | Renders `HH:MM` into `#clock` every 10 s |
| `Search` | Builds search URLs, opens them in a new tab |
| `Particles` | Draws and animates floating dots on `<canvas>` |
| `Todos` | CRUD for tasks, persists to `localStorage` key `todos_v2` |
| `Notes` | Loads/saves textarea content, debounced auto-save |
| `Calendar` | Builds the mini calendar DOM from the current date |
| `Quote` | Picks a quote by `date % quotes.length` |
| `Modal` | Shows/hides the shortcuts overlay |
| `Keyboard` | Global `keydown` listener for `/`, `N`, `?`, `Esc` |
| `Ripple` | Attaches click-ripple animation to `.qa-card` elements |
| `Reveal` | `IntersectionObserver` — plays `.fade-up` only when in viewport |

---

## Animation Classes (src/animations.css)

| Class | Effect |
|---|---|
| `.fade-up` | Slides up + fades in on load (use with `.d-0` – `.d-12` for stagger) |
| `.breathe` | Gentle scale + opacity pulse, used on the gradient heading |
| `.shimmer` | Loading-skeleton shimmer, available for future use |
| `.card-enter` | Quick scale-in for dynamically added todo items |
| `.ripple-host` | Enables click-ripple on any element |

---

## Browser Support

Tested in Firefox (primary target). Works in Chrome and Edge. Requires:

- CSS `backdrop-filter` (all modern browsers)
- CSS custom properties
- `IntersectionObserver` API
- `localStorage`

---

## Dependencies (all CDN, no build step)

| Library | Purpose |
|---|---|
| [Font Awesome 6.5](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css) | Icons |
| [Syne](https://fonts.google.com/specimen/Syne) | Display / heading font |
| [DM Sans](https://fonts.google.com/specimen/DM+Sans) | Body font |
| [DM Mono](https://fonts.google.com/specimen/DM+Mono) | Clock monospace |

No npm, no bundler, no build step — open `index.html` and it works.
