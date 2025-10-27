const { CodeChallenge } = require('../models');

const seedChallenges = async () => {
  try {
    console.log('🌱 Seeding Code Challenges...');
    
    // Clear existing challenges
    await CodeChallenge.destroy({ where: {} });
    
    const challenges = [
      {
        title: 'Hello World',
        description: 'Write a function that returns "Hello, World!"',
        difficulty: 'easy',
        category: 'javascript',
        language: 'javascript',
        starterCode: `function helloWorld() {
  // Write your code here
  return "";
}`,
        solution: `function helloWorld() {
  return "Hello, World!";
}`,
        testCases: [
          {
            input: 'helloWorld()',
            expectedOutput: 'Hello, World!'
          }
        ],
        hints: [
          'Return a string literal',
          'Use double quotes around the text'
        ],
        xpReward: 25,
        coinReward: 10,
        timeLimit: 5,
        isPublished: true,
        isActive: true
      },
      {
        title: 'Sum of Two Numbers',
        description: 'Write a function that takes two numbers and returns their sum',
        difficulty: 'easy',
        category: 'javascript',
        language: 'javascript',
        starterCode: `function sum(a, b) {
  // Write your code here
  return 0;
}`,
        solution: `function sum(a, b) {
  return a + b;
}`,
        testCases: [
          {
            input: 'sum(2, 3)',
            expectedOutput: 5
          },
          {
            input: 'sum(-1, 1)',
            expectedOutput: 0
          },
          {
            input: 'sum(0, 0)',
            expectedOutput: 0
          }
        ],
        hints: [
          'Use the + operator to add two numbers',
          'Return the result directly'
        ],
        xpReward: 30,
        coinReward: 15,
        timeLimit: 10,
        isPublished: true,
        isActive: true
      },
      {
        title: 'Find Maximum Number',
        description: 'Write a function that finds the maximum number in an array',
        difficulty: 'medium',
        category: 'javascript',
        language: 'javascript',
        starterCode: `function findMax(numbers) {
  // Write your code here
  return 0;
}`,
        solution: `function findMax(numbers) {
  return Math.max(...numbers);
}`,
        testCases: [
          {
            input: 'findMax([1, 5, 3, 9, 2])',
            expectedOutput: 9
          },
          {
            input: 'findMax([-1, -5, -3])',
            expectedOutput: -1
          },
          {
            input: 'findMax([42])',
            expectedOutput: 42
          }
        ],
        hints: [
          'Use Math.max() to find the maximum',
          'Use the spread operator (...) to pass array elements as arguments'
        ],
        xpReward: 50,
        coinReward: 25,
        timeLimit: 15,
        isPublished: true,
        isActive: true
      },
      {
        title: 'Palindrome Checker',
        description: 'Write a function that checks if a string is a palindrome',
        difficulty: 'medium',
        category: 'javascript',
        language: 'javascript',
        starterCode: `function isPalindrome(str) {
  // Write your code here
  return false;
}`,
        solution: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
        testCases: [
          {
            input: 'isPalindrome("racecar")',
            expectedOutput: true
          },
          {
            input: 'isPalindrome("hello")',
            expectedOutput: false
          },
          {
            input: 'isPalindrome("A man a plan a canal Panama")',
            expectedOutput: true
          }
        ],
        hints: [
          'Remove non-alphanumeric characters and convert to lowercase',
          'Compare the string with its reverse'
        ],
        xpReward: 75,
        coinReward: 35,
        timeLimit: 20,
        isPublished: true,
        isActive: true
      },
      {
        title: 'Fibonacci Sequence',
        description: 'Write a function that returns the nth number in the Fibonacci sequence',
        difficulty: 'hard',
        category: 'javascript',
        language: 'javascript',
        starterCode: `function fibonacci(n) {
  // Write your code here
  return 0;
}`,
        solution: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
        testCases: [
          {
            input: 'fibonacci(0)',
            expectedOutput: 0
          },
          {
            input: 'fibonacci(1)',
            expectedOutput: 1
          },
          {
            input: 'fibonacci(5)',
            expectedOutput: 5
          },
          {
            input: 'fibonacci(10)',
            expectedOutput: 55
          }
        ],
        hints: [
          'Use recursion with base cases',
          'The Fibonacci sequence: F(n) = F(n-1) + F(n-2)'
        ],
        xpReward: 100,
        coinReward: 50,
        timeLimit: 30,
        isPublished: true,
        isActive: true
      },
      {
        title: 'Array Sorting',
        description: 'Write a function that sorts an array of numbers in ascending order',
        difficulty: 'easy',
        category: 'javascript',
        language: 'javascript',
        starterCode: `function sortArray(numbers) {
  // Write your code here
  return numbers;
}`,
        solution: `function sortArray(numbers) {
  return numbers.sort((a, b) => a - b);
}`,
        testCases: [
          {
            input: 'sortArray([3, 1, 4, 1, 5])',
            expectedOutput: [1, 1, 3, 4, 5]
          },
          {
            input: 'sortArray([5, 2, 8, 1, 9])',
            expectedOutput: [1, 2, 5, 8, 9]
          }
        ],
        hints: [
          'Use the sort() method with a compare function',
          'The compare function should return a - b for ascending order'
        ],
        xpReward: 40,
        coinReward: 20,
        timeLimit: 10,
        isPublished: true,
        isActive: true
      }
    ];
    
    await CodeChallenge.bulkCreate(challenges);
    console.log('✅ Code Challenges seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    throw error;
  }
};

module.exports = seedChallenges;
