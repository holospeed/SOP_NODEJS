import mysql from "mysql";
import {port, host, user, password, database } from "../../constants/database.mjs"

const con = mysql.createConnection({
  host,
  port,
  database,
  user,
  password
});


con.connect((err) => {
  if (err) 
    throw err;

  console.log("CONNECTED");
});

export default con;