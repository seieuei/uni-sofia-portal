export type HandbookBlock = {
  titleBg: string;
  titleEn: string;
  bodyBg: string[];
  bodyEn: string[];
};

/** Student handbook slice from students2.pdf — enrolment, fees 2026/27, payment. */
export const STUDENT_ENROLMENT_FEES: HandbookBlock[] = [
  {
    titleBg: "Записване — новоприети",
    titleEn: "Enrolment — newly admitted",
    bodyBg: [
      "Новоприетите студенти се записват съгласно заповед на Ректора.",
      "Необходимите документи за записване се закупуват от университетските книжарници. Записването може да става и от упълномощено лице.",
      "Студентските книжки се получават в първия учебен ден в съответната специалност.",
    ],
    bodyEn: [
      "Newly admitted students enrol according to a Rector’s order.",
      "Required enrolment documents are sold at the university bookshops. An authorised person may enrol on the student’s behalf.",
      "Student record books are issued on the first teaching day in the relevant programme.",
    ],
  },
  {
    titleBg: "Записване — по-горен курс",
    titleEn: "Enrolment — upper year",
    bodyBg: [
      "Записването в по-горен курс става след успешно полагане на всички изпити.",
      "Необходими документи: студентска книжка и квитанция за платена семестриална такса. Книжката задължително се подпечатва от филиалните библиотеки.",
    ],
    bodyEn: [
      "Upper-year enrolment requires all exams to have been passed.",
      "Required: student record book and proof of paid semester fee. The record book must be stamped by the branch libraries.",
    ],
  },
  {
    titleBg: "Годишни такси 2026/2027",
    titleEn: "Annual fees 2026/2027",
    bodyBg: [
      "Размерите на таксите се определят със заповеди на Ректора (вкл. РД-19-276/15.06.2026, РД-19-290/30.06.2026, РД-19-315/29.07.2026 и последващи изменения).",
      "Има отделни приложения за държавна поръчка, платено обучение бакалавър/магистър, новоприети и действащи магистри след друга ОКС, докторанти и чуждестранни студенти.",
      "Точните суми по специалност се публикуват в приложенията към заповедите на официалния сайт.",
    ],
    bodyEn: [
      "Fee amounts are set by Rector’s orders (incl. RD-19-276/15.06.2026, RD-19-290/30.06.2026, RD-19-315/29.07.2026 and later amendments).",
      "Separate annexes cover state-funded places, paid BA/MA study, newly admitted and continuing MA after another degree, doctoral and international students.",
      "Exact programme amounts are published in the order annexes on the official site.",
    ],
  },
  {
    titleBg: "Плащане чрез СУСИ / ePay",
    titleEn: "Payment via SUSI / ePay",
    bodyBg: [
      "Таксите могат да се платят през информационната система СУСИ с ePay/EasyPay (интернет или код за каса EasyPay).",
      "При това плащане отпада печатът за платена такса в книжката; следва записване в отдел „Студенти“.",
      "НЕ важи за студенти, новоприети от семестъра, за който се плаща — те ползват банков превод или друг обявен начин.",
      "Срокове зимен семестър 2026/27: задочно до 31.08.2026; редовно до 30.09.2026. Летен: задочно до 17.01.2027; редовно до 14.02.2027.",
    ],
    bodyEn: [
      "Fees can be paid via the SUSI information system using ePay/EasyPay (online or EasyPay cash-desk code).",
      "This removes the need for a paid-fee stamp in the record book; then enrol at Student Affairs.",
      "Does NOT apply to students newly admitted for the semester being paid — they use bank transfer or another announced method.",
      "Winter 2026/27 deadlines: part-time by 31 Aug 2026; full-time by 30 Sep 2026. Summer: part-time by 17 Jan 2027; full-time by 14 Feb 2027.",
    ],
  },
  {
    titleBg: "Банков превод",
    titleEn: "Bank transfer",
    bodyBg: [
      "БНБ — централно управление, за всички студенти.",
      "IBAN: BG52 BNBG 9661 3100 1743 01",
      "BIC: BNBGBGSD",
      "В нареждането задължително: три имена, ЕГН, специалност, факултет, форма и степен на обучение. Комисионната е за сметка на вносителя. БНБ не приема суми в брой.",
      "Отделни IBAN има за Физически факултет, ФХФ, ФМИ и Медицински факултет — виж официалното съобщение.",
    ],
    bodyEn: [
      "BNB — head office, for all students.",
      "IBAN: BG52 BNBG 9661 3100 1743 01",
      "BIC: BNBGBGSD",
      "The payment order must include full name, personal ID, programme, faculty, form and degree of study. Bank fees are paid by the remitter. BNB does not accept cash.",
      "Separate IBANs exist for Physics, Chemistry & Pharmacy, FMI and Medicine — see the official notice.",
    ],
  },
];
