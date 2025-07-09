
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
    message: 'Today I honor [Name]. Your light continues to inspire change. #FentanylAwareness #FacingFentanyl',
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
    message: 'Our department stands with families affected by fentanyl. Education saves lives. #FacingFentanyl #CommunitySupport #FentanylAwareness',
    imagePath: '/lovable-uploads/1a9d664a-b81b-400c-a32f-b7daeefdb2ec.png',
    customizable: false
  },
  {
    id: 'law-2',
    title: 'Deadly Dose Warning',
    message: '2 milligrams can be lethal. Knowledge protects our communities. #FentanylAwareness #PublicSafety #ShareTheMessage',
    imagePath: '/lovable-uploads/1a9d664a-b81b-400c-a32f-b7daeefdb2ec.png',
    customizable: false
  }
];

export const recoveryTemplates: PostTemplate[] = [
  {
    id: 'recovery-1',
    title: 'Hope & Recovery',
    message: 'Recovery is possible. Hope is real. Resources are available today. #Recovery #Hope #FacingFentanyl #FentanylAwareness',
    imagePath: '/lovable-uploads/1a9d664a-b81b-400c-a32f-b7daeefdb2ec.png',
    customizable: false
  },
  {
    id: 'recovery-2',
    title: 'Breaking Stigma',
    message: 'Breaking stigma, building support. We\'re here to help. #RecoverySupport #BreakTheStigma #FacingFentanyl',
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
