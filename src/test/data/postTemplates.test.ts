
import { describe, it, expect } from 'vitest';
import { 
  getTemplatesByPersona, 
  familyTemplates, 
  lawEnforcementTemplates, 
  recoveryTemplates 
} from '@/data/postTemplates';

describe('Post Templates', () => {
  describe('getTemplatesByPersona', () => {
    it('returns family templates for family persona', () => {
      const templates = getTemplatesByPersona('family');
      expect(templates).toEqual(familyTemplates);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('returns law enforcement templates for law_enforcement persona', () => {
      const templates = getTemplatesByPersona('law_enforcement');
      expect(templates).toEqual(lawEnforcementTemplates);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('returns recovery templates for recovery persona', () => {
      const templates = getTemplatesByPersona('recovery');
      expect(templates).toEqual(recoveryTemplates);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('returns empty array for unknown persona', () => {
      const templates = getTemplatesByPersona('unknown');
      expect(templates).toEqual([]);
    });
  });

  describe('Family Templates', () => {
    it('has required template structure', () => {
      familyTemplates.forEach(template => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('title');
        expect(template).toHaveProperty('message');
        expect(template).toHaveProperty('imagePath');
        expect(template).toHaveProperty('customizable');
        
        expect(typeof template.id).toBe('string');
        expect(typeof template.title).toBe('string');
        expect(typeof template.message).toBe('string');
        expect(typeof template.imagePath).toBe('string');
        expect(typeof template.customizable).toBe('boolean');
      });
    });

    it('has customizable templates for personalization', () => {
      const customizableTemplates = familyTemplates.filter(t => t.customizable);
      expect(customizableTemplates.length).toBeGreaterThan(0);
    });

    it('contains personalization placeholders in customizable templates', () => {
      const customizableTemplates = familyTemplates.filter(t => t.customizable);
      customizableTemplates.forEach(template => {
        expect(template.message).toMatch(/\[Name\]|\[relationship\]/);
      });
    });
  });

  describe('Law Enforcement Templates', () => {
    it('has required template structure', () => {
      lawEnforcementTemplates.forEach(template => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('title');
        expect(template).toHaveProperty('message');
        expect(template).toHaveProperty('imagePath');
        expect(template).toHaveProperty('customizable');
      });
    });

    it('has non-customizable templates', () => {
      lawEnforcementTemplates.forEach(template => {
        expect(template.customizable).toBe(false);
      });
    });
  });

  describe('Recovery Templates', () => {
    it('has required template structure', () => {
      recoveryTemplates.forEach(template => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('title');
        expect(template).toHaveProperty('message');
        expect(template).toHaveProperty('imagePath');
        expect(template).toHaveProperty('customizable');
      });
    });

    it('has non-customizable templates', () => {
      recoveryTemplates.forEach(template => {
        expect(template.customizable).toBe(false);
      });
    });
  });

  describe('Template Content', () => {
    it('all templates have appropriate hashtags', () => {
      const allTemplates = [
        ...familyTemplates,
        ...lawEnforcementTemplates,
        ...recoveryTemplates,
      ];

      allTemplates.forEach(template => {
        expect(template.message).toMatch(/#\w+/); // Contains at least one hashtag
      });
    });

    it('all templates reference fentanyl awareness', () => {
      const allTemplates = [
        ...familyTemplates,
        ...lawEnforcementTemplates,
        ...recoveryTemplates,
      ];

      allTemplates.forEach(template => {
        const message = template.message.toLowerCase();
        expect(
          message.includes('fentanyl') || 
          message.includes('awareness') ||
          message.includes('recovery') ||
          message.includes('hope')
        ).toBe(true);
      });
    });
  });
});
