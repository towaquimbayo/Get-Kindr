# KINDR

# Run the app locally
### Step 1: Database Setup
1. Copy the sample `.env` file and fill in with your API and account details:  
  - Create a PostgreSQL database either locally, or in the cloud (you can use [https://vercel.com/postgres](Vercel) for easy hosting. The various connection strings should be found in the Vercel account hosting the database
  - Create a Google OAuth app using the following [https://refine.dev/blog/nextauth-google-github-authentication-nextjs/#for-googleprovider-make-sure-you-have-a-google-account](tutorial)
  - Get a Mapbox access token and a Google Maps API token to view the events map

### Development mode
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
