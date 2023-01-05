export const config = {
  runtime: "edge",
};

export default async (req) => {
  console.log(req);
  console.log(req.url);
  console.log(req.body);

  let chunkIndex = 0;
  const decoder = new TextDecoder("utf-8");
  const writer = new WritableStream({
    write(chunk) {
      return new Promise((resolve) => {
        const text = decoder.decode(chunk, { stream: true });
        chunkIndex++;
        fetch(
          "https://tiled-coop-client-menthus123.vercel.app/api/channel-auth/?action=sync_upload",
          {
            method: "POST",
            body: text,
            headers: {
              "Content-Type": "text/plain",
            },
          }
        ).then(resolve);
      });
    },
    close() {
      console.log("done writing!");
    },
    abort(err) {
      console.log("Sink error:", err);
    },
  });

  try {
    await req.body?.pipeTo(writer);
    console.log("Finishd piping!");
  } catch (err) {
    console.log(`
    Error!
    
    ${err}
    `);
  }

  return new Response();
};
