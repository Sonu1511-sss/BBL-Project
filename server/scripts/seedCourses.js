import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Track from '../models/Track.js';
import Question from '../models/Question.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Shubham1511:Sonu%404321@cluster0.gl1ltyr.mongodb.net/BPL-Project?retryWrites=true&w=majority');
    console.log('✅ MongoDB connected for seeding');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// DSA Questions (Striver A2Z style)
const dsaQuestions = [
  // Arrays Section
  { id: 'AR-01', title: 'Two Sum', videoUrl: 'https://youtube.com/watch?v=two-sum', leetcodeUrl: 'https://leetcode.com/problems/two-sum/', solveLink: 'https://leetcode.com/problems/two-sum/', difficulty: 'Easy', companies: ['Accenture+29', 'Google+15', 'Amazon+12'], topics: ['Array', 'HashTable'] },
  { id: 'AR-02', title: '3Sum', videoUrl: 'https://youtube.com/watch?v=3sum', leetcodeUrl: 'https://leetcode.com/problems/3sum/', solveLink: 'https://leetcode.com/problems/3sum/', difficulty: 'Medium', companies: ['Google+15', 'Amazon+10'], topics: ['Array', 'Two Pointers'] },
  { id: 'AR-03', title: 'Best Time to Buy and Sell Stock', videoUrl: 'https://youtube.com/watch?v=best-time', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', solveLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', difficulty: 'Easy', companies: ['Amazon+20', 'Microsoft+15'], topics: ['Array', 'Dynamic Programming'] },
  { id: 'AR-04', title: 'Maximum Subarray', videoUrl: 'https://youtube.com/watch?v=max-subarray', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', solveLink: 'https://leetcode.com/problems/maximum-subarray/', difficulty: 'Medium', companies: ['Amazon+25', 'Google+18'], topics: ['Array', 'Divide and Conquer'] },
  { id: 'AR-05', title: 'Product of Array Except Self', videoUrl: 'https://youtube.com/watch?v=product-array', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/', solveLink: 'https://leetcode.com/problems/product-of-array-except-self/', difficulty: 'Medium', companies: ['Amazon+22', 'Facebook+15'], topics: ['Array'] },
  // Add more DSA questions...
];

// System Design Topics
const systemDesignTopics = [
  { id: 'LB-01', title: 'Introduction to L4 vs L7', resourceUrl: 'https://youtube.com/watch?v=l4-l7', note: 'Focus on Nginx vs HAProxy' },
  { id: 'LB-02', title: 'Load Balancing Algorithms', resourceUrl: 'https://youtube.com/watch?v=lb-algorithms', note: 'Round Robin, Least Connections, IP Hash' },
  { id: 'LB-03', title: 'Circuit Breaker Pattern', resourceUrl: 'https://youtube.com/watch?v=circuit-breaker', note: 'Prevent cascading failures' },
  { id: 'DB-01', title: 'Horizontal vs Vertical Sharding', resourceUrl: 'https://youtube.com/watch?v=sharding', note: 'No notes added' },
  { id: 'DB-02', title: 'Directory Based Sharding', resourceUrl: 'https://youtube.com/watch?v=directory-sharding', note: 'Complex implementation' },
  // Add more System Design topics...
];

const seedCourses = async () => {
  await connectDB();

  try {
    console.log('🗑️ Deleting existing tracks and questions...');
    await Track.deleteMany({});
    await Question.deleteMany({});
    console.log('✅ Existing data deleted.');

    console.log('🌱 Seeding courses...');

    // Create DSA Patterns Track
    const dsaTrack = new Track({
      track: 'DSA Patterns',
      title: 'DSA Patterns',
      description: 'Master Data Structures and Algorithms',
      sections: [
        {
          name: 'Arrays',
          order: 1,
          questions: dsaQuestions.slice(0, 5),
        },
        {
          name: 'Strings',
          order: 2,
          questions: [],
        },
        {
          name: 'Linked Lists',
          order: 3,
          questions: [],
        },
        {
          name: 'Trees',
          order: 4,
          questions: [],
        },
        {
          name: 'Dynamic Programming',
          order: 5,
          questions: [],
        },
      ],
    });
    await dsaTrack.save();

    // Save DSA questions to Question collection
    for (const question of dsaQuestions.slice(0, 5)) {
      await Question.findOneAndUpdate(
        { track: 'DSA Patterns', section: 'Arrays', id: question.id },
        {
          ...question,
          track: 'DSA Patterns',
          section: 'Arrays',
          type: 'leetcode',
        },
        { upsert: true, new: true }
      );
    }

    // Create System Design Track
    const systemDesignTrack = new Track({
      track: 'System Design',
      title: 'System Design',
      description: 'Learn scalable system design',
      sections: [
        {
          name: 'Load Balancing',
          order: 1,
          questions: systemDesignTopics.slice(0, 3),
        },
        {
          name: 'Database Sharding',
          order: 2,
          questions: systemDesignTopics.slice(3, 5),
        },
        {
          name: 'Basics',
          order: 0,
          questions: [],
        },
      ],
    });
    await systemDesignTrack.save();

    // Save System Design questions to Question collection
    for (const topic of systemDesignTopics) {
      const section = topic.id.startsWith('LB') ? 'Load Balancing' : 'Database Sharding';
      await Question.findOneAndUpdate(
        { track: 'System Design', section, id: topic.id },
        {
          ...topic,
          track: 'System Design',
          section,
          type: 'theory',
        },
        { upsert: true, new: true }
      );
    }

    // Create DBMS Track
    const dbmsTrack = new Track({
      track: 'DBMS',
      title: 'Database Management Systems',
      description: 'Master database concepts',
      sections: [
        {
          name: 'Basics',
          order: 1,
          questions: [],
        },
      ],
    });
    await dbmsTrack.save();

    // Create CN Track
    const cnTrack = new Track({
      track: 'CN',
      title: 'Computer Networks',
      description: 'Understand network protocols',
      sections: [
        {
          name: 'Basics',
          order: 1,
          questions: [],
        },
      ],
    });
    await cnTrack.save();

    // Create OS Track
    const osTrack = new Track({
      track: 'OS',
      title: 'Operating Systems',
      description: 'Explore OS fundamentals',
      sections: [
        {
          name: 'Basics',
          order: 1,
          questions: [],
        },
      ],
    });
    await osTrack.save();

    console.log('✅ Courses seeded successfully!');
    console.log(`✅ DSA Patterns: ${dsaQuestions.length} questions`);
    console.log(`✅ System Design: ${systemDesignTopics.length} topics`);
    console.log('✅ DBMS, CN, OS tracks created');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
