/**
 * @type {import('tinacms').Collection}
 */
export default {
  label: "Page Content",
  name: "page",
  path: "content/page",
  format: "mdx",
  fields: [
    {
      name: "body",
      label: "Main Content",
      type: "rich-text",
      isBody: true,
    },
    {
      name: "blocks",
      label: "Blocks",
      type: "object",
      list: true,
      templates: [
        {
          name: "card_slider",
          label: "Card Slider",
          fields: [
            {
              type: "object",
              name: "cards",
              label: "Cards",
              list: true,
              fields: [
                { type: "string", name: "title", label: "Title" },
                { type: "image", name: "image", label: "Image" },
                {
                  type: "string",
                  name: "caseStudySlug",
                  label: "Case Study",
                  description: "Link to a case study (e.g., banking-app-redesign, ecommerce-platform)",
                },
                {
                  type: "boolean",
                  name: "comingSoon",
                  label: "Coming Soon",
                  description: "Mark this card as coming soon (applies blur overlay)",
                },
              ],
            },
          ],
        },
        {
          name: "photo_stack",
          label: "Photo Stack",
          fields: [
            { type: "image", name: "images", label: "Images", list: true },
          ],
        },
        {
          name: "social_links",
          label: "Social Links",
          fields: [
            {
              type: "object",
              name: "links",
              label: "Links",
              list: true,
              fields: [
                { type: "string", name: "icon", label: "Icon (linkedin, medium, behance, dribbble)" },
                { type: "string", name: "url", label: "URL" },
              ],
            },
          ],
        },
        {
          name: "about_hero",
          label: "About Hero",
          fields: [
            { type: "string", name: "name", label: "Name" },
            { type: "rich-text", name: "description", label: "Description" },
            { type: "image", name: "image", label: "Image" },
          ],
        },
      ],
    }
  ],
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") {
        return `/`;
      }
      return undefined;
    },
  },
};
