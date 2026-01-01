import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const courses = [
  {
    title: 'Data Structures and Algorithms',
    slug: 'data-structures-algorithms',
    description: 'Master the fundamentals of DSA with hands-on practice problems and comprehensive explanations. Learn arrays, linked lists, trees, graphs, and advanced algorithms.',
    category: 'DSA',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80',
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
            content: 'Algorithms are step-by-step procedures for solving problems. They form the foundation of computer science and programming. In this lesson, we\'ll explore what algorithms are, why they matter, and how to analyze their efficiency.',
            duration: 15,
            order: 1,
            problems: [
              {
                title: 'Find Maximum Element',
                description: 'Write a function to find the maximum element in an array',
                difficulty: 'easy',
                testCases: [
                  { input: '[1, 5, 3, 9, 2]', output: '9' },
                  { input: '[-1, -5, -3]', output: '-1' }
                ],
                solution: 'function findMax(arr) { return Math.max(...arr); }'
              }
            ]
          },
          {
            title: 'Time and Space Complexity',
            type: 'video',
            videoUrl: 'https://example.com/video/complexity',
            duration: 25,
            order: 2,
            problems: [
              {
                title: 'Analyze Complexity',
                description: 'Determine the time complexity of a given algorithm',
                difficulty: 'medium',
                testCases: [
                  { input: 'O(n log n)', output: 'Correct' }
                ]
              }
            ]
          },
          {
            title: 'Big O Notation',
            type: 'text',
            content: 'Big O notation describes the upper bound of an algorithm\'s time or space complexity. It helps us understand how algorithms scale with input size.',
            duration: 20,
            order: 3,
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
            content: 'Arrays are contiguous memory locations that store elements of the same type. They provide O(1) access time but O(n) for insertion/deletion.',
            duration: 20,
            order: 1,
            problems: [
              {
                title: 'Two Sum',
                description: 'Find two numbers that add up to target',
                difficulty: 'medium',
                testCases: [
                  { input: '[2, 7, 11, 15], target=9', output: '[0, 1]' }
                ],
                solution: 'Use hash map for O(n) solution'
              },
              {
                title: 'Reverse Array',
                description: 'Reverse an array in-place',
                difficulty: 'easy',
                testCases: [
                  { input: '[1, 2, 3, 4]', output: '[4, 3, 2, 1]' }
                ]
              }
            ]
          },
          {
            title: 'String Manipulation',
            type: 'text',
            content: 'Strings are sequences of characters. Learn common string operations and algorithms.',
            duration: 25,
            order: 2,
            problems: [
              {
                title: 'Valid Palindrome',
                description: 'Check if a string is a palindrome',
                difficulty: 'easy',
                testCases: [
                  { input: '"racecar"', output: 'true' }
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'Linked Lists',
        description: 'Understanding linked data structures',
        order: 3,
        lessons: [
          {
            title: 'Singly Linked List',
            type: 'text',
            content: 'A linked list is a linear data structure where elements are stored in nodes, each pointing to the next node.',
            duration: 30,
            order: 1,
            problems: [
              {
                title: 'Reverse Linked List',
                description: 'Reverse a singly linked list',
                difficulty: 'medium',
                testCases: [
                  { input: '1->2->3->4', output: '4->3->2->1' }
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
    description: 'Learn to design scalable, distributed systems from scratch. Master load balancing, caching, databases, and microservices architecture.',
    category: 'System Design',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&q=80',
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
            content: 'System design is the process of defining architecture, components, modules, interfaces, and data for a system to satisfy specified requirements.',
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
          },
          {
            title: 'Load Balancing',
            type: 'text',
            content: 'Load balancing distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed.',
            duration: 25,
            order: 3,
            problems: []
          }
        ]
      },
      {
        title: 'Database Design',
        description: 'Choosing and designing databases for scale',
        order: 2,
        lessons: [
          {
            title: 'SQL vs NoSQL',
            type: 'text',
            content: 'Understanding when to use SQL databases (ACID properties) vs NoSQL (flexibility and scale).',
            duration: 30,
            order: 1,
            problems: []
          },
          {
            title: 'Database Sharding',
            type: 'text',
            content: 'Sharding is a database architecture pattern that splits data across multiple databases.',
            duration: 25,
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
    description: 'Master object-oriented design principles and design patterns. Learn to design classes, interfaces, and relationships.',
    category: 'LLD',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80',
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
            content: 'SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.',
            duration: 25,
            order: 1,
            problems: []
          },
          {
            title: 'Design Patterns',
            type: 'text',
            content: 'Common design patterns: Singleton, Factory, Observer, Strategy, and more.',
            duration: 30,
            order: 2,
            problems: []
          }
        ]
      },
      {
        title: 'Class Design',
        description: 'Designing robust classes and interfaces',
        order: 2,
        lessons: [
          {
            title: 'UML Diagrams',
            type: 'text',
            content: 'Learn to create class diagrams, sequence diagrams, and use case diagrams.',
            duration: 20,
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
    description: 'Understand how operating systems work under the hood. Learn about processes, memory management, file systems, and concurrency.',
    category: 'OS',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80',
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
            content: 'A process is an instance of a program in execution. A thread is a lightweight process that shares memory with other threads.',
            duration: 20,
            order: 1,
            problems: []
          },
          {
            title: 'CPU Scheduling',
            type: 'text',
            content: 'Learn about scheduling algorithms: FCFS, SJF, Round Robin, Priority Scheduling.',
            duration: 25,
            order: 2,
            problems: []
          }
        ]
      },
      {
        title: 'Memory Management',
        description: 'Understanding memory allocation and virtual memory',
        order: 2,
        lessons: [
          {
            title: 'Virtual Memory',
            type: 'text',
            content: 'Virtual memory allows programs to use more memory than physically available through paging and segmentation.',
            duration: 30,
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
    description: 'Learn networking fundamentals and protocols. Understand TCP/IP, HTTP, DNS, and network security.',
    category: 'CN',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&q=80',
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
            content: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.',
            duration: 25,
            order: 1,
            problems: []
          },
          {
            title: 'TCP/IP Protocol',
            type: 'text',
            content: 'TCP/IP is the fundamental protocol suite of the internet. Learn about TCP, UDP, IP, and their differences.',
            duration: 30,
            order: 2,
            problems: []
          }
        ]
      },
      {
        title: 'HTTP and Web Protocols',
        description: 'Understanding web communication',
        order: 2,
        lessons: [
          {
            title: 'HTTP Methods',
            type: 'text',
            content: 'Learn about GET, POST, PUT, DELETE, PATCH methods and their use cases.',
            duration: 20,
            order: 1,
            problems: []
          },
          {
            title: 'HTTPS and Security',
            type: 'text',
            content: 'HTTPS uses TLS/SSL to encrypt data. Learn about certificates, encryption, and security best practices.',
            duration: 25,
            order: 2,
            problems: []
          }
        ]
      }
    ]
  },
  {
    title: 'Database Management Systems',
    slug: 'database-management',
    description: 'Master SQL, NoSQL, and database design principles. Learn normalization, indexing, transactions, and query optimization.',
    category: 'DBMS',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop&q=80',
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
            content: 'SELECT is used to retrieve data from databases. Learn basic SELECT, WHERE, JOIN, GROUP BY, and HAVING clauses.',
            duration: 20,
            order: 1,
            problems: [
              {
                title: 'Write SELECT Query',
                description: 'Write a query to select all users from a table',
                difficulty: 'easy',
                testCases: [
                  { input: 'users table', output: 'SELECT * FROM users;' }
                ]
              }
            ]
          },
          {
            title: 'JOIN Operations',
            type: 'text',
            content: 'Learn INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN operations.',
            duration: 25,
            order: 2,
            problems: []
          }
        ]
      },
      {
        title: 'Database Design',
        description: 'Designing efficient database schemas',
        order: 2,
        lessons: [
          {
            title: 'Normalization',
            type: 'text',
            content: 'Normalization reduces data redundancy. Learn 1NF, 2NF, 3NF, and BCNF.',
            duration: 30,
            order: 1,
            problems: []
          },
          {
            title: 'Indexing',
            type: 'text',
            content: 'Indexes improve query performance. Learn about B-tree indexes, hash indexes, and composite indexes.',
            duration: 25,
            order: 2,
            problems: []
          }
        ]
      }
    ]
  },
  {
    title: 'AI/ML Fundamentals',
    slug: 'ai-ml-fundamentals',
    description: 'Introduction to Artificial Intelligence and Machine Learning. Learn supervised learning, unsupervised learning, neural networks, and deep learning basics.',
    category: 'AI/ML',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop&q=80',
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
            content: 'Machine learning is a subset of AI that enables systems to learn from data without explicit programming.',
            duration: 20,
            order: 1,
            problems: []
          },
          {
            title: 'Types of Learning',
            type: 'text',
            content: 'Supervised learning (labeled data), Unsupervised learning (unlabeled data), and Reinforcement learning (reward-based).',
            duration: 25,
            order: 2,
            problems: []
          }
        ]
      },
      {
        title: 'Neural Networks',
        description: 'Introduction to neural networks and deep learning',
        order: 2,
        lessons: [
          {
            title: 'Perceptron',
            type: 'text',
            content: 'A perceptron is the simplest neural network - a single neuron that makes binary decisions.',
            duration: 20,
            order: 1,
            problems: []
          },
          {
            title: 'Deep Learning Basics',
            type: 'text',
            content: 'Deep learning uses multiple layers of neurons to learn complex patterns in data.',
            duration: 30,
            order: 2,
            problems: []
          }
        ]
      }
    ]
  }
];

