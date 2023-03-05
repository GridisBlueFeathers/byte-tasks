import { API } from "./API";

export class Task {
    constructor({ name, description, _id, createdAt, isActive, isFinished, timeTracked }) {
        this.name = name;
        this.description = description;
        this.id = _id;
        this.createdAt = createdAt;
        this.isActive = isActive;
        this.isFinished = isFinished;
        this.timeTracked = timeTracked;
        this.element = document.createElement("div");
        this.timeTrackedId = null;

        this.handleDelete = this.handleDelete.bind(this);
        this.handleFinished = this.handleFinished.bind(this);
        this.handleTrackTime = this.handleTrackTime.bind(this);
        this.timerCounting = this.timerCounting.bind(this);
    }

    formatDateForCreatedAt(miliseconds) {
        const flooredSeconds = Math.floor(miliseconds / 1000);

        const hours = !Math.floor(flooredSeconds / 3600) ? "00" : Math.floor(flooredSeconds / 3600);

        const minutes = !Math.floor((flooredSeconds - (Number(hours) * 3600)) / 60) ? "00" : Math.floor((flooredSeconds - (Number(hours) * 3600)) / 60);

        const seconds = !Math.floor(flooredSeconds - (hours * 3600) - (minutes * 60)) ? "00" : Math.floor(flooredSeconds - (hours * 3600) - (minutes * 60));

        const units = [hours, minutes, seconds];
        const formattedUnits = units.map(unit => String(unit).length < 2 ? `0${unit}` : unit);

        const res = `${formattedUnits[0]}:${formattedUnits[1]}:${formattedUnits[2]}`

        return res;
    }

    async handleDelete() {
        const authToken = localStorage.getItem("token");

        try {
            await new API().taskIdDeleteRequest({
                token: authToken,
                taskId: this.id,
            });

            this.element.remove();
        } catch(error) {
            console.log(error.message);
        }
    }

    async handleFinished() {
        const authToken = localStorage.getItem("token");
        const body = {};

        switch(this.isFinished) {
            case true:
                body["timeTracked"] = 0;
                body["isFinished"] = false;
                break;
                
            case false:
                body["isActive"] = false;
                body["isFinished"] = true;
                break;
        }

        const stringifiedBody = JSON.stringify(body);
        
        try {
            const { timeTracked, isFinished, isActive } = await new API().taskFinishedRequest({
                token: authToken,
                taskId: this.id,
                body: stringifiedBody,
            });

            switch(isFinished) {
                case true:
                    this.isFinished = isFinished;
                    this.isActive = isActive;

                    this.element.classList.add("task__container-finished");
                    this.element.querySelector(".task__button").classList.add("task__button-inactive");
                    
                    this.element.querySelector("button").innerText = "Restart";

                    break;

                case false:
                    this.isFinished = isFinished;
                    this.timeTracked = timeTracked;

                    this.element.classList.remove("task__container-finished");
                    this.element.querySelector(".task__button").classList.remove("task__button-inactive");

                    this.element.querySelector("button").innerText = "Mark as done";
                    this.element.querySelector(".task__count").innerText = this.formatDateForCreatedAt(this.timeTracked);

                    break;
            }

        } catch(error) {
            console.log(error.message);
        }        
    }

    timerCounting() {
        this.element.querySelector(".task__count").innerText = this.formatDateForCreatedAt(this.timeTracked);

        this.timeTracked += 1000;

        this.timeTrackedId = setTimeout(() => {
            this.timerCounting();
        }, 1000);
    }

    async handleTrackTime() {
        if (this.isFinished) {
            return;
        }

        const authToken = localStorage.getItem("token");        
        const body = JSON.stringify({ isActive: !this.isActive });

        try {
            await new API().taskCountRequest({
                token: authToken,
                taskId: this.id,
                body: body,
            })

            switch(this.isActive) {
                case true:
                    this.isActive = false;

                    const pasueButton = this.element.querySelector(".fa-pause");
                    pasueButton.classList.remove("fa-pause");
                    pasueButton.classList.add("fa-play");

                    clearTimeout(this.timeTrackedId);
                    break;
                    
                case false:
                    this.isActive = true;

                    const playButton = this.element.querySelector(".fa-play");
                    playButton.classList.remove("fa-play");
                    playButton.classList.add("fa-pause");

                    this.timerCounting();
                    break;
            }
        } catch(error) {
            console.log(error.message);
        }
    }

    async renderTaskElement() {
        const taskNameElement = document.createElement("h4");
        const taskDescriptionElement = document.createElement("p");
        const taskTimerContainerElement = document.createElement("div");
        const taskTimerTimeElement = document.createElement("span");
        const taskCreatedAtElement = document.createElement("div");
        const taskActiveElement = document.createElement("button");

        const taskTimerButtonContainerElement = document.createElement("span");
        const taskTimerButtonIconElement = document.createElement("i");
        const taskTimerButtonCirleElement = document.createElement("i");


        const taskDeleteContainerElement = document.createElement("span");
        const taskDeleteXElement = document.createElement("span");
        const taskDeleteCirleElement = document.createElement("span");

        taskNameElement.innerText = this.name;

        taskDescriptionElement.innerText = this.description;

        taskTimerContainerElement.classList.add("task__timer");
        
        taskTimerButtonContainerElement.classList.add("fa-stack", "task__button");
        taskTimerButtonIconElement.classList.add("fa-solid", "fa-play", "fa-stack-1x");
        taskTimerButtonCirleElement.classList.add("fa-regular", "fa-circle", "fa-stack-2x");
        taskTimerButtonContainerElement.addEventListener("click", this.handleTrackTime);

        taskTimerTimeElement.innerText = this.formatDateForCreatedAt(this.timeTracked);
        taskTimerTimeElement.classList.add("task__count")

        taskCreatedAtElement.innerText = new Date(this.createdAt).toLocaleString();
        taskCreatedAtElement.classList.add("task__date");
        
        taskActiveElement.innerText = !this.isFinished ? "Mark as done" : "Restart";
        taskActiveElement.addEventListener("click", this.handleFinished)
        
        taskDeleteContainerElement.classList.add("fa-stack", "task__button", "task__close");
        taskDeleteXElement.classList.add("fa-solid", "fa-xmark", "fa-stack-1x");
        taskDeleteCirleElement.classList.add("fa-regular", "fa-circle", "fa-stack-2x");
        taskDeleteContainerElement.addEventListener("click", this.handleDelete);

        taskTimerButtonContainerElement.append(taskTimerButtonIconElement, taskTimerButtonCirleElement);
        taskDeleteContainerElement.append(taskDeleteXElement, taskDeleteCirleElement)
        taskTimerContainerElement.append(taskTimerButtonContainerElement, taskTimerTimeElement);
        await this.element.append(
            taskNameElement, 
            taskDescriptionElement, 
            taskTimerContainerElement, 
            taskCreatedAtElement, 
            taskActiveElement,
            taskDeleteContainerElement,
        );

        this.element.classList.add("task__container");

        if(this.isFinished) {
            this.element.classList.add("task__container-finished");
            taskTimerButtonContainerElement.classList.add("task__button-inactive");
        }

        if(this.isActive) {
            taskTimerButtonIconElement.classList.remove("fa-play");
            taskTimerButtonIconElement.classList.add("fa-pause");
            this.timerCounting();
        }

        document.getElementById("tasksContainer").append(this.element);

    }

}