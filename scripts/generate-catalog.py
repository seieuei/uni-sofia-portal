# -*- coding: utf-8 -*-
"""Generate src/lib/catalog.ts from drive inventory + curated metadata."""
import csv, json, os, re, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INV = os.path.join(ROOT, "su-forms", "drive_inventory.csv")
if not os.path.exists(INV):
    INV = "/workspace/su-forms/drive_inventory.csv"
OUT = os.path.join(ROOT, "src", "lib", "catalog.ts")

# Files that are knowledge, not fillable processes
HANDBOOK = {
    "1nSzuy3Q1q246cTS4HnE1EUlpae64MsdR": {
        "slug": "most-used-documents",
        "kind": "catalog",
        "titleBg": "Най-използвани документи (каталог маршрути)",
        "titleEn": "Most used documents (routing catalog)",
        "summaryBg": "37-страничен каталог (Приложение №1 към инструкцията): раздели 1–9, задължителни полета и маршрут за всяка бланка. Не е бланка — справочник.",
        "summaryEn": "37-page catalog (Annex 1): sections 1–9, required fields and route per blank. Knowledge, not a form.",
    },
    "169ywBDdIVHpW1GfAnAb_HuuBPAi6le0U": {
        "slug": "nomenklatura",
        "kind": "nomenclatura",
        "titleBg": "Номенклатура на делата",
        "titleEn": "Records nomenclatura",
        "summaryBg": "52 стр. (Ректор 17.03.2021): 17 архивни раздела — РД, УД, ДДСК, ФД, ЧР… Предлага индекс при приключване на преписка.",
        "summaryEn": "52 pp. (Rector 17.03.2021): 17 archival sections. Suggest a file index when a case closes.",
    },
    "1tZg0-4uktc2i0E3J4o2J29jSyYTaT6Uo": {
        "slug": "admin-instruction",
        "kind": "instruction",
        "titleBg": "Инструкция за административните дейности",
        "titleEn": "Instruction for administrative tasks",
        "summaryBg": "АС 29.03.2017 (изм. 2019). Деловодство, Архимед, резолюции, печати, срокове (7 дни).",
        "summaryEn": "AS 29.03.2017 (amd. 2019). Registry, Arhimed, resolutions, seals, 7-day default deadline.",
    },
    "1162OJKtWJM8rYnVqd1PaW6uTDrr9OPYf": {
        "slug": "roles",
        "kind": "roles",
        "titleBg": "Роли и системи (Roles.docx)",
        "titleEn": "Roles and systems (Roles.docx)",
        "summaryBg": "Слоеве: университет / факултет / програма / преподавател / студент. Болката при 5.x хонорари.",
        "summaryEn": "Layers: university / faculty / program / lecturer / student. The 5.x honorary-pay pain.",
    },
    "1rkl2d8ViQmhPKQ8Yiju2M802iJaeoMot": {
        "slug": "uchplan-afrikanistika",
        "kind": "curriculum",
        "titleBg": "Учебен план — Африканистика (KNA240425)",
        "titleEn": "Curriculum — African Studies (KNA240425)",
        "summaryBg": "БА, поле 2.1, 8 семестъра, випуск 2025/26. 2310 ч / 186 ECTS задължителни + 600 ч / 44 ECTS избираеми.",
        "summaryEn": "BA, field 2.1, 8 semesters, 2025/26. 2310 h / 186 ECTS required + 600 h / 44 ECTS electives.",
    },
}

SKIP_IDS = {
    "1NpbmT5KTu7wKb61ELBMpqGl-uonogptO",  # screenshot
    "1n5s8wXDIYRP8iPZxD7XDnjRpsP6-80Wn",  # susi4.png
    "1LL8gfTCLjrMoAJc-iRptndI5Dvo_51-b",  # susi.png
}
SKIP_MIMES_PREFIX = ("image/",)
FOLDER_MIME = "application/vnd.google-apps.folder"

