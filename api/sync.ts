const PASTEBIN_API_KEY = process.env.PASTEBIN_API_KEY as string;

export const config = {
  runtime: "edge",
};

export default async (req: Request, res: Response) => {
  console.log("req", req);
  console.log("url", req.url);
  console.log("body", req.body);
  const formData = await req.formData();
  const file = formData.get("api_paste_code") as File;
  formData.set("api_paste_code", await file.text());
  formData.append("api_dev_key", PASTEBIN_API_KEY);
  console.log("form data", Array.from(formData.entries()));

  try {
    const pastebinResponse = await fetch(
      "https://pastebin.com/api/api_post.php",
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("pastebinResponse status", pastebinResponse.status);
    const pastebinLink = await pastebinResponse.text();
    console.log("pastebinResponse text", pastebinLink);
    const response = new Response(pastebinLink, {
      status: 201,
      headers: {
        "Content-Type": "text/plain",
      },
    });

    return response;
  } catch (err) {
    console.log(`
    An error occured while posting to pastebin!

    ${err}
    `);
    return new Response(undefined, { status: 500 });
  }
};
