# KhmerPodcast Project

This repository contains two projects: one for the client-side built with React, and the other for the server-side built with Node.js. Both projects share the same .env file for configuration.

## Clone Project 
```bash
git clone https://github.com/PhoSophors/Khmerpodcast.git
```
## Server

1. Navigate to `server`directory:
```bash
cd server
```


2. Install dependencies:
```bash
npm install
```


3. Copy config.env rename to .env and config .env follow: 
```markdown
### Sample .env File

# mongo DB server
MONGODB_URL: your_mongo_db_url

# mong db local
MONGODB_URL_LOCAL: mongodb://localhost:

# // passport 
GOOGLE_CLIENT_ID: your_google_client_id
GOOGLE_CLIENT_SECRET: your_google_client_secret
GOOGLE_CALLBACK_URL: your_google_callback_url

# aws
AWS_ACCESS_KEY: aws_access_key
AWS_SECRET_KEY: aws_secret_key
AWS_BUCKET_NAME: bucket_name
AWS_REGION: aws_region

# aws for user profile
AWS_REGION_PROFILE: aws_region_profile
AWS_BUCKET_NAME_PROFILE: aws_bucket_name_profile

# jwt 
# command tio generate jwt secret
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET: your_jwt_secret

# google account 
EMAIL: your_email_account_for_node_mailer
PASSWORD: your_password_for_node_mailer

# Admin 
ADMIN_EMAIL: your_admin_email
ADMIN_PASSWORD: your_admin_password
```

4. start the `server` command:
```bash
npm run build
```

## Client 

1. Navigate to `client` directory:
```bash
cd client
```


2. Install dependencies:
```bash
npm install
```

### Sample .env File
3. Copy config.env rename to .env and config .env follow:
 ```markdown
 # import port from node js server

REACT_APP_API_URL = 'http://localhost:4000'

GENERATE_SOURCEMAP=false
```

3. Start the client:
```bash
npm start
```


```markdown
## License

This project is licensed under the ...
```




