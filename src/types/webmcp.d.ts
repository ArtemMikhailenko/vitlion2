/**
 * Minimal typings for the WebMCP browser API.
 *
 * WebMCP is a Draft Community Group Report (W3C Web Machine Learning CG,
 * 12 Feb 2026) — incubating, not on the standards track. Chrome shipped it
 * behind an origin trial; no other engine has an implementation. These types
 * exist because the API is absent from lib.dom.d.ts, and everything that uses
 * them is feature-detected.
 *
 * The declarative `<script type="webmcp">` form is not implemented anywhere —
 * the spec marks it deferred — so registration goes through registerTool().
 */

export {}

declare global {
  interface ModelContextToolAnnotations {
    /** Signals the tool only reads state and is safe to call speculatively. */
    readOnlyHint?: boolean
    [key: string]: unknown
  }

  interface ModelContextTool {
    name: string
    description: string
    /** JSON Schema for the arguments the agent may pass. */
    inputSchema?: Record<string, unknown>
    execute: (input: Record<string, unknown>, client?: unknown) => Promise<unknown>
    annotations?: ModelContextToolAnnotations
  }

  interface ModelContext {
    registerTool(tool: ModelContextTool): void
    unregisterTool?(name: string): void
  }

  interface Navigator {
    modelContext?: ModelContext
  }
}
