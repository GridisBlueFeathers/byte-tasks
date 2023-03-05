import { API } from './components/API';
import { Form } from './components/Form';
import { Task } from './components/Task';

import './styles/style.css';

const appElement = document.getElementById("app");
let authToken = localStorage.getItem("token");

const renderErrorCause = (error) => {
    const details = error.cause;
    
    details.forEach(detail => {
        const deatailPathSpanElement = document.getElementById(detail.path[0]).nextSibling;
        deatailPathSpanElement.innerText = detail.message;
    });
}

const loginFunction = async (body) => {
    try {
        const loginRequest = await new API().loginRequest(body);

        authToken = loginRequest.token;
        localStorage.setItem("token", authToken);

        document.getElementById("loginFormContainer").remove();

        renderAppPart(authToken);
    } catch(error) {
        renderErrorCause(error);
    }
}

const registerFunction = async (body) => {
    try {
        await new API().registerRequest(body);
        
        const formToggleElement = document.getElementById("formToggle");
        formToggleElement.dispatchEvent(new Event("click"));
    } catch(error) {
        renderErrorCause(error);
    }
}

const taskFunction = async (body) => {
    try {
        const taskRequest = await new API().taskPostRequest({
            token: authToken,
            body: body,
        });

        new Task(taskRequest).renderTaskElement();
    } catch(error) {
        renderErrorCause(error);
    }
}

const renderLoginPart = () => {
    const loginForm = new Form({
        name: "login",
        buttonText: "submit",
        APIEndpointFunction: loginFunction,
        inputTitlesArr: ["email", "password"],
    });
    
    const registerForm = new Form({
        name: "register",
        buttonText: "submit",
        APIEndpointFunction: registerFunction,
        inputTitlesArr: ["email", "name", "password"],
    });
    
    const loginFormElement = loginForm.createFormElement();
    const registerFormElement = registerForm.createFormElement();
    
    const loginContainer = document.createElement("div");

    const formToggleElement = document.createElement("button");
    const formToggleClickHandler = () => {
        switch(formToggleElement.innerText) {
            case "REGISTER":
                loginFormElement.remove();
                loginContainer.append(registerFormElement);
                formToggleElement.innerText = "Login";
                break;
            
            case "LOGIN":
                registerFormElement.remove();
                loginContainer.append(loginFormElement);
                formToggleElement.innerText = "Register";
                break;
        }
    }
    
    formToggleElement.setAttribute("id", "formToggle");
    formToggleElement.innerText = "Register";
    formToggleElement.addEventListener("click", formToggleClickHandler)
    
    loginContainer.classList.add("formContainer");
    loginContainer.setAttribute("id", "loginFormContainer");
    loginContainer.append(formToggleElement, loginFormElement);

    appElement.append(loginContainer);
}

const requestAppPart = async (authToken) => {
    const { name } = await new API().selfRequest(authToken);
    const tasks = await new API().taskGetRequest(authToken);
    
    return {
        username: name,
        tasksArr: tasks
    }
}

const renderLogout = (username, appContainer) => {
    const firstLetter = username[0].toUpperCase();

    const logoutElement = document.getElementById("logout");
    const logoutUserElement = document.getElementById("logout__user");
    const logoutTextElement = document.getElementById("logout__text");

    logoutElement.style.display = "flex";
    logoutUserElement.innerText = firstLetter;

    logoutTextElement.addEventListener("click", () => {
        logoutElement.style.display = "none";
        logoutUserElement.innerText = "";
        
        appContainer.remove();
        
        localStorage.removeItem('token');
        renderLoginPart();
    })

}

const renderAppPart = async (authToken) => {
    const { username, tasksArr } = await requestAppPart(authToken);
    
    const appContainer = document.createElement("div");
    const formContainer = document.createElement("div");
    const tasksContainer = document.createElement("div");
    
    appContainer.classList.add("appContainer");
    appContainer.setAttribute("id", "appContainer");
    
    formContainer.classList.add("formContainer");
    
    const taskForm = new Form({
        name: "add task",
        buttonText: "add",
        APIEndpointFunction: taskFunction,
        inputTitlesArr: ["name", "description"],
    });
    
    const taskElement = taskForm.createFormElement();
    formContainer.append(taskElement);
    
    
    tasksContainer.classList.add("tasksContainer");
    tasksContainer.setAttribute("id", "tasksContainer");

    tasksArr.forEach((taskObj) => {
        new Task(taskObj).renderTaskElement();
    });

    appContainer.append(formContainer, tasksContainer);
    
    appElement.append(appContainer)
    renderLogout(username, appContainer);
}

switch(!authToken) {
    case true:
        renderLoginPart();
        break;

    case false:
        renderAppPart(authToken);
        break;
}
