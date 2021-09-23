"use strict";

window.addEventListener("DOMContentLoaded", start);
const allStudents = [];
const prefectList = [];

let filterBy = "all";
let bloodStatusList;

document.querySelector(".student-number").textContent = 34;
const settings = {
  filter: null,
  sortBy: null,
  sortDir: "asc",
};

function btn_click() {
  isToggeled = !isToggeled;
  console.log("click", isToggeled);
  view(isToggeled);
}

// Prototype
let Student = {
  firstname: "",
  middlename: "",
  nickname: "",
  lastname: "",
  image: "",
  house: "",
  gender: "",
  bloodstatus: "",
  prefect: false,
  expelled: false,
  inquisitorialsquad: false,
};

function start() {
  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((data) => (bloodStatusList = data));
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => prepareObjects(jsonData));
  registerButtons();
}

function prepareObjects(jsonData) {
  jsonData.forEach((object) => {
    const student = Object.create(Student);
    const fullname = object.fullname.trim();
    student.firstname = getFirstName(object.fullname);
    student.nickname = getNickName(object.fullname);
    student.middlename = getMiddleName(object.fullname);
    student.lastname = getLastName(fullname);
    student.image = getImage(student);
    student.house = getHouse(object.house);
    student.gender = object.gender;
    student.fullname = student.firstname + " " + student.lastname;
    student.bloodstatus = bloodStatus(student.lastname);
    allStudents.push(student);
  });
  console.table(allStudents);
  displayList(allStudents);
}

function getFirstName(fullname) {
  const firstName = fullname.slice(0, fullname.indexOf(" "));
  if (firstName === "") {
    const noFirstName = getMiddleName(fullname);
    const cleanData = cleanResult(noFirstName);
    return cleanData;
  }
  const cleanData = cleanResult(firstName);
  return cleanData;
}

function getMiddleName(fullname) {
  if (fullname.includes(" ") === true) {
    /* const middleName = fullname.slice(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" ")); */
    const middleName = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));

    const cleanData = cleanResult(middleName);
    return cleanData;
  }

  // Clean "" in middle name for EARNIE
}

function getNickName(fullname) {
  const nickname = fullname.slice(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
  const initial = nickname.slice(0, 1);
  if (initial === '"') {
    length = nickname.length;
    const noQuotes = nickname.slice(1, length - 1);
    const cleanData = cleanResult(noQuotes);
    return cleanData;
  }
  if (nickname.length >= 0) {
    let cleanData = cleanResult(nickname);
    return cleanData;
  }
}

function getLastName(fullname) {
  const lastName = fullname.substring(fullname.lastIndexOf(" ") + 1);
  const cleanData = cleanResult(lastName);
  return cleanData;
}

function getImage(student) {
  /* if (lastname !== undefined) { */
  const lastnameLowcase = student.lastname.toLowerCase();
  const firstnameLowcase = student.firstname.toLowerCase();
  const initialName = firstnameLowcase.slice(0, 1).toLowerCase();

  if (student.lastname === "Patil") {
    const imageName = `${lastnameLowcase}_${firstnameLowcase}.png`;
    console.log(imageName);
    return imageName;
  } else if (lastnameLowcase.includes("-")) {
    const noDash = lastnameLowcase.split("-").pop();
    const imageName = `${noDash}_${initialName}.png`;
    return imageName;
  } else {
    const imageName = `${lastnameLowcase}_${initialName}.png`;
    return imageName;
  }
}

function getHouse(house) {
  const cleanData = cleanResult(house);
  return cleanData;
}

function bloodStatus(lastName) {
  let bloodType;
  console.log(bloodStatusList);

  if (lastName) {
    bloodType = "muggle";
    if (bloodStatusList.pure.includes(lastName)) {
      bloodType = "pure";
    }
    if (bloodStatusList.half.includes(lastName)) {
      bloodType = "half";
    }
  }
  return bloodType;
}

function cleanResult(name) {
  const noSpaces = name.trim(name);
  const initial = noSpaces.substring(0, 1).toUpperCase() + noSpaces.substring(1).toLowerCase();
  const cleanData = initial;
  return cleanData;
}

function displayList(aList) {
  document.querySelector("#list").innerHTML = "";
  // build list
  aList.forEach(displayStudent);
  clickCard();
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=fullname]").textContent = student.fullname;
  clone.querySelector("[data-field=fullname1]").textContent = student.fullname;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=image]").src = "student-img/" + student.image;
  clone.querySelector(".prefect").textContent = student.prefect;
  clone.querySelector(".make-prefect").addEventListener("click", makePrefect(student));
  clone.querySelector(".make-expelled").addEventListener("click", makeExpelled(student));
  clone.querySelector(".student-box").classList.add("house-" + student.house);
  clone.querySelector(".bloodstatus").textContent = "Bloodstatus: " + student.bloodstatus;

  // append clone to list
  document.querySelector("#list").appendChild(clone);
}

