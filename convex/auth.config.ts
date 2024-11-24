// eslint-disable-next-line import/no-anonymous-default-export
export default {
  providers: [
    {
      domain: process.env.CLEKR_JWT_ISSUER_DOMAIN as string,
      applicationID: "convex",
    },
  ],
};
