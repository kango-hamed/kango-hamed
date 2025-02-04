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

const setData = async (data) => {
  console.log('setData lancé ✅');
  const url = 'http://127.0.0.1:3000/taches/ajout';

  try {
    const response = await fetch(url, {
      method : 'POST',
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
    modTache(data.id, table, viewTable);
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
  
      const { succes } = await setData(data);
  
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

const modTache = async (id, table, viewTable)=>{
  const url = `http://127.0.0.1:3000/taches/modifier?id=${id}`;
  const method = 'PUT';

  try {
    const message = await setTacheId(url, method);
  
    if (message.succes){
      alert('✅ Tâche terminée !');
      await loadTableView(table, viewTable);
    }

    else{
      throw new Error(message.error);
    }

  } catch (error) {
    console.log(`Erreur : ${error.message}`);
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