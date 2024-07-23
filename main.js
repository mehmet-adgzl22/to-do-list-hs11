import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import {
  clearBtn,
  container,
  displayAlert,
  form,
  grocery,
  list,
  submitBtn,
} from "./js/helpers.js";

let editElement;
let editFlag = false; 
let editID = ""; 

    //! Fonksiyonlar !//
const deleteItem = (e) => {
  const element = e.currentTarget.closest(".grocery-item");
  const id = element.dataset.id;

  list.removeChild(element);

  displayAlert("Başarıyla Kaldırıldı", "danger");

  removeFromLocalStorage(id);
};
const editItem = (e) => {
  const element = e.currentTarget.closest(".grocery-item");
  editElement = e.target.parentElement.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;

  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Düzenle";
};

const addItem = (e) => {
  e.preventDefault();
  const value = grocery.value;
  const id = uuidv4();

  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `
         <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    list.appendChild(element);
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    container.classList.add("show-container");
    displayAlert("Başarıyla Eklenildi", "success");
    addToLocalStorage(id, value);

    grocery.value = "";
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    submitBtn.textContent = "Ekle";
    displayAlert("Değer Değiştirildi", "success");

    editLocalStorage(editID, value);
    grocery.value = "";
  }
};

const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  container.classList.remove("show-container");
  localStorage.removeItem("list");
};
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();

  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStorage = (id, value) => {
  let items = getLocalStorage();
  items = items.map((item) => (item.id === id ? { ...item, value } : item));

  localStorage.setItem("list", JSON.stringify(items));
};

const createListItem = (id, value) => {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `
       <p class="title">${value}</p>
      <div class="btn-container">
          <button type="button" class="edit-btn">
              <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="delete-btn">
              <i class="fa-solid fa-trash"></i>
          </button>
      </div>
  `;
  list.appendChild(element);
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);

  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
};

const setupItems = () => {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
};

//! Olay İzleyicileri
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
