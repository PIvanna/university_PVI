const getElement = document.querySelector.bind(document);

let addIS = false;
let editIs = false;
const select_group = getElement("#select-group");
const f_name = getElement("#fname");
const l_name = getElement("#lname");
const select_gender = getElement("#select-gender");
const input_date = getElement("#input-date");

let clickedElemToDel = null;
let all = false;

class Student {
  static count = loadStudentsFromLocalStorage().length + 1;

  constructor(group, name, gender, birthday, status) {
    this.id = Student.count++;
    this.group = group;
    this.name = name;
    this.gender = gender;
    this.birthday = birthday;
    this.status = status;
  }
}

let student = null;
let students;
document.addEventListener("DOMContentLoaded", function () {
  if (
    window.location.pathname.split("/").pop() == "index.html" ||
    window.location.pathname.split("/").pop() == ""
  ) {
    students = loadStudentsFromLocalStorage();

    loadPage();
  }
});

function saveStudentsToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function loadStudentsFromLocalStorage() {
  const storedStudents = localStorage.getItem("students");
  return storedStudents ? JSON.parse(storedStudents) : [];
}

function loadPage() {
  const new_student = new Student(
    "PZ-21",
    "Ivanna Pavlyshyn",
    "female",
    "2006-07-07",
    "Online"
  );
  const exists = students.some(
    (s) =>
      s.group === new_student.group &&
      s.name === new_student.name &&
      s.gender === new_student.gender &&
      s.birthday === new_student.birthday &&
      s.status === new_student.status
  );

  if (!exists) {
    students.push(new_student);
    saveStudentsToLocalStorage();
  } else {
    console.log("Student with this ID already exists in localStorage");
    addRow(new_student);
  }
}

function changeDisplayFlex(elem) {
  elem.style.display =
    getComputedStyle(elem).display !== "flex" ? "flex" : "none";
}

