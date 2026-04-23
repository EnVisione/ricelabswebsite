/**
 * Pulls Minecraft skin renders by username via mc-heads.net (CORS-friendly, no key).
 * - variant="body"  → full-body 3D render
 * - variant="head"  → isometric head (cube)
 * - variant="avatar" → flat 2D face avatar
 */
export default function MinecraftSkin({
  username,
  variant = 'body',
  size = 140,
  alt,
  className,
  style,
}) {
  const endpoint =
    variant === 'head'
      ? `https://mc-heads.net/head/${username}/${size}`
      : variant === 'avatar'
      ? `https://mc-heads.net/avatar/${username}/${size}`
      : `https://mc-heads.net/body/${username}/${size}`

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
