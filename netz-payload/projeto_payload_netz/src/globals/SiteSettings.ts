import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',

  label: 'Configurações do Site',

  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },

    {
      name: 'siteDescription',
      type: 'textarea',
    },
  ],
}