'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { CONTACT } from '@/data/services'
import type { ContactInfo } from '@/lib/content/contact'

const ContactContext = createContext<ContactInfo>(CONTACT)

/**
 * Makes the editable contact details reachable from client components.
 *
 * They used to be a compile-time import in twelve files, which meant changing a
 * phone number was a code change and a deploy. The provider sits in the root
 * shell, so the value is resolved once per request on the server and every
 * button, footer and WhatsApp link below it reads the same one.
 *
 * The default is the bundled constant, so a component rendered outside the
 * provider — a test, a stray tree — still shows real details rather than blanks.
 */
export function ContactProvider({ value, children }: { value: ContactInfo; children: ReactNode }) {
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
}

export function useContact(): ContactInfo {
  return useContext(ContactContext)
}

/** Digits only — what wa.me and tel: want. */
export function digits(value: string): string {
  return value.replace(/\D/g, '')
}
