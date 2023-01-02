export const config = {
  runtime: "edge",
};

export default async (req: Request) => {
  console.log(req);
  console.log(req.url);
  console.log(req.body);
  const reader = req.body?.getReader();

  if (reader) {
    const data = await reader.read();

    console.log("data!");
    console.log(data);
  }

  return new Response();
};
