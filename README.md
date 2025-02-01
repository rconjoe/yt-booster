# yt-booster

### an extremely minimalist frontend for yt-dlp, written for bun.

![preview](./image.png)

`dlp.ts` - uses bun shell to execute dlp with request parameters passed to an http server (bun serve). also serves static frontend.

`ui/index.html` - static root we can serve with Bun.serve. runs ui/frontend.jsx

`ui/frontend.jsx` - renders `App.jsx`

`ui/App.jsx` - the actual page
