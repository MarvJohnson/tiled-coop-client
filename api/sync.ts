export const config = {
  runtime: "edge",
};

export default async (req: Request) => {
  console.log(req);
  const reader = req.body?.getReader();

  if (reader) {
    const data = await reader.read();

    console.log("data!");
    console.log(data);
  }

  return new Response();
};
