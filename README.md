# KINDR

# Run the app locally  
### Step 1: Environment Variables Setup
Copy the sample `.env` file and fill in with your API and account details:  
  - Create a PostgreSQL database either locally, or in the cloud (you can use [https://vercel.com/postgres](Vercel) for easy hosting. The various connection strings should be found in the Vercel account hosting the database
  - Create a Google OAuth app using the following [https://refine.dev/blog/nextauth-google-github-authentication-nextjs/#for-googleprovider-make-sure-you-have-a-google-account](tutorial)
  - Get a Mapbox access token and a Google Maps API token to view the events map

### Step 2: Install dependencies  
Installing required dependencies requires Node and npm:
  - Get Node and NPM
  - Execute `npm i --legacy-peer-deps` on the root directory

### Step 3: Run the app
Both the frontend and backend will run at the same time on different ports:
  - Execute `npm run dev` to run locally
  - This will also build the prisma schema for your PostgreSQL database if you haven't defined the schema already
  - This will also update the schema if there is any changes to the `schema.prisma` file

# Deploy the app
You may deploy the app manually using your preferred hosting service. However, Vercel is recommended due to simplicity and their free tier:

### Step 1: Import the repository
Create a Vercel account, and import the Get-Kindr repository:
  - Add your GitHub account to the list of members of the Get-Kindr organization
  - Then, you will see the Get-Kindr organization and repository in the Import Repository section of Vercel:
![image](https://github.com/get-kindr/Get-Kindr/assets/97265671/2ec363d9-54ab-4357-b2b3-66da882dbfde)
 
### Step 2: Add build configuration
Building requires adding some details to the project configuration:
  - Set the project template to Next.js
  - Set the install command to `pnpm install --no-frozen-lockfile`
![image](https://github.com/get-kindr/Get-Kindr/assets/97265671/b552fbea-0579-498f-a81b-524535c7b59b)

### Step 3: Add environment variables
For the project to build and deploy correctly, environment variables are required, much like with local development:
```
// Required for profile image API
NEXT_PUBLIC_IMGBB_API_KEY

// Required for Google login
OAUTH_REFRESH_TOKEN  
OAUTH_CLIENT_ID
OAUTH_CLIENT_SECRET
OAUTH_ACCESS_TOKEN

// Required for Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

// Required for PostgreSQL database
POSTGRES_USER
POSTGRES_HOST
POSTGRES_DATABASE
POSTGRES_URL_NON_POOLING
POSTGRES_PRISMA_URL
POSTGRES_URL
POSTGRES_PASSWORD

// Required for email recovery
MAIL_PASSWORD
MAIL_USERNAME

// Required for production deploy (this can be randomly generated)
NEXTAUTH_SECRET
```
  

```
pip install -r requirements.txt
cd backend && flask run -p 5001
```
4) Open another terminal and run:
```
cd frontend && npm i && npm run dev
```
5) Enjoy!

### Deploy the project
Deploying the project is very simple:
1) Go to your favourite hosting service and deploy the repo from GitHub
2) Add the following script to run upon deploying:
```
chmod a+x ./build.sh && ./build.sh
```
3) Set the Publishing Directory to `frontend/build`
4) Congratulations! You should now have KINDR deployed to your site!
