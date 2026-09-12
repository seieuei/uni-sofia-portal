# УниСофия Портал* — Phase A

Пилот на **сериозен работен портал** за Софийския университет (старт: Африканистика / ФКНФ).  
Попълва официалните бланки през уеб UI. **Допълва** СУСИ / elearn / Архимед — **не** ги замества.

> **Не е официален сайт на СУ.** Демо акаунти. Без истински SSO.

Официален сайт: [https://www.uni-sofia.bg](https://www.uni-sofia.bg)

---

## Какво е Phase A

1. **Auth** — email + парола в SQLite (Prisma), JWT сесия в httpOnly cookie (`jose`).
2. **Профил** — роля + факултет + катедра/програма (+ курс за студенти).
3. **Навигация (вписани):** Начало/Моята седмица · Входящи · Нова преписка · Моите дела · Справки · Справочник
4. **Процес 5.2** — Натовареност / хонорари: магьосник → потвърждение от преподавател → изчисление → DOCX.
5. **Default deny** — показват се само процеси за matching роля.
6. **Legacy forms** (`/forms`) — запазени и работещи.

Публичният лендинг запазва лек афектен тон; authenticated зоната е сериозна.

---

## Демо акаунти

Парола за всички: **`demo1234`**

| Email | Роля |
|-------|------|
| `program.admin@demo.uni-sofia.local` | program_admin |
| `lecturer@demo.uni-sofia.local` | lecturer |
| `faculty.admin@demo.uni-sofia.local` | faculty_admin |
| `student@demo.uni-sofia.local` | student |

Факултет: **FCML (ФКНФ)** · програма: **Африканистика**

### Успешен сценарий

1. Влез като `program.admin@…` → **Нова преписка** → 5.2 → изпрати към lecturer.
2. Излез, влез като `lecturer@…` → **Входящи** → потвърди часовете.
3. Обратно като admin → **Изчисли и генерирай DOCX** → свали документа.
4. **Моята седмица** и **Входящи** показват релевантни елементи.

Сийдът вече създава една примерна преписка `ПР-2609-10001` в статус `awaiting_lecturer`.

---

## Локално стартиране

```bash
cd uni-sofia-portal
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Отвори [http://localhost:3000](http://localhost:3000)

Проверка:

```bash
npm run build
npm start
```

Env:

- `DATABASE_URL` — default `file:./dev.db`
- `SESSION_SECRET` — смени в продукция

---

## Шаблон 5.2 (DOCX)

- Път: `templates/official/5.2-honorary.docx`
- Drive file id (официален бланк): `12PFiP5OBClZNDKxqG_GHHgsbGUcYlZi8` (Obrazec-5.2)
- В билдa Drive **не** се дърпа; шаблонът е **структурен** DOCX с полетата на бланка, **без** претенция за пикселова идентичност.
- Генериране на шаблона: `npx tsx scripts/build-5-2-template.ts`
- Попълване: `docxtemplater` + `pizzip`

---

## Workflow 5.2

`draft` → `awaiting_lecturer` → `awaiting_admin_review` → `awaiting_approvals` (Legal/PFC stubs) → `ready_for_rector` → `archived` (+ симулиран Архимед номер)

---

## Технологии

- Next.js 14 (App Router) + TypeScript + Tailwind
- Prisma + SQLite
- `jose` (JWT cookie) + `bcryptjs`
- `docxtemplater` / `pizzip`

---

## Deploy on Railway (SQLite + volume)

1. Create a Railway project from this repo (Nixpacks build is fine).
2. Add a **volume** mounted at `/data` so the SQLite file survives restarts.
3. Set environment variables:
   - `DATABASE_URL`=`file:/data/dev.db`
   - `SESSION_SECRET`=`<long random string>`
4. Railway will run `npm run build`, then `npm run start`, which:
   - runs `prisma migrate deploy`
   - seeds **only if** there are no users/forms yet
   - starts Next.js on `0.0.0.0:${PORT}`

Generated DOCX files land in `generated/` (ephemeral on Railway unless you mount that path too).

---

## Структура (накратко)

| Път | Какво е |
|-----|---------|
| `/` | Лендинг (лек тон + дисклеймър) |
| `/login` `/register` | Auth |
| `/week` | Моята седмица |
| `/inbox` | Входящи задачи |
| `/cases/new` | Нова преписка (5.2 wizard) |
| `/cases` `/cases/[id]` | Дела + timeline |
| `/reports` `/handbook` | Обвивки |
| `/forms` | Наследени демо форми |

---

## Лиценз / тон

Пилот с уважение към официалните бланки. Ако си от СУ и виждаш смисъл — мисията е на път.
