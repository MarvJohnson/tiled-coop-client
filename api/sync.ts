export const config = {
  runtime: "edge",
};

export default async (req: Request) => {
  console.log(req);
  console.log(req.url);
  console.log(req.body);

  const writer = new WritableStream({
    write(chunk) {
      console.log("writing!");
      return new Promise((resolve) => {
        console.log(`Chunk: ${chunk}`);
        resolve();
      });
    },
    close() {
      console.log("done writing!");
    },
  });

  await req.body?.pipeTo(writer);

  return new Response();
};
