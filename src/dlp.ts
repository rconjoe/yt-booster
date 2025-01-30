import { $ } from "bun";

export const server = () => Bun.serve({
  port: 3400,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/api/download") {
      const target = url.searchParams.get("target_url");
      const format = url.searchParams.get("format") || "mp4";
      const result = await $`yt-dlp -o '/tmp/%(title)s.%(ext)s' -f '${format}' '${target}'`.text();

      return new Response(result);
    }
    else return new Response("come mierda, 200 OK");
  },
});


// man yt-dlp, search for OUTPUT TEMPLATE
// const result = await $`yt-dlp -o './downloads/%(title)s.%(ext)s' -f mp4 '${target_url}'`.text();

