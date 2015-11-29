class Autoplete {
  private input: HTMLInputElement;
  private matches: HTMLElement[];
  private possibleMatches: HTMLElement[];
  private activeMatch: HTMLElement;
  private list: HTMLElement;

  constructor(input: HTMLInputElement, config: { [id: string]: any }) {
    this.input = input;
    this.matches = [];
    this.possibleMatches = [];

    this.setupList(
      config['list'] || input.getAttribute('data-list').split(', ')
    );

    input.addEventListener('input', function inputModified(ev) {
      this.clearList();

      if (!ev.srcElement.value) {
        return;
      }

      for (let i = 0, length = this.possibleMatches.length; i < length; ++i) {
        let entry: HTMLElement = this.possibleMatches[i];
        if (this.filter(ev.srcElement.value, entry.innerText)) {
          this.addMatch(entry);
        }
      }

      if (this.matches.length > 0) {
        this.setActiveMatch(this.matches[0]);
      }
    }.bind(this));

    input.addEventListener('keydown', function keyOnInputPressed(ev) {
      switch (ev.keyCode) {
      case 13:
        this.selectMatch(this.activeMatch);
        break;
      case 38:
        ev.preventDefault();
        this.traverseList(TraverseDirection.Up);
        break;
      case 40:
        ev.preventDefault();
        this.traverseList(TraverseDirection.Down);
        break;
      default:
        break;
      }
    }.bind(this));

    input.addEventListener('blur', function inputLostFocus(ev) {
      this.list.classList.remove('visible');
    }.bind(this));
    input.addEventListener('focus', function inputGainedFocus(ev) {
      this.list.classList.add('visible');
    }.bind(this));
  }

  private setupList(rawList: string[]): void {
    let container: HTMLElement = document.createElement('span');
    container.classList.add('autoplete');
    this.input.parentNode.insertBefore(container, this.input);
    container.appendChild(this.input);

    this.list = document.createElement('ul');
    this.list.classList.add('visible');
    container.appendChild(this.list);

    // Not sure why the clientWidth is 4 off, maybe the border?
    this.list.style.width = (this.input.clientWidth + 4).toString() + 'px';

    this.possibleMatches.length = rawList.length;
    for (let i = 0, length = this.possibleMatches.length; i < length; ++i) {
      this.possibleMatches[i]  = document.createElement('li');
      this.possibleMatches[i].innerHTML = rawList[i];
      this.list.appendChild(this.possibleMatches[i]);
    }

    this.list.addEventListener('mouseover', function listHoverBegan(ev) {
      this.setActiveMatch(ev.target);
    }.bind(this));

    this.list.addEventListener('mousedown', function matchClicked(ev) {
      this.selectMatch(ev.target);
    }.bind(this));
  }

  private filter(input: string, possibleMatch: string): boolean {
    return possibleMatch.search(new RegExp(input, 'i')) !== -1;
  }

  public exactFilter(input: string, possibleMatch: string): boolean {
    return possibleMatch.search(new RegExp(input)) !== -1;
  }

  private addMatch(match: HTMLElement): void {
    match.classList.add('visible');
    this.matches.push(match);
  }

  private removeMatch(match: HTMLElement): void {
    match.classList.remove('visible');
    const index: number = this.matches.indexOf(match);
    if (index > -1) {
      this.matches.splice(index, 1);
    }
  }

  private selectMatch(match: HTMLElement): void {
    this.input.value = match.innerText;
    this.clearList();
  }

  private clearList(): void {
    for (let i = this.matches.length - 1; i >= 0; --i) {
      this.removeMatch(this.matches[i]);
    }
    this.matches.length = 0;

    this.setActiveMatch(null);
  }

  private setActiveMatch(match: HTMLElement): void {
    if (this.activeMatch) {
      this.activeMatch.classList.remove('active');
    }
    if (match) {
      this.activeMatch = match;
      match.classList.add('active');
    }
  }

  private traverseList(direction: TraverseDirection): void {
    switch (direction) {
    case TraverseDirection.Up:
      if (this.activeMatch.previousSibling) {
        this.setActiveMatch(<HTMLElement> this.activeMatch.previousSibling);
      }
      break;
    case TraverseDirection.Down:
      if (this.activeMatch.nextSibling) {
        this.setActiveMatch(<HTMLElement> this.activeMatch.nextSibling);
      }
      break;
    }
  }
}

enum TraverseDirection {
  Up,
  Down
}

(function() {
  // Initialize all standard inputs.
  let inputs: NodeListOf<HTMLInputElement> = document.getElementsByTagName('input');
  for (let i = 0, length = inputs.length; i < length; ++i) {
    if (inputs[i].getAttribute('data-list') !== null) {
      new Autoplete(inputs[i], {});
    }
  }
}());

