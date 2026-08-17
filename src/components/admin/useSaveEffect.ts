'use client'

import { useEffect, useRef } from 'react'
import { announceSaved } from './PreviewPane'

/**
 * Runs once per successful save.
 *
 * Depends on the state object's identity, not on `state.ok`: useActionState
 * hands back a fresh object on every submission, so a second successful save
 * still fires even though the boolean never changed.
 */
export function useSaveEffect(state: { ok?: boolean }, onSaved: () => void) {
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!state.ok) return

    onSaved()
    announceSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])
}
