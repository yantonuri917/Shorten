import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = ''
  for await (const chunk of req) {
    body += chunk
  }

  const { url, alias } = JSON.parse(body || '{}')

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

  res.status(200).json({ code })
}
