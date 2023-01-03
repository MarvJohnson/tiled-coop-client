export const config = {
  runtime: "edge",
};

export default async (req: Request) => {
  console.log(req);
  console.log(req.url);
  console.log(req.body);

  let output = "";
  const decoder = new TextDecoder("utf-8");
  const writer = new WritableStream({
    write(chunk) {
      return new Promise((resolve) => {
        const text = decoder.decode(chunk, { stream: true });
        output += text;
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
  console.log("output:");
  for (
    let index = 0, chunk = 50;
    index + chunk < output.length;
    index += chunk
  ) {
    console.log(
      output.substring(index, Math.min(index + chunk, output.length))
    );
  }

  return new Response();
};
