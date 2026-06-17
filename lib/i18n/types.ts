export interface Translations {
  nav: { howItWorks: string; sell: string; buy: string; login: string; signup: string };
  hero: { badge: string; headline1: string; headline2: string; subtext: string; highlight: string; ctaBuy: string; ctaSell: string; stat1value: string; stat1label: string; stat2value: string; stat2label: string; stat3value: string; stat3label: string; freeSwipes: string };
  pillars: {
    tag: string; title: string; subtitle: string;
    discretion: { title: string; quote: string; f1: string; f2: string; f3: string; f4: string };
    matching: { title: string; quote: string; f1: string; f2: string; f3: string; f4: string };
    support: { title: string; quote: string; f1: string; f2: string; f3: string; f4: string };
  };
  process: {
    tag: string; title: string;
    s1: { num: string; title: string; desc: string };
    s2: { num: string; title: string; desc: string };
    s3: { num: string; title: string; desc: string };
    s4: { num: string; title: string; desc: string };
  };
  sellers: { tag: string; title: string; desc: string; f1: string; f2: string; f3: string; f4: string; cta: string };
  buyers: { tag: string; title: string; desc: string; f1: string; f2: string; f3: string; f4: string; cta: string };
  comparison: { tag: string; title: string; col1: string; col2: string; col3: string; rows: { feature: string; competitors: string; us: string }[] };
  cta: { title: string; subtitle: string; ctaBuy: string; ctaSell: string };
  footer: { tagline: string; subtagline: string; platform: string; platformLinks: { buy: string; sell: string; discover: string }; company: string; companyLinks: { howItWorks: string; login: string }; legal: string; legalLinks: { privacy: string; cookies: string; rights: string; dpo: string }; copyright: string; compliance: string; privacyBtn: string };
  login: { title: string; subtitle: string; tabLogin: string; tabSignup: string; namePlaceholder: string; profileLabel: string; profileBuyer: string; profileSeller: string; emailPlaceholder: string; passwordPlaceholder: string; loadingBtn: string; loginBtn: string; signupBtn: string; successMsg: string };
  discover: { title: string; swipesRemaining: (n: number) => string; back: string; pass: string; like: string; save: string; limitTitle: string; limitDesc: string; limitUpgrade: string; noMoreTitle: string; noMoreDesc: string; savedTitle: (n: number) => string; noProfileTitle: string; noProfileDesc: string; noProfileCta: string; toastLike: string; toastSave: string; toastPass: string };
  sellerOnboarding: {
    pageTitle: string;
    steps: { title: string; subtitle: string }[];
    stepOf: (current: number, total: number) => string;
    fields: { businessName: string; businessNamePlaceholder: string; sector: string; sectors: string[]; canton: string; foundedYear: string; annualRevenue: string; operatingMargin: string; recurringClients: string; saleReason: string; saleReasons: string[]; timeline: string; timelines: string[]; confidentiality: string; confidentialities: string[]; ownerDependency: (v: number) => string; hasProcesses: string; teamSize: string; documentsOrganized: string; accountingUpToDate: string; licensesValid: string; description: string; descriptionPlaceholder: string; yes: string; no: string };
    back: string; next: string; loading: string; submit: string;
    result: { title: string; scoreGood: string; scoreLow: string; ctaPublish: string; ctaReport: string };
  };
  buyerOnboarding: {
    pageTitle: string;
    steps: { title: string; subtitle: string }[];
    stepOf: (current: number, total: number) => string;
    fields: { capitalMin: string; capitalMax: string; capitalSource: string; capitalSources: string[]; sectors: string; openToOtherSectors: string; regionMain: string; radiusKm: (v: number) => string; exploreOtherRegions: string; involvementType: string; involvementTypes: string[]; hoursPerWeek: string; experienceBackground: string; experiencePlaceholder: string; timelineMonths: string; languages: string; languagesPlaceholder: string; yes: string; no: string };
    back: string; next: string; loading: string; submit: string;
    result: { title: string; scoreGood: string; scoreLow: string; cta: string };
  };
  sell: {
    pageTitle: string;
    steps: { title: string; subtitle: string }[];
    stepOf: (current: number, total: number) => string;
    fields: { businessName: string; businessNamePlaceholder: string; sector: string; foundedYear: string; canton: string; city: string; cityPlaceholder: string; priceMin: string; priceMax: string; annualRevenue: string; description: string; descriptionPlaceholder: string };
    back: string; next: string; loading: string; submit: string;
    success: { title: string; desc: string; back: string };
  };
  admin: { title: string; subtitle: string; pendingCount: (n: number) => string; noPending: string; noPendingDesc: string; revenue: (v: number) => string; submitted: (d: string) => string; reject: string; approve: string; loading: string; accessDenied: string; accessDeniedDesc: string };
  privacy: { navItems: { id: string; label: string; icon: string }[]; contactDpo: string; badge: string; title: string; subtitle: string; nLPD: string; GDPR: string };
}
