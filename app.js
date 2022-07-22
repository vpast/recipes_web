import * as fs from "node:fs/promises";
import path from "node:path";

var dataPath = path.join("data", "chilli.json");

const data = await fs.readFile(dataPath);
const htmlData = await fs.readFile("./templates/index.html", "utf-8")
let newData = JSON.parse(data);
console.log(newData);
console.log(htmlData);
