// AI Service for StudyHub - Free AI Integration
// Supports multiple free AI providers: Ollama (local), Hugging Face, and fallback templates

class AIRoadmapService {
  constructor() {
    this.ollamaUrl = 'http://localhost:11434';
    this.isOllamaAvailable = false;
    this.chatHistory = []; // Store chat context
    this.checkOllamaAvailability();
  }

  async checkOllamaAvailability() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: 'GET',
        timeout: 3000
      });
      this.isOllamaAvailable = response.ok;
    } catch (error) {
      this.isOllamaAvailable = false;
      console.log('Ollama not available, using template-based generation');
    }
  }

  // Generate comprehensive roadmap based on career/subject
  async generateRoadmap(subject, level = 'beginner', timeframe = '6 months') {
    console.log(`🤖 Generating AI roadmap for: ${subject} (${level} level, ${timeframe})`);
    
    if (this.isOllamaAvailable) {
      return await this.generateWithOllama(subject, level, timeframe);
    } else {
      return await this.generateWithTemplate(subject, level, timeframe);
    }
  }

  // Ollama-based generation (when available)
  async generateWithOllama(subject, level, timeframe) {
    const prompt = `Create a comprehensive learning roadmap for "${subject}" at ${level} level over ${timeframe}.

Structure the response as JSON with this exact format:
{
  "title": "${subject} Roadmap",
  "description": "Brief description",
  "totalWeeks": number,
  "phases": [
    {
      "phase": "Phase name",
      "weeks": "Week range",
      "description": "What to focus on",
      "topics": ["topic1", "topic2", "topic3"],
      "dailyTasks": [
        {"day": 1, "task": "specific task", "timeEstimate": "2 hours"},
        {"day": 2, "task": "specific task", "timeEstimate": "1.5 hours"}
      ],
      "weeklyGoal": "What to achieve this week",
      "resources": ["resource1", "resource2"]
    }
  ],
  "practiceQuestions": [
    {"week": 1, "question": "What is...", "type": "conceptual"},
    {"week": 2, "question": "Implement...", "type": "practical"}
  ]
}

Make it practical, specific, and actionable.`;

    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: prompt,
          stream: false,
          format: 'json'
        })
      });

      const result = await response.json();
      return JSON.parse(result.response);
    } catch (error) {
      console.log('Ollama generation failed, falling back to template');
      return await this.generateWithTemplate(subject, level, timeframe);
    }
  }

  // Template-based generation (always available)
  async generateWithTemplate(subject, level, timeframe) {
    const roadmapTemplates = {
      'data scientist': this.getDataScienceRoadmap(level, timeframe),
      'web developer': this.getWebDeveloperRoadmap(level, timeframe),
      'machine learning': this.getMLRoadmap(level, timeframe),
      'python': this.getPythonRoadmap(level, timeframe),
      'javascript': this.getJavaScriptRoadmap(level, timeframe),
      'react': this.getReactRoadmap(level, timeframe),
      'node.js': this.getNodeJSRoadmap(level, timeframe),
      'artificial intelligence': this.getAIRoadmap(level, timeframe),
      'cybersecurity': this.getCybersecurityRoadmap(level, timeframe),
      'cloud computing': this.getCloudRoadmap(level, timeframe)
    };

    const key = subject.toLowerCase();
    const template = roadmapTemplates[key] || this.getGenericRoadmap(subject, level, timeframe);
    
    // Add AI enhancement to templates
    return this.enhanceTemplate(template, subject, level);
  }

  // Data Science roadmap template
  getDataScienceRoadmap(level, timeframe) {
    const phases = level === 'beginner' ? [
      {
        phase: "Foundation & Math",
        weeks: "Week 1-4",
        description: "Build strong mathematical foundation",
        topics: ["Statistics", "Linear Algebra", "Python Basics", "Pandas"],
        dailyTasks: [
          { day: 1, task: "Learn basic statistics concepts", timeEstimate: "2 hours" },
          { day: 2, task: "Practice Python syntax and data types", timeEstimate: "2 hours" },
          { day: 3, task: "Introduction to NumPy arrays", timeEstimate: "1.5 hours" },
          { day: 4, task: "Pandas DataFrame operations", timeEstimate: "2 hours" },
          { day: 5, task: "Statistical measures and distributions", timeEstimate: "1.5 hours" },
          { day: 6, task: "Practice problems and coding exercises", timeEstimate: "2 hours" },
          { day: 7, task: "Review and build a mini project", timeEstimate: "2 hours" }
        ],
        weeklyGoal: "Understand data manipulation basics",
        resources: ["Khan Academy Statistics", "Python.org tutorial", "Pandas documentation"]
      },
      {
        phase: "Data Analysis & Visualization",
        weeks: "Week 5-8",
        description: "Learn to analyze and visualize data",
        topics: ["Matplotlib", "Seaborn", "Data Cleaning", "EDA"],
        dailyTasks: [
          { day: 1, task: "Learn Matplotlib basics", timeEstimate: "2 hours" },
          { day: 2, task: "Create different types of plots", timeEstimate: "2 hours" },
          { day: 3, task: "Seaborn for statistical visualization", timeEstimate: "1.5 hours" },
          { day: 4, task: "Data cleaning techniques", timeEstimate: "2 hours" },
          { day: 5, task: "Exploratory Data Analysis project", timeEstimate: "2.5 hours" },
          { day: 6, task: "Handle missing data and outliers", timeEstimate: "2 hours" },
          { day: 7, task: "Complete EDA project presentation", timeEstimate: "2 hours" }
        ],
        weeklyGoal: "Master data visualization and cleaning",
        resources: ["Matplotlib gallery", "Seaborn tutorial", "Kaggle Learn"]
      },
      {
        phase: "Machine Learning Basics",
        weeks: "Week 9-16",
        description: "Introduction to ML algorithms",
        topics: ["Scikit-learn", "Regression", "Classification", "Clustering"],
        dailyTasks: [
          { day: 1, task: "Linear regression theory and implementation", timeEstimate: "2 hours" },
          { day: 2, task: "Logistic regression for classification", timeEstimate: "2 hours" },
          { day: 3, task: "Decision trees and random forests", timeEstimate: "2 hours" },
          { day: 4, task: "K-means clustering", timeEstimate: "1.5 hours" },
          { day: 5, task: "Model evaluation metrics", timeEstimate: "2 hours" },
          { day: 6, task: "Cross-validation and hyperparameter tuning", timeEstimate: "2 hours" },
          { day: 7, task: "End-to-end ML project", timeEstimate: "3 hours" }
        ],
        weeklyGoal: "Build and evaluate ML models",
        resources: ["Scikit-learn docs", "Andrew Ng's ML Course", "Hands-On ML book"]
      },
      {
        phase: "Advanced Topics & Projects",
        weeks: "Week 17-24",
        description: "Deep learning and real-world projects",
        topics: ["Neural Networks", "Deep Learning", "Portfolio Projects", "Deployment"],
        dailyTasks: [
          { day: 1, task: "Neural network fundamentals", timeEstimate: "2 hours" },
          { day: 2, task: "Build neural network from scratch", timeEstimate: "2.5 hours" },
          { day: 3, task: "Introduction to TensorFlow/Keras", timeEstimate: "2 hours" },
          { day: 4, task: "Convolutional Neural Networks", timeEstimate: "2 hours" },
          { day: 5, task: "Work on portfolio project", timeEstimate: "3 hours" },
          { day: 6, task: "Model deployment basics", timeEstimate: "2 hours" },
          { day: 7, task: "Present project and get feedback", timeEstimate: "2 hours" }
        ],
        weeklyGoal: "Complete portfolio-worthy projects",
        resources: ["TensorFlow tutorials", "Keras documentation", "Streamlit for deployment"]
      }
    ] : [
      // Intermediate/Advanced phases would go here
    ];

    return {
      title: "Data Science Roadmap",
      description: "Comprehensive path from beginner to job-ready data scientist",
      totalWeeks: 24,
      phases,
      practiceQuestions: this.getDataScienceQuestions()
    };
  }

  getDataScienceQuestions() {
    return [
      { week: 1, question: "What is the difference between population and sample in statistics?", type: "conceptual" },
      { week: 2, question: "Write Python code to calculate mean, median, and mode of a dataset", type: "practical" },
      { week: 3, question: "How do you handle missing values in a dataset?", type: "conceptual" },
      { week: 4, question: "Create a DataFrame and perform basic operations", type: "practical" },
      { week: 5, question: "What visualization would you use to show correlation between variables?", type: "conceptual" },
      { week: 6, question: "Build a complete EDA report for a given dataset", type: "project" },
      { week: 7, question: "Explain the bias-variance tradeoff", type: "conceptual" },
      { week: 8, question: "Implement linear regression from scratch", type: "practical" },
      { week: 9, question: "When would you use logistic regression over linear regression?", type: "conceptual" },
      { week: 10, question: "Build and evaluate a classification model", type: "project" }
    ];
  }

  // Web Developer roadmap template
  getWebDeveloperRoadmap(level, timeframe) {
    const phases = level === 'beginner' ? [
      {
        phase: "HTML/CSS Fundamentals",
        weeks: "Week 1-4",
        description: "Master the building blocks of web development",
        topics: ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive Design"],
        dailyTasks: [
          { day: 1, task: "Learn HTML5 semantic elements", timeEstimate: "2 hours" },
          { day: 2, task: "CSS basics and selectors", timeEstimate: "2 hours" },
          { day: 3, task: "Flexbox layout system", timeEstimate: "2 hours" },
          { day: 4, task: "CSS Grid fundamentals", timeEstimate: "2 hours" },
          { day: 5, task: "Responsive design principles", timeEstimate: "2.5 hours" },
          { day: 6, task: "Build a responsive webpage", timeEstimate: "3 hours" },
          { day: 7, task: "Practice and review projects", timeEstimate: "2 hours" }
        ],
        weeklyGoal: "Create responsive web layouts",
        resources: ["MDN Web Docs", "CSS-Tricks", "freeCodeCamp"]
      },
      {
        phase: "JavaScript Fundamentals",
        weeks: "Week 5-8",
        description: "Learn programming logic and DOM manipulation",
        topics: ["JavaScript Syntax", "DOM Manipulation", "Events", "ES6+"],
        dailyTasks: [
          { day: 1, task: "JavaScript variables and data types", timeEstimate: "2 hours" },
          { day: 2, task: "Functions and scope", timeEstimate: "2 hours" },
          { day: 3, task: "DOM manipulation basics", timeEstimate: "2 hours" },
          { day: 4, task: "Event handling", timeEstimate: "2 hours" },
          { day: 5, task: "ES6 features (arrow functions, let/const)", timeEstimate: "2 hours" },
          { day: 6, task: "Build interactive webpage", timeEstimate: "3 hours" },
          { day: 7, task: "JavaScript practice problems", timeEstimate: "2 hours" }
        ],
        weeklyGoal: "Create interactive web applications",
        resources: ["JavaScript.info", "Eloquent JavaScript", "MDN JavaScript Guide"]
      }
    ] : [];

    return {
      title: "Web Developer Roadmap",
      description: "Complete path to becoming a modern web developer",
      totalWeeks: 24,
      phases,
      practiceQuestions: this.getWebDevQuestions()
    };
  }

  getWebDevQuestions() {
    return [
      { week: 1, question: "What is the difference between div and span elements?", type: "conceptual" },
      { week: 2, question: "How do you center a div using CSS?", type: "practical" },
      { week: 3, question: "Explain the CSS box model", type: "conceptual" },
      { week: 4, question: "Create a responsive navigation menu", type: "project" }
    ];
  }

  // Machine Learning roadmap template
  getMLRoadmap(level, timeframe) {
    return {
      title: "Machine Learning Roadmap",
      description: "Journey into AI and machine learning",
      totalWeeks: 20,
      phases: [
        {
          phase: "ML Foundations",
          weeks: "Week 1-8",
          description: "Mathematical foundations and basic concepts",
          topics: ["Statistics", "Linear Algebra", "Python", "NumPy", "Pandas"],
          dailyTasks: [
            { day: 1, task: "Statistics fundamentals", timeEstimate: "2 hours" },
            { day: 2, task: "Linear algebra basics", timeEstimate: "2 hours" },
            { day: 3, task: "Python for data science", timeEstimate: "2 hours" },
            { day: 4, task: "NumPy array operations", timeEstimate: "2 hours" },
            { day: 5, task: "Pandas data manipulation", timeEstimate: "2 hours" },
            { day: 6, task: "Data visualization", timeEstimate: "2 hours" },
            { day: 7, task: "Practice project", timeEstimate: "3 hours" }
          ],
          weeklyGoal: "Master data manipulation tools",
          resources: ["Scikit-learn docs", "Python ML courses", "Kaggle Learn"]
        }
      ],
      practiceQuestions: [
        { week: 1, question: "What is the difference between supervised and unsupervised learning?", type: "conceptual" }
      ]
    };
  }

  // Python roadmap template
  getPythonRoadmap(level, timeframe) {
    return {
      title: "Python Programming Roadmap",
      description: "Complete Python mastery from basics to advanced",
      totalWeeks: 16,
      phases: [
        {
          phase: "Python Basics",
          weeks: "Week 1-6",
          description: "Learn Python syntax and core concepts",
          topics: ["Syntax", "Data Types", "Control Flow", "Functions", "OOP"],
          dailyTasks: [
            { day: 1, task: "Python syntax and variables", timeEstimate: "2 hours" },
            { day: 2, task: "Data types and operations", timeEstimate: "2 hours" },
            { day: 3, task: "Control flow (if, loops)", timeEstimate: "2 hours" },
            { day: 4, task: "Functions and modules", timeEstimate: "2 hours" },
            { day: 5, task: "Object-oriented programming", timeEstimate: "2.5 hours" },
            { day: 6, task: "File handling and exceptions", timeEstimate: "2 hours" },
            { day: 7, task: "Build a small project", timeEstimate: "3 hours" }
          ],
          weeklyGoal: "Write clean, functional Python code",
          resources: ["Python.org tutorial", "Automate the Boring Stuff", "Python Crash Course"]
        }
      ],
      practiceQuestions: [
        { week: 1, question: "What is the difference between list and tuple in Python?", type: "conceptual" }
      ]
    };
  }

  // JavaScript roadmap template
  getJavaScriptRoadmap(level, timeframe) {
    return this.getWebDeveloperRoadmap(level, timeframe); // Reuse web dev roadmap
  }

  // React roadmap template
  getReactRoadmap(level, timeframe) {
    return {
      title: "React Development Roadmap",
      description: "Master modern React development",
      totalWeeks: 12,
      phases: [
        {
          phase: "React Fundamentals",
          weeks: "Week 1-6",
          description: "Learn React core concepts and hooks",
          topics: ["Components", "JSX", "Props", "State", "Hooks"],
          dailyTasks: [
            { day: 1, task: "React components and JSX", timeEstimate: "2 hours" },
            { day: 2, task: "Props and component communication", timeEstimate: "2 hours" },
            { day: 3, task: "State management with useState", timeEstimate: "2 hours" },
            { day: 4, task: "Effect hook and lifecycle", timeEstimate: "2 hours" },
            { day: 5, task: "Event handling in React", timeEstimate: "2 hours" },
            { day: 6, task: "Build a React app", timeEstimate: "3 hours" },
            { day: 7, task: "Practice and review", timeEstimate: "2 hours" }
          ],
          weeklyGoal: "Build interactive React applications",
          resources: ["React docs", "React tutorials", "Create React App"]
        }
      ],
      practiceQuestions: [
        { week: 1, question: "What is the difference between props and state?", type: "conceptual" }
      ]
    };
  }

  // Node.js roadmap template
  getNodeJSRoadmap(level, timeframe) {
    return {
      title: "Node.js Backend Roadmap",
      description: "Learn server-side JavaScript development",
      totalWeeks: 14,
      phases: [
        {
          phase: "Node.js Basics",
          weeks: "Week 1-6",
          description: "Learn Node.js fundamentals and Express",
          topics: ["Node.js Basics", "NPM", "Express.js", "APIs", "Databases"],
          dailyTasks: [
            { day: 1, task: "Node.js installation and basics", timeEstimate: "2 hours" },
            { day: 2, task: "NPM and package management", timeEstimate: "2 hours" },
            { day: 3, task: "Express.js server setup", timeEstimate: "2 hours" },
            { day: 4, task: "REST API development", timeEstimate: "2.5 hours" },
            { day: 5, task: "Database integration", timeEstimate: "2.5 hours" },
            { day: 6, task: "Authentication basics", timeEstimate: "2 hours" },
            { day: 7, task: "Build a simple API", timeEstimate: "3 hours" }
          ],
          weeklyGoal: "Create RESTful APIs with Node.js",
          resources: ["Node.js docs", "Express.js guide", "MDN Server-side"]
        }
      ],
      practiceQuestions: [
        { week: 1, question: "What is the event loop in Node.js?", type: "conceptual" }
      ]
    };
  }

  // AI roadmap template
  getAIRoadmap(level, timeframe) {
    return this.getMLRoadmap(level, timeframe); // Reuse ML roadmap
  }

  // Cybersecurity roadmap template
  getCybersecurityRoadmap(level, timeframe) {
    return {
      title: "Cybersecurity Roadmap",
      description: "Learn ethical hacking and security principles",
      totalWeeks: 20,
      phases: [
        {
          phase: "Security Fundamentals",
          weeks: "Week 1-8",
          description: "Learn basic security concepts and networking",
          topics: ["Network Security", "Cryptography", "Linux", "Security Tools"],
          dailyTasks: [
            { day: 1, task: "Networking basics", timeEstimate: "2 hours" },
            { day: 2, task: "TCP/IP and protocols", timeEstimate: "2 hours" },
            { day: 3, task: "Linux command line", timeEstimate: "2 hours" },
            { day: 4, task: "Cryptography basics", timeEstimate: "2 hours" },
            { day: 5, task: "Security tools (Nmap, Wireshark)", timeEstimate: "2.5 hours" },
            { day: 6, task: "Vulnerability assessment", timeEstimate: "2 hours" },
            { day: 7, task: "Practice lab exercises", timeEstimate: "3 hours" }
          ],
          weeklyGoal: "Understand security fundamentals",
          resources: ["OWASP", "Cybrary", "Security+ materials"]
        }
      ],
      practiceQuestions: [
        { week: 1, question: "What is the CIA triad in cybersecurity?", type: "conceptual" }
      ]
    };
  }

  // Cloud Computing roadmap template
  getCloudRoadmap(level, timeframe) {
    return {
      title: "Cloud Computing Roadmap",
      description: "Master cloud platforms and DevOps",
      totalWeeks: 16,
      phases: [
        {
          phase: "Cloud Basics",
          weeks: "Week 1-6",
          description: "Learn cloud concepts and AWS basics",
          topics: ["Cloud Concepts", "AWS/Azure", "Virtual Machines", "Storage", "Networking"],
          dailyTasks: [
            { day: 1, task: "Cloud computing concepts", timeEstimate: "2 hours" },
            { day: 2, task: "AWS account setup and EC2", timeEstimate: "2 hours" },
            { day: 3, task: "Virtual machines and instances", timeEstimate: "2 hours" },
            { day: 4, task: "Cloud storage (S3, databases)", timeEstimate: "2 hours" },
            { day: 5, task: "Cloud networking basics", timeEstimate: "2 hours" },
            { day: 6, task: "Deploy a simple web app", timeEstimate: "3 hours" },
            { day: 7, task: "Practice and cost optimization", timeEstimate: "2 hours" }
          ],
          weeklyGoal: "Deploy applications to the cloud",
          resources: ["AWS Documentation", "Cloud Guru", "Azure Learning"]
        }
      ],
      practiceQuestions: [
        { week: 1, question: "What are the benefits of cloud computing?", type: "conceptual" }
      ]
    };
  }

  // Generic roadmap for any subject
  getGenericRoadmap(subject, level, timeframe) {
    const weeks = timeframe.includes('3') ? 12 : timeframe.includes('6') ? 24 : 36;
    
    return {
      title: `${subject} Learning Roadmap`,
      description: `Structured learning path for ${subject}`,
      totalWeeks: weeks,
      phases: [
        {
          phase: "Foundation",
          weeks: `Week 1-${Math.floor(weeks/4)}`,
          description: `Build strong fundamentals in ${subject}`,
          topics: ["Basics", "Core Concepts", "Terminology", "Tools"],
          dailyTasks: [
            { day: 1, task: `Introduction to ${subject}`, timeEstimate: "2 hours" },
            { day: 2, task: "Learn basic terminology", timeEstimate: "1.5 hours" },
            { day: 3, task: "Hands-on practice", timeEstimate: "2 hours" },
            { day: 4, task: "Review and practice", timeEstimate: "1.5 hours" },
            { day: 5, task: "Mini project", timeEstimate: "2 hours" },
            { day: 6, task: "Problem solving", timeEstimate: "2 hours" },
            { day: 7, task: "Weekly review", timeEstimate: "1 hour" }
          ],
          weeklyGoal: `Understand ${subject} fundamentals`,
          resources: ["Online tutorials", "Documentation", "Practice platforms"]
        }
      ],
      practiceQuestions: [
        { week: 1, question: `What are the key concepts in ${subject}?`, type: "conceptual" },
        { week: 2, question: `Explain the importance of ${subject}`, type: "conceptual" }
      ]
    };
  }

  // Enhance templates with AI-like personalization
  async enhanceTemplate(template, subject, level) {
    // Add personalized difficulty adjustment
    if (level === 'intermediate') {
      template.phases.forEach(phase => {
        phase.dailyTasks.forEach(task => {
          task.timeEstimate = this.adjustTimeForLevel(task.timeEstimate, 1.2);
        });
      });
    }

    // Add motivational elements
    template.motivationalTips = this.getMotivationalTips(subject);
    template.progressMilestones = this.getProgressMilestones(template.totalWeeks);
    
    return template;
  }

  adjustTimeForLevel(timeStr, multiplier) {
    const hours = parseFloat(timeStr);
    const adjusted = Math.round(hours * multiplier * 2) / 2; // Round to nearest 0.5
    return `${adjusted} hours`;
  }

  getMotivationalTips(subject) {
    return [
      `🎯 Focus on understanding concepts, not just memorizing in ${subject}`,
      `💪 Practice daily, even if it's just 30 minutes`,
      `🚀 Build projects to apply what you learn`,
      `🤝 Join communities and discuss your progress`,
      `📈 Track your learning journey and celebrate small wins`
    ];
  }

  getProgressMilestones(totalWeeks) {
    const milestones = [];
    for (let week = 4; week <= totalWeeks; week += 4) {
      milestones.push({
        week,
        milestone: `Week ${week}: Complete phase assessment`,
        reward: "🎉 Treat yourself to something nice!"
      });
    }
    return milestones;
  }

  // Generate daily tasks based on current progress
  async generateDailyTasks(roadmap, currentWeek, completedTasks = []) {
    const currentPhase = roadmap.phases.find(phase => {
      const weekRange = phase.weeks.match(/Week (\d+)-(\d+)/);
      if (weekRange) {
        const start = parseInt(weekRange[1]);
        const end = parseInt(weekRange[2]);
        return currentWeek >= start && currentWeek <= end;
      }
      return false;
    });

    if (!currentPhase) return [];

    // Get base tasks and adapt based on progress
    const baseTasks = currentPhase.dailyTasks;
    const adaptedTasks = baseTasks.map(task => ({
      ...task,
      id: `task_${currentWeek}_${task.day}`,
      week: currentWeek,
      difficulty: this.calculateDifficulty(task, completedTasks),
      completed: false
    }));

    return adaptedTasks;
  }

  calculateDifficulty(task, completedTasks) {
    const completionRate = completedTasks.length > 0 ? 
      completedTasks.filter(t => t.completed).length / completedTasks.length : 0.5;
    
    if (completionRate > 0.8) return 'easy';
    if (completionRate > 0.6) return 'medium';
    return 'challenging';
  }

  // Generate daily practice questions
  async generateDailyQuestion(roadmap, currentWeek, userProgress = {}) {
    const questionsForWeek = roadmap.practiceQuestions.filter(q => q.week === currentWeek);
    
    if (questionsForWeek.length === 0) {
      // Generate a generic question based on the week
      return {
        question: `What key concept have you learned this week (Week ${currentWeek})?`,
        type: "reflection",
        week: currentWeek,
        difficulty: "medium"
      };
    }

    // Return a random question from the week's questions
    const randomQuestion = questionsForWeek[Math.floor(Math.random() * questionsForWeek.length)];
    
    return {
      ...randomQuestion,
      id: `q_${currentWeek}_${Date.now()}`,
      difficulty: this.getQuestionDifficulty(randomQuestion.type)
    };
  }

  getQuestionDifficulty(type) {
    const difficultyMap = {
      'conceptual': 'medium',
      'practical': 'challenging', 
      'project': 'hard',
      'reflection': 'easy'
    };
    return difficultyMap[type] || 'medium';
  }

  // Calculate user progress and provide insights
  calculateProgress(roadmap, completedTasks, currentWeek) {
    const totalWeeks = roadmap.totalWeeks;
    const weekProgress = (currentWeek / totalWeeks) * 100;
    
    const totalTasksThisWeek = roadmap.phases
      .flatMap(phase => phase.dailyTasks)
      .filter(task => task.week === currentWeek).length;
    
    const completedThisWeek = completedTasks
      .filter(task => task.week === currentWeek && task.completed).length;
    
    const weeklyCompletionRate = totalTasksThisWeek > 0 ? 
      (completedThisWeek / totalTasksThisWeek) * 100 : 0;

    return {
      overallProgress: Math.min(weekProgress, 100),
      weeklyProgress: weeklyCompletionRate,
      currentWeek,
      totalWeeks,
      completedTasks: completedTasks.filter(t => t.completed).length,
      totalTasks: completedTasks.length,
      nextMilestone: roadmap.progressMilestones?.find(m => m.week > currentWeek),
      insights: this.generateProgressInsights(weeklyCompletionRate, weekProgress)
    };
  }

  generateProgressInsights(weeklyRate, overallProgress) {
    const insights = [];
    
    if (weeklyRate >= 80) {
      insights.push("🔥 Excellent weekly progress! You're on fire!");
    } else if (weeklyRate >= 60) {
      insights.push("👍 Good progress this week. Keep it up!");
    } else if (weeklyRate < 40) {
      insights.push("⚡ Consider adjusting your daily schedule for better consistency");
    }

    if (overallProgress >= 75) {
      insights.push("🎯 You're in the final stretch! Start preparing for real-world applications");
    } else if (overallProgress >= 50) {
      insights.push("🚀 Halfway there! Time to start building portfolio projects");
    } else if (overallProgress >= 25) {
      insights.push("💪 Foundation building phase. Focus on understanding core concepts");
    }

    return insights;
  }

  // Chatbot-specific methods
  async getChatbotResponse(userMessage, context = {}) {
    // Store conversation context
    this.chatHistory.push({ role: 'user', content: userMessage });
    
    // Keep only last 10 messages for context
    if (this.chatHistory.length > 10) {
      this.chatHistory = this.chatHistory.slice(-10);
    }

    if (this.isOllamaAvailable) {
      return await this.getOllamaChatResponse(userMessage, context);
    } else {
      return await this.getTemplateChatResponse(userMessage, context);
    }
  }

  async getOllamaChatResponse(userMessage, context) {
    const conversationContext = this.chatHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `You are a friendly AI Study Buddy helping students learn. Your personality:
- Encouraging and supportive
- Clear and concise explanations
- Practical study advice
- Use emojis to be friendly
- Break complex topics into simple parts

Conversation history:
${conversationContext}`;

    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: `${systemPrompt}

Student: ${userMessage}

AI Study Buddy:`,
          stream: false
        })
      });

      const result = await response.json();
      const aiResponse = result.response || this.getTemplateChatResponse(userMessage, context);
      
      // Store AI response in history
      this.chatHistory.push({ role: 'assistant', content: aiResponse });
      
      return aiResponse;
    } catch (error) {
      console.log('Ollama chat failed, using template response');
      return this.getTemplateChatResponse(userMessage, context);
    }
  }

  getTemplateChatResponse(userMessage, context) {
    const message = userMessage.toLowerCase();

    // Study motivation responses
    if (message.includes('tired') || message.includes('frustrated') || message.includes('give up') || message.includes('quit')) {
      return this.getMotivationalChatResponse();
    }

    // Study techniques
    if (message.includes('how to study') || message.includes('study tips') || message.includes('learn better')) {
      return this.getStudyTechniqueResponse();
    }

    // Time management
    if (message.includes('time') || message.includes('schedule') || message.includes('organize')) {
      return this.getTimeManagementResponse();
    }

    // Subject-specific help
    if (message.includes('data science') || message.includes('machine learning') || message.includes('ml')) {
      return this.getDataScienceChatResponse(userMessage);
    }

    if (message.includes('web dev') || message.includes('javascript') || message.includes('react') || message.includes('html') || message.includes('css')) {
      return this.getWebDevChatResponse(userMessage);
    }

    if (message.includes('python')) {
      return this.getPythonChatResponse(userMessage);
    }

    // Math and statistics
    if (message.includes('math') || message.includes('statistics') || message.includes('calculus')) {
      return this.getMathChatResponse(userMessage);
    }

    // General encouragement
    return this.getGeneralEncouragementResponse(userMessage);
  }

  getMotivationalChatResponse() {
    const responses = [
      "🌟 I totally understand! Every learner faces moments like this. Remember, the fact that you're here asking means you haven't given up. That's already a win! \n\n💪 Try this: Take a 10-minute walk, then come back and tackle just ONE small task. Progress beats perfection!",
      "📚 Feeling stuck is part of the learning process! Your brain is actually working hard to form new connections. \n\n🎯 Break your study session into tiny 15-minute chunks. What's one small thing you could learn right now?",
      "💫 You know what? Every expert was once a complete beginner who felt exactly like you do now. The difference? They kept going. \n\n🚀 What if I told you that struggling means you're learning? Your brain grows when it's challenged!",
      "🌱 Learning is like growing a plant - some days you see progress, other days you don't, but growth is always happening underground. \n\n✨ What subject are you working on? Let's break it down together!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getStudyTechniqueResponse() {
    return `📖 **Effective Study Techniques:**

🎯 **Active Recall**: Close your notes and quiz yourself
⏰ **Pomodoro**: 25 min focused study + 5 min break
🔄 **Spaced Repetition**: Review at increasing intervals
📝 **Feynman Technique**: Explain it like you're teaching a 5-year-old
🎨 **Visual Learning**: Mind maps, diagrams, flowcharts
👥 **Teach Others**: Best way to test your understanding

💡 **Pro tip**: Combine 2-3 techniques for maximum effect! Which one sounds most helpful for your current subject?`;
  }

  getTimeManagementResponse() {
    return `⏰ **Time Management for Students:**

📅 **Time Blocking**: Assign specific hours to subjects
🍅 **Pomodoro Technique**: Built into StudyHub!
📊 **Priority Matrix**: Urgent vs Important tasks
🎯 **2-Minute Rule**: If it takes <2 min, do it now
📱 **Digital Detox**: Phone in another room while studying

🌟 **StudyHub tip**: Use our dashboard to track your time and see patterns! What's your biggest time challenge?`;
  }

  getDataScienceChatResponse(userMessage) {
    if (userMessage.includes('start') || userMessage.includes('begin') || userMessage.includes('beginner')) {
      return `🔬 **Data Science Beginner's Path:**\n\n1️⃣ **Python Basics** (2-3 weeks)\n2️⃣ **Statistics & Math** (3-4 weeks)\n3️⃣ **Pandas & NumPy** (2-3 weeks)\n4️⃣ **Data Visualization** (2 weeks)\n5️⃣ **Machine Learning** (4-6 weeks)\n\n💡 **Today's action**: Start with Python on Codecademy or freeCodeCamp! Want me to suggest a specific first project?`;
    }
    return `🔬 **Data Science Help:**

🐍 **Python**: Your main tool - focus on Pandas, NumPy
📊 **Statistics**: Foundation for everything else
🤖 **ML Algorithms**: Start with linear regression
📈 **Visualization**: Matplotlib, Seaborn, Plotly

🎯 What specific area are you working on? I can give targeted advice!`;
  }

  getWebDevChatResponse(userMessage) {
    return `💻 **Web Development Guidance:**

🎨 **Frontend Path**: HTML → CSS → JavaScript → React
⚙️ **Backend Path**: Node.js → Express → Databases
🛠️ **Essential Tools**: VS Code, Git, Chrome DevTools

🚀 **Project Ideas**:
• Personal portfolio
• To-do app
• Weather app
• Blog website

💡 What's your current skill level? Beginner, intermediate, or looking to level up?`;
  }

  getPythonChatResponse(userMessage) {
    return `🐍 **Python Learning Support:**

📚 **Fundamentals**: Variables, loops, functions, data structures
🔧 **Popular Libraries**: Requests, Pandas, NumPy, Flask
🎮 **Practice Platforms**: HackerRank, LeetCode, Codewars

💡 **Learning tip**: Code every day, even if it's just 20 minutes! Small programs build big skills.

What Python concept are you struggling with? Let's break it down! 🤓`;
  }

  getMathChatResponse(userMessage) {
    return `🧮 **Math Study Support:**

📐 **Break it down**: Math builds on itself - ensure you understand foundations
✏️ **Practice daily**: Even 15 minutes of problem-solving helps
📝 **Show your work**: Writing steps helps find mistakes
👥 **Study groups**: Explaining to others strengthens understanding

🎯 What specific math topic are you working on? Algebra, Calculus, Statistics? I can suggest targeted resources!`;
  }

  getGeneralEncouragementResponse(userMessage) {
    const responses = [
      "🌟 That's a great question! I love seeing curiosity in action. What specific aspect would you like to dive deeper into?",
      "📚 You're on the right track by asking questions! Learning is all about curiosity. How can I help you understand this better?",
      "💡 Interesting topic! Let me help you break this down into manageable pieces. What's your current understanding?",
      "🎯 I'm excited to help you learn! What would you say is the most challenging part about this topic?",
      "🚀 Every question is a step forward in your learning journey! What specific help do you need right now?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Smart Pomodoro AI Coach methods
  async getPomodoroCoaching(context) {
    if (this.isOllamaAvailable) {
      return await this.getOllamaPomodoroCoaching(context);
    } else {
      return this.getTemplatePomodoroCoaching(context);
    }
  }

  async getOllamaPomodoroCoaching(context) {
    const { phase, sessionCount, completionRate, focusScore, timeOfDay } = context;
    
    const prompt = `As a Pomodoro productivity coach, provide brief motivational coaching for a ${phase} phase. 
Context: Session #${sessionCount}, ${completionRate}% completion rate, focus score ${focusScore}%, time: ${timeOfDay}:00.
Be encouraging, specific, and under 40 words. Use emojis.`;

    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: prompt,
          stream: false
        })
      });

      const result = await response.json();
      return result.response || this.getTemplatePomodoroCoaching(context);
    } catch (error) {
      return this.getTemplatePomodoroCoaching(context);
    }
  }

  getTemplatePomodoroCoaching(context) {
    const { phase, sessionCount, completionRate, focusScore, timeOfDay } = context;
    
    if (phase === 'start') {
      if (timeOfDay >= 9 && timeOfDay <= 11) {
        return "🌅 Morning focus power activated! Your brain is fresh and ready for deep work. Let's make this session count! 🚀";
      } else if (timeOfDay >= 14 && timeOfDay <= 16) {
        return "☀️ Afternoon energy surge! Perfect time to tackle challenging tasks. Your focus is sharp right now! 💪";
      } else {
        return "⭐ Every moment is a chance to grow! Set your intention and dive deep into focused work. You've got this! 🎯";
      }
    }
    
    if (phase === 'midway') {
      if (focusScore >= 80) {
        return "🔥 Incredible focus! You're in the zone. Keep riding this wave of concentration! 🌊";
      } else {
        return "🏃‍♂️ Halfway there! Refocus and finish strong. Every minute of effort counts! ⚡";
      }
    }
    
    if (phase === 'completion') {
      if (completionRate >= 80) {
        return `🎉 Session ${sessionCount} crushed! ${completionRate}% completion rate is outstanding. You're building unstoppable momentum! 🚀`;
      } else {
        return `✅ Progress made! Session ${sessionCount} complete. Every step forward builds your focus muscle. Well done! 💪`;
      }
    }
    
    if (phase === 'break') {
      return "🌸 Time to recharge! Step away, breathe deeply, and let your mind process. You've earned this reset! ☕";
    }
    
    return "🌟 Stay focused and keep growing! Your dedication to improvement is inspiring! 🎯";
  }

  // Adaptive timer suggestions
  calculateOptimalSessionLength(userPatterns) {
    const {
      averageCompletionTime,
      successRate,
      timeOfDay,
      energyLevel,
      taskComplexity
    } = userPatterns;
    
    let baseTime = 25; // Standard Pomodoro
    
    // Adjust based on success rate
    if (successRate > 85) {
      baseTime += 5; // Extend for high performers
    } else if (successRate < 60) {
      baseTime -= 5; // Shorten for struggling users
    }
    
    // Time of day adjustments
    if (timeOfDay >= 9 && timeOfDay <= 11) {
      baseTime += 2; // Morning peak
    } else if (timeOfDay >= 14 && timeOfDay <= 16) {
      baseTime += 1; // Afternoon peak
    } else if (timeOfDay >= 20 || timeOfDay <= 7) {
      baseTime -= 3; // Late night/early morning
    }
    
    // Task complexity
    if (taskComplexity === 'high') {
      baseTime += 5;
    } else if (taskComplexity === 'low') {
      baseTime -= 3;
    }
    
    // Keep within reasonable bounds
    return Math.max(15, Math.min(45, baseTime));
  }

  // Break activity suggestions
  suggestBreakActivity(context) {
    const { sessionCount, timeOfDay, energyLevel, previousBreakType } = context;
    
    const activities = {
      active: [
        "🚶‍♂️ Take a 5-minute walk around your space",
        "🤸‍♀️ Do some light stretching or yoga poses",
        "💃 Dance to your favorite song",
        "🏃‍♂️ Do jumping jacks or quick cardio",
        "🧘‍♂️ Practice deep breathing exercises"
      ],
      mental: [
        "📚 Read a few pages of something interesting",
        "🧩 Solve a quick puzzle or brain teaser",
        "✍️ Write in your journal for 3 minutes",
        "🎨 Doodle or sketch something creative",
        "🤔 Practice mindfulness meditation"
      ],
      social: [
        "💬 Chat with a friend or colleague briefly",
        "📞 Make a quick call to someone you care about",
        "💌 Send a thoughtful message to someone",
        "🤝 Check in with your study group",
        "👥 Share your progress with accountability partner"
      ],
      refresh: [
        "💧 Drink a full glass of water",
        "🍎 Have a healthy snack",
        "🌱 Tend to your plants or look at nature",
        "☕ Make your favorite beverage mindfully",
        "🛁 Splash cold water on your face"
      ]
    };
    
    // Determine best activity type
    let activityType;
    
    if (sessionCount % 4 === 0) {
      // Every 4th session, suggest longer break
      activityType = energyLevel < 60 ? 'refresh' : 'active';
    } else if (timeOfDay >= 9 && timeOfDay <= 17) {
      // During work hours
      activityType = previousBreakType === 'active' ? 'mental' : 'active';
    } else {
      // Evening/night
      activityType = 'mental';
    }
    
    const typeActivities = activities[activityType];
    return typeActivities[Math.floor(Math.random() * typeActivities.length)];
  }

  // Focus optimization tips
  getFocusOptimizationTips(userStats) {
    const { completionRate, averageFocusScore, commonDistractions } = userStats;
    
    const tips = [];
    
    if (completionRate < 70) {
      tips.push("🎯 Try shorter 15-20 minute sessions to build momentum");
      tips.push("📱 Put your phone in another room during focus time");
    }
    
    if (averageFocusScore < 75) {
      tips.push("🧘‍♂️ Start each session with 2 minutes of deep breathing");
      tips.push("🎵 Try focus music or brown noise to minimize distractions");
    }
    
    if (commonDistractions.includes('notifications')) {
      tips.push("🔕 Enable 'Do Not Disturb' mode on all devices");
    }
    
    if (commonDistractions.includes('multitasking')) {
      tips.push("📝 Write down distracting thoughts to address later");
    }
    
    // Add motivational tips
    tips.push("⭐ Celebrate small wins - every completed session matters!");
    tips.push("🌱 Consistency beats perfection - show up daily!");
    
    return tips.slice(0, 3); // Return top 3 tips
  }
}

// Export singleton instance
export const aiRoadmapService = new AIRoadmapService();
export default aiRoadmapService;