async function seedAdminAndCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Shubham1511:Sonu%404321@cluster0.gl1ltyr.mongodb.net/BPL-Project?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB');

    // Create or update admin user
    const adminEmail = 'adminbpl@gmail.com';
    const adminPassword = 'Bpl@4321';
    
    let admin = await User.findOne({ email: adminEmail });
    
    if (admin) {
      // Update existing admin
      admin.password = await bcrypt.hash(adminPassword, 10);
      admin.role = 'admin';
      admin.name = 'Admin BPL';
      await admin.save();
      console.log('✅ Admin user updated');
    } else {
      // Create new admin
      admin = new User({
        name: 'Admin BPL',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created');
    }

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');

    // Insert courses
    await Course.insertMany(courses);
    console.log(`✅ Seeded ${courses.length} courses with modules and lessons`);

    // Display summary
    const courseCount = await Course.countDocuments();
    let totalModules = 0;
    let totalLessons = 0;
    
    for (const course of courses) {
      totalModules += course.modules.length;
      for (const module of course.modules) {
        totalLessons += module.lessons.length;
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`   Courses: ${courseCount}`);
    console.log(`   Modules: ${totalModules}`);
    console.log(`   Lessons: ${totalLessons}`);
    console.log(`\n🔑 Admin Credentials:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
}

seedAdminAndCourses();