function changeDisplayBlock(elem) {
  elem.style.display =
    getComputedStyle(elem).display !== "block" ? "block" : "none";
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

function resetForm() {
  select_group.value = "selected";
  f_name.value = "";
  l_name.value = "";
  select_gender.value = "selected";
  input_date.value = "";
}

function closeAdd() {
  changeDisplayFlex(getElement("#wrapper-shadow"));
  changeDisplayFlex(getElement("#addStudent"));
  resetForm();
}

function closeDel() {
  changeDisplayFlex(getElement("#wrapper-shadow"));
  changeDisplayFlex(getElement("#delete-wraper"));
  clickedElemToDel = null;
  if (!getElement("#checkbox1").checked) {
    getElement("#button-del-all").style.display = "none";
  }
  all = false;
}

function openDelOne() {
  openDel();
  all = false;
  clickedElemToDel = event.target;
  const studentId = clickedElemToDel.dataset.studentId;
  const studentIndex = students.findIndex((student) => student.id == studentId);
  if (studentIndex !== -1) {
    getElement(
      "#war_text"
    ).textContent = `Are you sure you want to delete user ${students[studentIndex].name}`;
  }
}

function openDel() {
  changeDisplayFlex(getElement("#wrapper-shadow"));
  changeDisplayFlex(getElement("#delete-wraper"));
}

function createElem(tag) {
  return document.createElement(`${tag}`);
}

function butAvai(elem) {
  let parentTd = elem.parentElement.parentElement.children[6];
  let but_edit = parentTd.querySelector("#button-edit");
  let but_del = parentTd.querySelector("#button-del");
  const buts = [but_del, but_edit];

  elem.checked
    ? buts.forEach((but) => {
        but.disabled = false;
        but.style.backgroundColor = "transparent";
      })
    : buts.forEach((but) => {
        but.disabled = true;
        getElement("#checkbox1").checked = false;
        getElement("#button-del-all").style.display = "none";
        but.style.backgroundColor = "rgb(222 222 222 / 55%)";
      });

  if (elem.checked) {
    elem.checked
      ? Array.from(document.querySelectorAll('input[type="checkbox"]'))
          .splice(1)
          .forEach((but) => {
            if (but.checked) {
              getElement("#checkbox1").checked = true;
              getElement("#button-del-all").style.display = "flex";
            }
          })
      : null;
  }
}

function checkTh() {
  const elem = event.target;
  if (elem.id == "checkbox1") {
    elem.checked
      ? Array.from(document.querySelectorAll('input[type="checkbox"]'))
          .splice(1)
          .forEach((but) => {
            but.checked = true;
            butAvai(but);
            getElement("#button-del-all").style.display = "flex";
          })
      : Array.from(document.querySelectorAll('input[type="checkbox"]'))
          .splice(1)
          .forEach((but) => {
            but.checked = false;
            butAvai(but);
            getElement("#button-del-all").style.display = "none";
          });
  }
}

function delAll() {
  all = true;
  openDel();
  getElement(
    "#war_text"
  ).textContent = `Are you sure you want to delete all users`;
}

function checkBox() {
  let checkedAll = true;
  Array.from(document.querySelectorAll('input[type="checkbox"]'))
    .splice(1)
    .forEach((but) => {
      if (!but.checked) {
        checkedAll = false;
      }
    });
  if (checkedAll) {
    getElement("#button-del-all").style.display = "flex";
    getElement(`input[type="checkbox"`).checked = true;
  }
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
  if (new_student.status == "Online") {
    elements.circle_status.style.backgroundColor = "#4286f5";
  }

  elements.img_edit.src = "./img/2202989.webp";
  elements.img_del.src = "./img/1214428.png";
  elements.img_edit.alt = "edit";
  elements.img_del.alt = "delete";
  elements.edit_but.id = "button-edit";
  elements.del_but.id = "button-del";
  elements.input.id = elements.label.htmlFor = `checkbox${new_student.id}`;
  elements.label.innerHTML = "hi";
  elements.label.style.fontSize = "0";
  elements.input.type = "checkbox";
  elements.input.checked = true;
  elements.input.onclick = function (event) {
    butAvai(event.target);
  };

  elements.edit_but.append(elements.img_edit);
  elements.del_but.append(elements.img_del);
  elements.but_cont.append(elements.edit_but, elements.del_but);

  elements.del_but.dataset.studentId = new_student.id;
  new_tr.dataset.studentId = new_student.id;
  elements.edit_but.dataset.studentId = new_student.id;
  elements.del_but.onclick = openDelOne;
  elements.edit_but.onclick = editStudent;

  new_tr.onclick = openInfo;
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
  checkBox();
}

function checkBirthday() {
  let date = input_date.value;
  let block = document.querySelector(".block-error");

  let datePattern =
    /^(19[1-9]\d|20[0-2]\d|2025)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (!datePattern.test(date)) {
    block.style.display = "block";
    block.textContent = "Invalid date format. Use MM-DD-YYYY.";
    return false;
  }

  let [year, month, day] = date.split("-").map(Number);
  let currentYear = new Date().getFullYear();
  if (year < currentYear - 80 || year > currentYear - 16) {
    block.style.display = "block";
    block.textContent = `Enter the year from [${currentYear - 80}; ${currentYear - 16}]`;
    return false;
  }

  let daysInMonth = new Date(year, month, 0).getDate();

  if (day > daysInMonth) {
    block.style.display = "block";
    block.textContent = `Enter the day from [01; ${daysInMonth}]`;
    return false;
  }

  block.style.display = "none";
  return true;
}

function checkName() {
  let name = f_name.value;
  const pattern = /^[A-Z]{1}[a-z-]{2,20}(\s*[A-Z]{1}[a-z-]{2,20})?$/;
  let block = document.querySelectorAll(".block-error")[1];
  console.log(pattern.test(name));
  if (!pattern.test(name)) {
    console.log(block);
    block.style.display = "block";
    block.style.textContent = "Enter name that have min 2 letter and only them";
    return false;
  } else {
    block.style.display = "none";
    return true;
  }
}

function checkSurname() {
  let surname = l_name.value;
  console.log("hi");
  const pattern = /^[A-Z]{1}[a-z]{2,20}(\s*[A-Z]{1}[a-z]{2,20})?$/;
  let block = document.querySelectorAll(".block-error")[2];
  console.log(pattern.test(surname));
  if (!pattern.test(surname)) {
    console.log(block);
    block.style.display = "block";
    block.style.textContent =
      "Enter surname that have min 2 letter and only them";
    return false;
  } else {
    block.style.display = "none";
    return true;
  }
}

function checkValidForm() {
  let blockGroup = document.querySelectorAll(".block-error")[3];
  let blockGender = document.querySelectorAll(".block-error")[4];
  if (select_group.value == "selected") {
    blockGroup.style.display = "block";
    return false;
  } else {
    blockGroup.style.display = "none";
  }

  if (select_gender.value == "selected") {
    blockGender.style.display = "block";
    return false;
  } else {
    blockGender.style.display = "none";
  }

  return (
    select_group.value != "selected" &&
    checkName() &&
    checkSurname() != "" &&
    select_gender.value != "selected" &&
    checkBirthday()
  );
}

function checkForm() {
  if (checkValidForm()) {
    const new_student = new Student(
      select_group.value,
      f_name.value + " " + l_name.value,
      select_gender.value,
      input_date.value,
      "Ofline"
    );
    students.push(new_student);
    saveStudentsToLocalStorage();
    addRow(new_student);
    resetForm();
    changeDisplayFlex(getElement("#wrapper-shadow"));
    changeDisplayFlex(getElement("#addStudent"));
  }
}

function delStudent() {
  if (all) {
    students.length = 0;
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");

    rows.forEach((row, index) => {
      if (index !== 0) {
        row.remove();
      }
    });
    getElement("#checkbox1").checked = false;
  } else {
    if (clickedElemToDel.id === "button-del") {
      const studentId = clickedElemToDel.dataset.studentId;
      event.stopPropagation();

      const rowToDelete = clickedElemToDel.closest("tr");
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
  saveStudentsToLocalStorage();
  closeDel();
}

function editStudent() {
  const clickedElem = event.target;
  if (clickedElem.id === "button-edit") {
    const studentId = clickedElem.dataset.studentId;
    event.stopPropagation();

    const studentIndex = students.findIndex(
      (student) => student.id == studentId
    );
    if (studentIndex !== -1) {
      student = students[studentIndex];
      const [firstName, lastName] = student.name.split(" ");
      select_group.value = student.group;
      f_name.value = firstName || "";
      l_name.value = lastName || "";
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
    resetForm();
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
    students[rowIndex].group = student.group;
    students[rowIndex].name = student.fname + " " + student.lname;
    students[rowIndex].gender = student.gender;
    students[rowIndex].birthday = student.birthday;
    const row = btnArray[rowIndex].closest("tr");
    [
      student.group,
      student.fname + " " + student.lname,
      student.gender,
      student.birthday,
    ].forEach((text, i) => (row.children[i + 1].textContent = text));
    saveStudentsToLocalStorage();
    console.log(JSON.stringify(students[rowIndex], null, 2));
  } else {
    console.log("Student not found");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const observer = new MutationObserver(() => {
    let notif = document.getElementById("sign-not");
    if (notif) {
      observer.disconnect();
      if (localStorage.getItem("notifHidden") === "true")
        notif.style.display = "none";
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});

function hideNotif() {
  let notif = getElement("#sign-not");
  if (notif) {
    notif.style.display = "none";
    localStorage.setItem("notifHidden", "true");
  }
}

function bell() {
  document
    .getElementById("bell")
    .animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(15deg)" },
        { transform: "rotate(-15deg)" },
        { transform: "rotate(10deg)" },
        { transform: "rotate(-10deg)" },
        { transform: "rotate(0deg)", offset: 0.5 },
      ],
      {
        duration: 1500,
        iterations: 1,
      }
    );
  localStorage.setItem("notifHidden", "false");
  let notif = getElement("#sign-not");
  notif.style.display = "block";
}

function okClick() {
  addIS ? (checkValidForm() ? checkForm() : closeAdd()) : closeAdd();
}

function burgerMenu() {
  document.querySelector("aside").classList.toggle("open");
}

function closeInfo() {
  changeDisplayFlex(getElement("#wrapper-shadow"));
  changeDisplayFlex(getElement("#info-student-wraper"));
}

function openInfo(event) {
  const { target, currentTarget } = event;
  const studentId = currentTarget.dataset.studentId;
  if (window.innerWidth >= 850 || target.id === "button-del") {
    return;
  }
  const student = students.find((student) => student.id == studentId);
  if (!student) return;
  const elements = {
    group_det: getElement("#group-det"),
    username_det: getElement("#username-det"),
    gender_det: getElement("#gender-det"),
    birthday_det: getElement("#birthday-det"),
    status_det: getElement("#status-det"),
  };
  changeDisplayFlex(getElement("#wrapper-shadow"));
  changeDisplayFlex(getElement("#info-student-wraper"));
  elements.group_det.innerHTML = `<span class="info-cap">Group: </span>${student.group}`;
  elements.username_det.innerHTML = `<span class="info-cap">Name: </span>${student.name}`;
  elements.gender_det.innerHTML = `<span class="info-cap">Gender: </span>${student.gender}`;
  elements.birthday_det.innerHTML = `<span class="info-cap">Birthday: </span>${student.birthday}`;
  elements.status_det.innerHTML = `<span class="info-cap">Status: </span>${student.status}`;
}
