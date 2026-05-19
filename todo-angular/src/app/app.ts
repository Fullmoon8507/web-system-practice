import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

type Filter = 'all' | 'active' | 'done';

const STORAGE_KEY = 'todos-v1';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  todos = signal<Todo[]>(this.load());
  filter = signal<Filter>('all');
  newText = '';

  visible = computed(() => {
    const f = this.filter();
    return this.todos().filter((t) => (f === 'all' ? true : f === 'done' ? t.done : !t.done));
  });

  remaining = computed(() => this.todos().filter((t) => !t.done).length);
  total = computed(() => this.todos().length);

  private load(): Todo[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? [];
    } catch {
      return [];
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos()));
  }

  addTodo() {
    const text = this.newText.trim();
    if (!text) return;
    this.todos.update((list) => [{ id: Date.now(), text, done: false }, ...list]);
    this.save();
    this.newText = '';
  }

  toggle(id: number, done: boolean) {
    this.todos.update((list) => list.map((t) => (t.id === id ? { ...t, done } : t)));
    this.save();
  }

  delete(id: number) {
    this.todos.update((list) => list.filter((t) => t.id !== id));
    this.save();
  }

  clearDone() {
    this.todos.update((list) => list.filter((t) => !t.done));
    this.save();
  }

  setFilter(f: Filter) {
    this.filter.set(f);
  }
}
