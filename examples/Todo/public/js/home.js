window.onload = function () {
  const editTodoButtonElems = document.getElementsByClassName("editTodoButton");

  for (const editTodoButtonElem of editTodoButtonElems) {
    editTodoButtonElem.addEventListener("click", (e) => {
      e.preventDefault();
      const todoTxt = prompt("Add Todo", "");
      if (todoTxt != null) {
        if (todoTxt === "") return alert("Can't add empty string as todo");

        fetch("/edit-todo", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idx: editTodoButtonElem.dataset.todoIdx,
            content: todoTxt,
          }),
        })
          .then((res) => res.json())
          .then(({ idx, content }) => {
            const todoItem = document.querySelectorAll(`.todo-list__item-text`)[
              idx
            ];
            if (todoItem) {
              todoItem.innerText = content;
            }
          })
          .catch(console.error);
      }
    });
  }
};
