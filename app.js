import * as fs from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";

var dataPath = path.join("data", "chilli.json");

const data = await fs.readFile(dataPath);
const htmlData = await fs.readFile("./templates/index.html", "utf-8")
let newData = JSON.parse(data);

const template = Handlebars.compile(htmlData);
const newHtml = template(newData);
fs.writeFile("./output/index.html", newHtml);
console.log(template(newData));