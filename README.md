Local User Testing:

1. Create a Postgres DB
   - name: idea_tracker
   - user: postgres
   - password: 1234
   - port: 5432
   * NOTE: A command you will run later will create the .env file, so feel free to alter that after the fact if you don't want to use those credentials or DB name
2. Run the following commands
   - npm install
   - npm run migrate:dev
   - npx prisma generate
   - npm run setup:env
     -- this creates the .env file. It auto generates a new JWT_SECRET variable using "require('crypto').randomBytes(32).toString('hex')" so feel free to generate a new one if you'd like.
   - npm run seed:dev
   - npm run dev

Production User Testing:

- Go to https://idea-tracker-api.onrender.com/api-docs
  - This will likely take some time unless the server has been used recently. Render shuts it down if there isn't any traffic on their free development servers and I am unwilling to pay to keep it live.
