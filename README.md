
## About this Project

This Project is Implementation of Email Signature Service of Assignement.

In backend startegy, We want to build an Email Signature Dynamic Engine

## Run This Project

   1. Download Docker into your local machine: (Windows: https://docs.docker.com/desktop/install/windows-install/,  Mac:https://docs.docker.com/desktop/install/mac-install/ )
   2. Run this command to build docker:
      ```bash
        $ docker build -t email-frontend .
      ```
   3. Run this command for project starting:
       ```
         $ docker compose up --build
       ```
   4. Type http://localhost:80/ in your browser.

   5. ENJOY! 


### FOR WEBHOOK
By Using /email-signature/webhook, you can give a bundle of Email Signature Result, with user is registered in system, And get a signatures/failure status

Request Body:
``````
   {
    "email": "email",
    "emailSignaturesToAdd":[
      {
        "selectedTemplate": Types.ObjectId,
        "name": "string",
        "phone": "string",
        "email":"string",
        "photoUrl": "string"
      }
    ]
   }