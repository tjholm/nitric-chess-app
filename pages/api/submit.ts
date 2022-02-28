// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const baseUrl = process.env.API_BASE_URL;

export default async function handler(req, res) {
  const { token, game, ...state } = JSON.parse(req.body)
  const resp = await fetch(`${baseUrl}/game/${game}?token=${token}`, {
    method: "POST",
    body: JSON.stringify(state),
  });

  if (resp.status != 200) {
    res.status(resp.status).json({ message: resp.statusText });
  } else {
    res.status(200).json({ message: "Thanks for making your move" });
  }
}
