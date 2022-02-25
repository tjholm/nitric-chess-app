// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const baseUrl = process.env.API_BASE_URL;

export default async function handler(req, res) {
  const { from, to, game } = JSON.parse(req.body)
  await fetch(`${baseUrl}/game/${game}`, {
    method: "POST",
    body: JSON.stringify({ from, to }),
  });
  res.status(200).json({ message: "Thanks for making your move" });
}
