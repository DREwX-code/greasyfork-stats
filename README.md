# GreasyFork Stats

[![Vercel](https://img.shields.io/badge/deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://greasyfork-stats.vercel.app/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Generate customizable SVG cards from a GreasyFork user's public statistics and embed them in GitHub READMEs, project pages, documentation, or anywhere SVG images are supported.

## Build your card

The easiest way to create your card is to use the interactive generator:

### [Open the GreasyFork Stats card generator →](https://greasyfork-stats.vercel.app/)

Enter a GreasyFork profile ID or URL, customize the theme and language, preview the result instantly, then copy the generated URL, Markdown, or HTML code.

## Preview

[![GreasyFork Stats](https://greasyfork-stats.vercel.app/api/stats?user=1259433&theme=github_dark&lang=en)](https://greasyfork-stats.vercel.app/)

## Features

* Interactive card generator
* Instant live preview
* Ready-to-copy URL, Markdown, and HTML
* GreasyFork profile ID or URL support
* Public GreasyFork statistics
* Automatic username detection
* Total installs and daily installs
* Script and rating statistics
* Lightweight SVG output
* Multiple built-in themes
* Multiple languages
* No authentication required
* Cached responses for reliable performance

## Manual usage

For manual integration, replace `YOUR_USER_ID` with the numeric ID from your GreasyFork profile URL.

```md
![GreasyFork Stats](https://greasyfork-stats.vercel.app/api/stats?user=YOUR_USER_ID)
```

### With options

```md
![GreasyFork Stats](https://greasyfork-stats.vercel.app/api/stats?user=YOUR_USER_ID&theme=github_dark&lang=en)
```

### HTML

```html
<img
  src="https://greasyfork-stats.vercel.app/api/stats?user=YOUR_USER_ID&theme=github_dark&lang=en"
  alt="GreasyFork Stats"
/>
```

## Parameters

| Parameter     | Description                | Default      | Example       |
| ------------- | -------------------------- | :----------: | ------------- |
| `user`        | Numeric GreasyFork user ID | **Required** | `1259433`     |
| `theme`       | Card theme                 | `default`    | `github_dark` |
| `lang`        | Card language              | `en`         | `fr`          |
| `hide_title`  | Hide the card title        | `false`      | `true`        |
| `hide_border` | Hide the card border       | `false`      | `true`        |

Boolean parameters accept `true`, `false`, `1`, or `0`.

## Themes

Available themes:

```text
default
github_dark
dracula
nord
gruvbox
tokyonight
catppuccin
monokai
cyberpunk
solarized_dark
```

Example:

```md
![GreasyFork Stats](https://greasyfork-stats.vercel.app/api/stats?user=YOUR_USER_ID&theme=catppuccin)
```

## Languages

Available languages:

```text
en
fr
es
de
```

Example:

```md
![GreasyFork Stats](https://greasyfork-stats.vercel.app/api/stats?user=YOUR_USER_ID&lang=fr)
```

## Data and caching

Statistics are retrieved from GreasyFork's public API. Successful cards are cached to reduce load, improve reliability, and avoid unnecessary requests to GreasyFork.

Because of this cache, recently updated statistics may take several hours to appear.

## License

Licensed under the [MIT License](LICENSE).
