const sequelize = require('../config/database');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('[SEED] 🌱 Starting database seed...');

    // Initialize models
    const { DataTypes } = require('sequelize');
    const Quest = require('../models/Quest')(sequelize);
    const Skill = require('../models/Skill')(sequelize);
    const Achievement = require('../models/Achievement')(sequelize);
    const LearningModule = require('../models/LearningModule')(sequelize);

    // Sync database
    await sequelize.sync({ alter: true });
    console.log('[SEED] ✅ Database synchronized');

    // Clear existing data
    await Quest.destroy({ where: {} });
    await Skill.destroy({ where: {} });
    await Achievement.destroy({ where: {} });
    await LearningModule.destroy({ where: {} });
    console.log('[SEED] 🗑️ Cleared existing data');

    // SEED LEARNING MODULES
    const modules = await LearningModule.bulkCreate([
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript: variables, functions, loops, and more',
        category: 'Programming',
        difficulty: 'beginner',
        duration: 120,
        xpReward: 500,
        coinReward: 250,
        isPublished: true,
        isActive: true,
        lessons: [
          { id: 1, title: 'Introduction', duration: 15 },
          { id: 2, title: 'Variables & Data Types', duration: 20 },
          { id: 3, title: 'Functions', duration: 25 },
          { id: 4, title: 'Loops & Conditionals', duration: 30 },
          { id: 5, title: 'Arrays & Objects', duration: 30 },
        ],
        challenges: [
          { id: 1, title: 'FizzBuzz', difficulty: 'easy', points: 50 },
          { id: 2, title: 'Array Filter', difficulty: 'medium', points: 100 },
          { id: 3, title: 'Object Manipulation', difficulty: 'medium', points: 100 },
        ],
      },
      {
        title: 'React Basics',
        description: 'Master React: Components, State, Props, and Hooks',
        category: 'Frontend',
        difficulty: 'intermediate',
        duration: 150,
        xpReward: 750,
        coinReward: 375,
        isPublished: true,
        isActive: true,
        lessons: [
          { id: 1, title: 'What is React?', duration: 15 },
          { id: 2, title: 'Components & JSX', duration: 25 },
          { id: 3, title: 'Props & State', duration: 30 },
          { id: 4, title: 'Hooks (useState, useEffect)', duration: 40 },
          { id: 5, title: 'Building a Todo App', duration: 40 },
        ],
        challenges: [
          { id: 1, title: 'Counter Component', difficulty: 'easy', points: 100 },
          { id: 2, title: 'Todo List App', difficulty: 'hard', points: 200 },
        ],
      },
      {
        title: 'Node.js & Express',
        description: 'Build server-side applications with Node.js and Express',
        category: 'Backend',
        difficulty: 'intermediate',
        duration: 180,
        xpReward: 1000,
        coinReward: 500,
        isPublished: true,
        isActive: true,
        lessons: [
          { id: 1, title: 'Node.js Basics', duration: 20 },
          { id: 2, title: 'Express Setup', duration: 25 },
          { id: 3, title: 'Routing & Middleware', duration: 30 },
          { id: 4, title: 'Database Integration', duration: 40 },
          { id: 5, title: 'Building a REST API', duration: 40 },
          { id: 6, title: 'Authentication & Security', duration: 25 },
        ],
        challenges: [
          { id: 1, title: 'Simple API', difficulty: 'medium', points: 150 },
          { id: 2, title: 'User Authentication', difficulty: 'hard', points: 250 },
        ],
      },
      {
        title: 'Database Design with SQL',
        description: 'Learn SQL and database design principles',
        category: 'Database',
        difficulty: 'beginner',
        duration: 100,
        xpReward: 400,
        coinReward: 200,
        isPublished: true,
        isActive: true,
        lessons: [
          { id: 1, title: 'SQL Basics', duration: 20 },
          { id: 2, title: 'CRUD Operations', duration: 25 },
          { id: 3, title: 'Joins & Relationships', duration: 30 },
          { id: 4, title: 'Database Design', duration: 25 },
        ],
        challenges: [
          { id: 1, title: 'Simple Queries', difficulty: 'easy', points: 75 },
          { id: 2, title: 'Complex Joins', difficulty: 'hard', points: 150 },
        ],
      },
      {
        title: 'Web Development Bootcamp',
        description: 'Complete full-stack web development course',
        category: 'Full Stack',
        difficulty: 'advanced',
        duration: 300,
        xpReward: 2000,
        coinReward: 1000,
        isPublished: true,
        isActive: true,
        lessons: [
          { id: 1, title: 'Frontend Fundamentals', duration: 60 },
          { id: 2, title: 'Backend Development', duration: 60 },
          { id: 3, title: 'Database & APIs', duration: 60 },
          { id: 4, title: 'Deployment & DevOps', duration: 40 },
          { id: 5, title: 'Real-world Project', duration: 80 },
        ],
        challenges: [
          { id: 1, title: 'Full Stack Todo App', difficulty: 'hard', points: 400 },
          { id: 2, title: 'E-commerce Platform', difficulty: 'hard', points: 500 },
        ],
      },
    ]);
    console.log(`[SEED] ✅ Created ${modules.length} learning modules`);

    // SEED QUESTS
    const quests = await Quest.bulkCreate([
      {
        title: 'Complete Your First Lesson',
        description: 'Start learning with your first module',
        category: 'daily',
        difficulty: 'easy',
        xpReward: 100,
        coinReward: 50,
        isActive: true,
      },
      {
        title: 'Solve 5 Code Challenges',
        description: 'Complete 5 coding challenges to boost your skills',
        category: 'daily',
        difficulty: 'medium',
        xpReward: 250,
        coinReward: 150,
        isActive: true,
      },
      {
        title: 'Master JavaScript Basics',
        description: 'Complete the JavaScript fundamentals module',
        category: 'weekly',
        difficulty: 'medium',
        xpReward: 500,
        coinReward: 300,
        isActive: true,
      },
      {
        title: 'Help Other Learners',
        description: 'Answer 3 questions from fellow learners',
        category: 'daily',
        difficulty: 'easy',
        xpReward: 150,
        coinReward: 75,
        isActive: true,
      },
      {
        title: 'Build Your First Project',
        description: 'Complete a real-world project challenge',
        category: 'weekly',
        difficulty: 'hard',
        xpReward: 1000,
        coinReward: 500,
        isActive: true,
      },
      {
        title: 'Learn a New Framework',
        description: 'Complete any framework module (React, Vue, Angular)',
        category: 'weekly',
        difficulty: 'hard',
        xpReward: 750,
        coinReward: 400,
        isActive: true,
      },
    ]);
    console.log(`[SEED] ✅ Created ${quests.length} quests`);

    // SEED SKILLS
    const skills = await Skill.bulkCreate([
      {
        name: 'JavaScript Ninja',
        description: 'Master JavaScript fundamentals',
        icon: 'lightning',
        tier: 1,
        category: 'Programming',
        requiredXP: 500,
        prerequisites: [],
        isActive: true,
      },
      {
        name: 'React Master',
        description: 'Become expert in React framework',
        icon: 'atom',
        tier: 2,
        category: 'Frontend',
        requiredXP: 1500,
        prerequisites: [],
        isActive: true,
      },
      {
        name: 'Node.js Expert',
        description: 'Master backend with Node.js',
        icon: 'server',
        tier: 2,
        category: 'Backend',
        requiredXP: 1500,
        prerequisites: [],
        isActive: true,
      },
      {
        name: 'Database Designer',
        description: 'SQL and database design expert',
        icon: 'database',
        tier: 2,
        category: 'Database',
        requiredXP: 1200,
        prerequisites: [],
        isActive: true,
      },
      {
        name: 'Full Stack Developer',
        description: 'Master both frontend and backend',
        icon: 'rocket',
        tier: 3,
        category: 'Full Stack',
        requiredXP: 3000,
        prerequisites: [],
        isActive: true,
      },
      {
        name: 'DevOps Engineer',
        description: 'Docker, Kubernetes, CI/CD master',
        icon: 'package',
        tier: 3,
        category: 'DevOps',
        requiredXP: 2500,
        prerequisites: [],
        isActive: true,
      },
      {
        name: 'Python Programmer',
        description: 'Advanced Python skills',
        icon: 'code',
        tier: 1,
        category: 'Programming',
        requiredXP: 800,
        prerequisites: [],
        isActive: true,
      },
      {
        name: 'Cloud Architect',
        description: 'AWS, Azure, GCP expertise',
        icon: 'cloud',
        tier: 3,
        category: 'Cloud',
        requiredXP: 2800,
        prerequisites: [],
        isActive: true,
      },
    ]);
    console.log(`[SEED] ✅ Created ${skills.length} skills`);

    // SEED ACHIEVEMENTS
    const achievements = await Achievement.bulkCreate([
      {
        title: 'First Step',
        description: 'Complete your first quest',
        icon: 'award',
        badge: 'first_step',
        type: 'milestone',
        condition: { quests: 1 },
        rarity: 'common',
        xpReward: 50,
        isActive: true,
      },
      {
        title: 'Quest Master',
        description: 'Complete 10 quests',
        icon: 'target',
        badge: 'quest_master',
        type: 'milestone',
        condition: { quests: 10 },
        rarity: 'rare',
        xpReward: 200,
        isActive: true,
      },
      {
        title: 'On Fire',
        description: 'Reach 7 day streak',
        icon: 'flame',
        badge: 'on_fire',
        type: 'streak',
        condition: { days: 7 },
        rarity: 'rare',
        xpReward: 250,
        isActive: true,
      },
      {
        title: 'Legend',
        description: 'Reach level 10',
        icon: 'crown',
        badge: 'legend',
        type: 'milestone',
        condition: { level: 10 },
        rarity: 'epic',
        xpReward: 500,
        isActive: true,
      },
      {
        title: 'Skill Collector',
        description: 'Unlock 5 skills',
        icon: 'award',
        badge: 'skill_collector',
        type: 'skill',
        condition: { skills: 5 },
        rarity: 'rare',
        xpReward: 300,
        isActive: true,
      },
      {
        title: 'Knowledge Seeker',
        description: 'Earn 1000 XP',
        icon: 'book',
        badge: 'knowledge_seeker',
        type: 'milestone',
        condition: { xp: 1000 },
        rarity: 'rare',
        xpReward: 150,
        isActive: true,
      },
    ]);
    console.log(`[SEED] ✅ Created ${achievements.length} achievements`);

    console.log('[SEED] 🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[SEED] ❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
