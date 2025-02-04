import functions from "./function.js";


const { addTask, deleteTache, modTache, complTache } = functions;
const { fetchData, setData, createTacheView, updateViewTable } = functions;

const viewTable = document.querySelector('#view-tasks-box');
const addForm = document.querySelector('#form');
const libInput = addForm.querySelector('#lib');
const descInput = addForm.querySelector('#desc');
const addBtn = addForm.querySelector('#button-add');

const table = document.createElement('table');
table.setAttribute('id', 'table-view');
table.classList.add('table-view');

document.addEventListener('DOMContentLoaded', async (e)=>{
  await updateViewTable(table, viewTable)
});

addBtn.addEventListener('click', (e) => {
  addTask(table, viewTable, libInput, descInput, e);
})