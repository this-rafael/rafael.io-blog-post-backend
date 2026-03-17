const PUBLIC_ACTIONS = [
  "api::artigo.artigo.find",
  "api::artigo.artigo.findOne",
  "plugin::upload.content-api.find",
  "plugin::upload.content-api.findOne",
];

export default {
  register() {},

  async bootstrap({ strapi }) {
    const publicRole = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (!publicRole) {
      return;
    }

    for (const action of PUBLIC_ACTIONS) {
      const existingPermission = await strapi.db
        .query("plugin::users-permissions.permission")
        .findOne({
          where: {
            action,
            role: publicRole.id,
          },
        });

      if (existingPermission) {
        if (!existingPermission.enabled) {
          await strapi.db.query("plugin::users-permissions.permission").update({
            where: { id: existingPermission.id },
            data: { enabled: true },
          });
        }

        continue;
      }

      await strapi.db.query("plugin::users-permissions.permission").create({
        data: {
          action,
          role: publicRole.id,
          enabled: true,
        },
      });
    }
  },
};
