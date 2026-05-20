/**
 * Pulls Minecraft skin renders by username via NMSR (nmsr.nickac.dev — no API key,
 * CORS-friendly, resolves canonical name → UUID → live skin). mc-heads.net was
 * returning a single placeholder for our three usernames; NMSR handles them all.
 *
 * - variant="body"   → full-body 3D render
 * - variant="head"   → isometric head cube
 * - variant="avatar" → flat 2D face (cheap, fits next to text)
 */
export default function MinecraftSkin({
  username,
  variant = 'body',
  size = 140,
  alt,
  className,
  style,
}) {
  const base = 'https://nmsr.nickac.dev'
  const endpoint =
    variant === 'head'
      ? `${base}/head/${username}`
      : variant === 'avatar'
      ? `${base}/face/${username}`
      : `${base}/fullbody/${username}`

  return (
    <img
      src={endpoint}
      alt={alt || `${username} Minecraft skin`}
      width={size}
      className={className}
      style={style}
      loading="lazy"
    />
  )
}
