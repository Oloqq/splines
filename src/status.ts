class Status {
  element: HTMLElement;

  constructor(displayLastMsgIn: string) {
    this.element = document.getElementById(displayLastMsgIn)!;
    if (!this.element) {
      console.error(`Couldn't get element for displaying status id=${displayLastMsgIn}`)
    }
  }

  info(what: string) {
    console.log(what);
    this.element.setAttribute("style", "color: black");
    this.element.innerText = what
  }

  warn(what: string) {
    console.log(what);
    this.element.setAttribute("style", "color: orange");
    this.element.innerText = what
  }
}

export const status = new Status("status");