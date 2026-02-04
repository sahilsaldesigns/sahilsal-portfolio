/**
 * @type {import('tinacms').Collection}
 */
export default {
  label: "Case Studies",
  name: "caseStudy",
  path: "content/case-studies",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      required: true,
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "image",
      label: "Thumbnail Image",
      name: "thumbnail",
    },
    {
      type: "image",
      label: "Hero Image",
      name: "heroImage",
    },
    {
      type: "string",
      label: "Client Name",
      name: "clientName",
    },
    {
      type: "string",
      label: "Role",
      name: "role",
    },
    {
      type: "string",
      label: "Project Date",
      name: "projectDate",
      description: "e.g., 2024 or January 2024",
    },
    {
      type: "string",
      label: "Tags",
      name: "tags",
      list: true,
    },
    {
      name: "body",
      label: "Content",
      type: "rich-text",
      isBody: true,
    },
  ],
  ui: {
    router: ({ document }) => {
      return `/case-studies/${document._sys.filename}`;
    },
  },
};
