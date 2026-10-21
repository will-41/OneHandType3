import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
// import authRoutes from "./routes/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply rate limiting to all requests
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { message: "Too many requests, please try again later." }
  });
  
  // Apply rate limiting to all API endpoints
  app.use("/api", apiLimiter);
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // TODO: Re-enable auth routes after fixing dependency issues
  // app.use("/api/auth", authRoutes);

  // User management endpoints
  app.post("/api/users", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ 
          message: "Username and password are required" 
        });
      }
      
      // Password validation
      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long"
        });
      }
      
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({
          message: "Password must include at least one uppercase letter, one lowercase letter, and one number"
        });
      }

      // Check if user already exists - use parameterized query in storage layer
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ 
          message: "User already exists" 
        });
      }

      // Hash password before storing
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Store user with hashed password
      const user = await storage.createUser({ username, password: hashedPassword });

      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({
        message: "User created successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        message: "Failed to retrieve user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      database: process.env.DATABASE_URL ? "PostgreSQL" : "Memory"
    });
  });

  // Lesson endpoints
  app.get("/api/lessons", async (req, res) => {
    try {
      const category = req.query.category as string;
      let lessons;

      if (category) {
        lessons = await storage.getLessonsByCategory(category);
      } else {
        lessons = await storage.getAllLessons();
      }

      res.json({ lessons });
    } catch (error) {
      console.error("Get lessons error:", error);
      res.status(500).json({
        message: "Failed to retrieve lessons",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLessonById(req.params.id);

      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      res.json({ lesson });
    } catch (error) {
      console.error("Get lesson error:", error);
      res.status(500).json({
        message: "Failed to retrieve lesson",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Curriculum endpoints
  app.get("/api/curriculum", async (req, res) => {
    try {
      const levels = await storage.getAllCurriculumLevels();
      res.json({ levels });
    } catch (error) {
      console.error("Get curriculum error:", error);
      res.status(500).json({
        message: "Failed to retrieve curriculum",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/curriculum/:levelId/lessons", async (req, res) => {
    try {
      const lessons = await storage.getCurriculumLessons(req.params.levelId);
      res.json({ lessons });
    } catch (error) {
      console.error("Get curriculum lessons error:", error);
      res.status(500).json({
        message: "Failed to retrieve curriculum lessons",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Achievement endpoints
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json({ achievements });
    } catch (error) {
      console.error("Get achievements error:", error);
      res.status(500).json({
        message: "Failed to retrieve achievements",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // User progress endpoints
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const progress = await storage.getUserProgress(userId);
      res.json({ progress });
    } catch (error) {
      console.error("Get user progress error:", error);
      res.status(500).json({
        message: "Failed to retrieve user progress",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const { lessonId, wpm, accuracy, completed } = req.body;

      if (!lessonId || typeof wpm !== 'number' || typeof accuracy !== 'number') {
        return res.status(400).json({ 
          message: "Missing required fields: lessonId, wpm, accuracy" 
        });
      }

      const progress = await storage.updateUserProgress(userId, lessonId, wpm, accuracy, completed || false);
      res.json({ progress });
    } catch (error) {
      console.error("Update user progress error:", error);
      res.status(500).json({
        message: "Failed to update user progress",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}