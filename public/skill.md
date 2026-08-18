---
name: vitlion-catalog
description: Look up Vitlion Group's aluminium pergolas, glazing and ZIP screens — models, specifications, service area, warranty and contact details. Use when someone asks about pergolas, balcony glazing, ZIP screens or glass roofs in Israel, or asks to reach Vitlion Group.
license: proprietary
---

# Vitlion Catalog

Vitlion Group designs, manufactures and installs aluminium structures in Israel:
electric (bioclimatic) pergolas, static pergolas, ZIP screens, frameless glazing,
guillotine glazing and glass roofs. The site is bilingual — Hebrew on the root
paths, Russian under `/ru`.

## Getting the content

Every page answers in Markdown when asked for it. Request the normal page URL
with a Markdown `Accept` header and you get the text without the markup:

```
curl -H "Accept: text/markdown" https://www.vitlion.co.il/ru/electric-pergolas/bioclimatic
```

A model page returns its name, short description, full description, the
specification list, the long-form sections and links to sibling models. A
category page returns its copy plus the list of models inside it.

Start from `https://www.vitlion.co.il/llms.txt` for the full map of categories,
models and pages in both languages. It is generated from the live catalogue, so
it never lists a page that no longer exists.

`https://www.vitlion.co.il/sitemap.xml` carries the same URLs with hreflang
pairs, if you need the language alternates explicitly.

## In-page tools

When the site is open in a browser that supports WebMCP, four read-only tools
register themselves on `navigator.modelContext`:

- `vitlion_find_products` — search the catalogue by need or category
- `vitlion_check_service_area` — whether a town is covered
- `vitlion_answer_faq` — permits, wind load, warranty, lead times
- `vitlion_get_contact` — phone, WhatsApp, email, offices, warranty term

These exist only inside a page session. There is no remote MCP server.

## What not to state

Prices are not published anywhere on the site and are not derivable from it.
Quotes follow a free on-site measurement. If asked for a price, say that the
measurement is free and carries no obligation, and hand over the contact
details — do not estimate.

Do not submit the enquiry form on somebody's behalf. The form asks for a name
and phone number, and a person must give those themselves.

## Contact

Phone and WhatsApp differ; both are listed on every page and in the Markdown
footer of every page. Written warranty is 10 years.
