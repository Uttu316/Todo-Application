let todos = JSON.parse(localStorage.getItem("todos")) || [];

$(() => {
  const input = $("#todo-input");
  const btn = $("#add-btn");
  const clearAllBtn = $("#clear-all-btn");
  const editInput = $('#todo-edit-input');
  const modalSaveBtn = $('#todo-madal-save-btn');

  changeFooter(todos);
  initList(todos);

  input.on({
    change: (event) => {
      const { value } = event.target;
      inputValidation(value,input);
    },
    keydown: (event) => {
      const { value } = event.target;
      //if pressed Enter
      if (event.keyCode === 13) {
        if (inputValidation(value,input)) {
          onAddTask(todos);
        }
      }
    },
  });

  editInput.on({
    change: (event) => {
      const { value } = event.target;
      inputValidation(value,editInput);
    },
    keydown: (event) => {
      const { value } = event.target;
      //if pressed Enter
      if (event.keyCode === 13) {
        if (inputValidation(value,editInput)) { 
          onEditTask();
        }
      }
    },
  });

  clearAllBtn.click((event) => {
    event.preventDefault();
    onClearAll(todos);
  });

  btn.click((event) => {
    event.preventDefault();
    onAddTask(todos);
  });
  modalSaveBtn.click((event)=>{
    event.preventDefault();
    onEditTask();
  })


  
});

//checks if entered value is correct or not
const isValidatedInput = (value) => {
  return /^[A-Za-z0-9/ /]*$/.test(value); //true//false
};

const createListItem = (taskObj) => {
  const { id, task } = taskObj;
  const li = `<li class="list-group-item text-break d-flex justify-content-between align-items-center todo-list-item"  data-id=${id}>
                  <span>${task}</span>
                  <div class="btn-group ms-2" role="group" >
                    <button type="button" class="btn btn-sm py-1 px-2 btn-secondary text-white todo-edit-btn" data-bs-toggle="modal" data-bs-target="#todo-edit-modal"><i class="fa-solid fa-pen"></i></button>
                    <button type="button" class="btn btn-sm py-1 px-2 btn-danger text-white todo-dlt-btn"><i class="fa-solid fa-trash"></i></button>
                  </div>
              </li>`;

  const liDomElement = $(li);

 const dltBtn = liDomElement.find('.todo-dlt-btn');
  dltBtn.click((event)=>{
    todos =  todos.filter((i)=>i.id!==id);
    
    const elToRemove = $(`.todo-list-item[data-id=${id}]`);
    elToRemove.remove()

    changeFooter(todos)
  
    localStorage.setItem("todos", JSON.stringify(todos));
  })




 const editBtn = liDomElement.find('.todo-edit-btn');
  editBtn.click((event)=>{
    const elToEdit = $(`.todo-list-item[data-id=${id}] span`);
    const latestValue = elToEdit.html()
    const editInput = $('#todo-edit-input');
    editInput[0].value = latestValue;
    editInput.attr('data-id',id) 
  })
  return liDomElement;
};

const onAddTask = (todos) => {
  const list = $("#todo-list");

  const input = $("#todo-input");
  const text = input[0].value;
  if (!text) return;
  const taskObj = {
    id: new Date().getTime().toString(),
    task: text,
  };
  todos.push(taskObj);

  changeFooter(todos);
  const li = createListItem(taskObj);
  list.prepend(li);
  input[0].value = "";

  localStorage.setItem("todos", JSON.stringify(todos));
};

const changeFooter = (todos) => {
  const clearAllBtn = $("#clear-all-btn");
  const todosFooter = $("#todo-footer");
  const todosNumber = $("#todos-number");

  todosNumber.html(todos.length);
  if (todos.length === 0) {
    clearAllBtn.hide();
    todosFooter.addClass("justify-content-center");
    todosFooter.removeClass("justify-content-between");
  } else {
    clearAllBtn.show();
    todosFooter.removeClass("justify-content-center");
    todosFooter.addClass("justify-content-between");
  }
};

const initList = (todos) => {
  const list = $("#todo-list");
  todos.forEach((item) => {
    const li = createListItem(item);
    list.prepend(li);
  });
};

const onClearAll = (todos) => {
  while (todos.length > 0) {
    todos.pop();
  }
  // todos = []
  const list = $("#todo-list");
  list.html("");
  changeFooter(todos);
  localStorage.setItem("todos", JSON.stringify(todos));
};

const inputValidation = (value,input) => {
  const btn = $("#add-btn");
  const isValid = isValidatedInput(value);

  if (!isValid) {
    input.addClass("invalid");
    btn[0].disabled = true;
  } else {
    input.removeClass("invalid");
    btn[0].disabled = false;
  }
  return isValid;
};

const onEditTask = ()=>{

  const editInput = $('#todo-edit-input');
 const id = editInput.attr('data-id');
 const value = editInput[0].value;
 if (!value) return;
 const elToEdit = $(`.todo-list-item[data-id=${id}] span`)
 elToEdit.html(value);

 const index = todos.findIndex((i)=>i.id===id);
 if(index!=-1){
    todos[index] = {...todos[index],task:value}
 }
 const closebtn = $('#todo-modal-close-btn')
 closebtn.click()

 localStorage.setItem("todos", JSON.stringify(todos));

}