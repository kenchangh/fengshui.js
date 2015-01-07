$('.add-todo-btn').click(function(e) {
  var todo = todos.setCtx(this);
  $('.todo-form').submit();
});

// used for cloning
var todoIte = $('.todo-item').slice(0, 1);

$('.todo-form').submit(function(e) {
  e.preventDefault(); // prevent form submit
  var $todo = $(this).find('.todo');
  var $todoInput = $('.todo-input', $todo);
  // only allow append if non-whitespace
  if ($.trim($todoInput.val()).length === 0) {
    return;
  }
  var removeBtn =
    '<span class="remove-todo pull-right '+
    'glyphicon glyphicon-remove"></span>';
  $('.todo-list', $todo).append(
    // clone and replace text
    todoItem
      .clone()
      .html($todoInput.val() + removeBtn)
  );
  $todoInput.val(''); // empty input for new one
});

// attached to future elements
// TODO: implement selector on root
$('.todo').on('click', '.remove-todo', function() {
  $(this).closest('.todo').remove();
});
