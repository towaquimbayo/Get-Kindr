# KINDR

(Outdated!) Just run `npm i`, then `npm run dev` to get it up and running!

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
