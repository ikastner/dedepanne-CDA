import Link from "next/link"

interface BrandLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
  href?: string
}

export default function BrandLogo({ 
  size = "md", 
  showText = true, 
  className = "",
  href = "/"
}: BrandLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-14 sm:h-16 w-auto", 
    lg: "h-16 sm:h-20 w-auto"
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }

  const LogoContent = () => (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      {/* Logo responsive */}
      <img
        src="/logo-smartphone.png"
        alt="Logo dédépanne"
        className={`block sm:hidden ${sizeClasses[size]}`}
      />
      <img
        src="/logo-tablet.png"
        alt="Logo dédépanne"
        className={`hidden sm:block lg:hidden ${sizeClasses[size]}`}
      />
      <img
        src="/logo.png"
        alt="Logo dédépanne"
        className={`hidden lg:block ${sizeClasses[size]}`}
      />
      
      {/* Texte du logo */}
      {showText && (
        <span className={`font-cocogoose font-black text-black ${textSizes[size]}`}>
          dédé<span className="text-primary">panne</span>
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href}>
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
} 