# Curated titles by catalog code (after normalize)
TITLES = {
    "2.1": ("Обявяване на конкурс за академична длъжност", "Announce academic-position competition"),
    "2.1A": ("Образец 2.1.А — справка натовареност (щатни + хонорувани)", "Form 2.1.A — load spreadsheet (staff + honorary)"),
    "2.2": ("Допускане на кандидати — асистент", "Admit candidates — assistant"),
    "2.3": ("Допускане на кандидати — гл. ас. / доц. / проф.", "Admit candidates — chief asst. / assoc. / prof."),
    "2.4": ("Комисия по провеждане на конкурс — асистент", "Competition commission — assistant"),
    "2.5": ("Научно жури — главен асистент", "Scientific jury — chief assistant"),
    "2.5.1": ("Предложение за научно жури от катедрата — гл. асистент", "Department proposal for jury — chief assistant"),
    "2.5.2": ("Декларация за конфликт на интереси — конкурс гл. асистент", "Conflict-of-interest declaration — chief assistant contest"),
    "2.5.3": ("Декларация за мин. нац. изисквания — жури гл. асистент", "Min. national requirements declaration — chief assistant jury"),
    "2.6": ("Научно жури — доцент / професор", "Scientific jury — associate / professor"),
    "2.6.1": ("Предложение за научно жури от катедрата — доц. / проф.", "Department proposal for jury — assoc. / prof."),
    "2.6.2": ("Разширяване състава на ФС/НС за избор на професор", "Expand faculty/scientific council for professor election"),
    "2.6.3": ("Декларация за конфликт на интереси — конкурс доц. / проф.", "Conflict-of-interest declaration — assoc. / prof. contest"),
    "2.6.4": ("Декларация за мин. нац. изисквания — жури доц. / проф.", "Min. national requirements declaration — assoc. / prof. jury"),
    "2.7": ("Назначаване на академична длъжност — асистент", "Appoint academic position — assistant"),
    "2.7.1": ("Назначаване на академична длъжност — главен асистент", "Appoint academic position — chief assistant"),
    "2.8": ("Назначаване на академична длъжност — доцент / професор", "Appoint academic position — associate / professor"),
    "2.9": ("Заявление за отпуск", "Leave application"),
    "2.10": ("Заявление за творчески отпуск", "Creative leave application"),
    "2.11": ("Прекъсване на отпуск", "Interrupt leave"),
    "2.12": ("Заявление за назначаване", "Hire application"),
    "2.12A": ("Декларация при постъпване на работа", "Incoming-employee declaration"),
    "2.12B": ("Заявление за преназначаване", "Reassignment application"),
    "2.12C": ("Заявление за продължаване срока на трудов договор", "Extend employment contract"),
    "3.1": ("Заявление за дубликат на диплома", "Diploma duplicate request"),
    "3.2": ("Заявление за обучение в нова специалност", "Study a second / new specialty"),
    "3.2C": ("Договор — бакалаври и магистри, нова специалност 2025/26", "Contract — BA/MA new specialty 2025/26"),
    "3.2M": ("Договор за платено обучение — магистър 2025/26", "Paid-study contract — master's 2025/26"),
    "3.3": ("Възстановяване на студентски права (Ректорат / ОД)", "Restore student rights (Rectorate / Education dept.)"),
    "3.4": ("Възстановяване на студентски права (факултет)", "Restore student rights (faculty only)"),
    "3.5": ("Прекъсване на студентски права", "Interrupt studies"),
    "3.6": ("Заявление за европейско приложение към диплома", "European diploma supplement"),
    "3.7": ("Заявление за финансова помощ", "Student financial aid"),
    "3.8": ("Application form — чуждестранни студенти", "Application form — international students"),
    "3.8C": ("Договор за чуждестранни студенти 2025/26", "Contract — international students 2025/26"),
    "4.1": ("Зачисляване в докторантура", "PhD enrolment"),
    "4.2": ("Комисия за кандидат-докторантски изпит", "Candidate-PhD exam commission"),
    "4.3A": ("Научно жури — заварени докторанти", "Scientific jury — incumbent doctoral students"),
    "4.3B": ("Научно жури — нови докторанти", "Scientific jury — new doctoral students"),
    "4.3C": ("Научно жури — доктор на науките (нови)", "Scientific jury — Doctor of Sciences (new)"),
    "4.4A": ("Договор с външни членове на жури (СТАР)", "Civil contract with external jury (legacy / STAR)"),
    "4.4B": ("Договор с външни членове на жури (НОВ)", "Civil contract with external jury (NEW)"),
    "4.5": ("Изплащане на външни членове на жури", "Pay external jury members"),
    "4.6": ("Изплащане на вътрешни членове на жури", "Pay internal jury members"),
    "4.7": ("Възнаграждение за научно ръководство", "Supervisor fee"),
    "4.8": ("Изплащане за кандидат-докторантски изпит", "Pay for candidate-PhD exam"),
    "4.9.1": ("Декларация за конфликт на интереси — член на жури (PhD)", "Conflict-of-interest declaration — PhD jury member"),
    "4.9.2": ("Декларация за мин. нац. изисквания — член на жури (PhD)", "Min. national requirements — PhD jury member"),
    "4.11A": ("Стипендия по ПМС 90/2000 — чл. 7 ал. 5 т. 1", "PMS 90/2000 stipend — art. 7(5)(1)"),
    "4.11B": ("Стипендия по ПМС 90/2000 — чл. 7 ал. 5 т. 2", "PMS 90/2000 stipend — art. 7(5)(2)"),
    "4.12": ("Възнаграждение за рецензия на проект на дисертация", "Fee for dissertation-project review"),
    "4.D": ("Декларация (докторантура)", "Declaration (doctoral)"),
    "5.1": ("Граждански договор + декларация ЗДДФЛ", "Civil contract + PIT declaration"),
    "5.2": ("Натовареност / хонорари — хонорувани преподаватели", "Load / honorary pay — honorary lecturers"),
    "5.2A": ("Договор с хоноруван преподавател (възмезден)", "Honorary lecturer contract (paid)"),
    "5.3A": ("Възлагане по научен проект (чл. 31)", "Assign work on a research project (art. 31)"),
    "5.3B": ("Изплащане — вътрешни по чл. 31 ал. 5", "Pay internals — art. 31(5)"),
    "5.3C": ("Договор с консултанти по научен проект", "Contract with project consultants"),
    "5.3CA": ("Договор с членове на научния колектив", "Contract with project team members"),
    "5.3D": ("Изплащане по научен проект + приемо-предавателен протокол", "Project pay + handover protocol"),
    "5.4A": ("Възлагане на допълнителни задачи (чл. 25 ВПРЗ)", "Assign extra university tasks (art. 25)"),
    "5.4B": ("Изплащане по чл. 25 ВПРЗ", "Pay extra tasks (art. 25)"),
    "5.5": ("Часове над годишния норматив (КТД)", "Hours over annual norm (collective agreement)"),
    "5.6": ("Заповед — допълнителни възнаграждения магистърски програми", "Order — extra pay for master's programmes"),
    "5.6A": ("Таблица 5.6.А — доп. възнаграждения МП (EUR)", "Sheet 5.6.A — master's extra pay (EUR)"),
    "5.7": ("Възнаграждение за кандидат-студентска кампания", "Pay for admissions campaign"),
    "5.7A": ("Договор с проверител (КСК)", "Contract with admissions examiner"),
    "5.8": ("Договор за базова практика", "Base-school practical-training contract"),
    "5.8A": ("Приложение / договор 5.8А — базова практика", "Annex 5.8A — base-school practice"),
    "5.9": ("Изплащане на базови учители", "Pay base-school teachers"),
    "5.9A": ("Справка за часове на базови учители", "Hour log for base-school teachers"),
    "5.11": ("Иницииране на граждански договор с чужденци", "Initiate civil contract with foreigners"),
    "5.11A": ("Service agreement (BG–EN) — general", "Service agreement (BG–EN) — general"),
    "5.11B": ("Service agreement (BG–EN) — гост-преподаватели", "Service agreement (BG–EN) — guest lecturers"),
    "5.11C": ("Service agreement (BG–EN) — работни програми", "Service agreement (BG–EN) — work programmes"),
    "5.12": ("Плащане по граждански договор с чужденци", "Pay foreign civil contract"),
    "5.13": ("Бланка гост-преподавател т. 7.1 — по тарифа", "Guest lecturer form 7.1 — tariff"),
    "5.14": ("Бланка гост-преподавател т. 7.2 — цялостно обучение", "Guest lecturer form 7.2 — full programme"),
    "5.15": ("Бланка гост-преподавател т. 7.3 — безвъзмездно", "Guest lecturer form 7.3 — unpaid"),
    "5.16A": ("Възлагане на извънреден труд", "Assign overtime"),
    "5.16B": ("Изплащане на извънреден труд", "Pay overtime"),
    "5.16C": ("Изплащане на нощен труд", "Pay night work"),
    "5.17B": ("Изплащане при бюджетни остатъци (чл. 27 ВПРЗ)", "Pay from residual budget (art. 27)"),
    "5.17C": ("Доп. възнаграждение на инспектори (чл. 29 / 29а ВПРЗ)", "Extra pay for inspectors (art. 29 / 29a)"),
    "5.17D": ("Заповед — научни публикации", "Order — scientific publications"),
    "5.17E": ("Договор — научни публикации", "Contract — scientific publications"),
    "5.1D": ("Декларация ЗДДФЛ / самоосигуряващо се лице", "PIT / self-insured person declaration"),
    "5.MP": ("План-сметка на магистърска програма (EUR)", "Master's programme budget (EUR)"),
    "9.1": ("Изходящо писмо до друга институция", "Outgoing letter to another institution"),
    "9.2": ("Писмо по вътрешна поща", "Internal mail"),
    "9.3": ("Изходящо писмо-отговор", "Outgoing reply letter"),
    "9.4": ("Докладна записка", "Official memo (dokladna zapiska)"),
}

