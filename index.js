
const fs=require('fs')
const http=require('http')
const url=require('url')
const replaceTemplate=(temp,product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%FROM%}/g,product.from);
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%DESCRIPTION%}/g,product.description);
    output=output.replace(/{%ID%}/g,product.id);
    if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const server=http.createServer((req,res)=>{
    const {query,path}=url.parse(req.url,true);
   if(path==='/' || path==='/overview'){
      res.writeHead(200, { 'content-type': 'text/html' });
      const cardsHtml=dataObj.map(el=>replaceTemplate(templateCard,el)).join('');
        const output=templateOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
   }
   else if(path==='/product'){
    console.log(query)
      res.writeHead(200, { 'content-type': 'text/html' });
      const product=dataObj[query.id]
      const html = replaceTemplate(templateProduct, product);
      console.log(html);
      res.end(html);
   }
   else if(path==='/api'){
      res.writeHead(200,{'content-type':'application/json'});
      res.end(data);
   }
   else{
    res.writeHead(404,{
        'content-type':'text/index.html',
        'my-own-header':'hello-world'
    })
    res.end('page not found');
   }
})
server.listen(8000,'127.0.0.1',()=>{
    console.log('request fom the server');
})