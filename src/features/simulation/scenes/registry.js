import MarinaBeach from './MarinaBeach.jsx';
import NungambakkamCafe from './NungambakkamCafe.jsx';
import OMRTechPark from './OMRTechPark.jsx';
import TNagarStreet from './TNagarStreet.jsx';
import MylaporeTemple from './MylaporeTemple.jsx';
import AdyarTheosophical from './AdyarTheosophical.jsx';
import BesantNagarSunset from './BesantNagarSunset.jsx';
import ChennaiCentralStation from './ChennaiCentralStation.jsx';
import AnnaNagarTower from './AnnaNagarTower.jsx';
import ValluvarKottam from './ValluvarKottam.jsx';
import ECRCoastalRoad from './ECRCoastalRoad.jsx';
import GenericOffice from './GenericOffice.jsx';
import GenericHomeReflection from './GenericHomeReflection.jsx';
import QuietWindowReflection from './QuietWindowReflection.jsx';
import KoyambeduMarket from './KoyambeduMarket.jsx';
import FortStGeorge from './FortStGeorge.jsx';
import IITMResearchPark from './IITMResearchPark.jsx';
import MahabalipuramShoreTemple from './MahabalipuramShoreTemple.jsx';
import BoardroomPitch from './BoardroomPitch.jsx';
import MonsoonStreet from './MonsoonStreet.jsx';
import MetroTrainInterior from './MetroTrainInterior.jsx';
import RooftopNightView from './RooftopNightView.jsx';
import CoworkingSpace from './CoworkingSpace.jsx';
import SunriseOverBay from './SunriseOverBay.jsx';

