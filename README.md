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

### Step 1
1) Clone the repo
2) Open the repo in your favourite code editor
3) Open a terminal and run:
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
