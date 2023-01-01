export const config = {
  runtime: "edge",
};

export default async (req, res) => {
  console.log(req);
  req.on("data", (chunk) => {
    console.log("chunk!");
    console.log(chunk.toString());
  });
};
