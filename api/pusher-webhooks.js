export default async (req, res) => {
  console.log(JSON.stringify(req.body));
  console.log(JSON.stringify(global));
  res.status(200).end();
};
