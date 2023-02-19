const addTodo = () => {
  const ul = document.getElementsByTagName('ul')[0];
  const input = document.getElementById('todoInput').value;

  if (input.length > 0) {
    const li = document.createElement('li');

    li.classList.add('fadeIn');
    li.appendChild(document.createTextNode(input));

    ul.appendChild(li);

    document.getElementById('todoInput').value = '';
  }
};