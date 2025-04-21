"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from 'lucide-react'

// ✅ Ya no usamos interface, solo desestructuramos las props
export function LoadingScreen({ isLoading, text = "Cargando...", className }) {
  if (!isLoading) return null

  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center",
      className
    )}>
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-xl font-medium text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
