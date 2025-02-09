const fetchData = async ()=>{
  console.log('fetchdata lancé ✅')
  const url = 'http://127.0.0.1:3000/taches'
  try {
    const response = await fetch(url);

    if(!response.ok){
      throw new Error(
        `❌ Erreur lors du chargement de la tâche !`
      );
    }
    
    console.log('Response reçue ✅')

    const data = await response.json();
    return data;

  } catch (error) {
    console.error(`Error : ${error.message}`);
  }
}

const setData = async (data, url, method) => {
  console.log('setData lancé ✅');

  try {
    const response = await fetch(url, {
      method : method,
      headers : {
        'Content-Type':'application/json'
      },
      body : JSON.stringify(data)
    });
    console.log('Requête envoyé ✅');
    if(!response.ok){
      throw new Error(
        `❌ Erreur lors de l'ajout de la tâche ! : ${response.statusText}`
      );
    }
    
    const message = await response.json();
    return message;

  } catch (error) {
    console.error(`${error.message}`);
  }
}

const setTacheId = async (url, method) => {
  console.log('setTacheId lancé ✅')
  try {
    const response = await fetch(url, {
      method : method
    });

    console.log('Requête envoyé ✅');
    if(!response.ok){
      throw new Error(
        `❌ Erreur lors de l'ajout de la tâche ! : ${response.statusText}`
      );
    }
    
    const message = await response.json();
    return message;

  } catch (error) {
    console.error(`${error.message}`);
  }
}

const messageBox = ({ message, succes })=>{
  const container = document.createElement('div');
  container.setAttribute('id', 'container-block-mod');
  container.classList.add('container');

  const messageImgContainer = document.createElement('div');
  messageImgContainer.setAttribute('id', 'container-block-mod');
  messageImgContainer.classList.add('container');

  const messageContainer = document.createElement('div');
  messageContainer.setAttribute('id', 'container-block-mod');
  messageContainer.classList.add('container');
  messageContainer.innerText = message;
}

const createModBox = (data, table, viewTable)=>{
  console.log('✅')
  const {id, lib, desc} = data;

  const container = document.createElement('div');
  container.setAttribute('id', 'container-block-mod');
  container.classList.add('container');

  const formMod = document.createElement('form');
  formMod.setAttribute('id', 'mod-form');
    
  const libMod = document.createElement('input');
  libMod.classList.add('tasks');
  libMod.setAttribute('id', 'lib-mod');
  libMod.setAttribute('type', 'text');
  libMod.setAttribute('placeholder', 'Titre de la tâche');
  libMod.value = lib;

  const descMod = document.createElement('textarea');
  descMod.setAttribute('id', 'desc-mod');
  descMod.setAttribute('type', 'text');
  descMod.setAttribute('placeholder', 'Description de la tâche');
  descMod.setAttribute('rows', '5');
  descMod.value = desc;

  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.setAttribute('id', 'button-add');
  button.innerText = 'Modifier';

  button.addEventListener('click', async (e)=>{
    e.preventDefault();
    await modTache(id, { libMod, descMod }, table, viewTable);
    await updateViewTable(table,viewTable)
  });

  const imgRetour = document.createElement('img');
  imgRetour.setAttribute('src', 'images/marque-de-croix.png');
  imgRetour.setAttribute('alt', 'fermer');

  const retour = document.createElement('button');
  retour.setAttribute('id', 'return-btn');
  retour.appendChild(imgRetour);

  const modBox = document.querySelector('.mod-box');

  modBox.classList.add('show');

  retour.addEventListener('click', (e)=>{
    modBox.classList.remove('show');
  });

  formMod.appendChild(libMod);
  formMod.appendChild(descMod);
  formMod.appendChild(button);

  container.appendChild(retour);
  container.appendChild(formMod);

  modBox.appendChild(container);
}

