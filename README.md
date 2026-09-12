# УниСофия Портал* — пълен работен каталог

Пилот на **сериозен работен портал** за Софийския университет (старт: Африканистика / ФКНФ).  
Попълва официалните бланки през уеб UI. **Допълва** СУСИ / elearn / Архимед — **не** ги замества.

> **Не е официален сайт на СУ.** Демо акаунти. Без истински SSO.

Официален сайт: [https://www.uni-sofia.bg](https://www.uni-sofia.bg)

---

## Какво има сега

1. **Auth** — email + парола в SQLite (Prisma), JWT сесия в httpOnly cookie (`jose`).
2. **Профил** — роля + факултет + катедра/програма (+ курс за студенти).
3. **Навигация (вписани):** Начало/Моята седмица · Входящи · Нова преписка · Моите дела · Справки · Справочник
4. **Пълен каталог процеси** (`/cases/new`) — всички бланки от Drive `uni-sofiaM` (~92 fillable), групирани по хъбове:
   Обучение · Докторантура · Академична кариера · Натовареност и хонорари · Договори и проекти · Моя труд · Кореспонденция
5. **Процес 5.2** — богат магьосник (натовареност / хонорари) + потвърждение от преподавател.
6. **Останалите процеси** — динамична форма от JSON schema → Case + маршрут + сваляем DOCX.
7. **Default deny** — студенти виждат студентски заявления; преподаватели — отпуск + декларации на жури; program_admin / faculty_admin — HR / админ пакет.
8. **Справочник** — каталози, които не са форми (Най-използвани, Номенклатура, Инструкция, Roles, учебен план).
9. **Legacy forms** (`/forms`) — запазени и работещи.

Публичният лендинг запазва лек афектен тон; authenticated зоната е сериозна.

---

## Каталог: как се импортира

Източник: Google Drive папка `uni-sofiaM` (`1oqy9H2eImjpSzWiG7ONDTJayB04S4MEK`), инвентар `/workspace/su-forms/drive_inventory.csv`.

```bash
# 1) Регенерирай src/lib/catalog.ts от инвентара (кодове, хъбове, роли, schema, маршрут)
python3 scripts/generate-catalog.py

# 2) Структурни DOCX за всеки процес (placeholder-и {fullName}, {faculty}, …)
python3 scripts/build-official-templates.py
# или: npm run template:catalog

# 3) Сийд на ProcessDefinition + HandbookEntry
npm run db:seed
```

`prisma/seed-processes.ts` чете `CATALOG` + наличните файлове в `templates/official/{folder}/` и създава ред за **всяка** fillable бланка. Ако лежи `.docx` sibling на `.doc`/`.pdf`/`.xlsx`, той се ползва за генериране.

Официален Drive файл се записва на същото място и се маркира с `*.from-drive`, за да не го презапише генераторът. LibreOffice (`soffice --headless --convert-to docx`) конвертира `.doc` когато е наличен — в този билд не е инсталиран, затова `.doc` остават с структурен `.docx` sibling.

### Честност за Word отметки

Перфектно картографиране на ~100 наследствени `.doc` по Word bookmarks **не** е реалистично в един пас.

Сега порталът прави:

1. **Каталог + динамични форми + workflow** за всички бланки.
2. **Best-effort DOCX:**
   - ако шаблонът има `{fullName}` / `{faculty}` / … (структурните файлове) → `docxtemplater`;
   - ако е истински Drive `.docx` без placeholder-и → копие + секция „Данни от портала“;
   - иначе портален пакет (корица + таблица с полетата).

Точното позициониране по слотове ще се доуточни **бланка по бланка** след `ROUTES.docx` (Приложение №1). Официалните бланки **не се променят**.

---

## Демо акаунти

Парола за всички: **`demo1234`**

| Email | Роля | Какво вижда в Нова преписка |
|-------|------|------------------------------|
| `program.admin@demo.uni-sofia.local` | program_admin | HR / натовареност / договори / писма |
| `lecturer@demo.uni-sofia.local` | lecturer | отпуск + декларации на жури |
| `faculty.admin@demo.uni-sofia.local` | faculty_admin | пълен админ пакет |
| `student@demo.uni-sofia.local` | student | студентски заявления (3.x) |

Факултет: **FCML (ФКНФ)** · програма: **Африканистика**

Сийдът създава примерни преписки `ПР-2609-10001`…`10004` (5.2, отпуск 2.9, прекъсване 3.5, докладна 9.4).

---

## Локално стартиране

```bash
cd uni-sofia-portal
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Отвори [http://localhost:3000](http://localhost:3000)

```bash
npm run build
npm start
```

Env: `DATABASE_URL` (default `file:./dev.db`) · `SESSION_SECRET`

---

## Workflow

Generic: `draft` / `awaiting_approvals` → domain → Legal (ако трябва) → PFC при плащане → Rector → извеждане (Архимед) → архивен екземпляр (Изготвил + Съгласували) → **копия след извеждане** по каталога (Приложение №1).

5.2 доклад: Декан → Деловодство → ПФЦ → Ректор (без Правен) → каса.

5.2: `draft` → `awaiting_lecturer` → `awaiting_admin_review` → `awaiting_approvals` → `ready_for_rector` → `archived` (+ симулиран Архимед номер).

---

## Технологии

Next.js 14 (App Router) + TypeScript + Tailwind · Prisma + SQLite · `jose` + `bcryptjs` · `docxtemplater` / `pizzip`

---

## Deploy on Railway (SQLite + volume)

1. Railway project from this repo.
2. Volume at `/data`.
3. `DATABASE_URL`=`file:/data/dev.db` · `SESSION_SECRET`=`<long random string>`
4. `npm run build` then `npm run start` (`prisma migrate deploy`, seed if empty).

Generated DOCX: `generated/` (ephemeral unless mounted).

---

## Структура

| Път | Какво е |
|-----|---------|
| `/` | Лендинг |
| `/login` `/register` | Auth |
| `/week` | Моята седмица |
| `/inbox` | Входящи задачи |
| `/cases/new` | Каталог процеси по хъб + търсене |
| `/cases/new/[slug]` | Динамична форма / 5.2 wizard |
| `/cases` `/cases/[id]` | Дела + timeline + сваляне на DOCX |
| `/reports` `/handbook` | Справки / справочник (не-форми) |
| `/forms` | Наследени демо форми |

---

## Лиценз / тон

Пилот с уважение към официалните бланки. Ако си от СУ и виждаш смисъл — мисията е на път.
