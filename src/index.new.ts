import TextSelector from 'core/TextSelector';

console.log('hi there!');

init();

function init() {
  const textSelector = new TextSelector(document.body, handleSelect);

  console.log(textSelector);
}

function handleSelect(data, event) {
  console.log('data: ', data);
  console.log('event: ', event);
}
