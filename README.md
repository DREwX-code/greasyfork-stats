
# GreasyFork Stats

Dynamic GreasyFork statistics cards for your online profiles.

Generate customizable SVG cards from your public GreasyFork statistics and embed them in GitHub READMEs, project pages, documentation, or anywhere SVG images are supported.

## Preview

![GreasyFork Stats](https://greasyfork-stats.vercel.app/api?user=1259433&theme=github_dark&lang=en)

## Features

- Automatic GreasyFork username detection
- Live public statistics
- Lightweight SVG output
- Multiple built-in themes
- Multiple languages
- No authentication required

## Usage

```md
![GreasyFork Stats](https://greasyfork-stats.vercel.app/api?user=YOUR_USER_ID)
```

With options:

```md
![GreasyFork Stats](https://greasyfork-stats.vercel.app/api?user=YOUR_USER_ID&theme=github_dark&lang=en)
```

Or with HTML:

```html
<img src="https://greasyfork-stats.vercel.app/api?user=YOUR_USER_ID&theme=github_dark&lang=en" alt="GreasyFork Stats">
```

## Parameters

| Parameter | Description | Default | Example |
|---|---|:---:|---|
| `user` | GreasyFork user ID | **Required** | `1259433` |
| `theme` | Card theme | `default` | `github_dark` |
| `lang` | Card language | `en` | `fr` |
| `hide_title` | Hide the card title | `false` | `true` |
| `hide_border` | Hide the card border | `false` | `true` |

## Themes

Available themes:

```txt
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
![GreasyFork Stats](https://greasyfork-stats.vercel.app/api?user=YOUR_USER_ID&theme=catppuccin)
```

## Languages

Available languages:

```txt
en
fr
es
de
```

Example:

```md
![GreasyFork Stats](https://greasyfork-stats.vercel.app/api?user=YOUR_USER_ID&lang=fr)
```

## Roadmap

- Script-specific stats cards
- More languages
- Custom card title
- Compact layout
- Additional statistics
- Public demo page

## License

MIT