# Filename / folder heuristics to force a catalog code
FORCE_CODE = [
    (re.compile(r"^отпуск\.docx$", re.I), "2.9"),
    (re.compile(r"творчески", re.I), "2.10"),
    (re.compile(r"прекъсване отпуск", re.I), "2.11"),
    (re.compile(r"заявление назначаване", re.I), "2.12"),
    (re.compile(r"декларация постъпване", re.I), "2.12A"),
    (re.compile(r"преназначаване", re.I), "2.12B"),
    (re.compile(r"продължаване срока", re.I), "2.12C"),
    (re.compile(r"Dogovor_za_bakalavri", re.I), "3.2C"),
    (re.compile(r"Dogovor_za_plateno", re.I), "3.2M"),
    (re.compile(r"Dogovor_za_chujdestranni", re.I), "3.8C"),
    (re.compile(r"план-сметка", re.I), "5.MP"),
    (re.compile(r"5\.2A|5\.2А|хонорувани-Възмезден", re.I), "5.2A"),
    (re.compile(r"5\.6\.A", re.I), "5.6A"),
    (re.compile(r"5\.9\.A", re.I), "5.9A"),
    (re.compile(r"5\.8A", re.I), "5.8A"),
    (re.compile(r"5\.7А|5\.7A", re.I), "5.7A"),
    (re.compile(r"5\.11A", re.I), "5.11A"),
    (re.compile(r"5\.11B", re.I), "5.11B"),
    (re.compile(r"5\.11C", re.I), "5.11C"),
    (re.compile(r"5\.16 A|5\.16A", re.I), "5.16A"),
    (re.compile(r"5\.16 B|5\.16B", re.I), "5.16B"),
    (re.compile(r"5\.16 C|5\.16C", re.I), "5.16C"),
    (re.compile(r"5\.17 B|5\.17B", re.I), "5.17B"),
    (re.compile(r"5\.17 C|5\.17C", re.I), "5.17C"),
    (re.compile(r"5\.17 D|5\.17D", re.I), "5.17D"),
    (re.compile(r"5\.17 E|5\.17E", re.I), "5.17E"),
    (re.compile(r"5\.3 Cа|5\.3 Ca|5\.3Cа", re.I), "5.3CA"),
    (re.compile(r"5\.4\.A|5\.4 A", re.I), "5.4A"),
    (re.compile(r"5\.4\.B|5\.4 B", re.I), "5.4B"),
    (re.compile(r"4\.3 A", re.I), "4.3A"),
    (re.compile(r"4\.3 B", re.I), "4.3B"),
    (re.compile(r"4\.3 C", re.I), "4.3C"),
    (re.compile(r"4\.4 А|4\.4 A|4\.4А-доклад", re.I), "4.4A"),
    (re.compile(r"4\.4 В|4\.4 B|4\.4В-доклад", re.I), "4.4B"),
    (re.compile(r"4\.11 A", re.I), "4.11A"),
    (re.compile(r"4\.11 B", re.I), "4.11B"),
    (re.compile(r"2\.1\.А|2\.1\.A", re.I), "2.1A"),
]

