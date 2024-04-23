document.addEventListener("DOMContentLoaded", function() {
  const formTarea = document.getElementById("form-tarea");
  const inputNuevaTarea = document.getElementById("nueva-tarea");
  const listaTareas = document.getElementById("lista-tareas");
  const tareasCompletadas = document.getElementById("tareas-completadas");

  // Verificar si hay tareas almacenadas en localStorage al cargar la página
  cargarTareasDesdeLocalStorage();

  formTarea.addEventListener("submit", function(event) {
    event.preventDefault();
    const tareaTexto = inputNuevaTarea.value.trim();
    if (tareaTexto !== "") {
      agregarTarea(tareaTexto);
      // Guardar la tarea en localStorage
      guardarTareaEnLocalStorage(tareaTexto, false); // false indica que la tarea no está completada
      inputNuevaTarea.value = "";
    }
  });

  function agregarTarea(tareaTexto) {
    const tareaItem = document.createElement("li");

    const tareaText = document.createElement("span");
    tareaText.textContent = tareaTexto;
    tareaItem.appendChild(tareaText);

    const completarBtn = document.createElement("button");
    completarBtn.textContent = "Completar";
    completarBtn.addEventListener("click", function() {
      completarTarea(tareaItem);
      // Actualizar las tareas en localStorage después de completar una tarea
      actualizarTareasEnLocalStorage();
    });

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.addEventListener("click", function() {
      tareaItem.remove();
      // Actualizar las tareas en localStorage después de eliminar una tarea
      actualizarTareasEnLocalStorage();
    });

    tareaItem.appendChild(completarBtn);
    tareaItem.appendChild(eliminarBtn);
    listaTareas.appendChild(tareaItem);
  }

  function completarTarea(tareaItem) {
    tareaItem.querySelector("button").remove();
    tareasCompletadas.appendChild(tareaItem);
    // Actualizar la tarea como completada en el localStorage
    guardarTareaEnLocalStorage(tareaItem.querySelector("span").textContent, true); // true indica que la tarea está completada
  }

  function guardarTareaEnLocalStorage(tarea, completada) {
    let tareas;
    if (localStorage.getItem('tareas') === null) {
      tareas = [];
    } else {
      tareas = JSON.parse(localStorage.getItem('tareas'));
    }
    tareas.push({ tarea: tarea, completada: completada });
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }

  function cargarTareasDesdeLocalStorage() {
    if (localStorage.getItem('tareas') !== null) {
      const tareas = JSON.parse(localStorage.getItem('tareas'));
      tareas.forEach(function(tareaObj) {
        agregarTareaDesdeLocalStorage(tareaObj);
      });
    }
  }

  function agregarTareaDesdeLocalStorage(tareaObj) {
    const tareaItem = document.createElement("li");

    const tareaText = document.createElement("span");
    tareaText.textContent = tareaObj.tarea;
    tareaItem.appendChild(tareaText);

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.addEventListener("click", function() {
      tareaItem.remove();
      // Actualizar las tareas en localStorage después de eliminar una tarea
      actualizarTareasEnLocalStorage();
    });

    tareaItem.appendChild(eliminarBtn);

    if (tareaObj.completada) {
      tareasCompletadas.appendChild(tareaItem);
    } else {
      const completarBtn = document.createElement("button");
      completarBtn.textContent = "Completar";
      completarBtn.addEventListener("click", function() {
        completarTarea(tareaItem);
        // Actualizar las tareas en localStorage después de completar una tarea
        actualizarTareasEnLocalStorage();
      });
      tareaItem.appendChild(completarBtn);
      listaTareas.appendChild(tareaItem);
    }
  }

  function actualizarTareasEnLocalStorage() {
    const tareas = [];
    const listaTareasPendientes = listaTareas.querySelectorAll('li');
    const listaTareasCompletadas = tareasCompletadas.querySelectorAll('li');
    listaTareasPendientes.forEach(function(tarea) {
      tareas.push({ tarea: tarea.querySelector("span").textContent, completada: false });
    });
    listaTareasCompletadas.forEach(function(tarea) {
      tareas.push({ tarea: tarea.querySelector("span").textContent, completada: true });
    });
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }
});
