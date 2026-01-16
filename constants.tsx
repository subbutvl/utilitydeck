
import React from 'react';
import { Tool, Category } from './types';
import { JsonFormatter } from './modules/dev/JsonFormatter';
import { ShadowGenerator } from './modules/dev/ShadowGenerator';
import { GradientGenerator } from './modules/dev/GradientGenerator';
import { FlexboxGenerator } from './modules/dev/FlexboxGenerator';
import { GridGenerator } from './modules/dev/GridGenerator';
import { SubGridGenerator } from './modules/dev/SubGridGenerator';
import { ButtonGenerator } from './modules/dev/ButtonGenerator';
import { CheckboxGenerator } from './modules/dev/CheckboxGenerator';
import { RadioButtonGenerator } from './modules/dev/RadioButtonGenerator';
import { SwitchGenerator } from './modules/dev/SwitchGenerator';
import { FormGenerator } from './modules/dev/FormGenerator';
import { CursorList } from './modules/dev/CursorList';
import { EntitiesList } from './modules/dev/EntitiesList';
import { PatternsGenerator } from './modules/dev/PatternsGenerator';

// Design Tools
import { PaletteGenerator } from './modules/design/PaletteGenerator';
import { ColorRangeGenerator } from './modules/design/ColorRangeGenerator';
import { ColorList } from './modules/design/ColorList';
import { ContrastChecker } from './modules/design/ContrastChecker';
import { VisionSimulator } from './modules/design/VisionSimulator';
import { ColorModeConverter } from './modules/design/ColorModeConverter';
import { ColorMixer } from './modules/design/ColorMixer';
import { PantoneHistory } from './modules/design/PantoneHistory';
import { HtmlColorNames } from './modules/design/HtmlColorNames';
import { ColorFinder } from './modules/design/ColorFinder';
import { ColorExtractor } from './modules/design/ColorExtractor';

// Text Tools
import { CaseConverter } from './modules/text/CaseConverter';
import { PasswordGenerator } from './modules/utils/PasswordGenerator';
import { Counter } from './modules/text/Counter';
import { WhitespaceRemover } from './modules/text/WhitespaceRemover';
import { FontPairFinder } from './modules/text/FontPairFinder';
import { StringSplitter } from './modules/text/StringSplitter';
import { LoremIpsum } from './modules/text/LoremIpsum';
import { BionicReading } from './modules/text/BionicReading';
import { HandwritingConverter } from './modules/text/HandwritingConverter';

// Utilities
import { Base64Tool } from './modules/utils/Base64Tool';
import { HtmlEntityTool } from './modules/utils/HtmlEntityTool';
import { UrlTool } from './modules/utils/UrlTool';
import { HashTool } from './modules/utils/HashTool';
import { UuidGenerator } from './modules/utils/UuidGenerator';

// Daily Pulse Modules
import { WorldClock } from './modules/worldclock/WorldClock';
import { CurrencyConverter } from './modules/worldclock/CurrencyConverter';
import { WeatherForecaster } from './modules/worldclock/WeatherForecaster';
import { QuotesGenerator } from './modules/worldclock/QuotesGenerator';
import { MovieRecommendation } from './modules/worldclock/MovieRecommendation';
import { TvShowRecommendation } from './modules/worldclock/TvShowRecommendation';
import { BookRecommendation } from './modules/worldclock/BookRecommendation';
import { SongRecommendation } from './modules/worldclock/SongRecommendation';
import { PlaceRecommendation } from './modules/worldclock/PlaceRecommendation';
import { PowerfulPeople } from './modules/worldclock/PowerfulPeople';
import { RandomFacts } from './modules/worldclock/RandomFacts';
import { PlantHub } from './modules/worldclock/PlantHub';
import { BirdHub } from './modules/worldclock/BirdHub';
import { AnimalHub } from './modules/worldclock/AnimalHub';
import { SpaceHub } from './modules/worldclock/SpaceHub';
import { WordHub } from './modules/worldclock/WordHub';
import { TirukuralHub } from './modules/worldclock/TirukuralHub';

// Calendar Module
import { Calendar } from './modules/calendar/Calendar';

