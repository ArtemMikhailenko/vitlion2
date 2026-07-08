# Vitlion Group. sitemap.xml

## Расположение файла

Платформа: Tilda. Файл sitemap.xml Tilda генерирует автоматически, но для контроля над приоритетами рекомендуется задать список вручную через настройки SEO.

```
sitemap.xml -> https://www.vitlion.co.il/sitemap.xml
```

В sitemap включаются только индексируемые страницы - общий каталог и 5 категорий. Главная (`/`), `/about`, `/projects` и `/contact` в sitemap не входят, так как закрыты в robots.txt.

## Приоритеты по языкам

Приоритет (priority в sitemap.xml, значение от 0.0 до 1.0) выставляется на основе частотности запросов. Ниже - приоритеты для ивритской версии как основной.

### Иврит (HE) - основной рынок

| URL | priority | changefreq | Частота/мес |
|-----|:--------:|:----------:|------------:|
| /product | 1.0 | weekly | 22 990 |
| /fixed | 0.9 | weekly | 10 130 |
| /glazing | 0.8 | weekly | 5 920 |
| /electric | 0.7 | weekly | 4 420 |
| /zip | 0.5 | monthly | 1 120 |
| /skylight | 0.2 | monthly | 130 |

### Русский (RU)

| URL | priority | changefreq | Частота/мес |
|-----|:--------:|:----------:|------------:|
| /ru/product | 0.8 | weekly | 160 |
| /ru/glazing | 0.5 | monthly | 40 |
| /ru/fixed | 0.5 | monthly | 20 |
| /ru/electric | 0.4 | monthly | 10 |
| /ru/zip | 0.4 | monthly | 10 |
| /ru/skylight | 0.1 | yearly | 0 |

### Английский (EN)

| URL | priority | changefreq | Частота/мес |
|-----|:--------:|:----------:|------------:|
| /en/product | 0.8 | weekly | 650 |
| /en/electric | 0.5 | monthly | 50 |
| /en/fixed | 0.5 | monthly | 50 |
| /en/zip | 0.5 | monthly | 50 |
| /en/glazing | 0.4 | monthly | 60 |
| /en/skylight | 0.1 | yearly | 0 |

## hreflang

Ивритская версия - корень без префикса, x-default указывает на неё же (основной рынок).

```html
<link rel="alternate" hreflang="he" href="https://www.vitlion.co.il/product" />
<link rel="alternate" hreflang="ru" href="https://www.vitlion.co.il/ru/product" />
<link rel="alternate" hreflang="en" href="https://www.vitlion.co.il/en/product" />
<link rel="alternate" hreflang="x-default" href="https://www.vitlion.co.il/product" />
```

## Содержимое sitemap.xml (иврит - основной)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://www.vitlion.co.il/product</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://www.vitlion.co.il/fixed</loc>
    <priority>0.9</priority>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://www.vitlion.co.il/glazing</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://www.vitlion.co.il/electric</loc>
    <priority>0.7</priority>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://www.vitlion.co.il/zip</loc>
    <priority>0.5</priority>
    <changefreq>monthly</changefreq>
  </url>

  <url>
    <loc>https://www.vitlion.co.il/skylight</loc>
    <priority>0.2</priority>
    <changefreq>monthly</changefreq>
  </url>

</urlset>
```

## После публикации

Отправить sitemap в Google Search Console - Файлы Sitemap - добавить https://www.vitlion.co.il/sitemap.xml
