export default async (req, res) => {
  console.log(JSON.stringify(req.body));
  console.log(Object.keys(global));
  res.status(200).end();
};