ROLES = {
    "student": "student",
    "student_plus": "student,applicant",
    "applicant": "applicant,student,faculty_admin",
    "leave": "lecturer,program_admin,faculty_admin,admin_staff",
    "hire": "program_admin,faculty_admin",
    "decl_person": "lecturer,faculty_admin,admin_staff",
    "decl_jury": "lecturer,faculty_admin,program_admin",
    "admin": "program_admin,faculty_admin",
    "admin_staff": "program_admin,faculty_admin,admin_staff",
    "letters": "program_admin,faculty_admin,admin_staff",
    "contracts": "program_admin,faculty_admin",
}

HUBS = {
    "training": ("Обучение", "Studies"),
    "phd": ("Докторантура", "Doctoral"),
    "career": ("Академична кариера", "Academic career"),
    "load": ("Натовареност и хонорари", "Load and honoraria"),
    "contracts": ("Договори и проекти", "Contracts and projects"),
    "mywork": ("Моя труд", "My work"),
    "letters": ("Кореспонденция", "Correspondence"),
}

NOM = {
    "training": "УД-12",
    "phd": "ДДСК-01",
    "career": "ЧР-09",
    "load": "ФД-23",
    "contracts": "ПО-03",
    "mywork": "ЧР-01",
    "letters": "РД-31",
}

def parse_code(title, folder):
    for rx, code in FORCE_CODE:
        if rx.search(title):
            return code
    # explicit dotted codes first (2.6.3, 4.9.1, 5.17)
    m = re.search(r"(?:обр(?:азец)?\.?\s*|Obrazec[-\s]?)?(\d+\.\d+(?:\.\d+)?)\s*([A-Za-zА-Яа-я])?", title, re.I)
    if m:
        code = m.group(1)
        suf = m.group(2)
        if suf:
            # latinize cyrillic suffixes
            trans = {"А": "A", "В": "B", "С": "C", "а": "A", "в": "B", "с": "C", "Б": "B"}
            suf = trans.get(suf, suf.upper())
            if suf in "ABCDE":
                code = code + suf
        return code
    m = re.search(r"(\d+\.\d+[A-Za-zА-Яа-я]?)", title)
    if m:
        raw = m.group(1)
        raw = raw.replace("А", "A").replace("В", "B").replace("С", "C")
        return raw
    if folder == "phd" and title.upper().startswith("ДЕКЛАРАЦИЯ"):
        return "4.D"
    if folder == "HR" and title.upper().startswith("ДЕКЛАРАЦИЯ"):
        return "5.1D"
    return None

