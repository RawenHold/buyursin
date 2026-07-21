# Buyursin BMS — Kinetic Minimalism

Интерактивная презентация решений Buyursin Technics для автоматизации коммерческих зданий.

## Что входит

- Kinetic Minimalism: строгая сетка, компактные компоненты, свободное пространство.
- Next.js 16, React 19, Tailwind CSS 4, Framer Motion.
- Русская и узбекская локализация.
- Интерактивная демонстрация процессов в реальном времени.
- Before / After с плавным ползунком.
- Карточки бизнес-выгод с микро-взаимодействиями.
- Изолированный конструктор коммерческого предложения по адресу `/proposal`.
- Генерация горизонтальных слайдов 16:9.
- Экспорт в PDF и PPTX с сохранением визуального оформления.
- Автоматическая проверка линтинга, типов, сборки и возможных секретов.

## Локальный запуск

```bash
npm ci
npm run dev
```

Главная страница: `http://localhost:3000`

Конструктор КП: `http://localhost:3000/proposal`

## Проверка проекта

```bash
npm run check
```

Команда выполняет:

1. Проверку на случайно добавленные секреты.
2. ESLint.
3. TypeScript.
4. Production build.

## Экспорт КП

Экспорт выполняется полностью в браузере:

- PDF: каждый слайд сохраняется в формате 16:9.
- PPTX: стилизованные слайды добавляются в презентацию как полноразмерные изображения. Это сохраняет дизайн максимально точно.

Данные конструктора и загруженный логотип сохраняются только в `localStorage` текущего браузера.

## Автоматический деплой в Vercel

В репозитории подготовлены workflow-файлы:

- `.github/workflows/quality.yml` — проверка каждого pull request и ветки `main`.
- `.github/workflows/vercel.yml` — Preview Deployment для pull request и Production Deployment для `main`.

В GitHub → Settings → Secrets and variables → Actions добавьте:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Секреты используются только внутри GitHub Actions и не попадают в клиентский bundle.

Альтернатива: подключить репозиторий через Vercel Git Integration. В этом случае Vercel автоматически создаёт preview-деплой для каждой ветки и production-деплой для `main`.

## Безопасность

- В клиентском коде нет API-ключей и токенов.
- `.env*` и `.vercel` исключены из Git.
- Не используйте префикс `NEXT_PUBLIC_` для приватных значений.
- Подробности: `SECURITY.md`.

## Структура

```text
src/app/                     страницы Next.js
src/components/site/         интерактивные секции сайта
src/modules/i18n/            RU / UZ локализация
src/modules/proposal/        изолированный конструктор КП и экспорт
scripts/check-no-secrets.mjs проверка секретов
.github/workflows/           CI и Vercel Deploy
```
