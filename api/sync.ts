const PASTEBIN_API_KEY = process.env.PASTEBIN_API_KEY as string;

export const config = {
  runtime: "edge",
};

export default async (req: Request) => {
  console.log(req);
  console.log(req.url);
  console.log(req.body);

  const formData = await req.formData();
  formData.append("api_dev_key", PASTEBIN_API_KEY);

  const response = await fetch("https://pastebin.com/api/api_post.php", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("response body");
  console.log(response.body);

  return new Response(response.body);
};
