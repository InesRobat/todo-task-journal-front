<template>
  <div class="task-list">
    <div class="left-panel">
      <h2>
        TO DO LIST
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="#ebebeb"
            viewBox="0 0 256 256"
          >
            <path
              d="M224,128a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128ZM128,72h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,112H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16ZM82.34,42.34,56,68.69,45.66,58.34A8,8,0,0,0,34.34,69.66l16,16a8,8,0,0,0,11.32,0l32-32A8,8,0,0,0,82.34,42.34Zm0,64L56,132.69,45.66,122.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm0,64L56,196.69,45.66,186.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"
            ></path>
          </svg>
        </span>
      </h2>
      <div class="task-form">
        <input
          v-model="newTask"
          type="text"
          placeholder="Add a new task"
          class="task-input"
        />
        <input
          type="date"
          class="task-date"
          id="date"
          @input="handleDate($event.target.value)"
          v-model="newTaskDate"
          required
        />

        <button
          @click="addTask"
          class="task-button"
          :class="{ disabled: !newTaskDate || !newTask }"
          :disabled="!newTaskDate || !newTask"
        >
          Add
        </button>
      </div>
    </div>

    <div class="right-panel">
      <div v-if="tasks.length === 0" class="empty-message">
        <p>No tasks to display. Start by adding a task!</p>
        <ThinkingModel />
        <q>daydreaming by Eric Wilson [CC-BY] via Poly Pizza</q>
      </div>

      <div v-else class="tasks">
        <div class="task-card" v-for="(task, index) in tasks" :key="task._id">
          <TaskItem
            :task="task"
            :index="index"
            @update="updateTask"
            @delete="deleteTask"
            @toggle-completion="toggleCompletion"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TaskItem from "./TaskItem.vue";
import ThinkingModel from "./ThinkingModel.vue";

const apiUrl = process.env.VUE_APP_API_URL;

export default {
  components: {
    TaskItem,
    ThinkingModel,
  },
  data() {
    return {
      tasks: [],
      newTask: "",
      newTaskDate: this.getCurrentDate(),
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;
    },
    handleDate(value) {
      this.newTaskDate = value;

      console.log("Selected date:", this.newTaskDate);
    },
    async fetchTasks() {
      try {
        const response = await axios.get(`${apiUrl}/tasks`);
        this.tasks = response.data;
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    },

    async addTask() {
      if (this.newTask.trim() === "" || this.newTaskDate.trim() === "") return;

      const newTaskObj = {
        name: this.newTask,
        completed: false,
        date: this.newTaskDate,
      };

      try {
        const response = await axios.post(`${apiUrl}/tasks`, newTaskObj);
        this.tasks.push(response.data);
        this.newTask = "";
        this.newTaskDate = "";
      } catch (error) {
        console.error("Error adding task", error);
      }
    },
    async updateTask(id) {
      try {
        const taskToUpdate = this.tasks.find((task) => task._id === id);
        taskToUpdate.completed = !taskToUpdate.completed;

        await axios.put(`${apiUrl}/tasks/${id}`, taskToUpdate);

        this.fetchTasks();
      } catch (error) {
        console.error("Error updating task", error);
      }
    },
    async deleteTask(id) {
      try {
        await axios.delete(`${apiUrl}/tasks/${id}`);

        this.tasks = this.tasks.filter((task) => task._id !== id);
      } catch (error) {
        console.error("Error deleting task", error);
      }
    },
    toggleCompletion(taskId) {
      axios
        .put(`${apiUrl}/tasks/${taskId}`)
        .then((response) => {
          const updatedTask = response.data;

          const index = this.tasks.findIndex((task) => task._id === taskId);
          if (index !== -1) {
            this.tasks.splice(index, 1, updatedTask);
          }
        })
        .catch((error) => {
          console.error("Error toggling task completion:", error);
        });
    },
  },
};
</script>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  margin: 20px;
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.left-panel h2 {
  margin: 0;
  font-size: 2.5rem;
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.task-form {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.task-input,
.task-date,
.task-button {
  flex: 1;
  padding: 10px 15px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  background-color: transparent;
  color: white;
  box-sizing: border-box;
}

.task-input:focus,
.task-date:focus,
.task-button:focus {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

.task-button {
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
  flex: inherit;
}

.task-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-button:hover {
  background-color: #0056b3;
}

.task-button:active {
  background-color: #003f7f;
}

.right-panel {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-card {
  padding: 15px 0px;
  height: 100%;
  display: flex;
  gap: 50px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.tasks {
  padding: 15px 0px;
  height: 100%;
  display: flex;
  gap: 50px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.empty-message {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media screen and (max-width: 768px) {
  .task-list {
    flex-direction: column;
    align-items: center;
  }

  .task-form {
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }

  .task-input,
  .task-date,
  .task-button {
    width: 100%;
  }

  .task-button {
    margin-top: 10px;
    flex: 1;
  }

  .left-panel h2 {
    font-size: 2rem;
    text-align: center;
  }

  .right-panel {
    width: 100%;
    padding: 10px;
  }

  .tasks {
    flex-direction: column;
    gap: 20px;
  }

  .task-card {
    flex-direction: column;
    width: 100%;
  }
}
</style>
