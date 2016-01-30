function createAutoplete(input: HTMLInputElement): void {
  const possibleMatches = input.getAttribute('data-list').split(', ');

  let container = surroundWithContainer(input);
  let list = setupList(possibleMatches, container);

  input.addEventListener('focus', () => list.classList.add('visible'));
  input.addEventListener('blur', () => list.classList.remove('visible'));

  input.addEventListener('input', ev => {
    for (let i = 0; i < list.childNodes.length; ++i) {
      const possibleMatch = <HTMLElement>list.childNodes[i];

      if (possibleMatch.innerText == input.value) {
        toggleMatch(possibleMatch, true);
      } else {
        toggleMatch(possibleMatch, false);
      }
    }
  });
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
    listItem.innerText = possibleMatch;
    list.appendChild(listItem);
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

let inputs = [].slice.call(
  document.getElementsByTagName('input')
);

inputs.forEach(input => {
  if (input.getAttribute('data-list') !== null) {
    createAutoplete(input);
  }
});