// Social Modules
import { YoutubeThumbnail } from './modules/social/YoutubeThumbnail';
import { YoutubeTitleGen } from './modules/social/YoutubeTitleGen';
import { YoutubeViralStrategy } from './modules/social/YoutubeViralStrategy';
import { InstagramGen } from './modules/social/InstagramGen';
import { TweetGen } from './modules/social/TweetGen';
import { FacebookGen } from './modules/social/FacebookGen';
import { DesignPortfolioGen } from './modules/social/DesignPortfolioGen';

// Unit Converters
import { LengthConverter } from './modules/converters/LengthConverter';
import { WeightConverter } from './modules/converters/WeightConverter';
import { TemperatureConverter } from './modules/converters/TemperatureConverter';
import { AreaConverter } from './modules/converters/AreaConverter';
import { VolumeConverter } from './modules/converters/VolumeConverter';
import { TimeConverter } from './modules/converters/TimeConverter';
import { EnergyConverter } from './modules/converters/EnergyConverter';
import { SpeedConverter } from './modules/converters/SpeedConverter';
import { PressureConverter } from './modules/converters/PressureConverter';
import { PowerConverter } from './modules/converters/PowerConverter';
import { AngleConverter } from './modules/converters/AngleConverter';
import { FuelConverter } from './modules/converters/FuelConverter';
import { DataConverter } from './modules/converters/DataConverter';
import { UnitSystemsInfo } from './modules/converters/UnitSystemsInfo';

// Theme Generators
import { BootstrapThemeBuilder } from './modules/themes/BootstrapThemeBuilder';
import { TailwindThemeBuilder } from './modules/themes/TailwindThemeBuilder';
import { ShadcnThemeBuilder } from './modules/themes/ShadcnThemeBuilder';
import { PrimengThemeBuilder } from './modules/themes/PrimengThemeBuilder';

// Image Tools
import { ImageStudio } from './modules/images/ImageStudio';
import { SvgStudio } from './modules/images/SvgStudio';
import { BulkImageConverter } from './modules/images/BulkImageConverter';
import { BulkAudioConverter } from './modules/images/BulkAudioConverter';
import { BulkVideoConverter } from './modules/images/BulkVideoConverter';

// Photography Tools
import { TimelapseCalculator } from './modules/photography/TimelapseCalculator';
import { Rule500Calculator as Astro500 } from './modules/photography/Rule500Calculator';
import { DoFCalculator } from './modules/photography/DoFCalculator';
import { AdvancedDoFCalculator } from './modules/photography/AdvancedDoFCalculator';
import { MacroDoFCalculator } from './modules/photography/MacroDoFCalculator';
import { DoFTable } from './modules/photography/DoFTable';
import { HyperfocalTable } from './modules/photography/HyperfocalTable';
import { CoCCalculator } from './modules/photography/CoCCalculator';
import { DiffractionCalculator } from './modules/photography/DiffractionCalculator';
import { MacroDiffractionCalculator } from './modules/photography/MacroDiffractionCalculator';
import { PhotographyTips } from './modules/photography/PhotographyTips';

// Curated Resources
import { CuratedResources } from './modules/resources/CuratedResources';
import { RssReader } from './modules/resources/RssReader';

// Icons
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconCode = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const IconBox = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const IconLayout = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const IconGrid = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3"/><rect width="7" height="7" x="14" y="3"/><rect width="7" height="7" x="14" y="14"/><rect width="7" height="7" x="3" y="14"/></svg>;
const IconText = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>;
const IconTool = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconScale = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/></svg>;
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const IconCamera = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
const IconTimer = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>;
const IconTarget = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IconBookmark = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>;
const IconQuote = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>;
const IconRss = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>;
const IconFilm = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M17 3v18"/><path d="M3 7h4"/><path d="M3 12h4"/><path d="M3 17h4"/><path d="M17 7h4"/><path d="M17 12h4"/><path d="M17 17h4"/></svg>;
const IconTv = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>;
const IconBook = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IconMusic = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
const IconMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconInfo = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>;
const IconLeaf = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8-.5 2.2-2 4.2-4.5 5.5L11 20z"/><path d="M11 20c.5-5.5 2-8 5-10"/></svg>;
const IconBird = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7c-1.5 0-3-1-4.5-2a4.66 4.66 0 0 0-6.06 1.15c-.45.54-.51 1.25-.13 1.84.44.66.71 1.43.78 2.22l.14 1.5c.12 1.25.53 2.45 1.2 3.53l.36.57c.56.88 1.55 1.41 2.61 1.4h3.6c.92 0 1.8-.4 2.4-1.1l2.4-2.8a4.13 4.13 0 0 0 1.05-3.04c-.11-1.3-.87-2.45-1.99-3.11l-1.05-.62A3.26 3.26 0 0 0 16 7z"/><path d="m11 13 4-2"/></svg>;
const IconAnimal = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z"/><path d="M15 13a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z"/><path d="M7 13a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z"/><path d="M9.1 21a1 1 0 0 1-.8-.4l-1.9-2.3c-.6-.7-.9-1.5-.9-2.4v-4.1a2 2 0 0 1 .6-1.4l2.5-2.5c.4-.4 1-.6 1.5-.6h3.8c.5 0 1.1.2 1.5.6l2.5 2.5a2 2 0 0 1 .6 1.4v4.1c0 .9-.3 1.7-.9 2.4l-1.9 2.3a1 1 0 0 1-.8.4H9.1Z"/></svg>;
const IconMoon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
const IconType = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>;
const IconWisdom = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"/><path d="M12 7v5l3 3"/></svg>;