def hub_for(code, folder, title):
    if folder == "letters" or (code and code.startswith("9.")):
        return "letters"
    if folder == "phd" or (code and code.startswith("4.")):
        return "phd"
    if folder == "student documents" or (code and code.startswith("3.")):
        return "training"
    if code:
        if code.startswith("2.") and any(code.startswith(x) for x in ["2.9", "2.10", "2.11", "2.12"]):
            return "mywork"
        if code.startswith("2."):
            return "career"
        if code in ("5.2", "5.2A", "5.5", "5.6", "5.6A", "5.9", "5.9A", "5.MP"):
            return "load"
        if code.startswith("5."):
            return "contracts"
    t = title.lower()
    if any(k in t for k in ["отпуск", "назначаване", "постъпване", "преназначаване", "трудов"]):
        return "mywork"
    if folder == "HR":
        if any(k in t for k in ["хонор", "натовар", "норматив", "магист", "базов", "план-смет"]):
            return "load"
        return "contracts"
    if folder == "documents":
        return "career"
    return "contracts"

def roles_for(code, hub, title):
    t = title.lower()
    if hub == "training":
        if code in ("3.8",) or "application" in t:
            return ROLES["applicant"]
        if code in ("3.2C", "3.2M", "3.8C") or "dogovor" in t or "договор" in t:
            return ROLES["admin"]
        return ROLES["student"]
    if hub == "phd":
        if "декларац" in t or (code and code.startswith("4.9")):
            return ROLES["decl_jury"]
        return ROLES["admin"]
    if hub == "career":
        if "декларац" in t or (code and re.match(r"2\.(5|6)\.[234]", code or "")):
            return ROLES["decl_jury"]
        return ROLES["admin"]
    if hub == "mywork":
        if code in ("2.9", "2.10", "2.11") or "отпуск" in t:
            return ROLES["leave"]
        if "декларац" in t or code == "2.12A":
            return ROLES["decl_person"]
        return ROLES["hire"]
    if hub == "load":
        return ROLES["admin"]
    if hub == "contracts":
        return ROLES["contracts"]
    if hub == "letters":
        return ROLES["letters"]
    return ROLES["admin"]

def family_for(code, hub, title):
    t = title.lower()
    if "декларац" in t or (code and ("4.9" in code or code in ("2.5.2", "2.5.3", "2.6.3", "2.6.4", "2.12A", "5.1D", "4.D"))):
        return "declaration"
    if hub == "letters":
        return "letter"
    if hub == "mywork" and (code in ("2.9", "2.10", "2.11") or "отпуск" in t):
        return "leave"
    if hub == "mywork":
        return "hire"
    if hub == "training" and (code in ("3.2C", "3.2M", "3.8C") or "dogovor" in t or "договор" in t):
        return "contract"
    if hub == "training":
        return "petition"
    if hub == "load" or (code and code in ("5.2", "5.5", "5.6", "5.6A", "5.9", "2.1A")):
        return "load"
    if hub == "contracts" or (code and code.startswith("5.")):
        return "contract"
    if hub == "career":
        return "contest"
    if hub == "phd":
        if code and any(code.startswith(x) for x in ["4.4", "4.5", "4.6", "4.7", "4.8", "4.11", "4.12"]):
            return "pay"
        return "phd"
    return "generic"

def has_payment(code, family, title):
    t = title.lower()
    if family in ("load", "pay"):
        return True
    if any(k in t for k in ["изплащ", "възнагражд", "хонор", "стипен", "pomosht", "помощ", "тариф", "платен", "pay", "plashtane", "izplacht"]):
        return True
    if code and any(code.startswith(x) for x in ["4.4", "4.5", "4.6", "4.7", "4.8", "4.11", "4.12", "5.", "3.7"]):
        if code in ("5.11A", "5.11B", "5.11C", "5.13", "5.14", "5.15"):
            return False  # agreement blanks, payment is 5.12
        return True
    return False

def has_legal(code, family, title):
    t = title.lower()
    if family in ("contract", "hire", "contest"):
        return True
    if any(k in t for k in ["договор", "dogovor", "назнач", "конкурс", "жури", "juri", "заповед", "zapoved"]):
        return True
    if code and code.startswith("5.2") and code != "5.2A":
        return False  # 5.2 pay доклад — Legal already saw the contract
    if code == "5.2":
        return False
    return family in ("pay",)

def wizard_kind(code, family):
    if code == "5.2":
        return "load-5-2"
    if family == "load":
        return "dynamic-load"
    return "dynamic"

def slug_for(code, title, file_id):
    if code == "5.2":
        return "load-pay-5-2"
    if code:
        s = "p-" + code.lower().replace(".", "-")
        return s
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower())
    slug = re.sub(r"-+", "-", slug).strip("-")[:48]
    return slug or ("p-" + file_id[:8].lower())

def ext_for(mime, title):
    t = title.lower()
    if t.endswith(".docx"): return ".docx"
    if t.endswith(".doc"): return ".doc"
    if t.endswith(".xlsx"): return ".xlsx"
    if t.endswith(".xls"): return ".xls"
    if t.endswith(".pdf"): return ".pdf"
    if "wordprocessingml" in mime: return ".docx"
    if mime == "application/msword": return ".doc"
    if "spreadsheetml" in mime: return ".xlsx"
    if mime == "application/vnd.ms-excel": return ".xls"
    if mime == "application/pdf": return ".pdf"
    return ""

