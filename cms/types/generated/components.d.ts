import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutNewsletterConfig extends Struct.ComponentSchema {
  collectionName: 'components_layout_newsletter_configs';
  info: {
    displayName: 'Newsletter Config';
    icon: 'mail';
  };
  attributes: {
    buttonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Subscribe'>;
    description: Schema.Attribute.Text;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Subscribe to our newsletter'>;
  };
}

export interface SharedCaseStudyCosts extends Struct.ComponentSchema {
  collectionName: 'components_shared_case_study_costs';
  info: {
    displayName: 'Case Study Costs';
    icon: 'priceTag';
  };
  attributes: {
    fees: Schema.Attribute.String;
    hours: Schema.Attribute.Integer;
    value: Schema.Attribute.String;
    weeks: Schema.Attribute.Integer;
  };
}

export interface SharedContactPerson extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_people';
  info: {
    displayName: 'Contact Person';
    icon: 'user';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    phone: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String;
  };
}

export interface SharedFeaturedContent extends Struct.ComponentSchema {
  collectionName: 'components_shared_featured_contents';
  info: {
    displayName: 'Featured Content';
    icon: 'star';
  };
  attributes: {
    courses: Schema.Attribute.Relation<
      'oneToMany',
      'api::academy-course.academy-course'
    >;
    resources: Schema.Attribute.Relation<
      'oneToMany',
      'api::resource-item.resource-item'
    >;
    title: Schema.Attribute.String;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heros';
  info: {
    displayName: 'Hero';
    icon: 'picture';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    cta: Schema.Attribute.Component<'shared.quick-link', false>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedQuickLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_quick_links';
  info: {
    displayName: 'Quick Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social Link';
    icon: 'link';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'linkedin', 'instagram', 'youtube', 'twitter', 'whatsapp']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTextItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_items';
  info: {
    displayName: 'Text Item';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.newsletter-config': LayoutNewsletterConfig;
      'shared.case-study-costs': SharedCaseStudyCosts;
      'shared.contact-person': SharedContactPerson;
      'shared.featured-content': SharedFeaturedContent;
      'shared.hero': SharedHero;
      'shared.quick-link': SharedQuickLink;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'shared.text-item': SharedTextItem;
    }
  }
}
