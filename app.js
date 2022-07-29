import * as fs from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";
import readdir from "recursive-readdir";

var dataPath = path.join("data", "chilli.json");

const data = await fs.readFile(dataPath);
const htmlData = await fs.readFile(
  path.join(".", "templates", "index.html"),
  "utf-8"
);
let newData = JSON.parse(data);
let allTemplates = {};

readdir("templates").then(
  function (files) {
    processFiles(files);
  },
  function (error) {
    console.error("EVERYTHING FUCKED UP", error);
  }
);

async function processFiles(files) {
  for (let i = 0; i < files.length; i++) {
    let splitedTemplates = files[i].split("templates\\")
    var rawHtml = await fs.readFile(files[i], "utf-8");
    allTemplates[splitedTemplates] = Handlebars.compile(rawHtml);
    var compiledTemplates =  allTemplates[splitedTemplates](newData);
    console.log(compiledTemplates)
    // console.log(filesTemplate(rawHtml))
    // fs.writeFile(path.join(".", "output", files[i]), template(rawHtml));
  }
  // console.log("files are", files);
}

// const template = Handlebars.compile(htmlData);
// const newHtml = template(newData);
// fs.writeFile(path.join(".", "output", "index.html"), newHtml);
// console.log(template(newData));
