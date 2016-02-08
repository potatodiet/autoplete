function createAutoplete(input: HTMLInputElement): void {
  const possibleMatches = input.getAttribute('data-list').split(', ');

  let container = surroundWithContainer(input);
  let list = setupList(possibleMatches, container);

  // Not sure why the clientWidth is 4 off, maybe the border?
  list.style.width = (input.clientWidth + 4).toString() + 'px';

  input.addEventListener('focus', () => list.classList.add('visible'));
  input.addEventListener('blur', () => list.classList.remove('visible'));

  list.addEventListener('mouseover', ev => {
    setActiveMatch(<HTMLElement>ev.target, list);
  });

  list.addEventListener('mousedown', ev => {
    selectMatch(<HTMLElement>ev.target, input);
  });

  input.addEventListener('input', ev => addMatches(list, input));

  input.addEventListener('keydown', ev => {
    switch (ev.keyCode) {
      case 13:
        selectMatch(getActiveMatch(list), input);
        list.classList.remove('visible');
        break;
      case 38:
        ev.preventDefault();
        traverseList('up', list);
        break;
      case 40:
        ev.preventDefault();
        traverseList('down', list);
        break;
    }
  });
}

function addMatches(list: HTMLElement, input: HTMLInputElement) {
  let anyMatches: boolean = false;

  for (let i = 0; i < list.childNodes.length; ++i) {
    const possibleMatch = <HTMLElement>list.childNodes[i];

    if (filter(input.value, possibleMatch.textContent)) {
      toggleMatch(possibleMatch, true);

      // Sets the first match as active.
      if (!anyMatches) {
        anyMatches = true;
        setActiveMatch(possibleMatch, list);
      }
    } else {
      toggleMatch(possibleMatch, false);
    }
  }
}

function surroundWithContainer(input: HTMLInputElement): HTMLElement {
  let container = document.createElement('div');
  container.classList.add('autoplete');

  input.parentNode.insertBefore(container, input);
  container.appendChild(input);

  return container;
}

function setupList(possibleMatches: string[],
                   container: HTMLElement): HTMLElement {
  let list = document.createElement('ul');
  container.appendChild(list);

  possibleMatches.forEach(possibleMatch => {
    let listItem = document.createElement('li');
    listItem.textContent = possibleMatch;
    list.appendChild(listItem);
    console.log(listItem);
  });

  return list;
}

function toggleMatch(match: HTMLElement, on: boolean): void {
  if (on) {
    match.classList.add('visible');
  } else {
    match.classList.remove('visible');
  }
}

function filter(input: string, possibleMatch: string): boolean {
  if (input.length === 0) {
    return false;
  }

  return possibleMatch.search(new RegExp(input, 'i')) !== -1;
}

function setActiveMatch(match: HTMLElement, list: HTMLElement): void {
  for (let i = 0, length = list.children.length; i < length; ++i) {
    list.children[i].classList.remove('active');
  }

  match.classList.add('active');
}

function getActiveMatch(list: HTMLElement): HTMLElement {
  for (let i = 0, length = list.children.length; i < length; ++i) {
    const match = list.children[i];
    if (match.classList.contains('active')) {
      return <HTMLElement>match;
    }
  }

  console.debug('No active match exists');
  return <HTMLElement>document.createElement('null');
}

function selectMatch(match: HTMLElement, input: HTMLInputElement): void {
  input.value = match.textContent;
  input.dispatchEvent(new Event('input'));
}

function traverseList(direction: string, list: HTMLElement): void {
  let match: HTMLElement = getActiveMatch(list);

  if (direction === 'up') {
    match = <HTMLElement>match.previousSibling;
  } else if (direction === 'down') {
    match = <HTMLElement>match.nextSibling;
  }

  if (match) {
    setActiveMatch(match, list);
  }
}

let inputs = [].slice.call(
  document.getElementsByTagName('input')
);

inputs.forEach(input => {
  if (input.getAttribute('data-list') !== null) {
    createAutoplete(input);
  }
});

