export default async (req, res) => {
  console.log(JSON.stringify(req.body));
  if (activeChannels) {
    console.log(JSON.stringify(activeChannels));
  } else {
    console.log("no global");
  }
  res.status(200).end();
};
