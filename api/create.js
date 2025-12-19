import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { url, alias } = req.body || {}
  if (!url) {
    return res.status(400).json({ error: 'URL kosong' })
  }

  const code = alias && alias.trim() !== ''
    ? alias.trim()
    : Math.random().toString(36).substring(2, 8)

  const exists = await kv.get(code)
  if (exists) {
    return res.status(409).json({ error: 'Alias sudah dipakai' })
  }

  await kv.set(code, url)

  return res.json({ code })
}
