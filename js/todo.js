var todos = new fengshui.System({
  root: 'todo',
  aliases: {
    'todo-input': 'newTodo'
  },
  types: {
    value: ['newTodo']
  }
});

todos.addTodoBtn.click(function(e) {
  var todo = todos.setCtx(this);
  todo.todoForm.submit();
});

var todoItem = todos.todoItem.slice(0, 1); // use one for cloning

todos.todoForm.submit(function(e) {
  e.preventDefault(); // prevent form submit
  var todo = todos.setCtx(this);
  // only allow append if non-whitespace
  if ($.trim(todo.newTodo).length === 0) return;
  var removeBtn =
    '<span class="remove-todo pull-right '+
    'glyphicon glyphicon-remove"></span>';
  todo.todoList.append(
    // clone and replace text
    todoItem
      .clone()
      .html(todo.newTodo + removeBtn)
  );
  todo.todoInput.val(''); // empty input for new one
});

// attached to future elements
// TODO: implement selector on root
todos.fsRoot.on('click', '.remove-todo', function() {
  var todo = todos.setCtx(this);
  todo.todoItem.one.remove();
});
