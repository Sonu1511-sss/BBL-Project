import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

const courses = [
  {
    title: 'Data Structures and Algorithms',
    slug: 'data-structures-algorithms',
    description: 'Master the fundamentals of DSA with hands-on practice problems and comprehensive explanations.',
    category: 'DSA',
    thumbnail: 'https://via.placeholder.com/400x300?text=DSA',
    isFree: true,
    modules: [
      {
        title: 'Introduction to Algorithms',
        description: 'Learn the basics of algorithms and complexity analysis',
        order: 1,
        lessons: [
          {
            title: 'What are Algorithms?',
            type: 'text',
            content: 'Algorithms are step-by-step procedures for solving problems...',
            duration: 15,
            order: 1,
            problems: [
              {
                title: 'Find Maximum Element',
                description: 'Write a function to find the maximum element in an array',
                difficulty: 'easy',
                testCases: [
                  { input: '[1, 5, 3, 9, 2]', output: '9' }
                ]
              }
            ]
          },
          {
            title: 'Time and Space Complexity',
            type: 'video',
            videoUrl: 'https://example.com/video/complexity',
            duration: 25,
            order: 2,
            problems: []
          }
        ]
      },
      {
        title: 'Arrays and Strings',
        description: 'Deep dive into array and string manipulation',
        order: 2,
        lessons: [
          {
            title: 'Array Basics',
            type: 'text',
            content: 'Arrays are contiguous memory locations...',
            duration: 20,
            order: 1,
            problems: [
              {
                title: 'Two Sum',
                description: 'Find two numbers that add up to target',
                difficulty: 'medium',
                testCases: [
                  { input: '[2, 7, 11, 15], target=9', output: '[0, 1]' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'System Design',
    slug: 'system-design',
    description: 'Learn to design scalable, distributed systems from scratch.',
    category: 'System Design',
    thumbnail: 'https://via.placeholder.com/400x300?text=System+Design',
    isFree: true,
    modules: [
      {
        title: 'Introduction to System Design',
        description: 'Fundamentals of designing large-scale systems',
        order: 1,
        lessons: [
          {
            title: 'What is System Design?',
            type: 'text',
            content: 'System design is the process of defining architecture...',
            duration: 20,
            order: 1,
            problems: []
          },
          {
            title: 'Scalability Basics',
            type: 'video',
            videoUrl: 'https://example.com/video/scalability',
            duration: 30,
            order: 2,
            problems: []
          }
        ]
      }
    ]
  },
  {
    title: 'Low Level Design',
    slug: 'low-level-design',
    description: 'Master object-oriented design principles and design patterns.',
    category: 'LLD',
    thumbnail: 'https://via.placeholder.com/400x300?text=LLD',
    isFree: true,
    modules: [
      {
        title: 'OOP Principles',
        description: 'Learn SOLID principles and OOP concepts',
        order: 1,
        lessons: [
          {
            title: 'SOLID Principles',
            type: 'text',
            content: 'SOLID stands for Single Responsibility, Open/Closed...',
            duration: 25,
            order: 1,
            problems: []
          }
        ]
      }
    ]
  },
  {
    title: 'Operating Systems',
    slug: 'operating-systems',
    description: 'Understand how operating systems work under the hood.',
    category: 'OS',
    thumbnail: 'https://via.placeholder.com/400x300?text=OS',
    isFree: true,
    modules: [
      {
        title: 'Process Management',
        description: 'Learn about processes, threads, and scheduling',
        order: 1,
        lessons: [
          {
            title: 'Process vs Thread',
            type: 'text',
            content: 'A process is an instance of a program...',
            duration: 20,
            order: 1,
            problems: []
          }
        ]
      }
    ]
  },
  {
    title: 'Computer Networks',
    slug: 'computer-networks',
    description: 'Learn networking fundamentals and protocols.',
    category: 'CN',
    thumbnail: 'https://via.placeholder.com/400x300?text=Networks',
    isFree: true,
    modules: [
      {
        title: 'Network Basics',
        description: 'Introduction to networking concepts',
        order: 1,
        lessons: [
          {
            title: 'OSI Model',
            type: 'text',
            content: 'The OSI model has 7 layers...',
            duration: 25,
            order: 1,
            problems: []
          }
        ]
      }
    ]
  },
  {
    title: 'Database Management Systems',
    slug: 'database-management',
    description: 'Master SQL, NoSQL, and database design principles.',
    category: 'DBMS',
    thumbnail: 'https://via.placeholder.com/400x300?text=DBMS',
    isFree: true,
    modules: [
      {
        title: 'SQL Fundamentals',
        description: 'Learn SQL queries and database operations',
        order: 1,
        lessons: [
          {
            title: 'SELECT Queries',
            type: 'text',
            content: 'SELECT is used to retrieve data...',
            duration: 20,
            order: 1,
            problems: []
          }
        ]
      }
    ]
  },
  {
    title: 'AI/ML Fundamentals',
    slug: 'ai-ml-fundamentals',
    description: 'Introduction to Artificial Intelligence and Machine Learning.',
    category: 'AI/ML',
    thumbnail: 'https://via.placeholder.com/400x300?text=AI+ML',
    isFree: true,
    modules: [
      {
        title: 'Introduction to ML',
        description: 'Basics of machine learning',
        order: 1,
        lessons: [
          {
            title: 'What is Machine Learning?',
            type: 'text',
            content: 'Machine learning is a subset of AI...',
            duration: 20,
            order: 1,
            problems: []
          }
        ]
      }
    ]
  }
];

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/babua-lms');
    console.log('✅ Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');

    // Insert courses
    await Course.insertMany(courses);
    console.log(`✅ Seeded ${courses.length} courses`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
}

seedCourses();

