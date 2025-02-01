import { $ } from "bun";
import { readdir } from "node:fs/promises";
import homepage from "./ui/index.html";

export const server = () => Bun.serve({
  port: 3400,
  static: {
    "/": homepage
  },
  async fetch(req) {
    const url = new URL(req.url);

    // /api/retrieve
    if (url.pathname === "/api/retrieve") {
      const target = url.searchParams.get("target_url");
      // const format = url.searchParams.get("format") || "mp4";
      const format = "mp4"
      const file = (await readdir("/tmp/ytb")).toString();
      if (file.length > 1) {
        console.info(`deleting ${file}!`)
        await Bun.file(`/tmp/ytb/${file}`).delete()
      } else {
        console.info("no existing file in /tmp/ytb")
      }
      try {
        console.info(`downloading new file.`)
        const result = await $`yt-dlp -o '/tmp/ytb/%(id)s.%(ext)s' -f '${format}' '${target}'`.text();

        return new Response(result, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          }
        });
      } catch (error) {
        console.error(`${error.stdout.toString()}\n\n${error.stderr.toString()}`)
        return new Response(`ERROR! logs: \n \n ${error.stdout.toString()} \n \n ${error.stderr.toString()}`, { status: 500 })
      }
    }

    // /api/download
    if (url.pathname === "/api/download") {
      const file = (await readdir("/tmp/ytb")).toString();
      if (file.length > 1) {
        console.info(`serving file: ${file}`)
        const bunfile = await Bun.file(`/tmp/ytb/${file}`).bytes();
        return new Response(bunfile, {
          headers: {
            "Content-Type": "video/mp4",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          }
        })
      } else {
        console.info('/api/download was called, but no file was found in /tmp/ytb')
        return new Response("no file found", { status: 500 })
      }
    }

    // catch-all 404
    else return new Response("404!", { status: 404 });
  },
});

