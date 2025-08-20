
export interface PostTemplate {
  id: string;
  title: string;
  message: string;
  imagePath: string;
  customizable: boolean;
}

export const familyTemplates: PostTemplate[] = [
  {
    id: 'family-1',
    title: 'Honor & Remember',
    message: 'Together we prevent other families from this heartbreak.',
    imagePath: '/lovable-uploads/1a9d664a-b81b-400c-a32f-b7daeefdb2ec.png',
    customizable: true
  },
  {
    id: 'family-2',
    title: 'Loving Memory',
    message: 'In loving memory of my [relationship] [Name]. Together we prevent other families from this heartbreak. #FacingFentanyl #ShareTheMessage',
    imagePath: '/lovable-uploads/1a9d664a-b81b-400c-a32f-b7daeefdb2ec.png',
    customizable: true
  }
];

export const lawEnforcementTemplates: PostTemplate[] = [
  {
    id: 'law-1',
    title: 'United We Stand',
    message: 'As law enforcement, we see fentanyl\'s devastating impact daily. Together, we protect our communities through awareness. #FacingFentanyl',
    imagePath: '/lovable-uploads/1a9d664a-b81b-400c-a32f-b7daeefdb2ec.png',
    customizable: false
  },
  {
    id: 'law-2',
    title: 'Deadly Dose Warning',
    message: 'Just 2 milligrams of fentanyl can kill. Our duty is to warn, educate, and protect. Share this message. #FentanylAwareness #PublicSafety',
    imagePath: '/lovable-uploads/1a9d664a-b81b-400c-a32f-b7daeefdb2ec.png',
    customizable: false
  }
];

export const recoveryTemplates: PostTemplate[] = [
  {
    id: 'recovery-1',
    title: 'Hope & Recovery',
    message: 'Recovery from addiction is possible. We\'re here with support, resources, and hope. You\'re not alone. #FacingFentanyl #RecoverySupport',
    imagePath: '/lovable-uploads/1a9d664a-b81b-400c-a32f-b7daeefdb2ec.png',
    customizable: false
  },
  {
    id: 'recovery-2',
    title: 'Breaking Stigma',
    message: 'Addiction is a disease, not a choice. Our community offers judgment-free support and life-saving resources. #BreakTheStigma #RecoverySupport',
    imagePath: '/lovable-uploads/1a9d664a-b81b-400c-a32f-b7daeefdb2ec.png',
    customizable: false
  }
];

export const getTemplatesByPersona = (persona: string): PostTemplate[] => {
  switch (persona) {
    case 'family':
      return familyTemplates;
    case 'law_enforcement':
      return lawEnforcementTemplates;
    case 'recovery':
      return recoveryTemplates;
    default:
      return [];
  }
};
