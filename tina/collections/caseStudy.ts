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
          name: "mediaType",
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
    },
    {
      type: "object",
      name: "contentBlocks",
      label: "Content Blocks",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.title || "Content Block" };
        },
      },
      fields: [
        {
          type: "string",
          name: "icon",
          label: "Icon",
          options: [
            { value: "overview", label: "Overview (Target)" },
            { value: "challenge", label: "Challenge (Alert)" },
            { value: "solution", label: "Solution (Lightbulb)" },
            { value: "results", label: "Results (Chart)" },
            { value: "technology", label: "Technology (Code)" },
            { value: "learning", label: "Learning (Book)" },
            { value: "users", label: "Users (People)" },
            { value: "process", label: "Process (Workflow)" },
          ],
        },
        {
          type: "string",
          name: "title",
          label: "Block Title",
          required: false,
        },
        {
          type: "rich-text",
          name: "content",
          label: "Content",
          required: true,
        },
        {
          type: "object",
          name: "media",
          label: "Media (Images/Videos)",
          list: true,
          fields: [
            {
              type: "string",
              name: "type",
              label: "Type",
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
            {
              type: "string",
              name: "alt",
              label: "Alt Text / Caption",
            },
            {
              type: "string",
              name: "layout",
              label: "Layout",
              options: [
                { value: "full", label: "Full Width" },
                { value: "half", label: "Half Width" },
                { value: "third", label: "Third Width" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default caseStudy;