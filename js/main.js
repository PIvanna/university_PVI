const getElement = document.querySelector.bind(document);


let addIS = false;
let editIs = false;
const select_group = getElement("#select-group");
const f_name = getElement("#fname");
const l_name = getElement("#lname");
const select_gender = getElement("#select-gender");
const input_date = getElement("#input-date");



class Student {
  static count = 2;

  constructor(group, name, gender, birthday, status) {
    this.id = Student.count++;
    this.group = group;
    this.name = name;
    this.gender = gender;
    this.birthday = birthday;
    this.status = status;
  }


}

const students = [];
let student = null;



document.addEventListener("DOMContentLoaded", function() {
  loadPage();
});

function loadPage() {
  const new_student = new Student(
    "PZ-21",
    "Ivanna Pavlyshyn",
    "Female",
    "07/07/2006",
    "active"
  );
  students.push(new_student);
  addRow(new_student);
}

function changeDisplayFlex(elem) {
  elem.style.display =
    getComputedStyle(elem).display !== "flex" ? "flex" : "none";
}

function changeDisplayBlock(elem) {
  elem.style.display =
    getComputedStyle(elem).display !== "block" ? "block" : "none";
}

function checkTh() {
  const checkbox = getElement("#checkbox1");
  if (checkbox.checked) checkbox.checked = false;
}

function openDropProfile() {
  changeDisplayFlex(getElement("#drop-profile"));
}



function openAdd() {
  addIS = true;
  editIs = false;
  openWind();
}

function openWind() {
  const elements = {
    addText: getElement("#add_text"),
    buttonCreate: getElement("#button-create"),
    editText: getElement("#edit_text"),
    buttonSave: getElement("#button-save"),
    wrapperShadow: getElement("#wrapper-shadow"),
    addStudent: getElement("#addStudent"),
  };

  if (addIS || editIs) {
    const isAdd = addIS;

    elements.addText.style.display = isAdd ? "block" : "none";
    elements.buttonCreate.style.display = isAdd ? "block" : "none";
    elements.editText.style.display = isAdd ? "none" : "block";
    elements.buttonSave.style.display = isAdd ? "none" : "block";

    addIS = false;
    editIs = false;
  }

  changeDisplayFlex(elements.wrapperShadow);
  changeDisplayFlex(elements.addStudent);
}

function closeAdd() {
  changeDisplayFlex(getElement("#wrapper-shadow"));
  changeDisplayFlex(getElement("#addStudent"));
}

function createElem(tag) {
  return document.createElement(`${tag}`);
}



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
  if(new_student.status == "active"){
    elements.circle_status.style.backgroundColor = "green";
  }

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
    new_student.name,
    new_student.gender,
    new_student.birthday,
  ].forEach((text, i) => (new_tr.children[i + 1].textContent = text));
  new_tr.children[5].append(elements.circle_status);
  new_tr.children[6].append(elements.but_cont);

  main_tbody.append(new_tr);
}

function checkValidForm() {
  return (
    select_group.value != "selected" &&
    f_name.value != "" &&
    l_name.value != "" &&
    select_gender.value != "selected" &&
    input_date.value != ""
  );
}

function checkForm() {
  if (checkValidForm()) {
    const new_student = new Student(
      select_group.value,
      f_name.value +  l_name.value,
      select_gender.value,
      input_date.value,
      "disabled"
    );
    students.push(new_student);
    addRow(new_student);
    changeDisplayFlex(getElement("#wrapper-shadow"));
    changeDisplayFlex(getElement("#addStudent"));
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
      select_group.value = student.group;
      f_name.value = student.fname;
      l_name.value = student.lname;
      select_gender.value = student.gender;
      input_date.value = student.birthday;

      addIS = false;
      editIs = true;
      openWind();
    }
  }
}

function saveForm() {
  if (checkValidForm()) {
    student.group = select_group.value;
    student.fname = f_name.value;
    student.lname = l_name.value;
    student.gender = select_gender.value;
    student.birthday = input_date.value;
    editRow(student);
    changeDisplayFlex(getElement("#wrapper-shadow"));
    changeDisplayFlex(getElement("#addStudent"));
    student = null;
  }
}

function editRow(student) {
  const btnArray = Array.from(document.querySelectorAll("#button-del"));

  const rowIndex = btnArray.findIndex(
    (btn) => btn.dataset.studentId == student.id
  );

  if (rowIndex !== -1) {
    const row = btnArray[rowIndex].closest("tr");
    [student.group, student.fname, student.lname, student.birthday].forEach(
      (text, i) => (row.children[i + 1].textContent = text)
    );
  } else {
    console.log("Student not found");
  }
}

function bell(){
  document.getElementById('bell').animate([
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(15deg)' },
    { transform: 'rotate(-15deg)' },
    { transform: 'rotate(10deg)' },
    { transform: 'rotate(-10deg)' },
    { transform: 'rotate(0deg)', offset: 0.5 }
  ], {
    duration: 1500,
    iterations: 1
  });
}