def folder_dir(folder):
    return {
        "phd": "phd",
        "documents": "documents",
        "student documents": "student-documents",
        "HR": "HR",
        "letters": "letters",
        "root": "root",
    }.get(folder, folder.replace(" ", "-"))

def ts_str(s):
    return json.dumps(s, ensure_ascii=False)

# Read inventory
rows = []
with open(INV, encoding="utf-8") as f:
    for r in csv.DictReader(f):
        rows.append(r)

processes = []
handbook = []
seen_slugs = set()

for r in rows:
    folder = r["folder"]
    title = r["title"]
    fid = r["fileId"]
    mime = r["mimeType"]
    size = r.get("size") or "0"
    if mime == FOLDER_MIME:
        continue
    if fid in SKIP_IDS or mime.startswith("image/"):
        continue
    if fid in HANDBOOK:
        h = dict(HANDBOOK[fid])
        h["driveFileId"] = fid
        h["sourceFolder"] = folder
        h["originalTitle"] = title
        h["mimeType"] = mime
        h["size"] = int(size) if size else 0
        handbook.append(h)
        continue

    code = parse_code(title, folder)
    hub = hub_for(code, folder, title)
    family = family_for(code, hub, title)
    roles = roles_for(code, hub, title)
    slug = slug_for(code, title, fid)
    n = 2
    base = slug
    while slug in seen_slugs:
        slug = f"{base}-{n}"
        n += 1
    seen_slugs.add(slug)

    if code and code in TITLES:
        titleBg, titleEn = TITLES[code]
    else:
        # fallback: strip extension and Obrazec prefix
        raw = re.sub(r"\.(docx?|xlsx?|pdf)$", "", title, flags=re.I)
        raw = re.sub(r"^(Образец|Obrazec|обр\.)\s*", "", raw, flags=re.I)
        titleBg = raw.strip(" -_")
        titleEn = titleBg
    descBg = f"Официална бланка от Drive ({folder}). Каталожен код: {code or '—'}. Официалният шаблон не се променя — порталът попълва данните."
    descEn = f"Official Drive blank ({folder}). Catalog code: {code or '—'}. Template stays unchanged; the portal fills the data."

    ext = ext_for(mime, title)
    fdir = folder_dir(folder)
    safe = slug
    template_rel = f"templates/official/{fdir}/{safe}{ext}" if ext else None

    processes.append({
        "slug": slug,
        "catalogCode": code,
        "hub": hub,
        "family": family,
        "wizardKind": wizard_kind(code, family),
        "titleBg": titleBg,
        "titleEn": titleEn,
        "descriptionBg": descBg,
        "descriptionEn": descEn,
        "rolesAllowed": roles,
        "driveFileId": fid,
        "sourceFolder": folder,
        "originalTitle": title,
        "mimeType": mime,
        "size": int(size) if size else 0,
        "templateRel": template_rel,
        "nomenclatura": NOM.get(hub),
        "hasPayment": has_payment(code, family, title),
        "hasLegal": has_legal(code, family, title),
    })

# sort: hub order then code
HUB_ORDER = ["training", "phd", "career", "load", "contracts", "mywork", "letters"]
def sort_key(p):
    ho = HUB_ORDER.index(p["hub"]) if p["hub"] in HUB_ORDER else 99
    return (ho, p.get("catalogCode") or "zz", p["slug"])
processes.sort(key=sort_key)

print(f"processes={len(processes)} handbook={len(handbook)}")
from collections import Counter
print("hubs", Counter(p["hub"] for p in processes))
print("codes missing", sum(1 for p in processes if not p["catalogCode"]))
for p in processes:
    print(f"  {p['catalogCode'] or '????':8} {p['hub']:10} {p['slug']:22} {p['titleBg'][:60]}")

# Write TypeScript
lines = []
lines.append("/** Auto-generated catalog of SU official blanks. Do not edit by hand — regenerate via scripts if inventory changes. */")
lines.append("")
lines.append("export type HubId =")
for h in HUB_ORDER:
    lines.append(f'  | "{h}"')
lines.append('  | "other";')
lines.append("")
lines.append("export const HUBS: { id: HubId; titleBg: string; titleEn: string; blurbBg: string; blurbEn: string }[] = [")
blurbs = {
    "training": ("Студентски заявления, договори за обучение, дубликати и помощи.", "Student petitions, study contracts, diploma copies and aid."),
    "phd": ("Зачисляване, журита, договори и изплащания по докторантура.", "Enrolment, juries, contracts and doctoral payments."),
    "career": ("Конкурси за академични длъжности и декларации на жури.", "Academic-position competitions and jury declarations."),
    "load": ("Натовареност, хонорари, норматив, базови учители, план-сметка.", "Load, honoraria, over-norm, base teachers, master's budget."),
    "contracts": ("Граждански договори, проекти, гости, извънреден труд, публикации.", "Civil contracts, projects, guests, overtime, publications."),
    "mywork": ("Отпуск, назначаване, преназначаване, декларация при постъпване.", "Leave, hire, reassignment, incoming-employee declaration."),
    "letters": ("Официална кореспонденция — входящи/изходящи и докладна.", "Official correspondence — incoming/outgoing and memos."),
}
for h in HUB_ORDER:
    bg, en = HUBS[h]
    bb, be = blurbs[h]
    lines.append(f'  {{ id: "{h}", titleBg: {ts_str(bg)}, titleEn: {ts_str(en)}, blurbBg: {ts_str(bb)}, blurbEn: {ts_str(be)} }},')
