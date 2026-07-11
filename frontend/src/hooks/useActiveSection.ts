import { useEffect, useState } from 'react'

/**
 * Meldet, welcher Abschnitt gerade im Blick ist. Aktiv ist der
 * Abschnitt, dessen Oberkante das obere Drittel des Fensters erreicht —
 * dieselbe Beobachtungszone wie beim Scroll-Spy der statischen Seite.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