//Expell student
const makeExpelled = (student) => {
  return () => {
    if (student.firstName === "Anna") {
      student.expelled === false;
      canNotExpell();
    } else if (student.expelled === true) {
      /*  student.expelled = false; */
      console.log("the student will not be expelled");
    } else if (student.expelled === false) {
      student.expelled = true;
      console.log("the student is expelled");
    }
    buildList();
  };
};

// Make student prefect
const makePrefect = (student) => {
  return () => {
    student.prefect = student.prefect ? false : true;
    if (student.prefect === true) {
      prefectList.push(student);
    }
    // Max 2 prefects pr house
    /*    const findPrefects = prefectList.filter(isSlytherin); */
    const arrHouse = [isSlytherin, isGryffindor, isHufflepuff, isRavenclaw];
    arrHouse.forEach(function (arrHouse) {
      const findPrefects = prefectList.filter(arrHouse);
      limitPrefect(findPrefects);
    });
  };
};

function limitPrefect(findPrefects) {
  const prefectCount = findPrefects.length;
  console.log(prefectCount);
  console.log(findPrefects);
  if (prefectCount > 2) {
    console.log(prefectCount);
    removeAorB(findPrefects[0], findPrefects[1]);
  }
  buildList();
}

function removeAorB(prefectsA, prefectsB) {
  // ask the user to ignore or remove A or B
  document.querySelector("#remove_aorb").classList.remove("hide");
  document.querySelector("#remove_aorb .close").addEventListener("click", closeDialog);
  document.querySelector("#remove_aorb #removea").addEventListener("click", removeA(prefectsA));
  document.querySelector("#remove_aorb #removeb").addEventListener("click", removeB(prefectsB));

  // show names on buttons
  document.querySelector(".prefect-house-allert").textContent = prefectsA.house;
  document.querySelector("#remove_aorb [data-field=prefectsA]").textContent = prefectsA.firstname + " " + prefectsA.lastname;
  document.querySelector("#remove_aorb [data-field=prefectsB]").textContent = prefectsB.firstname + " " + prefectsB.lastname;
}

function removePrefect() {
  closeDialog();
  makePrefect();
  buildList();
}

//Remove A
const removeA = (prefectsA) => {
  return () => {
    console.log("remove A is clicked");
    prefectsA.prefect = false;
    const index = prefectList.indexOf(prefectsA);
    if (index > -1) {
      prefectList.splice(index, 1);
    }
    removePrefect(prefectsA);
  };
};

// Remmove B
const removeB = (prefectsB) => {
  return () => {
    console.log("remove B is clicked");
    prefectsB.prefect = false;
    const index = prefectList.indexOf(prefectsB);
    if (index > -1) {
      prefectList.splice(index, 1);
    }
    removePrefect(prefectsB);
  };
};

// Close popup when student A og B is selected
function closeDialog() {
  document.querySelector("#remove_aorb").classList.add("hide");
  document.querySelector("#remove_aorb .close").removeEventListener("click", closeDialog);
  document.querySelector("#remove_aorb #removea").removeEventListener("click", removeA);
  document.querySelector("#remove_aorb #removeb").removeEventListener("click", removeB);
}

function clickCard() {
  document.querySelectorAll(".flip-card-x").forEach((el) =>
    el.addEventListener("click", function () {
      this.parentElement.classList.toggle("flip-card");
      console.log("filp card toggeled!");
      this.nextElementSibling.classList.toggle("hidden");
      this.lastSibling.classList.toggle("hidden");
    })
  );
}

function registerButtons() {
  document.querySelectorAll(".icon").forEach((filter) => filter.addEventListener("click", selectFilter));
  console.log("registerButtons");
  document.querySelectorAll(".sort").forEach((value) => value.addEventListener("change", selectSort));
  document.querySelector(".sort-dir").addEventListener("click", setDirection);
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected filter ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  } else if (settings.filterBy === "prefect") {
    filteredList = allStudents.filter(isPrefect);
  }
  return filteredList;
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isExpelled(student) {
  return student.expelled === true;
}
function isPrefect(student) {
  return student.prefect === true;
}

function selectSort(event) {
  const sortBy = event.target.value;
  const sortDir = event.target.value.sortDirection;

  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy}`);
  buildList(sortBy, sortDir);
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

/* function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
} */

function setDirection(e) {
  console.log(this);
  this.removeEventListener("click", setDirection);
  settings.sortDir = e.target.dataset.sortDirection;
  //toggle direction
  console.log(settings.sortDir);
  if (settings.sortDir === "desc") {
    console.log("asc shown");
    /*     e.target.innerHTML = "&#11014"; */
    settings.sortDir = "asc";
  } else {
    console.log("decending shown");
    /*     e.target.innerHTML = "&#11015"; */
    settings.sortDir = "desc";
  }
  registerButtons();
  buildList();
}

function buildList() {
  const currentList = filterList(allStudents.filter((student) => student.expelled === false));
  const sortedList = sortList(currentList);
  document.querySelector(".student-number").textContent = currentList.length;
  console.log(sortedList);
  displayList(sortedList);
}

/* function setPrefect() {} */

/* function search() {
  showStudentList(
    studentArray.filter(elm(=Z {
      return elm.target 
    
      
    )
  )} */