lines.append("];")
lines.append("")
lines.append("export type FieldType = \"text\" | \"textarea\" | \"date\" | \"number\" | \"email\" | \"select\" | \"checkbox\" | \"iban\" | \"loadLines\";")
lines.append("")
lines.append("export type CatalogField = {")
lines.append("  name: string;")
lines.append("  labelBg: string;")
lines.append("  labelEn: string;")
lines.append("  type: FieldType;")
lines.append("  required?: boolean;")
lines.append("  options?: { value: string; labelBg: string; labelEn: string }[];")
lines.append("};")
lines.append("")
lines.append('export type { RoutePhase, RouteStepDef } from "./processRoute";')
lines.append('export { routeFor, copyPackFor, mergeCaseRoute, parseRouteJson } from "./processRoute";')
lines.append("")
lines.append("export type CatalogProcess = {")
lines.append("  slug: string;")
lines.append("  catalogCode: string | null;")
lines.append("  hub: HubId;")
lines.append("  family: string;")
lines.append("  wizardKind: \"load-5-2\" | \"dynamic-load\" | \"dynamic\";")
lines.append("  titleBg: string;")
lines.append("  titleEn: string;")
lines.append("  descriptionBg: string;")
lines.append("  descriptionEn: string;")
lines.append("  rolesAllowed: string;")
lines.append("  driveFileId: string;")
lines.append("  sourceFolder: string;")
lines.append("  originalTitle: string;")
lines.append("  mimeType: string;")
lines.append("  size: number;")
lines.append("  templateRel: string | null;")
lines.append("  nomenclatura: string | null;")
lines.append("  hasPayment: boolean;")
lines.append("  hasLegal: boolean;")
lines.append("};")
lines.append("")
lines.append("export type HandbookItem = {")
lines.append("  slug: string;")
lines.append("  kind: string;")
lines.append("  titleBg: string;")
lines.append("  titleEn: string;")
lines.append("  summaryBg: string;")
lines.append("  summaryEn: string;")
lines.append("  driveFileId: string;")
lines.append("  sourceFolder: string;")
lines.append("  originalTitle: string;")
lines.append("  mimeType: string;")
lines.append("  size: number;")
lines.append("};")
lines.append("")
lines.append("export const CATALOG: CatalogProcess[] = [")
for p in processes:
    lines.append("  {")
    for k in ["slug","catalogCode","hub","family","wizardKind","titleBg","titleEn","descriptionBg","descriptionEn","rolesAllowed","driveFileId","sourceFolder","originalTitle","mimeType","templateRel","nomenclatura"]:
        v = p[k]
        if v is None:
            lines.append(f"    {k}: null,")
        elif isinstance(v, bool):
            lines.append(f"    {k}: {'true' if v else 'false'},")
        else:
            lines.append(f"    {k}: {ts_str(v)},")
    lines.append(f"    size: {p['size']},")
    lines.append(f"    hasPayment: {'true' if p['hasPayment'] else 'false'},")
    lines.append(f"    hasLegal: {'true' if p['hasLegal'] else 'false'},")
    lines.append("  },")
lines.append("];")
lines.append("")
lines.append("export const HANDBOOK: HandbookItem[] = [")
for h in handbook:
    lines.append("  {")
    for k in ["slug","kind","titleBg","titleEn","summaryBg","summaryEn","driveFileId","sourceFolder","originalTitle","mimeType"]:
        lines.append(f"    {k}: {ts_str(h[k])},")
    lines.append(f"    size: {h['size']},")
    lines.append("  },")
lines.append("];")
lines.append("")

