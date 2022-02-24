const fs = require("fs");
const http = require("http");
const url = require("url");

// _________________Files__________________

// Blocking Model

// const txtread = fs.readFileSync("./txt/input.txt", "utf-8");
// const textOut = `This Is Text From TXT FILE : [${txtread}] \n Created On : ${Date.now()}  `;

// fs.writeFileSync(`   ./txt/output.txt`  ,`Node File System Module Created This File : \n ${textOut}`);

// Non Blocking Model

// fs.readFile("./txt/input1.txt", "utf-8", (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//         console.log(data2);

//     });
// });

// console.log("Read Log");

/// SERVER

const replaceTemplate = (temp, product) => {
 let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
 output = output.replace(/{%IMAGE%}/g, product.image);
 output = output.replace(/{%PRICE%}/g, product.price);
 output = output.replace(/{%FROM%}/g, product.from);
 output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
 output = output.replace(/{%QUANTITY%}/g, product.quantity);
 output = output.replace(/{%DESCRIPTION%}/g, product.description);
 output = output.replace(/{%ID%}/g, product.id);

 if (!product.organic)
   output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
 return output;;
};

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const templateCards = fs.readFileSync(
  `${__dirname}/templates/template-cards.html`,
  "utf-8"
);

const templateProducts = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
const dataObject = JSON.parse(data);


// Request Response
const server = http.createServer((req, res) => {
console.log(req.url);
console.log(url.parse(req.url, true));
const pathname = req.url;

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObject.map((el) => replaceTemplate(templateCards, el)).join('');
    const output = templateOverview.replace("{%PRODUCT_CARD%}", cardsHtml);


    res.end(output);
  }

  // Products Page
  else if (pathname === "/products") {
    res.end("<h1>Products Page</h1>");
  }

  // Api Page
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }

  // Else 404
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });

    res.end(
      `<h1 style = "color: red" > 404 ${pathname} This Page Not Found </h1>`
    );
  }
});

// Server Listening Point
server.listen(8000, "127.0.0.1", () => {
  console.log("Server Running ... Port 8000 ");
});
