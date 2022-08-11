import * as fs from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";
import readdir from "recursive-readdir";

let allTemplates = {};

readdir("templates").then(
  function (files) {
    loadTemplates(files);
  },
  function (error) {
    console.error("EVERYTHING FUCKED UP", error);
  }
);

async function loadTemplates(files) {
  for (let i = 0; i < files.length; i++) {
    let fileName = path.basename(files[i], ".html");
    var rawHtml = await fs.readFile(files[i], "utf-8");
    allTemplates[fileName] = Handlebars.compile(rawHtml);
  }
  createPages();
}

async function createPages() {
  const jsonsInDir = await fs.readdir("./data/recipes");

  for (let i = 0; i < jsonsInDir.length; i++) {
    const jsonFile = await fs.readFile(
      path.join("./data/recipes", jsonsInDir[i]),
      "utf-8"
    );
    console.log(jsonsInDir[i]);
    const newJsonData = JSON.parse(jsonFile);
    var compiledTemplate = allTemplates["page"](newJsonData);
    var compiledFileName = path.basename(jsonsInDir[i], ".json");
    await fs.writeFile(path.join("output", compiledFileName + ".html"), compiledTemplate);
    console.log(compiledTemplate);
  }
}
