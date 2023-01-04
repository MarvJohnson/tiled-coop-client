export const config = {
  runtime: "edge",
};

export default async (req) => {
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
  console.log(output);

  EdgeRuntime.testOutput = output;

  return new Response();
};
