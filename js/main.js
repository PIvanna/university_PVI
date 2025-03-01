function includeHTML(file, elementId) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
    })
    .catch((error) => console.error(`Error loading ${file}:`, error));
}

document.addEventListener("DOMContentLoaded", () => {
  includeHTML("components/header.html", "header-placeholder");
  includeHTML("components/sidebar.html", "sidebar-placeholder");

  let currentPath = window.location.pathname.split("/").pop();
  const observer = new MutationObserver(() => {
    const navItems = document.querySelectorAll(".nav-item");

    if (navItems.length > 0) {
      navItems.forEach((link) => {
        link.getAttribute("href") === "./" + currentPath
          ? link.classList.add("active")
          : link.classList.remove("active");
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

function changeDisplay(elem) {
  elem.style.display != "flex"
    ? (elem.style.display = "flex")
    : (elem.style.display = "none");
}

function getElement(elem) {
  return document.querySelector(`${elem}`);
}

function checkTh() {
  const checkbox = getElement("#checkbox1");
  if (checkbox.checked) checkbox.checked = false;
}

function openDropProfile() {
  changeDisplay(getElement("#drop-profile"));
}

function openAdd() {
  const editTextElem = getElement("#edit_text");
  const saveButElem = getElement("#button-save");
  const addTextElem = getElement("#add_text");
  const createButElem = getElement("#button-create");

  if (window.getComputedStyle(editTextElem).display === "flex")
    editTextElem.style.display = "none";
  if (window.getComputedStyle(saveButElem).display === "flex")
    saveButElem.style.display = "none";
  if (window.getComputedStyle(addTextElem).display !== "flex")
    editTextElem.style.display = "flex";
  if (window.getComputedStyle(createButElem).display !== "flex")
    saveButElem.style.display = "flex";

  changeDisplay(getElement("#wrapper-shadow"));
  changeDisplay(getElement("#addStudent"));
}

function closeAdd() {
  changeDisplay(getElement("#wrapper-shadow"));
  changeDisplay(getElement("#addStudent"));
}

function createElem(tag) {
  return document.createElement(`${tag}`);
}

let mode = "none";

class Student {
  static count = 2;

  constructor(group, fname, lname, gender, birthday, status) {
    this.id = Student.count++;
    this.group = group;
    this.fname = fname;
    this.lname = lname;
    this.gender = gender;
    this.birthday = birthday;
    this.status = status;
  }

  getInfo() {
    return `${this.fname} ${this.lname}, Стать: ${this.gender}, Дата народження: ${this.birthday}, Статус: ${this.status}`;
  }
}

const students = [];

function addRow(new_student) {
  const main_tbody = getElement("#main-tbody");
  const new_tr = createElem("tr");

  const elements = {
    edit_but: createElem("button"),
    del_but: createElem("button"),
    but_cont: createElem("div"),
    img_edit: createElem("img"),
    img_del: createElem("img"),
    circle_status: createElem("div"),
    input: createElem("input"),
    label: createElem("label"),
  };

  elements.but_cont.className = "buttons-table";
  elements.circle_status.className = "status-circle";

  elements.img_edit.src = "./img/2202989.webp";
  elements.img_del.src = "./img/1214428.png";
  elements.edit_but.id = "button-edit";
  elements.del_but.id = "button-del";
  elements.input.id = elements.label.htmlFor = `checkbox${new_student.id}`;
  elements.input.type = "checkbox";
  elements.input.onclick = checkTh;

  elements.edit_but.append(elements.img_edit);
  elements.del_but.append(elements.img_del);
  elements.but_cont.append(elements.edit_but, elements.del_but);

  elements.del_but.dataset.studentId = new_student.id;
  elements.edit_but.dataset.studentId = new_student.id;
  elements.del_but.onclick = delStudent;
  elements.edit_but.onclick = editStudent;

  for (let i = 0; i < 7; i++) new_tr.append(createElem("td"));

  new_tr.children[0].append(elements.input, elements.label);
  [
    new_student.group,
    new_student.fname,
    new_student.lname,
    new_student.birthday,
  ].forEach((text, i) => (new_tr.children[i + 1].textContent = text));
  new_tr.children[5].append(elements.circle_status);
  new_tr.children[6].append(elements.but_cont);

  main_tbody.append(new_tr);
}

function checkForm() {
  const select_group = getElement("#select-group");
  const f_name = getElement("#fname");
  const l_name = getElement("#lname");
  const select_gender = getElement("#select-gender");
  const input_date = getElement("#input-date");

  if (
    select_group.value != "selected" &&
    f_name.value != "" &&
    l_name.value != "" &&
    select_gender.value != "selected" &&
    input_date.value != ""
  ) {
    const new_student = new Student(
      select_group.value,
      f_name.value,
      l_name.value,
      select_gender.value,
      input_date.value
    );
    students.push(new_student);
    addRow(new_student);
    changeDisplay(getElement("#wrapper-shadow"));
    changeDisplay(getElement("#addStudent"));
  }
}

function delStudent(event) {
  const clickedElem = event.target;

  if (clickedElem.id === "button-del") {
    const studentId = clickedElem.dataset.studentId;
    event.stopPropagation();

    const rowToDelete = clickedElem.closest("tr");
    rowToDelete.remove();

    const studentIndex = students.findIndex(
      (student) => student.id == studentId
    );
    if (studentIndex !== -1) {
      students.splice(studentIndex, 1);
      console.log(`Student with ID: ${studentId} removed from the list`);
    }
  }
}

let student = null;

function editStudent() {
  const clickedElem = event.target;
  console.log(clickedElem);
  if (clickedElem.id === "button-edit") {
    const studentId = clickedElem.dataset.studentId;
    console.log(studentId);
    event.stopPropagation();

    const studentIndex = students.findIndex(
      (student) => student.id == studentId
    );
    if (studentIndex !== -1) {
      student = students[studentIndex];
      const select_group = getElement("#select-group");
      const f_name = getElement("#fname");
      const l_name = getElement("#lname");
      const select_gender = getElement("#select-gender");
      const input_date = getElement("#input-date");
      select_group.value = student.group;
      f_name.value = student.fname;
      l_name.value = student.lname;
      select_gender.value = student.gender;
      input_date.value = student.birthday;
      openAdd();
      const addTextElem = getElement("#add_text");
      const createButElem = getElement("#button-create");
      const editTextElem = getElement("#edit_text");
      const saveButElem = getElement("#button-save");

      if (window.getComputedStyle(addTextElem).display === "flex")
        addTextElem.style.display = "none";
      if (window.getComputedStyle(createButElem).display === "flex")
        createButElem.style.display = "none";
      if (window.getComputedStyle(editTextElem).display !== "flex")
        editTextElem.style.display = "flex";
      if (window.getComputedStyle(saveButElem).display !== "flex")
        saveButElem.style.display = "flex";
    }
  }
}

function saveForm() {
  const select_group = getElement("#select-group");
  const f_name = getElement("#fname");
  const l_name = getElement("#lname");
  const select_gender = getElement("#select-gender");
  const input_date = getElement("#input-date");
  if (
    select_group.value != "selected" &&
    f_name.value != "" &&
    l_name.value != "" &&
    select_gender.value != "selected" &&
    input_date.value != ""
  ) {
    student.group = select_group.value;
    student.fname = f_name.value;
    student.lname = l_name.value;
    student.gender = select_gender.value;
    student.birthday = input_date.value;
    editRow(student);
    changeDisplay(getElement("#wrapper-shadow"));
    changeDisplay(getElement("#addStudent"));
    student = null;
  }
}

function editRow(student) {
  const btnArray = Array.from(document.querySelectorAll("#button-del"));
  const rowIndex = btnArray.findIndex((btn) => {
    const row = btn.closest("tr");
    return row.dataset.studentId == student.id;
  });

  console.log("Row Index:", rowIndex);
}
