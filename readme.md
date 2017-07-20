//create account on firebase
//install below tools
npm install -g firebase-tools
firebase login
--second time after network disconnect
  firebase login --reauth
firebase init
firebase deploy 

//before deploy add below to firebase.json
{
  "hosting": {
    "public": "public"
  }
}