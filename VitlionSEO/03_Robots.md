# Vitlion Group. robots.txt

## Расположение файла

```
robots.txt -> https://www.vitlion.co.il/robots.txt
```

На платформе Tilda файл настраивается через: Настройки сайта -> SEO -> robots.txt (поле для ручного ввода содержимого).

## Логика

* **Главная `/`** - закрыта от индексации (промо-страница, не каталог).
* **`/about`** - закрыта от индексации (страница о компании).
* **`/projects`** - закрыта от индексации (портфолио/проекты).
* **`/contact`** - закрыта от индексации (контакты).
* **`/services` и все 5 категорий** - открыты для индексации, это посадочные страницы под собранную семантику.

## Содержимое robots.txt

```
User-agent: \*
Allow: /services
Allow: /electric-pergolas
Allow: /static-pergolas
Allow: /zip-shutters
Allow: /glazing
Allow: /glass-roofs

Disallow: /$
Disallow: /about
Disallow: /projects
Disallow: /contact
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /login
Disallow: /search
Disallow: /tilda/

Sitemap: https://www.vitlion.co.il/sitemap.xml
```

## Проверка после публикации

1. Открыть `https://www.vitlion.co.il/robots.txt` в браузере - убедиться, что файл отдаётся.
2. В Google Search Console -> Настройки -> robots.txt - проверить, что Google корректно читает файл.
3. Проверить через инструмент проверки URL, что `/product`, `/electric-pergolas`, `/static-pergolas`, `/zip-shutters`, `/glazing`, `/glass-roofs` открыты (Allowed), а `/`, `/about`, `/projects`, `/contact` закрыты (Disallowed).

