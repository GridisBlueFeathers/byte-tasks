export class Input {
    constructor(name) {
        this.name = name;
    }

    createInputElement() {
        const inputContainer = document.createElement("div");
        const inputLabel = document.createElement("label");
        const inputInput = document.createElement("input");
        const inputError = document.createElement("span");

        inputInput.setAttribute("id", this.name);
        if(this.name === "password") {
            inputInput.setAttribute("type", "password");
        }

        inputLabel.setAttribute("for", this.name);

        inputLabel.innerText = this.name;
        
        inputContainer.append(inputLabel, inputInput, inputError);

        return inputContainer;
    }
}