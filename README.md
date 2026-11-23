# MortgagePage.ca

Static website for **mortgagepage.ca**, hosted on GitHub Pages from the `main` branch (root folder). The `CNAME` file holds the custom domain; don't delete it.

## Layout

| Path | What it is |
|---|---|
| `index.html` | Home page: featured rates table, calculator links, latest news |
| `assets/data/rates.js` | **The rates.** The home page table is drawn from this file |
| `assets/lenders/` | Lender / broker / brokerage logos used in the rates table |
| `calculators/` | Calculators menu (`index.html`) and one page per calculator |
| `news/index.html` | News listing, drawn from `assets/data/news.js` |
| `news/<slug>.html` | One page per article, made from `_templates/article-template.html` |
| `news/images/` | Article pictures |
| `assets/css/site.css`, `assets/js/site.js` | Site styles and the script that draws the rates and news lists |
| `_templates/` | Templates (not published, because GitHub Pages skips folders that start with `_`) |

Colours: navy `#13294b`, red `#d71920`, light blue shading `#eaf2fb` / `#f4f8fd`, white background. Font: Archivo, with IBM Plex Mono for numbers.

## Updating the rates

1. Edit `assets/data/rates.js`. For each term set `rate` (a number like `4.44`, or `null` for a dash), `lender` (name, also used as the logo's alt text), `logo` (for example `assets/lenders/abc-lender.png`, or `""`), and `inquire` (a URL, or `""` until there is one).
2. Put any new logo files in `assets/lenders/`. Keep them under about 300 × 120 px, trimmed, PNG with a transparent or white background.
3. Set `updated` to the time of the update in Eastern time, ISO format, for example `"2026-11-23T10:30:00-05:00"` (use `-04:00` during daylight saving time). The page shows it as "Rates last updated at 10:30 a.m. EST on November 23, 2026".
4. Commit and push. GitHub Pages republishes within a minute or two.

The fill-in template for the owner is `_templates/rates-update-template.txt`.

## Adding a news article

1. Pick a short slug from the title, such as `bank-of-canada-december-2026`.
2. Copy `_templates/article-template.html` to `news/<slug>.html` and replace `{{TITLE}}`, `{{SUMMARY}}`, `{{SLUG}}`, `{{DATE_TEXT}}` (such as "November 23, 2026"), `{{BODY_HTML}}` (the article as `<p>`, `<h2>`, `<ul>` and so on), `{{IMAGE_FILE}}`, `{{IMAGE_ALT}}` and `{{OG_IMAGE}}` (the full image URL, for example `https://mortgagepage.ca/news/images/<file>`, or `https://mortgagepage.ca/assets/img/og-image.png` when there is no picture). If there is no picture, delete the `<figure>` line.
3. Save the picture (resized to about 1600 px wide, JPEG) in `news/images/`.
4. Add an entry at the **top** of `window.MP_NEWS` in `assets/data/news.js`: `{ slug, title, date: "YYYY-MM-DD", summary, image: "news/images/<file>", imageAlt }`.
5. Commit and push.

## Calculators

Each calculator page wraps the owner's original calculator code (originally written for a GoDaddy site) in the site header and footer. The calculators are recoloured to navy through CSS variables on `.mp-calc` in `site.css`, and their PDFs use the MortgagePage.ca logo (embedded as `window.PDF_LOGO_DATA` at the bottom of each page). The PDF contact lines still show the phone number 613-823-8324 and admin@yourmortgagestaff.ca.
