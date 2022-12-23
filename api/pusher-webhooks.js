export default async (req, res) => {
  console.log(JSON.stringify(req.body));
  res.status(200).end();
};
