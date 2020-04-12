const { Client } = require("pg");
const express = require("express");
const app = express();
app.use(express.urlencoded());
app.use(express.json());

client = new Client({
  user: "vallari",
  password: "password",
  host: "127.0.0.1",
  port: 5432,
  database: "todo",
});
start();

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`));

app.get("/todos", async (req, res) => {
  const rows = await readTodos();
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(JSON.stringify(rows));
});

app.post("/todos", async (req, res) => {
  console.log("Here");
  let result = {};
  try {
    const reqJSON = req.body;
    console.log(reqJSON);
    await createTodos(reqJSON.id, reqJSON.task, reqJSON.due);
    result.success = true;
  } catch (e) {
    console.log("fail");
    result.success = false;
  } finally {
    res.setHeader("content-type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(JSON.stringify(result));
  }
});

app.delete("/todos", async (req, res) => {
  let result = {};
  console.log("del");
  try {
    const reqJSON = req.body;
    // reqJSON = 1;
    console.log(reqJSON);
    await deleteTodos(reqJSON.id);
    result.success = true;
  } catch (e) {
    console.log(e);
    result.success = false;
  } finally {
    res.setHeader("content-type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "DELETE");
    res.send(JSON.stringify(result));
  }
});
app.listen(8080, () => console.log("serving"));
async function start() {
  await connect();
  // console.table(await readTodos());
  // await createTodos([6, "monkey", "04-05-2020"]);
  // console.table(await readTodos());
  // await deleteTodos(6);
  // console.table(await readTodos());
}
async function connect() {
  try {
    await client.connect();
  } catch (e) {
    console.log("error: ", e);
  }
}
async function readTodos() {
  try {
    const result = await client.query("select * from basic_todos");
    return result.rows;
  } catch (e) {
    return [];
  }
}
async function createTodos(id, task, due) {
  try {
    await client.query(
      "insert into basic_todos (id,task,due) values ($1,$2,$3)",
      [id, task, due]
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
async function deleteTodos(id = 0) {
  try {
    await client.query("delete from basic_todos where id = $1", [id]);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// fetch("http://localhost:8080/todos",{method: "POST", Headers: {"content-type":"application"}, body: JSON.stringify({"id":"6","task":"katy","due":"05-02-2020"})}).then(a=>a.json()).then(console.log)
