import jwt from "jsonwebtoken";
import con from "../connection/connenction.mjs";
import { SECRET_KEY, JWT_EXPIRE } from "../../constants/JWT.mjs";

const returnJWT = (username,id) => {

  const issuer_claim = "THE_SERVER_NAME"; // this can be the servername
  const audience_claim = "THE_AUDIENCE";
  const issuedat_claim = Date.now(); // issued at
  const notbefore_claim =  0; //not before in seconds
  const expire_claim = issuedat_claim + JWT_EXPIRE; // expire time in seconds

  return jwt.sign({ 
        "iss" : issuer_claim, 
        "aud" : audience_claim,
        "iat" : issuedat_claim,   // iat – timestamp of token issuing.
        "nbf" : notbefore_claim,  // nbf – Timestamp of when the token should start being considered valid. Should be equal to or greater than iat. In this case, the token will begin to be valid after 10 seconds after being issued
        "exp" : expire_claim,     // exp – Timestamp of when the token should stop to be valid. Needs to be greater than iat and nbf. In our example, the token will expire after 60 seconds of being issued.
        "data" : {
            "id" : id,
            "username" : username
        }
    },
    SECRET_KEY
  );
}

const auth = (req, res) => {
  const username = (req.query?.username ?? null).trim();
  const password = (req.query?.password ?? null).trim();


  if (username !== null && password !== null) {


      const query = `SELECT id, username, password FROM user WHERE username="${username}" AND password="${password}"  LIMIT 0,1`;

    
        con.query(query, (err,row)=>{
          if(err) throw err;
        
          if(row.length === 1){

            const db_username = row[0]["username"];
            const db_id       = row[0]["id"];
            const jwt = returnJWT(db_username, db_id);

            res.status(200);
            res.send({
              "message" : "Successful login.",
              "jwt" : jwt,
              "id" : db_id,
              "username" : db_username,
            });
            res.end();

          }else{
       
            const query =  `INSERT INTO user SET username="${username}",password="${password}"`;
            con.query(query, (err,row)=>{
              if(err) throw err;


              const query = `SELECT id FROM user WHERE username="${username}" LIMIT 0,1`;
                con.query(query, (err,row)=>{
                  if(err) throw err;

               
                  const db_id  = row[0]["id"];
                  const jwt    = returnJWT(username, db_id);
                  
                  res.status(200);
                  res.send({
                    "message" : "Successful login.",
                    "jwt" : jwt,
                    "id" : db_id,
                    "username" : username,
                  });
                  res.end();


                });


            });

            return;
          }

        });
   
      
     
  
       
 
    
 

  }else{
    const error = {
      message : "Login failed."
    }
    res.status(403);
    res.send(JSON.stringify(error));
  }
};

export default auth;
