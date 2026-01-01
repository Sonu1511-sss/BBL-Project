import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Thread from '../models/Community.js';
import Booking from '../models/Booking.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seedCommunityAndMentors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Shubham1511:Sonu%404321@cluster0.gl1ltyr.mongodb.net/BPL-Project?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB');

    // Get courses for reference
    const courses = await Course.find();
    if (courses.length === 0) {
      console.log('⚠️  No courses found. Please run seed:admin first.');
      process.exit(1);
    }

    // Create or get mentor users
    const mentorData = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.mentor@bpl.com',
        password: 'Mentor@123',
        role: 'mentor',
        profile: {
          bio: 'Senior Software Engineer with 10+ years in System Design and DSA. Expert in helping students crack FAANG interviews.',
          avatar: 'https://i.pravatar.cc/150?img=12'
        }
      },
      {
        name: 'Priya Sharma',
        email: 'priya.mentor@bpl.com',
        password: 'Mentor@123',
        role: 'mentor',
        profile: {
          bio: 'Full-stack developer and LLD expert. Specialized in design patterns and clean code architecture.',
          avatar: 'https://i.pravatar.cc/150?img=47'
        }
      },
      {
        name: 'Amit Patel',
        email: 'amit.mentor@bpl.com',
        password: 'Mentor@123',
        role: 'mentor',
        profile: {
          bio: 'Database architect and DBMS specialist. 8+ years experience in SQL, NoSQL, and database optimization.',
          avatar: 'https://i.pravatar.cc/150?img=33'
        }
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.mentor@bpl.com',
        password: 'Mentor@123',
        role: 'mentor',
        profile: {
          bio: 'AI/ML engineer and data scientist. Helps students understand machine learning fundamentals and build projects.',
          avatar: 'https://i.pravatar.cc/150?img=20'
        }
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.mentor@bpl.com',
        password: 'Mentor@123',
        role: 'mentor',
        profile: {
          bio: 'Network engineer and OS expert. Specialized in computer networks, operating systems, and distributed systems.',
          avatar: 'https://i.pravatar.cc/150?img=51'
        }
      }
    ];

    const mentors = [];
    for (const mentorInfo of mentorData) {
      let mentor = await User.findOne({ email: mentorInfo.email });
      if (mentor) {
        mentor.role = 'mentor';
        mentor.profile = mentorInfo.profile;
        mentor.password = await bcrypt.hash(mentorInfo.password, 10);
        await mentor.save();
        console.log(`✅ Updated mentor: ${mentorInfo.name}`);
      } else {
        mentor = new User({
          ...mentorInfo,
          password: await bcrypt.hash(mentorInfo.password, 10)
        });
        await mentor.save();
        console.log(`✅ Created mentor: ${mentorInfo.name}`);
      }
      mentors.push(mentor);
    }

    // Create some student users for community posts
    const studentData = [
      {
        name: 'Rahul Verma',
        email: 'rahul.student@bpl.com',
        password: 'Student@123',
        role: 'student',
        profile: {
          bio: 'Learning DSA and System Design',
          avatar: 'https://i.pravatar.cc/150?img=1'
        }
      },
      {
        name: 'Anjali Mehta',
        email: 'anjali.student@bpl.com',
        password: 'Student@123',
        role: 'student',
        profile: {
          bio: 'Focused on LLD and design patterns',
          avatar: 'https://i.pravatar.cc/150?img=5'
        }
      },
      {
        name: 'Karan Malhotra',
        email: 'karan.student@bpl.com',
        password: 'Student@123',
        role: 'student',
        profile: {
          bio: 'Mastering DBMS and SQL',
          avatar: 'https://i.pravatar.cc/150?img=8'
        }
      }
    ];

    const students = [];
    for (const studentInfo of studentData) {
      let student = await User.findOne({ email: studentInfo.email });
      if (student) {
        student.profile = studentInfo.profile;
        student.password = await bcrypt.hash(studentInfo.password, 10);
        await student.save();
        console.log(`✅ Updated student: ${studentInfo.name}`);
      } else {
        student = new User({
          ...studentInfo,
          password: await bcrypt.hash(studentInfo.password, 10)
        });
        await student.save();
        console.log(`✅ Created student: ${studentInfo.name}`);
      }
      students.push(student);
    }

    // Clear existing threads
    await Thread.deleteMany({});
    console.log('🗑️  Cleared existing community threads');

    // Create community threads
    const threadTemplates = [
      {
        title: 'How to approach Two Sum problem efficiently?',
        content: 'I\'m struggling with the Two Sum problem. Can someone explain the optimal approach? I understand the brute force O(n²) solution but want to learn the O(n) hash map approach.',
        tags: ['DSA', 'arrays', 'hash-map'],
        courseId: courses.find(c => c.category === 'DSA')?._id,
        author: students[0]._id,
        upvotes: [mentors[0]._id, students[1]._id],
        replies: [
          {
            content: 'Great question! The key is to use a hash map to store complements. As you iterate, check if the complement (target - current) exists in the map.',
            author: mentors[0]._id,
            upvotes: [students[0]._id, students[1]._id]
          },
          {
            content: 'Here\'s a simple example: For [2,7,11,15] with target 9, when you see 2, store {7: 0}. When you see 7, you find it in the map, so return [0,1].',
            author: students[1]._id,
            upvotes: []
          }
        ],
        isResolved: true
      },
      {
        title: 'System Design: Load Balancing Strategies',
        content: 'What are the different load balancing algorithms? When should we use round-robin vs least connections?',
        tags: ['System Design', 'load-balancing', 'scalability'],
        courseId: courses.find(c => c.category === 'System Design')?._id,
        author: students[1]._id,
        upvotes: [mentors[0]._id, mentors[1]._id],
        replies: [
          {
            content: 'Round-robin is simple and works well when all servers have similar capacity. Least connections is better when requests have varying processing times.',
            author: mentors[0]._id,
            upvotes: [students[1]._id]
          }
        ],
        isResolved: false
      },
      {
        title: 'SOLID Principles - Real World Example',
        content: 'Can someone explain Single Responsibility Principle with a practical example? I understand the theory but need a concrete code example.',
        tags: ['LLD', 'OOP', 'SOLID'],
        courseId: courses.find(c => c.category === 'LLD')?._id,
        author: students[2]._id,
        upvotes: [mentors[1]._id],
        replies: [
          {
            content: 'Think of a User class. It should only handle user data, not email sending. Create a separate EmailService class for that. This way, if email logic changes, you only modify EmailService.',
            author: mentors[1]._id,
            upvotes: [students[2]._id, students[0]._id]
          }
        ],
        isResolved: true
      },
      {
        title: 'SQL JOIN vs Subquery - Performance',
        content: 'When should I use JOINs vs subqueries? Which is more performant?',
        tags: ['DBMS', 'SQL', 'performance'],
        courseId: courses.find(c => c.category === 'DBMS')?._id,
        author: students[0]._id,
        upvotes: [mentors[2]._id, students[1]._id],
        replies: [
          {
            content: 'Generally, JOINs are more performant as the database optimizer can better optimize them. Use subqueries when the logic is clearer or when you need correlated subqueries.',
            author: mentors[2]._id,
            upvotes: [students[0]._id]
          }
        ],
        isResolved: false
      },
      {
        title: 'Process vs Thread - When to use what?',
        content: 'I\'m confused about when to use processes vs threads. Can someone clarify with examples?',
        tags: ['OS', 'process', 'thread'],
        courseId: courses.find(c => c.category === 'OS')?._id,
        author: students[1]._id,
        upvotes: [mentors[4]._id],
        replies: [
          {
            content: 'Use processes when you need isolation and security (e.g., separate applications). Use threads for parallelism within the same application (e.g., handling multiple requests in a web server).',
            author: mentors[4]._id,
            upvotes: [students[1]._id]
          }
        ],
        isResolved: true
      },
      {
        title: 'TCP vs UDP - Real World Use Cases',
        content: 'When should I choose TCP over UDP? What are the trade-offs?',
        tags: ['CN', 'networking', 'TCP', 'UDP'],
        courseId: courses.find(c => c.category === 'CN')?._id,
        author: students[2]._id,
        upvotes: [mentors[4]._id, students[0]._id],
        replies: [
          {
            content: 'TCP: Use for applications that need reliability (web browsing, file transfer). UDP: Use for real-time applications where speed matters more than reliability (video streaming, gaming).',
            author: mentors[4]._id,
            upvotes: [students[2]._id]
          }
        ],
        isResolved: false
      },
      {
        title: 'Machine Learning: Supervised vs Unsupervised',
        content: 'What\'s the main difference between supervised and unsupervised learning? When would I use each?',
        tags: ['AI/ML', 'machine-learning'],
        courseId: courses.find(c => c.category === 'AI/ML')?._id,
        author: students[0]._id,
        upvotes: [mentors[3]._id, students[1]._id],
        replies: [
          {
            content: 'Supervised learning uses labeled data (you know the answers). Use it for classification/regression. Unsupervised learning finds patterns in unlabeled data. Use it for clustering or dimensionality reduction.',
            author: mentors[3]._id,
            upvotes: [students[0]._id, students[2]._id]
          }
        ],
        isResolved: true
      },
      {
        title: 'Best practices for Array manipulation in DSA',
        content: 'What are some common patterns for solving array problems? Any tips for beginners?',
        tags: ['DSA', 'arrays', 'tips'],
        courseId: courses.find(c => c.category === 'DSA')?._id,
        author: students[1]._id,
        upvotes: [mentors[0]._id, students[0]._id, students[2]._id],
        replies: [
          {
            content: '1. Two pointers technique 2. Sliding window 3. Hash map for lookups 4. Sorting when order matters. Start with these patterns!',
            author: mentors[0]._id,
            upvotes: [students[1]._id, students[0]._id]
          }
        ],
        isResolved: false
      }
    ];

    const threads = [];
    for (const template of threadTemplates) {
      const thread = new Thread(template);
      await thread.save();
      threads.push(thread);
    }
    console.log(`✅ Created ${threads.length} community threads`);

    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing bookings');

    // Create some sample bookings
    const bookingTemplates = [
      {
        studentId: students[0]._id,
        mentorId: mentors[0]._id,
        sessionType: 'mock-interview',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration: 60,
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'DSA Interview Prep - Focus on arrays and hash maps'
      },
      {
        studentId: students[1]._id,
        mentorId: mentors[1]._id,
        sessionType: 'office-hours',
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 45,
        status: 'pending',
        notes: 'LLD Design Review - Discuss SOLID principles'
      },
      {
        studentId: students[2]._id,
        mentorId: mentors[2]._id,
        sessionType: 'general',
        scheduledAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        duration: 30,
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
        notes: 'Database Optimization - SQL query optimization'
      }
    ];

    const bookings = [];
    for (const template of bookingTemplates) {
      const booking = new Booking(template);
      await booking.save();
      bookings.push(booking);
    }
    console.log(`✅ Created ${bookings.length} mentor bookings`);

    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   Mentors: ${mentors.length}`);
    console.log(`   Students: ${students.length}`);
    console.log(`   Community Threads: ${threads.length}`);
    console.log(`   Mentor Bookings: ${bookings.length}`);
    console.log(`\n🔑 Test Credentials:`);
    console.log(`   Mentor: rajesh.mentor@bpl.com / Mentor@123`);
    console.log(`   Student: rahul.student@bpl.com / Student@123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
}

seedCommunityAndMentors();

