export default {
  kind: "collectionType" as const,
  collectionName: "artigos",
  info: {
    singularName: "artigo",
    pluralName: "artigos",
    displayName: "Artigo",
    description: "Blog posts rendered by rafael.io",
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {},
  attributes: {
    legacyId: {
      type: "integer",
      unique: true,
    },
    title: {
      type: "string",
      required: true,
      maxLength: 255,
    },
    slug: {
      type: "uid",
      targetField: "title",
      required: true,
    },
    description: {
      type: "text",
    },
    content: {
      type: "text",
      required: true,
    },
    cover: {
      type: "media",
      multiple: false,
      required: false,
      allowedTypes: ["images"],
    },
    labels: {
      type: "json",
    },
    linkedinUrl: {
      type: "string",
    },
    readingTime: {
      type: "integer",
      min: 1,
    },
  },
};
