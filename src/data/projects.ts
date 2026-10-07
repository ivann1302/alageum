interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ProjectSupply {
  model: string;
  details: string;
  quantity: number;
}

interface Project {
  customer: string;
  supplies: ProjectSupply[];
  images: ProjectImage[];
}

// Source: «Для Сайта/Таблица реализованных проектов.xlsx», rows 3–12.
// The merged customer cell A5:A8 assigns all four supply rows to Электротехмонтаж.
const photos: Record<number, ProjectImage> = {
  1: { src: "images/projects/photo-01.webp", alt: "Трансформатор ТДНС-16000 на площадке подстанции", width: 1600, height: 1205 },
  2: { src: "images/projects/photo-02.webp", alt: "Трансформатор серии ТМН / ТМ-6300 на подстанции, вид спереди", width: 1440, height: 1920 },
  3: { src: "images/projects/photo-03.webp", alt: "Трансформатор серии ТМН / ТМ-6300 на подстанции, вид сбоку", width: 1920, height: 1440 },
  4: { src: "images/projects/photo-04.webp", alt: "Трансформатор серии ТМН / ТМ-6300 на площадке подстанции", width: 1920, height: 1440 },
  5: { src: "images/projects/photo-05.webp", alt: "Трансформатор серии ТМН / ТМ-6300 в производственном цехе", width: 1440, height: 1920 },
  6: { src: "images/projects/photo-06.webp", alt: "Трансформатор серии ТМН / ТМ-6300 в цехе, вид сбоку", width: 1440, height: 1920 },
  7: { src: "images/projects/photo-07.webp", alt: "Трансформатор ТМН-4000 в производственном цехе, вид спереди", width: 1440, height: 1920 },
  8: { src: "images/projects/photo-08.webp", alt: "Трансформатор ТМН-4000 в цехе, вид со стороны расширительного бака", width: 1440, height: 1920 },
  9: { src: "images/projects/photo-09.webp", alt: "Трансформатор ТМН-4000 в производственном цехе, вид сбоку", width: 1920, height: 1440 },
  10: { src: "images/projects/photo-10.webp", alt: "Трансформатор ТРДН-80000/220 кВ в заводском цехе", width: 960, height: 1280 },
  11: { src: "images/projects/photo-11.webp", alt: "Трансформатор ТРДН-80000/110-ХЛ1 в заводском цехе", width: 1280, height: 549 },
};

const tmn4000Photos = [photos[7], photos[8], photos[9]];
const tm6300Photos = [photos[2], photos[3], photos[4], photos[5], photos[6]];

export const projects: Project[] = [
  {
    customer: "ООО «Грачевка»",
    supplies: [{
      model: "ТМН-4000/35-11 кВ",
      details: "У1, У/Д-11, алюминиевые обмотки, РПН производства Хуаминг.",
      quantity: 1,
    }],
    images: tmn4000Photos,
  },
  {
    customer: "ОАО «СЗЛ»",
    supplies: [{
      model: "ТМН-4000/35-6,3 кВ",
      details: "У1, У/Д-11, алюминиевые обмотки, РПН производства Хуаминг, ШМР.",
      quantity: 2,
    }],
    images: tmn4000Photos,
  },
  {
    customer: "ТД Электротехмонтаж АО",
    supplies: [
      {
        model: "ТМН-4000/35-6,3 кВ",
        details: "У1, У/Д-11, алюминиевые обмотки, РПН производства Хуаминг, ШМР.",
        quantity: 1,
      },
      {
        model: "ТМН-4000/35-11 кВ",
        details: "У1, У/Д-11, алюминиевые обмотки, РПН производства Хуаминг.",
        quantity: 1,
      },
      {
        model: "ТМН-4000/35-6,3 кВ",
        details: "У1, У/Д-11, алюминиевые обмотки, РПН производства Хуаминг, ШМР.",
        quantity: 4,
      },
      {
        model: "ТРДН-80000/220 кВ",
        details: "Согласно опросному листу ТОО «Азия Трафо» (РК), с ШМР.",
        quantity: 1,
      },
    ],
    images: [...tmn4000Photos, photos[10]],
  },
  {
    customer: "ООО «ТЭС Инжиниринг»",
    supplies: [{
      model: "ТМН-6300/35-10 кВ",
      details: "У1, У/Д-11, алюминиевые обмотки (Al/Al).",
      quantity: 2,
    }],
    images: tm6300Photos,
  },
  {
    customer: "ООО «ТЭС»",
    supplies: [{
      model: "ТМ-6300/35-6,3 кВ",
      details: "У1, У/Д-11, алюминиевые обмотки.",
      quantity: 1,
    }],
    images: tm6300Photos,
  },
  {
    customer: "ООО «ФК Групп»",
    supplies: [{
      model: "ТРДН-80000/110-ХЛ1",
      details: "По опросному листу «КПЭИ-005-1_22-1-040-ЭП.ОЛ.1».",
      quantity: 1,
    }],
    images: [photos[11]],
  },
  {
    customer: "МУП «Борисоглебская горэлектросеть»",
    supplies: [{
      model: "ТДНС-16000/36,75-6,3 кВ",
      details: "У1, Ун/Д-11, алюминиевые обмотки, РПН производства Хуаминг, ШМР.",
      quantity: 1,
    }],
    images: [photos[1]],
  },
];
