const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const apiKey = "675d01fc60a208ee1fde1bca";
const loadingScreen = document.querySelector(".loading");
let allToDos = [];
getAllToDO();
formElement.addEventListener("submit", (e)=>{
    e.preventDefault();
    addTodo();
})
async function addTodo(){
    showLoading();
    const obj = {
        title:inputElement.value ,
        apiKey:apiKey,
    };
    
    const toDo = {
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "content-type":"application/json",
        },
    };
    const response = await fetch("https://todos.routemisr.com/api/v1/todos",toDo);
    if(response.ok){
        const data = await response.json();
        if(data.message === "success"){
            toastr.success('Added Successfully', 'Toastr App');
            await getAllToDO();
            formElement.reset();
        }
        else{
            toastr.error("Title is Empty");
        }
    }
    hideLoading();
}
async function getAllToDO(){
    showLoading();
    const response = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`);
    if(response.ok){
        const data = await response.json();
        if(data.message === "success"){
            allToDos = data.todos;
            displayData();
        }
    }
    hideLoading();
}
function displayData(){
    let cartona = ""
    for(const item of allToDos){
        cartona += `
          <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2">
                <span onclick="markComplelted('${item._id}')" style = "${item.completed ? '   text-decoration: line-through;':''}" class="task-name">${item.title}</span>
                <div class="d-flex align-items-center gap-4">
                    ${item.completed ? '<span><i class="fa-solid fa-square-check" style="color: #B197FC;"></i></span>':''}
                    <span onclick="deleteTodo('${item._id}')" class="icon"><i class="fa-solid fa-trash-can"></i></span>
                </div>
            </li>
        `
    }
    document.querySelector(".task-container").innerHTML = cartona;
    changeProgress();
}
async function deleteTodo(idTodo){
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async(result) => {
        if (result.isConfirmed) {
            showLoading();
            const todoData = 
        {
            todoId:idTodo,
        };
        const response = await fetch("https://todos.routemisr.com/api/v1/todos" , {
            method:"DELETE",
            body:JSON.stringify(todoData),
            headers:{
                "content-type":"application/json",
            }
        })
        if(response.ok){
            const data = await response.json();
            if(data.message === "success"){
                Swal.fire({
                    title: "Deleted!",
                    text: "Your To Do List has been deleted.",
                    icon: "success"
                  });
               await getAllToDO();
            }
        }
        hideLoading();
        }
      });
}
async function markComplelted(idTodo){
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Complete it!"
      }).then(async(result) => {
        if (result.isConfirmed) {
            showLoading();
            const todo = {
                todoId:idTodo,
            };
            const response = await fetch("https://todos.routemisr.com/api/v1/todos", {
                method:"PUT",
                body:JSON.stringify(todo),
                headers:{
                    "content-type":"application/json",
                }
            })
            if(response.ok){
                const data = await response.json();
                if(data.message === "success"){
                    Swal.fire({
                        title: "Completed!",
                        text: "Your To Do List has been Completed.",
                        icon: "success"
                      });
                    await getAllToDO();
                }
                
            }
            hideLoading();
        }
      });
}
function showLoading(){
    loadingScreen.classList.remove("d-none");
}
function showLoading(){
    loadingScreen.classList.remove("d-none");
}
function hideLoading(){
    loadingScreen.classList.add("d-none");
}
function changeProgress(){
    const copmletedTask = allToDos.filter((todo)=> todo.completed).length
    const totalTask = allToDos.length;
    document.getElementById("progress").style.width = `${(copmletedTask / totalTask)*100}%`
    const statusNumber = document.querySelectorAll(".status-number span");
    statusNumber[0].innerHTML = copmletedTask;
    statusNumber[1].innerHTML = totalTask;
}