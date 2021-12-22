import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import con from "../connection/connenction.mjs";
import { SECRET_KEY } from "../../constants/JWT.mjs";
import { phpURL } from "../../constants/phpURL.mjs"


const verifyToken = (req)  => {
  try{
    const bearerHeader = req.headers['authorization'];
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
  
     try{
      if (bearerHeader) {   
        const data = jwt.verify(bearerToken, SECRET_KEY );
        return data;
      } else {
        return null;
      }
    }catch(e){
      return null;
    } 
  }catch{
    return null;
  }

}

export const getPost = async (req, res) => {

  const token = verifyToken(req);
  if( token === null ){
    res.status(401);
    res.send({"message":"Auth error"});
  }else{
    
    const response = await fetch(phpURL);
    const json = await response.json();

    res.status(200);
    res.send(json);
  }


};

export const postPost = (req, res) => {


  const token = verifyToken(req);
  if( token === null ){
    res.status(401);
    res.send({"message":"Auth errordd"});
  }else{

    const id = parseInt(token?.data?.id ?? -1);
    const comment = req.body?.comment ?? null;

    const query = `INSERT INTO content (user_id, content) VALUES (${id}, "${comment}")`;

    con.query(query, (err)=>{
      if(err) throw err;
      res.status(200);
      res.send({"message":"Success"});
      res.end();
    });

  }

};

export const putPost = (req, res) => {
  const token = verifyToken(req);
  if( token === null ){
    res.status(401);
    res.send({"message":"Auth error"});
  }else{

    const id = parseInt(token?.data?.id ?? -1);
    const comment_id = parseInt(req?.body?.comment_id ?? -1);
    const comment = req?.body?.comment ?? "";

    const query = `UPDATE content SET content="${comment}" WHERE id=${comment_id} AND user_id="${id}"`;

    con.query(query, (err)=>{
      if(err) throw err;
      res.status(200);
      res.send({"message":"Success"});
      res.end();
    });

  }
};

export const deletePost = (req, res) => {
  const token = verifyToken(req);
  if( token === null ){
    res.status(401);
    res.send({"message":"Auth error"});
  }else{
 
    const id = parseInt(token?.data?.id ?? -1);
    const comment_id = parseInt(req?.body?.comment_id ?? -1);

    const query = `DELETE FROM content WHERE id="${comment_id}" AND user_id="${id}"`;

    con.query(query, (err)=>{
      if(err) throw err;
      res.status(200);
      res.send({"message":"Success"});
      res.end();
    });

  }
};
