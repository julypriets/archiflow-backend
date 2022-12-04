export default () => ({
  aws: {
    region: process.env.REGION,
    access_key: process.env.ACCESS_KEY,
    secret_key: process.env.SECRET_KEY,
  },
  terraform: {
    token: process.env.TERRAFORM_TOKEN,
  },
});
