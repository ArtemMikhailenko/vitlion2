import type { ReactNode } from 'react'
import PreviewPane from './PreviewPane'

/**
 * Form on the left, the page it edits on the right.
 *
 * The preview appears from 1280px up. Below that there is not enough room for
 * both, and a preview too small to read is worse than none — narrow screens get
 * the "открыть страницу" link in the header instead.
 */
export default function SplitEditor({
  path,
  children,
}: {
  /** Site path being edited, without the language prefix — "/" for the home page. */
  path: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_28rem] 2xl:grid-cols-[minmax(0,1fr)_34rem]">
      <div className="min-w-0">{children}</div>
      <PreviewPane
        path={path}
        className="sticky top-6 hidden h-[calc(100vh-8rem)] xl:flex"
      />
    </div>
  )
}
