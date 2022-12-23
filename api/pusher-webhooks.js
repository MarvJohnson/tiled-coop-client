export default async (req, res) => {
  console.log(JSON.stringify(req.body));
  if (this.activeChannels) {
    console.log(JSON.stringify(this.activeChannels));
  } else {
    console.log("no global");
  }
  res.status(200).end();
};
