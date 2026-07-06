import { Avatar, AvatarFallback, AvatarImage, AvatarLogoImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

interface EntityAvatarProps {
  name: string;
  image?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
  square?: boolean;
}

/** Falls back to initials on a tinted background when no image fixture is set.
 *  `square` usages (company logos) render unclipped via object-contain, since logos are
 *  rarely square themselves and object-cover would crop wordmarks like Tinder's. */
export function EntityAvatar({ name, image, size = "default", className, square }: EntityAvatarProps) {
  return (
    <Avatar size={size} className={cn(square && "rounded-lg after:rounded-lg", className)}>
      {image ? (
        square ? (
          <AvatarLogoImage src={image} alt={name} />
        ) : (
          <AvatarImage src={image} alt={name} />
        )
      ) : null}
      <AvatarFallback
        className={cn("bg-accent font-medium text-accent-foreground", square && "rounded-lg")}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
