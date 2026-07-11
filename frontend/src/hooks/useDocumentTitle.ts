import { useEffect } from 'react'

/** Setzt den Dokumenttitel der aktuellen Seite. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