# Field helpers and family schemas in TS
rest = r'''
const f = (
  name: string,
  labelBg: string,
  labelEn: string,
  type: FieldType = "text",
  required = true,
  options?: CatalogField["options"]
): CatalogField => ({ name, labelBg, labelEn, type, required, options });

const COMMON_PERSON: CatalogField[] = [
  f("fullName", "Име и фамилия", "Full name"),
  f("egn", "ЕГН / ЛНЧ", "Personal ID", "text", false),
  f("faculty", "Факултет", "Faculty"),
  f("department", "Катедра / програма", "Department / programme"),
];

const DATES: CatalogField[] = [
  f("dateFrom", "От дата", "From date", "date"),
  f("dateTo", "До дата", "To date", "date"),
];

const GROUNDS = f("grounds", "Основание / мотиви", "Grounds / motivation", "textarea");
const AMOUNT = f("amount", "Сума", "Amount", "number", false);
const IBAN = f("iban", "IBAN", "IBAN", "iban", false);
const FUNDING = f("fundingSource", "Източник на средства", "Source of funds");
const PERIOD = f("period", "Период", "Period");
const SUBJECT = f("subject", "Относно", "Subject");

export function fieldsFor(p: CatalogProcess): CatalogField[] {
  const extra: CatalogField[] = [];
  switch (p.family) {
    case "petition":
      extra.push(
        f("studentId", "Факултетен номер", "Student ID"),
        f("year", "Курс / година", "Year of study", "text", false),
        f("specialty", "Специалност", "Specialty"),
        ...DATES.map((x) => ({ ...x, required: false })),
        GROUNDS
      );
      if (p.catalogCode === "3.7" || p.hasPayment) extra.push(IBAN, AMOUNT, FUNDING);
      if (p.catalogCode === "3.5") {
        extra.push(
          f("pudGround", "Основание по ПУД чл. 165", "PUD art. 165 ground", "select", true, [
            { value: "illness", labelBg: "Заболяване", labelEn: "Illness" },
            { value: "childbirth", labelBg: "Раждане / отглеждане", labelEn: "Childbirth / childcare" },
            { value: "exams", labelBg: "Неположени изпити", labelEn: "Failed / pending exams" },
            { value: "abroad", labelBg: "Частично обучение в чужбина", labelEn: "Partial study abroad" },
            { value: "other", labelBg: "Друго", labelEn: "Other" },
          ])
        );
      }
      break;
    case "leave":
      extra.push(
        f("position", "Длъжност", "Position", "text", false),
        f("leaveType", "Вид отпуск", "Leave type", "select", true, [
          { value: "paid", labelBg: "Платен годишен", labelEn: "Paid annual" },
          { value: "unpaid", labelBg: "Неплатен", labelEn: "Unpaid" },
          { value: "creative", labelBg: "Творчески", labelEn: "Creative" },
          { value: "other", labelBg: "Друг", labelEn: "Other" },
        ]),
        ...DATES,
        GROUNDS,
        f("has110", "Имам договор по чл. 110 КТ (втори)", "I have a dual art. 110 contract", "checkbox", false)
      );
      break;
    case "hire":
      extra.push(
        f("position", "Длъжност", "Position"),
        ...DATES.map((x) => ({ ...x, required: false })),
        GROUNDS
      );
      break;
    case "declaration":
      extra.push(
        f("roleInCase", "Роля (член на жури / кандидат / служител)", "Role (jury / candidate / staff)"),
        f("contestOrFile", "Конкурс / преписка", "Contest / case", "text", false),
        f("declareTrue", "Декларирам верността на данните", "I declare the data is true", "checkbox"),
        GROUNDS
      );
      break;
    case "letter":
      extra.push(
        f("addressee", "Адресат", "Addressee"),
        f("addresseeTitle", "Длъжност на адресата", "Addressee title", "text", false),
        SUBJECT,
        f("yourRef", "На Ваш №", "Your ref. no.", "text", false),
        f("body", "Текст", "Body", "textarea"),
        f("attachments", "Приложения", "Attachments", "textarea", false)
      );
      break;
    case "load":
      extra.push(
        PERIOD,
        f("program", "Програма / специалност", "Programme"),
        FUNDING,
        AMOUNT,
        f("loadLines", "Редове натовареност", "Load lines", "loadLines", false)
      );
      break;
    case "pay":
    case "contract":
      extra.push(
        f("counterparty", "Контрагент / лице", "Counterparty / person", "text", false),
        PERIOD,
        FUNDING,
        AMOUNT,
        IBAN,
        GROUNDS
      );
      break;
    case "contest":
      extra.push(
        f("position", "Академична длъжност", "Academic position"),
        f("professionalField", "Професионално направление", "Professional field"),
        f("dvCitation", "ДВ / ежедневник (цитат)", "State Gazette / press citation", "text", false),
        f("fsExtract", "Протокол / препис-извлечение ФС", "Faculty council extract", "text", false),
        GROUNDS
      );
      break;
    case "phd":
      extra.push(
        f("candidateName", "Име на докторанта / кандидата", "Doctoral candidate name", "text", false),
        f("phdForm", "Форма", "Form", "select", false, [
          { value: "full", labelBg: "Редовна", labelEn: "Full-time" },
          { value: "part", labelBg: "Задочна", labelEn: "Part-time" },
          { value: "independent", labelBg: "Самостоятелна", labelEn: "Independent" },
        ]),
        f("professionalField", "Професионално направление", "Professional field", "text", false),
        f("supervisor", "Научен ръководител", "Supervisor", "text", false),
        GROUNDS
      );
      if (p.hasPayment) extra.push(FUNDING, AMOUNT);
      break;
    default:
      extra.push(PERIOD, GROUNDS);
      if (p.hasPayment) extra.push(FUNDING, AMOUNT, IBAN);
  }
  return [...COMMON_PERSON, ...extra];
}

export function catalogBySlug(slug: string): CatalogProcess | undefined {
  return CATALOG.find((p) => p.slug === slug);
}
'''
lines.append(rest)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("wrote", OUT, "bytes", os.path.getsize(OUT))
