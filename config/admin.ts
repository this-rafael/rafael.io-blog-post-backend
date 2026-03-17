export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "changeMe"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", "changeMe"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT", "changeMe"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
});
