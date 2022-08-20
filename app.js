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
    let rawHtml = await fs.readFile(files[i], "utf-8");
    allTemplates[fileName] = Handlebars.compile(rawHtml);
  }
  createPages();
}

async function createPages() {
  const jsonsInDir = await fs.readdir("./data/recipes");
  const ingredientsData = JSON.parse(
    await fs.readFile("./data/ingredients.json")
  );
  const translations = JSON.parse(await fs.readFile("./data/texts.json"));

  for (let i = 0; i < jsonsInDir.length; i++) {
    const jsonFile = await fs.readFile(
      path.join("./data/recipes", jsonsInDir[i]),
      "utf-8"
    );
    // console.log(jsonsInDir[i]);
    const recipe = JSON.parse(jsonFile);
    const ingredientList = recipe["ingredients"];
    
    for (let j = 0; j < ingredientList.length; j++) {
      const item = ingredientList[j];
      const name = item["name"];
      item["english"] = ingredientsData[name]["translations"]["en_US"];
      console.log(item);
    }
    
    let compiledTemplate = allTemplates["page"](recipe);

    // console.log(recipe["ingredients"][0]["gram"]);
    let compiledFileName = path.basename(jsonsInDir[i], ".json");

    await fs.writeFile(
      path.join("output", compiledFileName + ".html"),
      compiledTemplate
    );
    // console.log(compiledTemplate);
  }
}
