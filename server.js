const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const tachePath = path.join(__dirname, 'taches.json');

const readTacheFile = async ()=>{
  let tachePromise = new Promise((res, rej) => {
    fs.readFile(tachePath, 'utf-8', (err, taches) => {
      if (err) {
        if (err.code === 'ENOENT') {
          rej(new Error('taches.json vide'));
        } else {
          rej(new Error('Erreur lors de la lecture du fichier', err.message))
        }
      } else {
        res(taches);
      }
    });
  });

  return tachePromise;
}

const server = http.createServer((req,res)=>{

  res.setHeader('Access-Control-Allow-Origin', '*');

  if(req.method === 'OPTIONS'){
    res.setHeader(
      'Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Authorization'
    );

    res.setHeader(
      'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );

    return res.end();
  }

  
  const filePath = path.join(
    __dirname, 'static', req.url === '/'? 'index.html': req.url
  );

  const extname = path.extname(filePath);
  if (extname !== '') {
    let contentType;

    switch (extname) {
      case '.js':
        contentType = 'application/javascript';
        break;

      case '.css':
        contentType = 'text/css';
        break;

      case '.svg':
        contentType = 'image/png';
        break;
    
      default:
        contentType = 'text/html'
        break;
    }

    fs.readFile(filePath, (err, file)=>{
      if (err){
        if (err.code === 'ENOENT') {
          res.writeHead(404, {'Content-Type' : 'text/html'});
          res.end('<h1> Oops page no found ! </h1>');
        }
        else{
          res.writeHead(500, {'Content-Type' : 'application/json'});
          res.write('<h1> Oops server error ! </h1>');
          res.end(JSON.stringify({error : err.message}));
        }
      }
      
      else{
        res.writeHead(200, { 'Content-Type' : contentType });
        res.end(file, 'utf-8');
      }
    });
  }

  else{
    if (req.url === '/taches' && req.method === 'GET') {
      readTacheFile()
          .then((taches)=>{
            const parsedTaches = JSON.parse(taches);
            res.writeHead(200, { 'Content-Type':'application/json' });
            res.end(JSON.stringify({succes:true, taches:parsedTaches}));
          })
          .catch(error => {
            console.error(`Erreur : ${error.message}`);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          });
    }
    else if (req.url.startsWith('/taches/get-tache') && req.method === 'GET') {
      const parsedUrl = url.parse(req.url, true);
      const id = parseInt(parsedUrl.query.id);

      readTacheFile()
          .then((taches)=>{
            const tachesArray = JSON.parse(taches)
            const newTableTaches = tachesArray.filter(tache =>{
              if (tache.id === id) {
                return 1;
              }
            });

            return newTableTaches;
          })
          .then((data) => {
            const tache = data[0];
            res.writeHead(200, { 'Content-Type':'application/json' });
            res.end(JSON.stringify({ succes:true, tache:tache }));
          })
          .catch(error => {
            console.error(`Erreur : ${error.message}`);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          });
    }

    else if(req.url === '/taches/ajout' && req.method === 'POST'){
      console.log('Requête reussie ✅')
      let data = '';

      req.on('data', chunk =>{
        data += chunk;
      });

      req.on('end', () => {
        
        return readTacheFile()
            .then((taches)=>{
              const tachesArray = JSON.parse(taches)

              const tache = JSON.parse(data);

              tachesArray.push(tache);

              fs.writeFile(tachePath, JSON.stringify(tachesArray), (err) => {
                if (err) {
                  res.writeHead(500, { 'Content-Type':'application/json' });
                  res.end(JSON.stringify({ error: err.message }));
                }
          
                else{
                  res.writeHead(200, { 'Content-Type':'application/json' });
                  res.end(JSON.stringify( { succes:true, tache }));
                }
              });
            })
            .catch(error => {
              console.error(`Erreur : ${error.message}`);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: error.message }));
            })
      });
    }

    else if(req.url.startsWith('/taches/modifier') && req.method === 'PUT'){
      const parsedUrl = url.parse(req.url, true);
      const id = parseInt(parsedUrl.query.id);
      let data = '';

      req.on('data', chunk =>{
        data += chunk;
      });

      req.on('end', () => {
        
        return readTacheFile()
            .then((taches)=>{
              const {lib, desc} = data;
              const tachesArray = JSON.parse(taches);
              console.log(taches);
              const newTableTaches = tachesArray.map(tache =>{
                console.log(tache);
                if (tache.id === id) {
                  tache.lib = lib;
                  tache.desc = desc;
                }
              });

              console.log('MIse à jour effectuée ✅')

              // fs.writeFile(tachePath, JSON.stringify(newTableTaches), (err) => {
              //     if (err) {
              //       res.writeHead(500, { 'Content-Type':'application/json' });
              //       res.end(JSON.stringify({ error: err.message }));
              //     }
            
              //     else{
              //       res.writeHead(200, { 'Content-Type':'application/json' });
              //       res.end(JSON.stringify( { 
              //         succes:true, tache:newTableTaches[0] 
              //       }));
              //     }
              // });
            })
            .catch(error => {
              console.error(`Erreur : ${error.message}`);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: error.message }));
            })
      });
    }

    else if(req.url.startsWith('/taches/supprimer') && req.method === 'DELETE'){
      console.log('Requête reussie ✅');
      const parsedUrl = url.parse(req.url, true);
      const id = parseInt(parsedUrl.query.id);
      console.log(id);

      readTacheFile()
        .then((taches)=>{
          const tachesArray = JSON.parse(taches)
          const newTableTaches = tachesArray.filter(tache =>{
            if (tache.id !== id) {
              return 1;
            }
          });
              
          fs.writeFile(tachePath, JSON.stringify(newTableTaches), (err) => {
            if (err) {
              res.writeHead(500, { 'Content-Type':'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          
            else{
              res.writeHead(200, { 'Content-Type':'application/json' });
              res.end(JSON.stringify( { succes: true }));
            }
          });
        })
        .catch(error => {
          console.error(`Erreur : ${error.message}`);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
    }
  }
});



server.listen(3000, ()=>{
  console.log('Serveur lancé sur http://localhost:3000')
});