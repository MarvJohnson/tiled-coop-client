const PASTEBIN_API_KEY = process.env.PASTEBIN_API_KEY as string;

export const config = {
  runtime: "edge",
};

export default async (req: Request) => {
  console.log("req", req);
  console.log("url", req.url);
  console.log("body", req.body);

  const formData = await req.formData();
  const file = formData.get("api_paste_code") as File;
  formData.set("api_paste_code", await file.text());
  formData.append("api_dev_key", PASTEBIN_API_KEY);

  console.log("form data", Array.from(formData.entries()));

  try {
    const response = await fetch("https://pastebin.com/api/api_post.php", {
      method: "POST",
      body: formData,
    });

    console.log("response text", await response.text());

    return response;
  } catch (err) {
    console.log(`
    An error occured while posting to pastebin!

    ${err}
    `);
    return new Response();
  }
};