const createTacheView = (table, data, viewTable) =>{
  const {lib, etat} = data;

  const delImg = document.createElement('img');
  delImg.setAttribute('src', 'images/bouton-supprimer.png');
  delImg.setAttribute('alt', 'bouton supprimer img');

  const complImg = document.createElement('img');
  complImg.setAttribute('src', 'images/tache-terminee.png');
  complImg.setAttribute('alt', 'bouton terminer img');

  const modImg = document.createElement('img');
  modImg.setAttribute('src', 'images/edition.png');
  modImg.setAttribute('alt', 'bouton modifier img');

  const row = table.insertRow();
  row.classList.add(etat ? 'terminee':'en-cours');

  const libCel = row.insertCell(0);
  libCel.innerText = lib;

  const stateCel = row.insertCell(1);
  stateCel.innerText = etat ? 'Terminée':'En cours';

  const delBtn = document.createElement('button');
  delBtn.classList.add('btn-del');
  delBtn.setAttribute('id', 'del-btn');
  delBtn.appendChild(delImg);
  delBtn.addEventListener('click', (e)=>{
    console.log('click ✅')
    deleteTache(data.id, table, viewTable);
  });

  const modBtn = document.createElement('button');
  modBtn.classList.add('btn-mod');
  modBtn.setAttribute('id', 'mod-btn');
  modBtn.appendChild(modImg);
  modBtn.addEventListener('click', (e)=>{
    createModBox(data, table, viewTable);
  });

  const complBtn = document.createElement('button');
  complBtn.classList.add('btn-term');
  complBtn.setAttribute('id', 'compl-btn');
  complBtn.appendChild(complImg);
  complBtn.addEventListener('click', (e)=>{
    complTache(data.id, table, viewTable);
  });

  const celBtn = row.insertCell(2);
  celBtn.classList.add('btn-container');

  celBtn.appendChild(complBtn);
  celBtn.appendChild(modBtn);
  celBtn.appendChild(delBtn);
}

const loadTableView = async (table, viewTable)=>{
  const {succes, taches} = await fetchData();

  console.log(`Response : ${taches}, ${succes}`);

  let isLoad = false;

  try {
    if (succes) {
      if (taches.length) {
        table.innerHTML = '';

        const tableTile = document.createElement('caption');
        tableTile.innerText = 'Mes Tâches';
        table.appendChild(tableTile);

        taches.forEach(tache => {
          createTacheView(table, tache, viewTable);
        });
        isLoad = true;
      }
      return isLoad;
    }
    else{
      throw new Error("taches n'est pas un tableau !");
      
    }
  } catch (error) {
    console.log(`Erreur : ${error.message}`);
  }
}

const updateViewTable = async(table, viewTable)=>{
  const isLoad = await loadTableView(table, viewTable);

  viewTable.innerHTML = '';

  console.log(`isLoad : ${isLoad}`);

  if (isLoad) {
    viewTable.appendChild(table);
  }
  else{
    viewTable
      .appendChild(document
        .createTextNode('Pas de tâches enregistrées pour le moment !'));
  }
}

const addTask = async (table, viewTable, libInput, descInput, event)=>{
  event.preventDefault();

  const url = 'http://127.0.0.1:3000/taches/ajout';

  try {
    const { taches } = await fetchData();
    const tachesId = taches.length + 1;

    if (libInput.value !== '') {
      const data = {
        id:tachesId,
        lib: libInput.value,
        desc: descInput.value,
        etat:false
      }
  
      const { succes } = await setData(data, url, 'POST');
  
      if (succes){
        libInput.value = '';
        descInput.value = '';
  
        alert('✅ Tâche ajoutée avec succés !')
  
        await updateViewTable(table,viewTable)
      }
    }
    else{
      alert('Tout les champs sont requis !')
    }
  }

  catch (error) {
    console.error(`Error : ${error.message}`);
  }
}

const deleteTache = async (id, table, viewTable)=>{
  const url = `http://127.0.0.1:3000/taches/supprimer?id=${id}`;
  const method = 'DELETE';

  try {
    const message = await setTacheId(url, method);
  
    if (message.succes){
      alert('✅ Tâche supprimée avec succés !');
      await updateViewTable(table,viewTable);
    }

    else{
      throw new Error(message.error);
    }

  } catch (error) {
    console.log(`Erreur : ${error.message}`);
  }
}

const modTache = async (id, data, table, viewTable)=>{
  const url = `http://127.0.0.1:3000/taches/modifier?id=${id}`;
  const method = 'PUT';

  const modBox = document.querySelector('.mod-box');

  const { libMod, descMod} = data;
  try {
    if (libMod.value !== '') {
      const { succes } = await setData(
        { 
          lib:libMod.value,
          desc:descMod.value
        },
        url,
        'PUT'
      );

      if (succes){
        alert('✅ Tâche modifié avec succés !');
        modBox.classList.remove('show');
      }
    }

    else{
      alert('Tout les champs sont requis !')
    }
  }

  catch (error) {
    console.error(`Error : ${error.message}`);
  }
}

const complTache = async (id, table, viewTable)=>{
  console.log(id)
  const url = `http://127.0.0.1:3000/taches/terminer?id=${id}`;
  const method = 'PUT';

  try {
    const message = await setTacheId(url, method);
  
    if (message.succes){
      alert('✅ Tâche modifiée avec succés !');
      await loadTableView(table, viewTable);
    }

    else{
      throw new Error(message.error);
    }

  } catch (error) {
    console.log(`Erreur : ${error.message}`);
  }
}

export default {
  fetchData,
  setData,
  createTacheView,
  addTask,
  deleteTache,
  modTache,
  complTache,
  updateViewTable
}