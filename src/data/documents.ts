export interface DocumentItem {
  title: string;
  kind:
    | "Опросный лист"
    | "Габаритный чертеж"
    | "Выписка из реестра ЕАЭС"
    | "Декларация соответствия";
  file: string;
  preview: string;
  pages: number;
}

export const documents: DocumentItem[] = [
  {
    title: "Масляные трансформаторы до 35 кВ",
    kind: "Декларация соответствия",
    file: "docs/declaration-oil-transformers-35kv.pdf",
    preview: "images/documents/declaration-oil-transformers-35kv.webp",
    pages: 5,
  },
  {
    title: "Масляные трансформаторы до 110 кВ",
    kind: "Декларация соответствия",
    file: "docs/declaration-oil-transformers-110kv.pdf",
    preview: "images/documents/declaration-oil-transformers-110kv.webp",
    pages: 5,
  },
  {
    title: "Сухие трансформаторы",
    kind: "Декларация соответствия",
    file: "docs/declaration-dry-transformers.pdf",
    preview: "images/documents/declaration-dry-transformers.webp",
    pages: 6,
  },
  {
    title: "Трансформаторы ТМЗ",
    kind: "Декларация соответствия",
    file: "docs/declaration-tmz.pdf",
    preview: "images/documents/declaration-tmz.webp",
    pages: 5,
  },
  {
    title: "Комплектные трансформаторные подстанции",
    kind: "Декларация соответствия",
    file: "docs/declaration-substations.pdf",
    preview: "images/documents/declaration-substations.webp",
    pages: 5,
  },
  {
    title: "Трансформаторы напряжения",
    kind: "Декларация соответствия",
    file: "docs/declaration-voltage-transformers.pdf",
    preview: "images/documents/declaration-voltage-transformers.webp",
    pages: 5,
  },
  {
    title: "Разъединители",
    kind: "Декларация соответствия",
    file: "docs/declaration-disconnectors.pdf",
    preview: "images/documents/declaration-disconnectors.webp",
    pages: 5,
  },
  {
    title: "Однофазные масляные преобразовательные трансформаторы",
    kind: "Декларация соответствия",
    file: "docs/declaration-omp.pdf",
    preview: "images/documents/declaration-omp.webp",
    pages: 5,
  },
  {
    title: "ТМГ-250 производства ПЭТЗ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tmg-250-petz.pdf",
    preview: "images/documents/extract-tmg-250-petz.webp",
    pages: 1,
  },
  {
    title: "ТМГ-250 производства УТЗ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tmg-250-utz.pdf",
    preview: "images/documents/extract-tmg-250-utz.webp",
    pages: 1,
  },
  {
    title: "ТМГ-400 производства ПЭТЗ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tmg-400-petz.pdf",
    preview: "images/documents/extract-tmg-400-petz.webp",
    pages: 1,
  },
  {
    title: "ТМГ-400 производства УТЗ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tmg-400-utz.pdf",
    preview: "images/documents/extract-tmg-400-utz.webp",
    pages: 1,
  },
  {
    title: "ТМГ-630 производства ПЭТЗ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tmg-630-petz.pdf",
    preview: "images/documents/extract-tmg-630-petz.webp",
    pages: 1,
  },
  {
    title: "ТМГ-630 производства УТЗ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tmg-630-utz.pdf",
    preview: "images/documents/extract-tmg-630-utz.webp",
    pages: 1,
  },
  {
    title: "ТМГ-1000 производства ПЭТЗ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tmg-1000-petz.pdf",
    preview: "images/documents/extract-tmg-1000-petz.webp",
    pages: 1,
  },
  {
    title: "ТМГ-1000 производства УТЗ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tmg-1000-utz.pdf",
    preview: "images/documents/extract-tmg-1000-utz.webp",
    pages: 1,
  },
  {
    title: "ТДН-10000, 35 кВ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tdn-10000-35kv.pdf",
    preview: "images/documents/extract-tdn-10000-35kv.webp",
    pages: 1,
  },
  {
    title: "ТДН-16000, 35 кВ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tdn-16000-35kv.pdf",
    preview: "images/documents/extract-tdn-16000-35kv.webp",
    pages: 1,
  },
  {
    title: "ТМН-6300, 6–35 кВ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tmn-6300-6-35kv.pdf",
    preview: "images/documents/extract-tmn-6300-6-35kv.webp",
    pages: 1,
  },
  {
    title: "ТДТН-10000, 110–500 кВ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tdtn-10000-110-500kv.pdf",
    preview: "images/documents/extract-tdtn-10000-110-500kv.webp",
    pages: 1,
  },
  {
    title: "ТДТН-16000, 110–500 кВ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tdtn-16000-110-500kv.pdf",
    preview: "images/documents/extract-tdtn-16000-110-500kv.webp",
    pages: 1,
  },
  {
    title: "ТДТН-25000, 110–500 кВ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tdtn-25000-110-500kv.pdf",
    preview: "images/documents/extract-tdtn-25000-110-500kv.webp",
    pages: 1,
  },
  {
    title: "ТДТН-40000, 110–500 кВ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tdtn-40000-110-500kv.pdf",
    preview: "images/documents/extract-tdtn-40000-110-500kv.webp",
    pages: 1,
  },
  {
    title: "ТДТН-63000, 110–500 кВ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-tdtn-63000-110-500kv.pdf",
    preview: "images/documents/extract-tdtn-63000-110-500kv.webp",
    pages: 1,
  },
  {
    title: "ТРДН-63000, 110–500 кВ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-trdn-63000-110-500kv.pdf",
    preview: "images/documents/extract-trdn-63000-110-500kv.webp",
    pages: 1,
  },
  {
    title: "ТРДН-80000, 110–500 кВ",
    kind: "Выписка из реестра ЕАЭС",
    file: "docs/extract-trdn-80000-110-500kv.pdf",
    preview: "images/documents/extract-trdn-80000-110-500kv.webp",
    pages: 1,
  },
];

const questionnaireDocuments: DocumentItem[] = [
  {
    title: "Опросный лист ТМГ-400, 6(10)/0,4 кВ",
    kind: "Опросный лист",
    file: "docs/questionnaire-tmg-400.pdf",
    preview: "images/documents/questionnaire-tmg-400.webp",
    pages: 1,
  },
  {
    title: "Опросный лист ТМ-1000, 6(10)/0,4 кВ",
    kind: "Опросный лист",
    file: "docs/questionnaire-tm-1000.pdf",
    preview: "images/documents/questionnaire-tm-1000.webp",
    pages: 1,
  },
];

const dimensionalDrawingDocuments: DocumentItem[] = [
  {
    title: "Габаритный чертёж ТМГэ-2500",
    kind: "Габаритный чертеж",
    file: "docs/dimensional-drawing-tmge-2500.pdf",
    preview: "images/documents/dimensional-drawing-tmge-2500.webp",
    pages: 1,
  },
  {
    title: "Габаритный чертёж ТСЛЗ-1000, 6(10)/0,4 кВ",
    kind: "Габаритный чертеж",
    file: "docs/dimensional-drawing-tslz-1000.pdf",
    preview: "images/documents/dimensional-drawing-tslz-1000.webp",
    pages: 1,
  },
];

export const featuredDocuments: DocumentItem[] = [
  ...questionnaireDocuments,
  ...dimensionalDrawingDocuments,
  ...documents.filter((document) => document.kind === "Выписка из реестра ЕАЭС").slice(0, 2),
  ...documents.filter((document) => document.kind === "Декларация соответствия").slice(0, 2),
];
