import { Input } from "./Input";

export class Form {
    constructor({ name, buttonText, APIEndpointFunction, inputTitlesArr }) {
        this.name = name;
        this.buttonText = buttonText;
        this.inputTitlesArr = inputTitlesArr;
        this.APIEndpointFunction = APIEndpointFunction;

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const formInputsObj = {};

        this.inputTitlesArr.forEach(inputTitle => {
            const inputElement = document.getElementById(inputTitle);
            const inputValue = inputElement.value;
            formInputsObj[inputTitle] = inputValue;

            const inputSpanElement = inputElement.nextElementSibling;
            inputSpanElement.innerText = "";
        });
        
        const body = JSON.stringify(formInputsObj);
        this.APIEndpointFunction(body);
    }

    createFormElement() {
        const formElement = document.createElement("form");
        const formTitleElement = document.createElement("h3");
        const formButton = document.createElement("button");

        formTitleElement.innerText = this.name;
        formElement.append(formTitleElement);


        this.inputTitlesArr.forEach(inputTitle => {
            const input = new Input(inputTitle);

            const inputContainer = input.createInputElement();
            
            formElement.append(inputContainer);
        });

        formButton.innerText = this.buttonText;
        formElement.append(formButton);
        
        formElement.addEventListener("submit", this.handleSubmit);

        return formElement;

    }
}