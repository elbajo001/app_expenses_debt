import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Group, Expense, Person } from '../types';

const PERSON_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#06b6d4', '#84cc16'
];

interface ExpenseStoreState {
  currentUserId: string | null;
  groups: Group[];
  people: Person[];
  expenses: Expense[];
  activeGroupId: string | null;

  setCurrentUserId: (userId: string) => void;
  clearStore: () => void;
  addGroup: (data: Omit<Group, 'id' | 'createdAt' | 'userId'>) => void;
  updateGroup: (id: string, data: Partial<Pick<Group, 'name' | 'description'>>) => void;
  deleteGroup: (id: string) => void;
  setActiveGroup: (id: string | null) => void;

  addPerson: (groupId: string, name: string) => void;
  removePerson: (groupId: string, personId: string) => void;

  addExpense: (data: Omit<Expense, 'id' | 'createdAt' | 'userId'>) => void;
  updateExpense: (id: string, data: Partial<Omit<Expense, 'id' | 'groupId' | 'createdAt' | 'userId'>>) => void;
  deleteExpense: (id: string) => void;

  getGroupById: (id: string) => Group | undefined;
  getPeopleByGroup: (groupId: string) => Person[];
  getExpensesByGroup: (groupId: string) => Expense[];
  getPersonById: (id: string) => Person | undefined;
  getUserGroups: () => Group[];
  getUserExpenses: () => Expense[];
}

interface GroupWithUser extends Group {
  userId?: string;
}

interface ExpenseWithUser extends Expense {
  userId?: string;
}

const getNextAvailableColor = (existingPeople: Person[]): string => {
  const usedColors = new Set(existingPeople.map(p => p.color));
  for (const color of PERSON_COLORS) {
    if (!usedColors.has(color)) return color;
  }
  return PERSON_COLORS[0];
};

export const useExpenseStore = create<ExpenseStoreState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      groups: [],
      people: [],
      expenses: [],
      activeGroupId: null,

      setCurrentUserId: (userId) => {
        set({ currentUserId: userId });
      },

      clearStore: () => {
        // Clear localStorage persistence
        // localStorage.removeItem('expense-app-storage');
        // Clear state
        set({
          currentUserId: null,
          // groups: [],
          // people: [],
          // expenses: [],
          activeGroupId: null,
        });
      },

      addGroup: (data) => {
        const userId = get().currentUserId;
        if (!userId) return;

        const newGroup: GroupWithUser = {
          id: uuidv4(),
          ...data,
          members: [],
          createdAt: new Date().toISOString(),
          userId,
        };
        set((state) => ({
          groups: [...state.groups, newGroup],
          activeGroupId: newGroup.id,
        }));
      },

      updateGroup: (id, data) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id ? { ...group, ...data } : group
          ),
        }));
      },

      deleteGroup: (id) => {
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
          expenses: state.expenses.filter((expense) => expense.groupId !== id),
          activeGroupId: state.activeGroupId === id ? null : state.activeGroupId,
        }));
      },

      setActiveGroup: (id) => {
        set({ activeGroupId: id });
      },

      addPerson: (groupId, name) => {
        const groupPeople = get().getPeopleByGroup(groupId);
        const color = getNextAvailableColor(groupPeople);

        const newPerson: Person = {
          id: uuidv4(),
          name,
          color,
        };

        set((state) => {
          const group = state.groups.find((g) => g.id === groupId);
          if (!group) return state;

          return {
            people: [...state.people, newPerson],
            groups: state.groups.map((g) =>
              g.id === groupId
                ? { ...g, members: [...g.members, newPerson.id] }
                : g
            ),
          };
        });
      },

      removePerson: (groupId, personId) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? { ...g, members: g.members.filter((m) => m !== personId) }
              : g
          ),
        }));
      },

      addExpense: (data) => {
        const userId = get().currentUserId;
        if (!userId) return;

        const newExpense: ExpenseWithUser = {
          id: uuidv4(),
          ...data,
          createdAt: new Date().toISOString(),
          userId,
        };
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }));
      },

      updateExpense: (id, data) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...data } : expense
          ),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },

      getGroupById: (id) => {
        const userId = get().currentUserId;
        return get().groups.find((group) => group.id === id && (group as GroupWithUser).userId === userId);
      },

      getPeopleByGroup: (groupId) => {
        const group = get().groups.find((g) => g.id === groupId);
        if (!group) return [];
        return get().people.filter((person) => group.members.includes(person.id));
      },

      getExpensesByGroup: (groupId) => {
        const userId = get().currentUserId;
        return get().expenses.filter((expense) => expense.groupId === groupId && (expense as ExpenseWithUser).userId === userId);
      },

      getPersonById: (id) => {
        return get().people.find((person) => person.id === id);
      },

      getUserGroups: () => {
        const userId = get().currentUserId;
        if (!userId) return [];
        return get().groups.filter((group) => (group as GroupWithUser).userId === userId);
      },

      getUserExpenses: () => {
        const userId = get().currentUserId;
        if (!userId) return [];
        return get().expenses.filter((expense) => (expense as ExpenseWithUser).userId === userId);
      },
    }),
    {
      name: 'expense-app-storage',
    }
  )
);
