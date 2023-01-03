export const config = {
  runtime: "edge",
};

export default async (req: Request) => {
  console.log(req);
  console.log(req.url);
  console.log(req.body);

  const writer = new WritableStream({
    write(chunk) {
      console.log("writing");
      console.log(chunk);
      console.log(!!chunk);
      console.log(typeof chunk);
      console.log(Object.keys(chunk));
      console.log(JSON.stringify(chunk));
      console.log(chunk.toString());
      return new Promise((resolve) => {
        console.log(`Chunk: ${chunk}`);
        resolve();
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