// Registry of hand-built, animated Chennai scene templates.
// `tags` mirror the `tags` column on chennai_areas so the story-generation
// prompt (and, if needed, future auto-matching) can line a slide's
// retrieved location up with the closest visual template.
// `areaMatch` lists chennai_areas.name values this template visually represents.
export const SCENE_TEMPLATES = {
  marina_beach: {
    component: MarinaBeach,
    tags: ['beach', 'iconic', 'dawn', 'perspective'],
    areaMatch: ['Marina Beach', 'Marina Lighthouse']
  },
  nungambakkam_cafe: {
    component: NungambakkamCafe,
    tags: ['cafe', 'creative', 'meetings', 'entrepreneurial', 'cosmopolitan'],
    areaMatch: ['Nungambakkam', 'Amethyst Café, Nungambakkam', 'Khader Nawaz Khan Road']
  },
  omr_tech_park: {
    component: OMRTechPark,
    tags: ['it', 'tech', 'startup', 'growth', 'corporate'],
    areaMatch: ['OMR (Old Mahabalipuram Road)', 'Tidel Park', 'Olympia Tech Park, Guindy', 'RMZ Millenia / Perungudi IT belt']
  },
  t_nagar_street: {
    component: TNagarStreet,
    tags: ['commercial', 'business', 'shopping', 'bustling', 'market'],
    areaMatch: ['T. Nagar', 'Pondy Bazaar (Ranganathan Street)', 'Usman Road']
  },
  mylapore_temple: {
    component: MylaporeTemple,
    tags: ['spiritual', 'ancient', 'cultural', 'traditional', 'historic'],
    areaMatch: ['Mylapore', 'Kapaleeshwarar Temple', 'Sannathi Street, Mylapore']
  },
  adyar_theosophical: {
    component: AdyarTheosophical,
    tags: ['peace', 'wisdom', 'nature', 'intellectual', 'peaceful'],
    areaMatch: ['Adyar', 'Theosophical Society, Adyar']
  },
  besant_nagar_sunset: {
    component: BesantNagarSunset,
    tags: ['beach', 'peaceful', 'romantic', 'sunset', 'relaxed'],
    areaMatch: ["Besant Nagar", "Elliot's Beach", 'Thiruvanmiyur']
  },
  chennai_central_station: {
    component: ChennaiCentralStation,
    tags: ['transport', 'historic', 'transition', 'interchange'],
    areaMatch: ['Chennai Central Railway Station', 'Chennai Central Metro Station', 'Egmore']
  },
  anna_nagar_tower: {
    component: AnnaNagarTower,
    tags: ['residential', 'startup', 'premium', 'family', 'landmark'],
    areaMatch: ['Anna Nagar', 'Anna Nagar Tower', 'Anna Nagar Tower Park']
  },
  valluvar_kottam: {
    component: ValluvarKottam,
    tags: ['cultural', 'outdoor', 'romantic', 'peaceful'],
    areaMatch: ['Valluvar Kottam']
  },
  ecr_coastal_road: {
    component: ECRCoastalRoad,
    tags: ['road', 'scenic', 'freedom', 'drive'],
    areaMatch: ['ECR (East Coast Road)', 'Muttukadu Boat House']
  },
  generic_office: {
    component: GenericOffice,
    tags: ['it', 'corporate', 'startup', 'growth', 'business'],
    areaMatch: []
  },
  generic_home: {
    component: GenericHomeReflection,
    tags: ['peaceful', 'reflective', 'residential'],
    areaMatch: []
  },
  generic_reflection: {
    component: QuietWindowReflection,
    tags: ['peaceful', 'reflective', 'solitude', 'introspective'],
    areaMatch: []
  },
  koyambedu_market: {
    component: KoyambeduMarket,
    tags: ['market', 'bustling', 'wholesale'],
    areaMatch: ['Koyambedu Wholesale Market']
  },
  fort_st_george: {
    component: FortStGeorge,
    tags: ['historic', 'government', 'cultural'],
    areaMatch: ['Fort St. George']
  },
  iitm_research_park: {
    component: IITMResearchPark,
    tags: ['startup', 'incubator', 'tech', 'serious', 'deeptech'],
    areaMatch: ['IIT Madras Research Park', 'Indian Institute of Technology Madras (main campus)', 'Guindy National Park']
  },
  mahabalipuram_shore_temple: {
    component: MahabalipuramShoreTemple,
    tags: ['historic', 'ancient', 'beach', 'cultural'],
    areaMatch: ['Mahabalipuram (Mamallapuram) Shore Temple']
  },
  boardroom_pitch: {
    component: BoardroomPitch,
    tags: ['pitch', 'investor', 'meeting', 'high-stakes'],
    areaMatch: []
  },
  monsoon_street: {
    component: MonsoonStreet,
    tags: ['rain', 'dramatic', 'transition', 'street'],
    areaMatch: []
  },
  metro_train_interior: {
    component: MetroTrainInterior,
    tags: ['transit', 'transition', 'momentum', 'urban'],
    areaMatch: ['Chennai Central Metro Station', 'Alandur Metro Station', 'CMBT Metro Station']
  },
  rooftop_night_view: {
    component: RooftopNightView,
    tags: ['night', 'reflective', 'skyline', 'solitude'],
    areaMatch: []
  },
  coworking_space: {
    component: CoworkingSpace,
    tags: ['startup', 'team', 'work', 'growth'],
    areaMatch: ['IIT Madras Research Park', 'Tidel Park']
  },
  sunrise_over_bay: {
    component: SunriseOverBay,
    tags: ['dawn', 'establishing', 'hope', 'wide'],
    areaMatch: ['Marina Beach', 'Mahabalipuram (Mamallapuram) Shore Temple']
  }
};

export const DEFAULT_SCENE_TEMPLATE = 'generic_reflection';

/** Flat list of {id, tags} for embedding into the story-generation prompt. */
export function getTemplateList() {
  return Object.entries(SCENE_TEMPLATES).map(([id, t]) => ({ id, tags: t.tags }));
}

/** Safe lookup — always returns a valid component, never undefined. */
export function getSceneComponent(templateId) {
  return (SCENE_TEMPLATES[templateId] || SCENE_TEMPLATES[DEFAULT_SCENE_TEMPLATE]).component;
}
