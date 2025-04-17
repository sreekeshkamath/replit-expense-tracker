import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExpenseSchema, expenseSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all expenses
  app.get("/api/expenses", async (req: Request, res: Response) => {
    try {
      const expenses = await storage.getAllExpenses();
      return res.status(200).json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  // Get expense by ID
  app.get("/api/expenses/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid expense ID" });
      }

      const expense = await storage.getExpense(id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }

      return res.status(200).json(expense);
    } catch (error) {
      console.error("Error fetching expense:", error);
      return res.status(500).json({ message: "Failed to fetch expense" });
    }
  });

  // Create a new expense
  app.post("/api/expenses", async (req: Request, res: Response) => {
    try {
      // Log the received data for debugging
      console.log('Received expense data:', req.body);
      
      // Create a custom validator that handles date conversion
      const customExpenseSchema = z.object({
        amount: z.string(), // Amount as string
        category: z.string(),
        date: z.union([
          z.date(), // Accept Date objects directly
          z.string().transform(val => new Date(val)), // Convert strings to Date
        ]),
        description: z.string().nullable().optional(),
        type: z.string(),
      });
      
      const validatedData = customExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      return res.status(201).json(expense);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating expense:", error);
      return res.status(500).json({ message: "Failed to create expense" });
    }
  });

  // Update an expense
  app.put("/api/expenses/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid expense ID" });
      }

      const validatedData = expenseSchema.parse(req.body);
      const updatedExpense = await storage.updateExpense(id, validatedData);
      
      if (!updatedExpense) {
        return res.status(404).json({ message: "Expense not found" });
      }

      return res.status(200).json(updatedExpense);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating expense:", error);
      return res.status(500).json({ message: "Failed to update expense" });
    }
  });

  // Delete an expense
  app.delete("/api/expenses/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid expense ID" });
      }

      const success = await storage.deleteExpense(id);
      if (!success) {
        return res.status(404).json({ message: "Expense not found" });
      }

      return res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
      console.error("Error deleting expense:", error);
      return res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Initialize some example expenses if in development mode
  if (process.env.NODE_ENV === 'development') {
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    const expenses = await storage.getAllExpenses();
    if (expenses.length === 0) {
      // Add some sample expenses
      await storage.createExpense({
        amount: "125.50",
        category: "Food & Dining",
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        description: "Grocery Shopping",
        type: "expense",
      });

      await storage.createExpense({
        amount: "1200.00",
        category: "Housing",
        date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        description: "Rent Payment",
        type: "expense",
      });

      await storage.createExpense({
        amount: "4500.00",
        category: "Work",
        date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
        description: "Salary Deposit",
        type: "income",
      });

      await storage.createExpense({
        amount: "68.35",
        category: "Food & Dining",
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        description: "Restaurant Dinner",
        type: "expense",
      });

      await storage.createExpense({
        amount: "95.40",
        category: "Utilities",
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        description: "Electricity Bill",
        type: "expense",
      });
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
