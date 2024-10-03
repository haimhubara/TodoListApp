// grab all elements 
const form = document.querySelector("[data-form]");//By Attribute
const lists = document.querySelector("[data-lists]");
const input = document.querySelector("[data-input]");


//--keep array Global fo UI variable fo UI Display
checkArr = [];
let todoArr = [];
let email = "";
let userName = "";



///--ToDo Class: Each Visual Element Should be 
//--related to ToDO Object
class Todo {
    constructor(id, todo){
        this.id = id;
        this.todo = todo;
    }
}




//--Class To handle Storage Operations
//-- Of todo array
class Storage
{
    //Get Array Of Class Objects 
    static addTodStorage(todoArr){
        let storage = localStorage.setItem("todo", JSON.stringify(todoArr));
        return storage;
    }

    //Get From Storage By Key
    static getStorage(){
        let storage = localStorage.getItem("todo") === null ? 
        [] : JSON.parse(localStorage.getItem("todo"));
        return storage
    }

   

}



 async function getSession() {
    try {
        // Fetch session data from the server
        const response = await fetch("/getSession");
        if (response.ok) {
            // Parse the JSON response
            const sessionData = await response.json();
            console.log(sessionData);
            // Update the UI with session data
            // For example, you can display the user's email and name in the UI
            if (sessionData.todo && Array.isArray(sessionData.todo)) {
                sessionData.todo.forEach(element => {
                    todoArr.push(new Todo(element.id, element.todo));
                });
               // Log checkArr to see if it's populated correctly
            }
             

        } else {
            console.error("Failed to fetch session data");
            // Handle the error accordingly
        }
    } catch (error) {
        console.error("Error fetching session data:", error);
        // Handle the error accordingly
    }
}


  

//Submit
form.addEventListener("submit", (e) => {

  //Disble continue sumit processing...
 e.preventDefault();
  // If session todos have not been added yet
 //Create New Object By User Input
 let id = Math.random() * 1000000;
 const todo = new Todo(id, input.value);
// todoArr.push(todo);
 todoArr = [...todoArr,todo];
 // Generate HTML markup for each todo item
 

 UI.displayData();
 UI.clearInput();
 //add to storage


 Storage.addTodStorage(todoArr);
});

//Handle UI Operation 
class UI {

    static async main() {
        todoArr = Storage.getStorage();
        await getSession();
        console.log(todoArr);
        UI.displayData();
        UI.registerRemoveTodo();
        loginCallback();
   
    }


    static addLogoutEventListener() {
        const btnLogout = document.getElementById("btnLogout");
    
        // Add event listener to the logout button
        btnLogout.addEventListener("click", async () => {
          try {
            const response = await fetch("/logout");
            if (response.ok) {
              console.log("Logout successful");
              UI.deleteData();
      
              window.location.href = "/login"; // Change "/login" to the actual URL of your login page
            } else {
              console.error("Failed to logout");
              // Handle the error accordingly
            }
          } catch (error) {
            console.error("Error logging out:", error);
            // Handle the error accordingly
          }
        });
      }
  
    // Add btnSave click event listener inside the UI class
    static addSaveEventListener() {
      const btnSave = document.getElementById("btnSave");
     
    }// Add btnSave click event listener inside the UI class
static addSaveEventListener() {
  const btnSave = document.getElementById("btnSave");
  btnSave.addEventListener("click", async () => {
      try {
          const response = await fetch("/saveTodos", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ todos: todoArr })
          });
          if (response.ok) {
              console.log("Todos saved to MongoDB");
              
          } else {
              console.error("Failed to save todos to MongoDB");
              // Handle the error accordingly
          }
      } catch (error) {
          console.error("Error saving todos to MongoDB:", error);
          // Handle the error accordingly
      }
  });
}

    
static deleteData() {
    // Clear the todo container in the HTML
    lists.innerHTML = "";
    // Clear the todoArr array
    todoArr = [];
    // Clear the localStorage
    Storage.addTodStorage([]);
}
  
    
    static displayData(){
        
      //-Generate Html
      //-each Delete Icon Injected with 
      //--data-id = {id of the object}
      
    let displayData = todoArr.map((item) => {
        return `
            <div class="todo">
            <p>${item.todo}</p>
            <span class="remove" data-id = ${item.id}>🗑️</span>
            </div>
          `
       });
       lists.innerHTML = displayData.join(" ");
      //--Put generated html in a container   
    }
 
  //--Clear Input Element
  static clearInput(){
     
      input.value = "";
  }

  //--Remove Element When Clicked
  static registerRemoveTodo(){
      //--Register Click  For Deleting a toto row
      //--The Click is on the List Div Container

      lists.addEventListener("click", (e) => {
         
          console.log(e.target.outerHTML);//Inner Clicked 
          console.log(e.currentTarget.outerHTML);//Registered Clicked

          if(e.target.classList.contains("remove")){
              //Get Id of clicked delete
              let btnId = e.target.dataset.id;
              //--Remove Element From HTML DOM
              
              //remove from array.
              UI.removeArrayTodo(btnId, e.target);

          }
      
      });
  }
 
 //Remove Element From UI And Update LocalStorage
  static removeArrayTodo(id,elementClicked){
      
      elementClicked.parentElement.remove();
      todoArr = todoArr.filter((item) => item.id !== +id);
      Storage.addTodStorage(todoArr);
 
    }
 
}

function loginCallback() {
    UI.addSaveEventListener();
    UI.addLogoutEventListener();
  }


    
 async function main() {
    await UI.main();
}

// Call the main function
main();  

 
