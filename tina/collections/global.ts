import type { Collection } from "tinacms";

const Global: Collection = {
  label: "Global",
  name: "global",
  path: "content/global",
  format: "json",
  ui: {
    global: true,
  },
  fields: [
    // Header
    {
      type: "object",
      label: "Header",
      name: "header",
      fields: [
        {
          type: "image",
          label: "Logo",
          name: "logo",
        },
        {
          type: "string",
          label: "Logo Alt Text",
          name: "logo_alt",
        },
        {
          type: "object",
          label: "Nav Links",
          name: "nav",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.label };
            },
            defaultItem: {
              href: "home",
              label: "Home",
            },
          },
          fields: [
            {
              type: "string",
              label: "Link",
              name: "href",
            },
            {
              type: "string",
              label: "Label",
              name: "label",
            },
          ],
        },
      ],
    },
    //Social Links
    {
      name: "socialLinks",
      label: "Social Links",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.icon ? `${item.icon.toUpperCase()}` : "Social Link",
        }),
      },
      fields: [
        {
          name: "icon",
          label: "Icon",
          type: "string",
          ui: {
            component: "select",
          },
          options: [
            { label: "LinkedIn", value: "linkedin" },
            { label: "Medium", value: "medium" },
            { label: "Behance", value: "behance" },
            { label: "Dribbble", value: "dribbble" },
          ],
        },
        {
          name: "url",
          label: "URL",
          type: "string",
        },
      ],
    },
    // Footer
    {
      type: "object",
      label: "Footer",
      name: "footer",
      fields: [
        {
          type: "string",
          label: "Copyright text",
          name: "copyright",
        },
      ],
    },
  ],
};

export default Global;
