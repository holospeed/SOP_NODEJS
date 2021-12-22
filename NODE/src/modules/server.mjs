import { port } from "../constants/port.mjs";
import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./openapi.json";
import auth from "./routes/auth.mjs";
import { getPost, postPost, putPost, deletePost} from "../modules/routes/post.mjs";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/auth", auth);

app.get("/post", getPost);
app.post("/post",  postPost);
app.put("/post",  putPost);
app.delete("/post",  deletePost);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 

const server = app.listen(port, () => {
  console.log("server has started");
});

export default server;
