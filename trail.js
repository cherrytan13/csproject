const supabase = supabase.createClient(
      'https://your-supabase-url.supabase.co',
      'your-anon-key'
    )

    const form = document.getElementById('todo-form')
    const input = document.getElementById('new-todo')
    const list = document.getElementById('todo-list')

    // Load todos on page load
    window.onload = loadTodos

    async function loadTodos() {
      const { data: todos, error } = await supabase
        .from('todos')
        .select('*')
        .order('inserted_at', { ascending: true })

      if (error) {
        alert('Error loading todos')
        console.error(error)
        return
      }

      list.innerHTML = ''
      todos.forEach(addTodoToUI)
    }

    form.onsubmit = async (e) => {
      e.preventDefault()
      const title = input.value.trim()
      if (!title) return

      const { data, error } = await supabase
        .from('todos')
        .insert([{ title }])
        .select()

      if (error) {
        alert('Error adding todo')
        console.error(error)
      } else {
        addTodoToUI(data[0])
        input.value = ''
      }
    }

    function addTodoToUI(todo) {
      const li = document.createElement('li')
      li.innerHTML = `
        <input type="checkbox" ${todo.is_complete ? 'checked' : ''}>
        <span class="${todo.is_complete ? 'completed' : ''}">${todo.title}</span>
        <button>❌</button>
      `

      const checkbox = li.querySelector('input')
      checkbox.onchange = () => toggleComplete(todo.id, checkbox.checked, li)

      const deleteBtn = li.querySelector('button')
      deleteBtn.onclick = () => deleteTodo(todo.id, li)

      list.appendChild(li)
    }

    async function toggleComplete(id, isComplete, li) {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete: isComplete })
        .eq('id', id)

      if (!error) {
        const span = li.querySelector('span')
        if (isComplete) span.classList.add('completed')
        else span.classList.remove('completed')
      }
    }

    async function deleteTodo(id, li) {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (!error) li.remove()
    }