export const TOOLS: Tool[] = [
  // Curated Resources (Highlighted diff color in Layout)
  {
    id: 'curated-resources',
    name: 'Curated Assets',
    description: 'Expert-picked tools, design resources, and development kits powered by the system database.',
    category: 'Curated Resources',
    icon: <IconBookmark />,
    component: CuratedResources,
  },
  {
    id: 'rss-reader',
    name: 'RSS Intelligence',
    description: 'Real-time global news aggregator for tech, design, and entertainment professionals.',
    category: 'Curated Resources',
    icon: <IconRss />,
    component: RssReader,
  },

  // Photography
  {
    id: 'photo-dof',
    name: 'DoF Calculator',
    description: 'Calculate depth of field, near/far limits, and hyperfocal distance.',
    category: 'Photography',
    icon: <IconTarget />,
    component: DoFCalculator,
  },
  {
    id: 'photo-dof-adv',
    name: 'Advanced DoF',
    description: 'Detailed DoF analysis with bokeh blur circle size estimation.',
    category: 'Photography',
    icon: <IconTarget />,
    component: AdvancedDoFCalculator,
  },
  {
    id: 'photo-dof-macro',
    name: 'Macro DoF',
    description: 'Specialized DoF tool for extreme close-up and macro photography.',
    category: 'Photography',
    icon: <IconTarget />,
    component: MacroDoFCalculator,
  },
  {
    id: 'photo-timelapse',
    name: 'Timelapse Maker',
    description: 'Calculate event duration, frames needed, and resulting video length.',
    category: 'Photography',
    icon: <IconTimer />,
    component: TimelapseCalculator,
  },
  {
    id: 'photo-500-rule',
    name: '500 Rule (Astro)',
    description: 'Determine maximum shutter speed to prevent star trailing.',
    category: 'Photography',
    icon: <IconSparkles />,
    component: Astro500,
  },
  {
    id: 'photo-dof-table',
    name: 'DoF Table',
    description: 'Generate a reference grid for DoF at various distances and apertures.',
    category: 'Photography',
    icon: <IconGrid />,
    component: DoFTable,
  },
  {
    id: 'photo-hyperfocal',
    name: 'Hyperfocal Table',
    description: 'Reference table for hyperfocal points across focal lengths.',
    category: 'Photography',
    icon: <IconGrid />,
    component: HyperfocalTable,
  },
  {
    id: 'photo-coc',
    name: 'CoC Calculator',
    description: 'Calculate Circle of Confusion for any sensor or print size.',
    category: 'Photography',
    icon: <IconTarget />,
    component: CoCCalculator,
  },
  {
    id: 'photo-diffraction',
    name: 'Diffraction Limit',
    description: 'Calculate the aperture where diffraction begins to soften images.',
    category: 'Photography',
    icon: <IconTarget />,
    component: DiffractionCalculator,
  },
  {
    id: 'photo-diffraction-macro',
    name: 'Macro Diffraction',
    description: 'Diffraction limit analysis accounting for magnification bellows factor.',
    category: 'Photography',
    icon: <IconTarget />,
    component: MacroDiffractionCalculator,
  },
  {
    id: 'photo-tips-bird',
    name: 'Bird Photography Tips',
    description: 'AI-powered coaching for wildlife and avian photography.',
    category: 'Photography',
    icon: <IconSparkles />,
    component: () => <PhotographyTips type="bird" />,
  },
  {
    id: 'photo-tips-astro',
    name: 'Astro-Coaching',
    description: 'Advanced AI tips for night sky and celestial imaging.',
    category: 'Photography',
    icon: <IconSparkles />,
    component: () => <PhotographyTips type="astro" />,
  },
  {
    id: 'photo-tips-gen',
    name: 'Pro-Photo Tips',
    description: 'Comprehensive photography advice and AI-driven creative ideas.',
    category: 'Photography',
    icon: <IconSparkles />,
    component: () => <PhotographyTips type="general" />,
  },

  // Daily Pulse (Grouped)
  {
    id: 'world-clock',
    name: 'Global Monitor',
    description: 'Real-time global clock dashboard with analog/digital views and day-night logic.',
    category: 'Daily Pulse',
    icon: <IconClock />,
    component: WorldClock,
  },
  {
    id: 'global-calendar',
    name: 'Unified Calendar',
    description: 'Yearly view with integrated India/US federal holiday tracking and regional toggles.',
    category: 'Daily Pulse',
    icon: <IconCalendar />,
    component: Calendar,
  },
  {
    id: 'quotes-gen',
    name: 'Quotes Generator (AI Opt)',
    description: 'Discover wisdom through random curated quotes or generate fresh perspectives using AI.',
    category: 'Daily Pulse',
    icon: <IconQuote />,
    component: QuotesGenerator,
  },
  {
    id: 'movie-rec',
    name: 'Movie Hub (AI Opt)',
    description: 'Get curated cinema recommendations or let AI find your next favorite film.',
    category: 'Daily Pulse',
    icon: <IconFilm />,
    component: MovieRecommendation,
  },
  {
    id: 'tv-rec',
    name: 'TV Show Hub (AI Opt)',
    description: 'Discover trending series across all streaming platforms with AI insights.',
    category: 'Daily Pulse',
    icon: <IconTv />,
    component: TvShowRecommendation,
  },
  {
    id: 'book-rec',
    name: 'Book Hub (AI Opt)',
    description: 'Explore timeless classics and modern bestsellers curated for your reading lists.',
    category: 'Daily Pulse',
    icon: <IconBook />,
    component: BookRecommendation,
  },
  {
    id: 'song-rec',
    name: 'Song Hub (AI Opt)',
    description: 'Find your next anthem through expertly picked tracks or AI mood matching.',
    category: 'Daily Pulse',
    icon: <IconMusic />,
    component: SongRecommendation,
  },
  {
    id: 'place-rec',
    name: 'Travel Hub (AI Opt)',
    description: 'Discover breathtaking locations and hidden gems around the globe.',
    category: 'Daily Pulse',
    icon: <IconMapPin />,
    component: PlaceRecommendation,
  },
  {
    id: 'people-hub',
    name: 'Impactful Minds (AI Opt)',
    description: 'Biographies and wisdom from the world\'s most powerful and influential people.',
    category: 'Daily Pulse',
    icon: <IconUsers />,
    component: PowerfulPeople,
  },
  {
    id: 'fact-hub',
    name: 'Fact Vault (AI Opt)',
    description: 'Expand your knowledge with mind-bending facts and trivia.',
    category: 'Daily Pulse',
    icon: <IconInfo />,
    component: RandomFacts,
  },
  {
    id: 'plant-hub',
    name: 'Botanical Lab (AI Opt)',
    description: 'Explore diverse flora and plant species from around the world.',
    category: 'Daily Pulse',
    icon: <IconLeaf />,
    component: PlantHub,
  },
  {
    id: 'bird-hub',
    name: 'Avian Explorer (AI Opt)',
    description: 'Discover unique bird species and their natural habitats.',
    category: 'Daily Pulse',
    icon: <IconBird />,
    component: BirdHub,
  },
  {
    id: 'animal-hub',
    name: 'Wildlife Tracker (AI Opt)',
    description: 'In-depth look at creatures across the globe, from savanna to sea.',
    category: 'Daily Pulse',
    icon: <IconAnimal />,
    component: AnimalHub,
  },
  {
    id: 'space-hub',
    name: 'Cosmic Voyager (AI Opt)',
    description: 'Explore planets, stars, and the latest in space exploration.',
    category: 'Daily Pulse',
    icon: <IconMoon />,
    component: SpaceHub,
  },
  {
    id: 'word-hub',
    name: 'Lexical Forge (AI Opt)',
    description: 'Discover obscure words, definitions, and their linguistic origins.',
    category: 'Daily Pulse',
    icon: <IconType />,
    component: WordHub,
  },
  {
    id: 'kural-hub',
    name: 'Kural Wisdom (AI Opt)',
    description: 'Ancient ethical teachings from the Tirukural with modern translations.',
    category: 'Daily Pulse',
    icon: <IconWisdom />,
    component: TirukuralHub,
  },
  {
    id: 'currency-conv',
    name: 'Currency Converter (AI Opt)',
    description: 'Convert between world currencies with live rates and AI-powered market sentiment analysis.',
    category: 'Daily Pulse',
    icon: <IconTool />,
    component: CurrencyConverter,
  },
  {
    id: 'weather-forecaster',
    name: 'Weather Forecaster (AI Opt)',
    description: 'Current weather and 7-day forecast for any city with AI-powered travel and outfit advice.',
    category: 'Daily Pulse',
    icon: <IconTimer />,
    component: WeatherForecaster,
  },

  // Image Tools
  {
    id: 'img-studio',
    name: 'Image Studio (AI)',
    description: 'Full-featured image editor with AI generative tools, watermarking, and aspect ratio controls.',
    category: 'Image Tools',
    icon: <IconSparkles />,
    component: ImageStudio,
  },
  {
    id: 'svg-studio',
    name: 'SVG Studio',
    description: 'SVG inspector, code viewer and visual previewer.',
    category: 'Image Tools',
    icon: <IconCode />,
    component: SvgStudio,
  },
  {
    id: 'bulk-img-conv',
    name: 'Bulk Image Converter',
    description: 'Convert groups of images between PNG, JPG, and WebP instantly.',
    category: 'Image Tools',
    icon: <IconCamera />,
    component: BulkImageConverter,
  },
  {
    id: 'bulk-audio-conv',
    name: 'Bulk Audio Converter',
    description: 'Local audio file conversion between common web formats.',
    category: 'Image Tools',
    icon: <IconTool />,
    component: BulkAudioConverter,
  },
  {
    id: 'bulk-video-conv',
    name: 'Bulk Video Converter',
    description: 'Batch video processing and transcoding (Coming Soon).',
    category: 'Image Tools',
    icon: <IconTimer />,
    component: BulkVideoConverter,
  },

  // Design Tools
  {
    id: 'color-finder',
    name: 'Image Color Finder',
    description: 'Detect Average, RMS, and Dominant colors from any uploaded image.',
    category: 'Design Tools',
    icon: <IconCamera />,
    component: ColorFinder,
  },
  {
    id: 'color-extractor',
    name: 'Palette Extractor',
    description: 'Extract a cohesive 5-color palette from images using cluster analysis.',
    category: 'Design Tools',
    icon: <IconSparkles />,
    component: ColorExtractor,
  },
  {
    id: 'palette-gen',
    name: 'Palette Generator',
    description: 'Generate beautiful 5-color palettes with randomization and locking.',
    category: 'Design Tools',
    icon: <IconSparkles />,
    component: PaletteGenerator,
  },
  {
    id: 'pantone-history',
    name: 'Pantone History',
    description: 'Archive of Pantone Colors of the Year (1976-2026).',
    category: 'Design Tools',
    icon: <IconClock />,
    component: PantoneHistory,
  },
  {
    id: 'html-color-names',
    name: 'HTML Color Names',
    description: 'Reference of all 140 W3C standardized CSS color names.',
    category: 'Design Tools',
    icon: <IconCode />,
    component: HtmlColorNames,
  },
  {
    id: 'color-range',
    name: 'Color Range Generator',
    description: 'Create harmonious color ramps and scales from a base color.',
    category: 'Design Tools',
    icon: <IconScale />,
    component: ColorRangeGenerator,
  },
  {
    id: 'color-list',
    name: 'Master Color List',
    description: 'A comprehensive searchable reference of named CSS colors.',
    category: 'Design Tools',
    icon: <IconSparkles />,
    component: ColorList,
  },
  {
    id: 'contrast-checker',
    name: 'Contrast Checker',
    description: 'WCAG compliance tool for text and background contrast.',
    category: 'Design Tools',
    icon: <IconCheck />,
    component: ContrastChecker,
  },
  {
    id: 'vision-simulator',
    name: 'Vision Simulator',
    description: 'Simulate color vision deficiencies for accessibility testing.',
    category: 'Design Tools',
    icon: <IconClock />,
    component: VisionSimulator,
  },
  {
    id: 'color-converter',
    name: 'Color Mode Converter',
    description: 'Convert between HEX, RGB, HSL, OKLCH and high-gamut modes.',
    category: 'Design Tools',
    icon: <IconScale />,
    component: ColorModeConverter,
  },
  {
    id: 'color-mixer',
    name: 'Color Mixer',
    description: 'Blend two colors together with precision ratios.',
    category: 'Design Tools',
    icon: <IconSparkles />,
    component: ColorMixer,
  },

  // Dev Tools
  {
    id: 'pattern-gen',
    name: 'Pattern Generator',
    description: 'Create geometric CSS background patterns with live blending and geometry controls.',
    category: 'Dev Tools',
    icon: <IconGrid />,
    component: PatternsGenerator,
  },
  {
    id: 'shadow-gen',
    name: 'Shadow Generator',
    description: 'Create multi-layered CSS box-shadows with presets.',
    category: 'Dev Tools',
    icon: <IconBox />,
    component: ShadowGenerator,
  },
  {
    id: 'gradient-gen',
    name: 'Gradient Generator',
    description: 'Advanced linear and radial CSS gradient editor.',
    category: 'Dev Tools',
    icon: <IconCode />,
    component: GradientGenerator,
  },
  {
    id: 'flex-gen',
    name: 'Flexbox Generator',
    description: 'Visual sandbox for CSS Flexbox layouts.',
    category: 'Dev Tools',
    icon: <IconLayout />,
    component: FlexboxGenerator,
  },
  {
    id: 'grid-gen',
    name: 'Grid Generator',
    description: 'Generate complex CSS Grid layouts visually.',
    category: 'Dev Tools',
    icon: <IconGrid />,
    component: GridGenerator,
  },
  {
    id: 'subgrid-gen',
    name: 'SubGrid Generator',
    description: 'Experiment with CSS Grid subgrid properties.',
    category: 'Dev Tools',
    icon: <IconGrid />,
    component: SubGridGenerator,
  },
  {
    id: 'button-gen',
    name: 'Buttons Generator',
    description: 'Custom CSS button designer with hover states.',
    category: 'Dev Tools',
    icon: <IconTool />,
    component: ButtonGenerator,
  },
  {
    id: 'checkbox-gen',
    name: 'Checkbox Generator',
    description: 'Custom CSS checkbox and radio style generator.',
    category: 'Dev Tools',
    icon: <IconCheck />,
    component: CheckboxGenerator,
  },
  {
    id: 'radio-gen',
    name: 'Radiobutton Generator',
    description: 'Stylish CSS-only radio button generator.',
    category: 'Dev Tools',
    icon: <IconCheck />,
    component: RadioButtonGenerator,
  },
  {
    id: 'switch-gen',
    name: 'Input Switch Generator',
    description: 'Create modern toggle switches for your forms.',
    category: 'Dev Tools',
    icon: <IconTool />,
    component: SwitchGenerator,
  },
  {
    id: 'form-gen',
    name: 'Input Form Generator',
    description: 'Generate clean HTML/CSS form layouts.',
    category: 'Dev Tools',
    icon: <IconCode />,
    component: FormGenerator,
  },

  // Text Tools
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between different case styles.',
    category: 'Text Tools',
    icon: <IconText />,
    component: CaseConverter,
  },
  {
    id: 'text-counter',
    name: 'Text Counter',
    description: 'Detailed analysis of characters, words, and sentences.',
    category: 'Text Tools',
    icon: <IconText />,
    component: Counter,
  },
  {
    id: 'whitespace-remover',
    name: 'Whitespace Remover',
    description: 'Clean up unnecessary spaces, tabs, and line breaks.',
    category: 'Text Tools',
    icon: <IconText />,
    component: WhitespaceRemover,
  },
  {
    id: 'font-pair-finder',
    name: 'Font Pair Finder (AI)',
    description: 'Find perfect Google Font pairings (uses Gemini AI).',
    category: 'Text Tools',
    icon: <IconText />,
    component: FontPairFinder,
  },
  {
    id: 'string-splitter',
    name: 'String Splitter',
    description: 'Split strings by custom delimiters and format as lists or arrays.',
    category: 'Text Tools',
    icon: <IconText />,
    component: StringSplitter,
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum (AI)',
    description: 'Generate standard (Latin) or thematic placeholder text (AI).',
    category: 'Text Tools',
    icon: <IconText />,
    component: LoremIpsum,
  },
  {
    id: 'bionic-reading',
    name: 'Bionic Reading',
    description: 'Optimize text for faster reading with saccade bolding.',
    category: 'Text Tools',
    icon: <IconText />,
    component: BionicReading,
  },
  {
    id: 'handwriting-converter',
    name: 'Handwriting Converter',
    description: 'Transform digital text into realistic handwritten notes.',
    category: 'Text Tools',
    icon: <IconText />,
    component: HandwritingConverter,
  },

  // Unit Converters
  {
    id: 'conv-length',
    name: 'Length Converter',
    description: 'Convert between metric and imperial length units (mm to Light Years).',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: LengthConverter,
  },
  {
    id: 'conv-weight',
    name: 'Weight & Mass',
    description: 'Convert mass from milligrams to Petagrams and tons.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: WeightConverter,
  },
  {
    id: 'conv-temp',
    name: 'Temperature',
    description: 'Switch between Celsius, Fahrenheit, and Kelvin scales.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: TemperatureConverter,
  },
  {
    id: 'conv-area',
    name: 'Area Converter',
    description: 'Convert square units, hectares, and acres.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: AreaConverter,
  },
  {
    id: 'conv-volume',
    name: 'Volume Converter',
    description: 'Convert solid cubic units and liquid measurements.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: VolumeConverter,
  },
  {
    id: 'conv-time',
    name: 'Time Converter',
    description: 'Precision time unit conversion from nano-seconds to years.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: TimeConverter,
  },
  {
    id: 'conv-energy',
    name: 'Energy Converter',
    description: 'Joules, Calories, BTU, and Watt-hour conversions.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: EnergyConverter,
  },
  {
    id: 'conv-speed',
    name: 'Speed Converter',
    description: 'Km/h, Mph, Knots, and Speed of Light conversions.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: SpeedConverter,
  },
  {
    id: 'conv-pressure',
    name: 'Pressure Converter',
    description: 'Pascal, Bar, PSI, and Atmosphere units.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: PressureConverter,
  },
  {
    id: 'conv-power',
    name: 'Power Converter',
    description: 'Watts, Horsepower, and related power units.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: PowerConverter,
  },
  {
    id: 'conv-angle',
    name: 'Angle Converter',
    description: 'Convert Degrees, Radians, and Gradians.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: AngleConverter,
  },
  {
    id: 'conv-fuel',
    name: 'Fuel Consumption',
    description: 'MPG and Liters per 100km conversions.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: FuelConverter,
  },
  {
    id: 'conv-data',
    name: 'Data Storage',
    description: 'Digital storage units from Bits to Petabytes.',
    category: 'Unit Converters',
    icon: <IconScale />,
    component: DataConverter,
  },
  {
    id: 'conv-systems',
    name: 'Unit Systems Reference',
    description: 'Encyclopedia of Metric and Imperial systems.',
    category: 'Unit Converters',
    icon: <IconClock />,
    component: UnitSystemsInfo,
  },

  // Theme Generators
  {
    id: 'theme-bootstrap',
    name: 'Bootstrap Builder',
    description: 'Customize Bootstrap theme colors and generate SCSS/CSS variables.',
    category: 'Theme Generator',
    icon: <IconSparkles />,
    component: BootstrapThemeBuilder,
  },
  {
    id: 'theme-tailwind',
    name: 'Tailwind Configurator',
    description: 'Build custom Tailwind color palettes and generate config objects.',
    category: 'Theme Generator',
    icon: <IconSparkles />,
    component: TailwindThemeBuilder,
  },
  {
    id: 'theme-shadcn',
    name: 'ShadCN UI Designer',
    description: 'Visual editor for Radix-based ShadCN CSS variables for light/dark modes.',
    category: 'Theme Generator',
    icon: <IconSparkles />,
    component: ShadcnThemeBuilder,
  },
  {
    id: 'theme-primeng',
    name: 'PrimeNG Builder',
    description: 'Enterprise-grade theme builder for PrimeNG components.',
    category: 'Theme Generator',
    icon: <IconSparkles />,
    component: PrimengThemeBuilder,
  },

  // Utilities
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Pretty print, minify and validate JSON data.',
    category: 'Utilities',
    icon: <IconCode />,
    component: JsonFormatter,
  },
  {
    id: 'cursor-preview',
    name: 'Cursor List Preview',
    description: 'Reference for all available CSS cursor types.',
    category: 'Utilities',
    icon: <IconCode />,
    component: CursorList,
  },
  {
    id: 'html-entity-tool',
    name: 'HTML Entity Encoder',
    description: 'Encode/Decode individual HTML entities.',
    category: 'Utilities',
    icon: <IconCode />,
    component: HtmlEntityTool,
  },
  {
    id: 'entities-list',
    name: 'Entities List',
    description: 'Searchable database of HTML special characters.',
    category: 'Utilities',
    icon: <IconText />,
    component: EntitiesList,
  },
  {
    id: 'url-percent',
    name: 'URL Percent Coder',
    description: 'URL encode/decode strings safely.',
    category: 'Utilities',
    icon: <IconCode />,
    component: UrlTool,
  },
  {
    id: 'base64-coder',
    name: 'Base 64 Coder',
    description: 'Convert strings to/from Base64 format.',
    category: 'Utilities',
    icon: <IconCode />,
    component: Base64Tool,
  },
  {
    id: 'password-gen',
    name: 'Password Generator',
    description: 'Create secure and random passwords.',
    category: 'Utilities',
    icon: <IconTool />,
    component: PasswordGenerator,
  },
  {
    id: 'md5-hash',
    name: 'MD5 Encrypt',
    description: 'Generate MD5 message-digest algorithm hashes.',
    category: 'Utilities',
    icon: <IconTool />,
    component: () => <HashTool algorithm="MD5" />,
  },
  {
    id: 'sha256-hash',
    name: 'SHA256 Encrypt',
    description: 'Generate standard SHA-256 secure hashes.',
    category: 'Utilities',
    icon: <IconTool />,
    component: () => <HashTool algorithm="SHA-256" />,
  },
  {
    id: 'uuid-gen',
    name: 'UUID Generator',
    description: 'Generate unique identifiers (v1, v4) for development.',
    category: 'Utilities',
    icon: <IconTool />,
    component: UuidGenerator,
  },

  // Social Tools
  {
    id: 'yt-thumbnail',
    name: 'YT Thumbnail Maker',
    description: 'Create high-impact thumbnails (AI or manual).',
    category: 'Social Tools',
    icon: <IconCode />,
    component: YoutubeThumbnail,
  },
  {
    id: 'yt-title-gen',
    name: 'YT Title Generator (AI)',
    description: 'Generate high-CTR titles (Gemini AI optimized).',
    category: 'Social Tools',
    icon: <IconCode />,
    component: YoutubeTitleGen,
  },
  {
    id: 'yt-viral-kit',
    name: 'Viral Strategy (AI)',
    description: 'Comprehensive AI analysis to make your video go viral.',
    category: 'Social Tools',
    icon: <IconCode />,
    component: YoutubeViralStrategy,
  },
  {
    id: 'ig-gen',
    name: 'Instagram Hub (AI)',
    description: 'Generate viral captions and optimized hashtags.',
    category: 'Social Tools',
    icon: <IconCode />,
    component: InstagramGen,
  },
  {
    id: 'tweet-gen',
    name: 'Tweet Maker (AI)',
    description: 'Craft engaging tweets and multi-post threads.',
    category: 'Social Tools',
    icon: <IconCode />,
    component: TweetGen,
  },
  {
    id: 'fb-gen',
    name: 'Facebook Copy (AI)',
    description: 'Generate persuasive Facebook posts and advertisements.',
    category: 'Social Tools',
    icon: <IconCode />,
    component: FacebookGen,
  },
  {
    id: 'portfolio-gen',
    name: 'Portfolio Helper (AI)',
    description: 'Optimize descriptions and tags for Dribbble and Behance.',
    category: 'Social Tools',
    icon: <IconCode />,
    component: DesignPortfolioGen,
  }
];

export const CATEGORIES: Category[] = [
  'Curated Resources',
  'Image Tools',
  'Design Tools',
  'Photography',
  'Dev Tools',
  'Text Tools',
  'Unit Converters',
  'Theme Generator',
  'Daily Pulse',
  'Social Tools',
  'Utilities'
];
