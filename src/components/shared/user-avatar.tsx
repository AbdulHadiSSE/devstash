import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function getInitials(name?: string | null) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : ""
  return (first + last).toUpperCase() || "?"
}

interface UserAvatarProps {
  name?: string | null
  image?: string | null
  className?: string
  size?: "default" | "sm" | "lg"
}

export function UserAvatar({ name, image, className, size }: UserAvatarProps) {
  return (
    <Avatar className={className} size={size}>
      {image && <AvatarImage src={image} alt={name ?? "User"} />}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
