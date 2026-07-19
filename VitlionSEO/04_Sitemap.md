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

|URL|priority|changefreq|Частота/мес|
|-|:-:|:-:|-:|
|/services|1.0|weekly|22 990|
|/static-pergolas|0.9|weekly|10 130|
|/glazing|0.8|weekly|5 920|
|/electric-pergolas|0.7|weekly|4 420|
|/zip-shutters|0.5|monthly|1 120|
|/glass-roofs|0.2|monthly|130|

### Русский (RU)

|URL|priority|changefreq|Частота/мес|
|-|:-:|:-:|-:|
|/ru/services|0.8|weekly|160|
|/ru/glazing|0.5|monthly|40|
|/ru/static-pergolas|0.5|monthly|20|
|/ru/electric-pergolas|0.4|monthly|10|
|/ru/zip-shutters|0.4|monthly|10|
|/ru/glass-roofs|0.1|yearly|0|

### Английский (EN)

|URL|priority|changefreq|Частота/мес|
|-|:-:|:-:|-:|
|/en/services|0.8|weekly|650|
|/en/electric-pergolas|0.5|monthly|50|
|/en/static-pergolas|0.5|monthly|50|
|/en/zip-shutters|0.5|monthly|50|
|/en/glazing|0.4|monthly|60|
|/en/glass-roofs|0.1|yearly|0|

## hreflang

Ивритская версия - корень без префикса, x-default указывает на неё же (основной рынок).

```html
<link rel="alternate" hreflang="he" href="https://www.vitlion.co.il/services" />
<link rel="alternate" hreflang="ru" href="https://www.vitlion.co.il/ru/services" />
<link rel="alternate" hreflang="en" href="https://www.vitlion.co.il/en/services" />
<link rel="alternate" hreflang="x-default" href="https://www.vitlion.co.il/services" />
```

## Содержимое sitemap.xml (иврит - основной)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://www.vitlion.co.il/services</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://www.vitlion.co.il/static-pergolas</loc>
    <priority>0.9</priority>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://www.vitlion.co.il/glazing</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://www.vitlion.co.il/electric-pergolas</loc>
    <priority>0.7</priority>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://www.vitlion.co.il/zip-shutters</loc>
    <priority>0.5</priority>
    <changefreq>monthly</changefreq>
  </url>

  <url>
    <loc>https://www.vitlion.co.il/glass-roofs</loc>
    <priority>0.2</priority>
    <changefreq>monthly</changefreq>
  </url>

</urlset>
```

## После публикации

Отправить sitemap в Google Search Console - Файлы Sitemap - добавить https://www.vitlion.co.il/sitemap.xml

