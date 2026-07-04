import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

interface EntityAvatarProps {
  name: string;
  image?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
  square?: boolean;
}

/** Falls back to initials on a tinted background when no image fixture is set. */
export function EntityAvatar({ name, image, size = "default", className, square }: EntityAvatarProps) {
  return (
    <Avatar size={size} className={cn(square && "rounded-lg after:rounded-lg", className)}>
      {image ? <AvatarImage src={image} alt={name} className={cn(square && "rounded-lg")} /> : null}
      <AvatarFallback
        className={cn("bg-accent font-medium text-accent-foreground", square && "rounded-lg")}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
