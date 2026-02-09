import type { Collection } from "tinacms";

const caseStudy: Collection = {
  name: "caseStudy",
  label: "Case Studies",
  path: "content/case-studies",
  format: "mdx",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      required: true,
    },
    {
      type: "string",
      name: "description",
      label: "Description",
      required: true,
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true,
      ui: {
        component: "tags",
      },
    },
    {
      type: "object",
      name: "heroMedia",
      label: "Hero Media",
      ui: {
        component: "group",
      },
      fields: [
        {
          type: "string",
          name: "mediaType", // 👈 IMPORTANT
          label: "Media Type",
          options: ["image", "video"],
          required: true,
        },
        {
          type: "image",
          name: "image",
          label: "Image",
        },
        {
          type: "string",
          name: "videoUrl",
          label: "Video URL",
        },
      ],
    }



  ],
};

export default caseStudy;