import { $ } from "bun";

export const server = () => Bun.serve({
  port: 3400,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/api/download") {
      const target = url.searchParams.get("target_url");
      const format = url.searchParams.get("format") || "mp4";
      try {
        const result = await $`yt-dlp -o './downloads/%(id)s.%(ext)s' -f '${format}' '${target}'`.text();

        return new Response(result);
      } catch (error) {
        return new Response(`something broke in bun shell's yt-dlp call. logs: \n \n ${error.stdout.toString()} \n \n ${error.stderr.toString()}`)
      }
    }
    else return new Response("come mierda, 200 OK");
  },
});

