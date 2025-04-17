import { users, type User, type InsertUser, type Expense, type InsertExpense } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllExpenses(): Promise<Expense[]>;
  getExpense(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: Partial<Expense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private expenses: Map<number, Expense>;
  private userId: number;
  private expenseId: number;

  constructor() {
    this.users = new Map();
    this.expenses = new Map();
    this.userId = 1;
    this.expenseId = 1;
  }

  // User-related methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Expense-related methods
  async getAllExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.expenseId++;
    const expense: Expense = { ...insertExpense, id };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: number, data: Partial<Expense>): Promise<Expense | undefined> {
    const existingExpense = this.expenses.get(id);
    
    if (!existingExpense) {
      return undefined;
    }
    
    const updatedExpense: Expense = { ...existingExpense, ...data };
    this.expenses.set(id, updatedExpense);
    
    return updatedExpense;
  }

  async deleteExpense(id: number): Promise<boolean> {
    if (!this.expenses.has(id)) {
      return false;
    }
    
    return this.expenses.delete(id);
  }
}

export const storage = new MemStorage();
