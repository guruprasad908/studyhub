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

  // AI-powered flashcard generation
  async generateFlashcards(content) {
    console.log(`🤖 Generating AI flashcards for content: ${content.substring(0, 50)}...`);
    
    if (this.isOllamaAvailable) {
      return await this.generateFlashcardsWithOllama(content);
    } else {
      return await this.generateFlashcardsWithTemplate(content);
    }
  }

  // Ollama-based flashcard generation (when available)
  async generateFlashcardsWithOllama(content) {
    const prompt = `Create 10 educational flashcards from the following content. 
Each flashcard should have a clear question on one side and a concise answer on the other.

Content:
${content}

Structure the response as JSON with this exact format:
{
  "flashcards": [
    {
      "question": "Clear, specific question",
      "answer": "Concise, accurate answer"
    }
  ]
}

Requirements:
- Create exactly 10 flashcards
- Focus on key concepts, definitions, and important facts
- Make questions clear and unambiguous
- Keep answers concise but complete
- Vary the question types (definitions, explanations, comparisons, etc.)`;

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
      const parsed = JSON.parse(result.response);
      return parsed.flashcards || [];
    } catch (error) {
      console.log('Ollama flashcard generation failed, falling back to template');
      return await this.generateFlashcardsWithTemplate(content);
    }
  }

  // Template-based flashcard generation (always available)
  async generateFlashcardsWithTemplate(content) {
    // Extract key terms and concepts from content
    const keyTerms = this.extractKeyTerms(content);
    
    // Generate flashcards based on common patterns
    const flashcards = [];
    
    // Definition-based flashcards
    keyTerms.forEach((term, index) => {
      if (index < 5) { // Limit to 5 definition cards
        flashcards.push({
          question: `What is ${term}?`,
          answer: this.getDefinition(term, content)
        });
      }
    });
    
    // Concept explanation flashcards
    const concepts = this.extractConcepts(content);
    concepts.forEach((concept, index) => {
      if (index < 3 && flashcards.length < 8) {
        flashcards.push({
          question: `Explain the concept of ${concept}`,
          answer: this.getConceptExplanation(concept, content)
        });
      }
    });
    
    // Fill remaining slots with general Q&A
    while (flashcards.length < 10) {
      const generalCards = this.getGeneralFlashcards(content);
      if (generalCards.length > 0) {
        flashcards.push(generalCards.shift());
      } else {
        break;
      }
    }
    
    return flashcards.slice(0, 10); // Ensure exactly 10 cards
  }

  // Helper methods for template-based flashcard generation
  extractKeyTerms(content) {
    // Simple term extraction based on capitalized words or common patterns
    const terms = content.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g) || [];
    return [...new Set(terms)].slice(0, 10); // Unique terms, limit to 10
  }

  extractConcepts(content) {
    // Extract concepts based on common educational terms
    const conceptPatterns = [
      'machine learning', 'artificial intelligence', 'data science', 
      'web development', 'computer science', 'mathematics',
      'statistics', 'programming', 'algorithm', 'database'
    ];
    
    return conceptPatterns.filter(concept => 
      content.toLowerCase().includes(concept.toLowerCase())
    );
  }

  getDefinition(term, content) {
    // Simple definition extraction - in a real implementation, this would be more sophisticated
    const sentences = content.split(/[.!?]+/);
    const termSentence = sentences.find(sentence => 
      sentence.toLowerCase().includes(term.toLowerCase())
    );
    
    return termSentence ? 
      termSentence.trim() + '.' : 
      `Definition of ${term} related to the study material.`;
  }

  getConceptExplanation(concept, content) {
    // Simple concept explanation - in a real implementation, this would be more sophisticated
    const conceptMap = {
      'machine learning': 'A method of data analysis that automates analytical model building using algorithms that iteratively learn from data.',
      'artificial intelligence': 'The simulation of human intelligence processes by machines, especially computer systems.',
      'data science': 'An interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data.',
      'web development': 'The work involved in developing a website for the Internet or an intranet.',
      'computer science': 'The study of computers and computational systems, including their theoretical and algorithmic foundations.',
      'statistics': 'The discipline that concerns the collection, organization, analysis, interpretation, and presentation of data.',
      'programming': 'The process of creating a set of instructions that tell a computer how to perform a task.',
      'algorithm': 'A process or set of rules to be followed in calculations or other problem-solving operations.',
      'database': 'An organized collection of structured information, or data, typically stored electronically in a computer system.'
    };
    
    return conceptMap[concept.toLowerCase()] || 
      `Explanation of ${concept} as it relates to your study material.`;
  }

  getGeneralFlashcards(content) {
    // General flashcard templates
    return [
      {
        question: "What are the key points covered in this material?",
        answer: "Review the main topics: " + content.substring(0, 100) + "..."
      },
      {
        question: "What is the most important concept to remember?",
        answer: "The core concept from this material is highlighted in the key sections."
      },
      {
        question: "How can this knowledge be applied practically?",
        answer: "This material provides foundational knowledge that can be applied to real-world scenarios."
      }
    ];
  }

  // AI-powered quiz generation
  async generateQuiz(content) {
    console.log(`🤖 Generating AI quiz for content: ${content.substring(0, 50)}...`);
    
    if (this.isOllamaAvailable) {
      return await this.generateQuizWithOllama(content);
    } else {
      return await this.generateQuizWithTemplate(content);
    }
  }

  // Ollama-based quiz generation (when available)
  async generateQuizWithOllama(content) {
    const prompt = `Create a 10-question multiple choice quiz from the following content.
Each question should have 4 options with exactly one correct answer.

Content:
${content}

Structure the response as JSON with this exact format:
{
  "title": "Quiz Title Based on Content",
  "questions": [
    {
      "question": "Clear, specific question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is the correct answer"
    }
  ]
}

Requirements:
- Create exactly 10 questions
- Focus on key concepts, definitions, and important facts
- Make questions clear and unambiguous
- Include one correct answer and three plausible distractors
- Provide brief explanations for each answer
- Vary the question types (definitions, explanations, applications, etc.)
- Number correctAnswer as 0, 1, 2, or 3 corresponding to the options array`;

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
      const parsed = JSON.parse(result.response);
      return {
        title: parsed.title || "AI Generated Quiz",
        questions: parsed.questions || []
      };
    } catch (error) {
      console.log('Ollama quiz generation failed, falling back to template');
      return await this.generateQuizWithTemplate(content);
    }
  }

  // Template-based quiz generation (always available)
  async generateQuizWithTemplate(content) {
    // Extract key terms and concepts from content
    const keyTerms = this.extractKeyTerms(content);
    const concepts = this.extractConcepts(content);
    
    const questions = [];
    
    // Definition-based questions
    keyTerms.forEach((term, index) => {
      if (index < 3) { // Limit to 3 definition questions
        questions.push({
          question: `What is the best definition of "${term}"?`,
          options: [
            this.getDefinition(term, content),
            this.generateDistractor(term),
            this.generateDistractor(term),
            this.generateDistractor(term)
          ],
          correctAnswer: 0,
          explanation: `This is the correct definition of ${term} based on the study material.`
        });
      }
    });
    
    // Concept application questions
    concepts.forEach((concept, index) => {
      if (index < 3 && questions.length < 6) {
        questions.push({
          question: `Which of the following is a key aspect of ${concept}?`,
          options: [
            this.getConceptKeyAspect(concept),
            this.generateDistractorConcept(),
            this.generateDistractorConcept(),
            this.generateDistractorConcept()
          ],
          correctAnswer: 0,
          explanation: `This correctly identifies a fundamental aspect of ${concept}.`
        });
      }
    });
    
    // Fill remaining slots with general knowledge questions
    while (questions.length < 10) {
      const generalQuestions = this.getGeneralQuizQuestions(content);
      if (generalQuestions.length > 0) {
        questions.push(generalQuestions.shift());
      } else {
        break;
      }
    }
    
    return {
      title: "AI Generated Quiz on Study Material",
      questions: questions.slice(0, 10) // Ensure exactly 10 questions
    };
  }

  // Helper methods for template-based quiz generation
  generateDistractor(term) {
    const distractors = [
      `A complex process related to ${term} but not the main definition`,
      `An advanced concept that builds upon ${term}`,
      `A common misconception about ${term}`,
      `A related term that is often confused with ${term}`
    ];
    return distractors[Math.floor(Math.random() * distractors.length)];
  }

  generateDistractorConcept() {
    const distractors = [
      "A methodology that focuses on systematic approaches",
      "A framework designed for efficient implementation",
      "A technique used for optimizing performance",
      "A strategy that emphasizes collaborative development"
    ];
    return distractors[Math.floor(Math.random() * distractors.length)];
  }

  getConceptKeyAspect(concept) {
    const aspectMap = {
      'machine learning': 'Ability to learn from data without explicit programming',
      'artificial intelligence': 'Simulation of human intelligence in machines',
      'data science': 'Extraction of insights from structured and unstructured data',
      'web development': 'Creation of websites and web applications',
      'computer science': 'Study of computational systems and computation',
      'statistics': 'Collection, analysis, interpretation, and presentation of data',
      'programming': 'Process of creating instructions for computers to execute',
      'algorithm': 'Step-by-step procedure for solving a problem',
      'database': 'Organized collection of structured information'
    };
    
    return aspectMap[concept.toLowerCase()] || 
      `A fundamental aspect of ${concept} relevant to the study material.`;
  }

  getGeneralQuizQuestions(content) {
    // General quiz question templates
    return [
      {
        question: "What is the main topic of this material?",
        options: [
          this.extractMainTopic(content),
          this.generateDistractorTopic(),
          this.generateDistractorTopic(),
          this.generateDistractorTopic()
        ],
        correctAnswer: 0,
        explanation: "This correctly identifies the primary focus of the study material."
      },
      {
        question: "Which approach is most effective for learning this material?",
        options: [
          "Active recall and spaced repetition",
          "Passive reading multiple times",
          "Memorization without understanding",
          "Cramming before assessments"
        ],
        correctAnswer: 0,
        explanation: "Active recall and spaced repetition are evidence-based learning techniques."
      }
    ];
  }

  extractMainTopic(content) {
    // Simple topic extraction - in a real implementation, this would be more sophisticated
    const topics = [
      'Machine Learning', 'Data Science', 'Web Development', 
      'Computer Science', 'Programming', 'Mathematics'
    ];
    
    for (const topic of topics) {
      if (content.toLowerCase().includes(topic.toLowerCase())) {
        return topic;
      }
    }
    
    return "Study Material Concepts";
  }

  generateDistractorTopic() {
    const topics = [
      "Advanced Theoretical Frameworks",
      "Practical Implementation Strategies",
      "Historical Development Analysis",
      "Contemporary Research Methods"
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  // AI-powered note processing
  async processNotes(content) {
    console.log(`🤖 Processing notes with AI: ${content.substring(0, 50)}...`);
    
    if (this.isOllamaAvailable) {
      return await this.processNotesWithOllama(content);
    } else {
      return await this.processNotesWithTemplate(content);
    }
  }

  // Ollama-based note processing (when available)
  async processNotesWithOllama(content) {
    const prompt = `Process the following study notes and create a comprehensive analysis.
Provide a structured output with summary, key points, and concept map.

Content:
${content}

Structure the response as JSON with this exact format:
{
  "summary": "Concise summary of the main points (2-3 paragraphs)",
  "keyPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ],
  "mindMap": {
    "text": "Text-based representation of concept relationships",
    "description": "Brief explanation of the concept map structure"
  }
}

Requirements:
- Create a clear, concise summary of 2-3 paragraphs
- Extract 5-7 key points from the content
- Generate a text-based concept map showing relationships
- Focus on the most important concepts and their connections
- Use clear, educational language`;

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
      const parsed = JSON.parse(result.response);
      return {
        summary: parsed.summary || "AI-generated summary will appear here.",
        keyPoints: parsed.keyPoints || ["Key points will be generated here."],
        mindMap: parsed.mindMap || {
          text: "Concept map will be generated here.",
          description: "Visual representation of key concepts and their relationships."
        }
      };
    } catch (error) {
      console.log('Ollama note processing failed, falling back to template');
      return await this.processNotesWithTemplate(content);
    }
  }

  // Template-based note processing (always available)
  async processNotesWithTemplate(content) {
    // Extract key points using simple heuristics
    const keyPoints = this.extractKeyPoints(content);
    
    // Generate a summary based on key points
    const summary = this.generateSummary(content, keyPoints);
    
    // Create a simple mind map representation
    const mindMap = this.generateMindMap(content);
    
    return {
      summary,
      keyPoints,
      mindMap
    };
  }

  // Helper methods for template-based note processing
  extractKeyPoints(content) {
    // Simple key point extraction - in a real implementation, this would be more sophisticated
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Extract sentences that seem important (longer sentences, contain key terms)
    const keyTerms = ['important', 'key', 'essential', 'crucial', 'significant', 'main', 'primary'];
    const keySentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return keyTerms.some(term => lowerSentence.includes(term)) || sentence.length > 100;
    });
    
    // Limit to 5-7 key points
    const points = keySentences.length > 0 
      ? keySentences.slice(0, 6) 
      : sentences.slice(0, 5).map(s => s.trim() + '.');
    
    // Add a general point if we have too few
    if (points.length < 5) {
      points.push("This material covers fundamental concepts that are essential for understanding the subject.");
    }
    
    return points;
  }

  generateSummary(content, keyPoints) {
    // Create a summary based on key points
    const topic = this.extractMainTopic(content);
    const wordCount = content.split(/\s+/).length;
    
    return `This study material covers ${topic} with approximately ${wordCount} words. 
The key concepts include: ${keyPoints.slice(0, 3).join(' ')}. 
This content provides foundational knowledge for understanding the subject matter and can be used for further study and review.`;
  }

  generateMindMap(content) {
    // Simple mind map generation
    const mainTopic = this.extractMainTopic(content);
    const concepts = this.extractConcepts(content);
    
    let mindMapText = `${mainTopic}\n`;
    concepts.slice(0, 4).forEach((concept, index) => {
      mindMapText += `  ├── ${concept}\n`;
      // Add sub-concepts for the first few concepts
      if (index < 2) {
        mindMapText += `  │   ├── Sub-concept 1\n`;
        mindMapText += `  │   └── Sub-concept 2\n`;
      }
    });
    
    return {
      text: mindMapText,
      description: `This concept map shows the relationship between ${mainTopic} and its key sub-topics. Central concepts branch out to related ideas.`
    };
  }

  // AI-powered study pattern analysis
  async analyzeStudyPatterns(studyData, timeframe = 'weekly') {
    console.log(`🤖 Analyzing study patterns for timeframe: ${timeframe}`);
    
    if (this.isOllamaAvailable) {
      return await this.analyzeStudyPatternsWithOllama(studyData, timeframe);
    } else {
      return await this.analyzeStudyPatternsWithTemplate(studyData, timeframe);
    }
  }

  // Ollama-based study pattern analysis (when available)
  async analyzeStudyPatternsWithOllama(studyData, timeframe) {
    const prompt = `Analyze the following study data and provide comprehensive insights.
Generate personalized recommendations and predictions based on the patterns.

Study Data:
${JSON.stringify(studyData, null, 2)}

Timeframe: ${timeframe}

Structure the response as JSON with this exact format:
{
  "consistencyScore": 85,
  "focusScore": 78,
  "progressScore": 92,
  "predictedSuccess": 88,
  "insights": [
    "Key insight 1 about study patterns",
    "Key insight 2 about learning habits",
    "Key insight 3 about improvement opportunities"
  ],
  "recommendations": [
    {
      "title": "Recommendation Title",
      "description": "Detailed explanation of how to implement this recommendation"
    }
  ],
  "peakHours": {
    "hours": [9, 10, 11],
    "score": 90
  },
  "sessionLength": {
    "minutes": 35,
    "score": 82
  },
  "breakBalance": {
    "ratio": "5:1",
    "score": 75
  },
  "motivation": {
    "current": 70,
    "trend": 5,
    "suggestions": [
      "Suggestion for maintaining or boosting motivation"
    ]
  }
}

Requirements:
- Provide realistic scores based on the data (0-100)
- Generate 3 key insights about study patterns
- Create 4 personalized recommendations
- Analyze peak study hours, session length, and break balance
- Include motivation analysis with trend and suggestions
- Use educational and encouraging language`;

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
      const parsed = JSON.parse(result.response);
      return parsed;
    } catch (error) {
      console.log('Ollama study pattern analysis failed, falling back to template');
      return await this.analyzeStudyPatternsWithTemplate(studyData, timeframe);
    }
  }

  // Template-based study pattern analysis (always available)
  async analyzeStudyPatternsWithTemplate(studyData, timeframe) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    
    // Generate scores based on patterns
    const consistencyScore = this.calculateConsistencyScore(patterns);
    const focusScore = this.calculateFocusScore(patterns);
    const progressScore = this.calculateProgressScore(studyData);
    
    // Predict success based on current patterns
    const predictedSuccess = Math.round((consistencyScore + focusScore + progressScore) / 3);
    
    // Generate insights
    const insights = this.generateStudyInsights(patterns, consistencyScore, focusScore);
    
    // Create recommendations
    const recommendations = this.generateRecommendations(patterns, consistencyScore, focusScore);
    
    // Analyze timing patterns
    const peakHours = this.analyzePeakHours(patterns);
    const sessionLength = this.analyzeSessionLength(patterns);
    const breakBalance = this.analyzeBreakBalance(patterns);
    
    // Motivation analysis
    const motivation = this.analyzeMotivation(patterns);
    
    return {
      consistencyScore,
      focusScore,
      progressScore,
      predictedSuccess,
      insights,
      recommendations,
      peakHours,
      sessionLength,
      breakBalance,
      motivation
    };
  }

  // Helper methods for template-based study pattern analysis
  extractStudyPatterns(studyData) {
    // Extract study patterns from data
    const patterns = {
      dailySessions: [],
      sessionDurations: [],
      studyHours: [],
      completionRates: [],
      focusScores: []
    };
    
    // Process study data to extract patterns
    if (studyData.sessions) {
      studyData.sessions.forEach(session => {
        patterns.dailySessions.push(session.date);
        patterns.sessionDurations.push(session.duration);
        patterns.studyHours.push(new Date(session.startTime).getHours());
        patterns.completionRates.push(session.completionRate || 50);
        patterns.focusScores.push(session.focusScore || 50);
      });
    }
    
    if (studyData.tasks) {
      studyData.tasks.forEach(task => {
        if (task.completed) {
          patterns.completionRates.push(100);
        } else {
          patterns.completionRates.push(0);
        }
      });
    }
    
    return patterns;
  }

  calculateConsistencyScore(patterns) {
    if (patterns.dailySessions.length === 0) return 50;
    
    // Calculate consistency based on regular study sessions
    const uniqueDays = new Set(patterns.dailySessions).size;
    const totalDays = patterns.dailySessions.length;
    const consistency = (uniqueDays / totalDays) * 100;
    
    // Adjust based on frequency
    const frequencyBonus = Math.min(patterns.dailySessions.length / 7, 1) * 20;
    
    return Math.min(100, Math.round(consistency * 0.7 + frequencyBonus));
  }

  calculateFocusScore(patterns) {
    if (patterns.focusScores.length === 0) return 50;
    
    // Average focus scores
    const avgFocus = patterns.focusScores.reduce((sum, score) => sum + score, 0) / patterns.focusScores.length;
    
    // Adjust based on session duration consistency
    const durationVariance = this.calculateVariance(patterns.sessionDurations);
    const durationBonus = durationVariance < 10 ? 10 : 0;
    
    return Math.min(100, Math.round(avgFocus * 0.8 + durationBonus));
  }

  calculateProgressScore(studyData) {
    if (!studyData.tasks || studyData.tasks.length === 0) return 50;
    
    // Calculate based on task completion
    const completedTasks = studyData.tasks.filter(task => task.completed).length;
    const completionRate = (completedTasks / studyData.tasks.length) * 100;
    
    // Adjust based on task difficulty
    const difficultyAdjustment = studyData.tasks.reduce((sum, task) => {
      const difficultyValue = task.difficulty === 'hard' ? 1.2 : 
                             task.difficulty === 'medium' ? 1.0 : 0.8;
      return sum + (task.completed ? difficultyValue : 0);
    }, 0);
    
    const adjustedRate = completionRate * (difficultyAdjustment / studyData.tasks.length);
    
    return Math.min(100, Math.round(adjustedRate));
  }

  calculateVariance(numbers) {
    if (numbers.length === 0) return 0;
    
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, num) => sum + num, 0) / squaredDiffs.length;
    
    return Math.sqrt(avgSquaredDiff);
  }

  generateStudyInsights(patterns, consistencyScore, focusScore) {
    const insights = [];
    
    if (consistencyScore < 60) {
      insights.push("Your study schedule could be more consistent. Try setting a fixed study time each day.");
    } else if (consistencyScore > 80) {
      insights.push("Excellent consistency! Your regular study habit is building strong learning momentum.");
    }
    
    if (focusScore < 60) {
      insights.push("Focus quality could be improved. Consider minimizing distractions and taking regular breaks.");
    } else if (focusScore > 80) {
      insights.push("Your focus quality is impressive! This level of concentration will accelerate your learning.");
    }
    
    if (patterns.studyHours.length > 0) {
      const avgHour = patterns.studyHours.reduce((sum, hour) => sum + hour, 0) / patterns.studyHours.length;
      insights.push(`You typically study around ${Math.round(avgHour)}:00. This is ${avgHour < 12 ? 'morning' : avgHour < 18 ? 'afternoon' : 'evening'} hours.`);
    }
    
    if (insights.length < 3) {
      insights.push("You're making steady progress! Consistency in your study routine is key to long-term success.");
      insights.push("Varying your study topics can help maintain engagement and improve retention.");
    }
    
    return insights.slice(0, 3);
  }

  generateRecommendations(patterns, consistencyScore, focusScore) {
    const recommendations = [];
    
    if (consistencyScore < 70) {
      recommendations.push({
        title: "Establish a Study Routine",
        description: "Set a fixed study time each day, even if it's just 15-20 minutes. Consistency beats intensity."
      });
    }
    
    if (focusScore < 70) {
      recommendations.push({
        title: "Optimize Your Study Environment",
        description: "Find a quiet space, put your phone on silent, and use the Pomodoro technique to maintain focus."
      });
    }
    
    if (patterns.sessionDurations.length > 0) {
      const avgDuration = patterns.sessionDurations.reduce((sum, dur) => sum + dur, 0) / patterns.sessionDurations.length;
      if (avgDuration < 20) {
        recommendations.push({
          title: "Extend Study Sessions",
          description: "Try gradually increasing session length to 25-30 minutes to build deeper focus."
        });
      }
    }
    
    recommendations.push({
      title: "Track Your Progress",
      description: "Use StudyHub's dashboard to monitor your study hours and completion rates. Visualization boosts motivation."
    });
    
    return recommendations.slice(0, 4);
  }

  analyzePeakHours(patterns) {
    if (patterns.studyHours.length === 0) {
      return { hours: [9, 10, 11], score: 50 }; // Default morning hours
    }
    
    // Count frequency of study hours
    const hourCounts = {};
    patterns.studyHours.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    // Find top 3 peak hours
    const sortedHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
    
    // Score based on consistency of peak hours
    const consistency = sortedHours.length > 0 ? 70 + (sortedHours.length * 10) : 50;
    
    return {
      hours: sortedHours.length > 0 ? sortedHours : [9, 10, 11],
      score: Math.min(100, consistency)
    };
  }

  analyzeSessionLength(patterns) {
    if (patterns.sessionDurations.length === 0) {
      return { minutes: 25, score: 50 }; // Default Pomodoro length
    }
    
    const avgMinutes = patterns.sessionDurations.reduce((sum, dur) => sum + dur, 0) / patterns.sessionDurations.length;
    const roundedMinutes = Math.round(avgMinutes);
    
    // Score based on optimal session length (25-50 minutes is ideal)
    let score = 50;
    if (roundedMinutes >= 20 && roundedMinutes <= 50) {
      score = 80 + Math.min(20, Math.abs(35 - roundedMinutes));
    } else if (roundedMinutes > 50) {
      score = 70; // Too long may reduce focus
    } else {
      score = 60; // Too short may not build focus
    }
    
    return {
      minutes: roundedMinutes,
      score
    };
  }

  analyzeBreakBalance(patterns) {
    if (patterns.sessionDurations.length < 2) {
      return { ratio: "5:1", score: 50 }; // Default Pomodoro ratio
    }
    
    // Calculate average session and break times
    const avgSession = patterns.sessionDurations.reduce((sum, dur) => sum + dur, 0) / patterns.sessionDurations.length;
    
    // Assume 5-minute breaks for Pomodoro, or proportional breaks
    const avgBreak = avgSession > 30 ? 10 : 5;
    const ratio = `${Math.round(avgSession)}:${avgBreak}`;
    
    // Score based on recommended ratios (3:1 to 6:1 is ideal)
    const ratioValue = avgSession / avgBreak;
    let score = 50;
    if (ratioValue >= 3 && ratioValue <= 6) {
      score = 80 + (Math.abs(5 - ratioValue) * 5);
    } else if (ratioValue > 6) {
      score = 70; // Too much work, not enough breaks
    } else {
      score = 60; // Too many breaks, not enough work
    }
    
    return {
      ratio,
      score: Math.min(100, Math.round(score))
    };
  }

  analyzeMotivation(patterns) {
    // Simple motivation analysis based on recent activity
    const recentSessions = patterns.dailySessions.slice(-7); // Last 7 sessions
    const sessionCount = recentSessions.length;
    
    // Base motivation on recent activity
    let current = Math.min(100, sessionCount * 15); // 15 points per session, max 100
    
    // Trend based on consistency
    const uniqueDays = new Set(recentSessions).size;
    const trend = uniqueDays > 4 ? 10 : uniqueDays > 2 ? 0 : -10;
    
    // Suggestions based on current level
    const suggestions = [];
    if (current < 50) {
      suggestions.push("Start with just 10 minutes of study today. Small wins build momentum!");
    } else if (current < 80) {
      suggestions.push("Celebrate your progress and set a small reward for completing today's goals.");
    } else {
      suggestions.push("You're on fire! Channel this energy into tackling your most challenging topic.");
    }
    
    return {
      current: Math.round(current),
      trend,
      suggestions
    };
  }

  // AI-powered personalized content recommendations
  async generateContentRecommendations(studyData, userPreferences = {}) {
    console.log(`🤖 Generating personalized content recommendations`);
    
    if (this.isOllamaAvailable) {
      return await this.generateContentRecommendationsWithOllama(studyData, userPreferences);
    } else {
      return await this.generateContentRecommendationsWithTemplate(studyData, userPreferences);
    }
  }

  // Ollama-based content recommendations (when available)
  async generateContentRecommendationsWithOllama(studyData, userPreferences) {
    const prompt = `Based on the student's study history and preferences, recommend personalized learning content.

Study Data:
${JSON.stringify(studyData, null, 2)}

User Preferences:
${JSON.stringify(userPreferences, null, 2)}

Structure the response as JSON with this exact format:
{
  "recommendations": [
    {
      "title": "Recommended Resource Title",
      "type": "article|video|course|book|practice",
      "description": "Brief description of why this is recommended",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedTime": "15 minutes|30 minutes|1 hour|2 hours",
      "priority": "high|medium|low"
    }
  ],
  "studyPlan": {
    "focusAreas": ["area1", "area2"],
    "nextSteps": ["step1", "step2"],
    "tips": ["tip1", "tip2"]
  }
}

Requirements:
- Create 5 personalized recommendations
- Focus on areas where the student needs improvement
- Consider their preferred learning style
- Include a mix of content types
- Provide actionable next steps
- Keep descriptions concise but informative`;

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
      const parsed = JSON.parse(result.response);
      return parsed;
    } catch (error) {
      console.log('Ollama content recommendation generation failed, falling back to template');
      return await this.generateContentRecommendationsWithTemplate(studyData, userPreferences);
    }
  }

  // Template-based content recommendations (always available)
  async generateContentRecommendationsWithTemplate(studyData, userPreferences) {
    // Extract study patterns
    const patterns = this.extractStudyPatterns(studyData);
    
    // Generate scores
    const consistencyScore = this.calculateConsistencyScore(patterns);
    const focusScore = this.calculateFocusScore(patterns);
    const progressScore = this.calculateProgressScore(studyData);
    
    // Determine focus areas based on scores
    const focusAreas = [];
    if (consistencyScore < 70) {
      focusAreas.push('study_consistency');
    }
    if (focusScore < 70) {
      focusAreas.push('focus_improvement');
    }
    if (progressScore < 70) {
      focusAreas.push('progress_acceleration');
    }
    
    // Generate recommendations based on focus areas
    const recommendations = this.createRecommendations(focusAreas, userPreferences);
    
    // Generate study plan
    const studyPlan = this.createStudyPlan(focusAreas, patterns);
    
    return {
      recommendations,
      studyPlan
    };
  }

  // Helper methods for template-based content recommendations
  createRecommendations(focusAreas, userPreferences) {
    const recommendations = [];
    
    // Add recommendations based on focus areas
    if (focusAreas.includes('study_consistency')) {
      recommendations.push({
        title: "Build a Daily Study Habit",
        type: "article",
        description: "Learn techniques to establish a consistent study routine that fits your schedule",
        difficulty: "beginner",
        estimatedTime: "15 minutes",
        priority: "high"
      });
      
      recommendations.push({
        title: "Habit Tracking Template",
        type: "practice",
        description: "Download and use a customizable habit tracker to monitor your daily study sessions",
        difficulty: "beginner",
        estimatedTime: "10 minutes",
        priority: "high"
      });
    }
    
    if (focusAreas.includes('focus_improvement')) {
      recommendations.push({
        title: "Advanced Focus Techniques",
        type: "video",
        description: "Master proven techniques to eliminate distractions and maintain deep focus during study sessions",
        difficulty: "intermediate",
        estimatedTime: "30 minutes",
        priority: "high"
      });
      
      recommendations.push({
        title: "Optimize Your Study Environment",
        type: "article",
        description: "Transform your study space for maximum concentration and productivity",
        difficulty: "beginner",
        estimatedTime: "20 minutes",
        priority: "medium"
      });
    }
    
    if (focusAreas.includes('progress_acceleration')) {
      recommendations.push({
        title: "Spaced Repetition System",
        type: "course",
        description: "Learn how to use spaced repetition to dramatically improve information retention",
        difficulty: "intermediate",
        estimatedTime: "1 hour",
        priority: "high"
      });
      
      recommendations.push({
        title: "Active Recall Practice",
        type: "practice",
        description: "Master the most effective study technique for long-term retention",
        difficulty: "beginner",
        estimatedTime: "25 minutes",
        priority: "high"
      });
    }
    
    // Add general recommendations if needed
    while (recommendations.length < 5) {
      const generalRecs = [
        {
          title: "Effective Note-Taking Strategies",
          type: "article",
          description: "Discover methods to create organized, reviewable study notes",
          difficulty: "beginner",
          estimatedTime: "20 minutes",
          priority: "medium"
        },
        {
          title: "Memory Palace Technique",
          type: "video",
          description: "Learn this ancient method for memorizing complex information",
          difficulty: "advanced",
          estimatedTime: "45 minutes",
          priority: "low"
        },
        {
          title: "Time Management for Students",
          type: "course",
          description: "Master your schedule to balance study, work, and life",
          difficulty: "intermediate",
          estimatedTime: "1 hour",
          priority: "medium"
        }
      ];
      
      const randomRec = generalRecs[Math.floor(Math.random() * generalRecs.length)];
      // Check if this recommendation already exists
      if (!recommendations.some(r => r.title === randomRec.title)) {
        recommendations.push(randomRec);
      }
    }
    
    return recommendations.slice(0, 5);
  }

  createStudyPlan(focusAreas, patterns) {
    const focusAreasList = [];
    const nextSteps = [];
    const tips = [];
    
    if (focusAreas.includes('study_consistency')) {
      focusAreasList.push('Building Consistent Study Habits');
      nextSteps.push('Set a fixed study time each day');
      nextSteps.push('Start with 15-minute sessions and gradually increase');
      tips.push('Consistency beats intensity - show up daily');
    }
    
    if (focusAreas.includes('focus_improvement')) {
      focusAreasList.push('Improving Focus and Concentration');
      nextSteps.push('Eliminate distractions during study time');
      nextSteps.push('Use the Pomodoro technique');
      tips.push('Take regular breaks to maintain focus quality');
    }
    
    if (focusAreas.includes('progress_acceleration')) {
      focusAreasList.push('Accelerating Learning Progress');
      nextSteps.push('Implement active recall techniques');
      nextSteps.push('Review material at increasing intervals');
      tips.push('Practice testing improves retention more than re-reading');
    }
    
    // Add default items if no specific focus areas
    if (focusAreasList.length === 0) {
      focusAreasList.push('General Study Skills', 'Time Management', 'Memory Techniques');
      nextSteps.push('Review your current study methods');
      nextSteps.push('Identify one technique to improve');
      tips.push('Small improvements compound over time');
    }
    
    return {
      focusAreas: focusAreasList,
      nextSteps,
      tips
    };
  }

  // AI-powered focus optimization with personalized distraction management
  async generateFocusOptimizationPlan(studyData, userPreferences = {}) {
    console.log(`🤖 Generating personalized focus optimization plan`);
    
    if (this.isOllamaAvailable) {
      return await this.generateFocusOptimizationPlanWithOllama(studyData, userPreferences);
    } else {
      return await this.generateFocusOptimizationPlanWithTemplate(studyData, userPreferences);
    }
  }

  // Ollama-based focus optimization plan generation (when available)
  async generateFocusOptimizationPlanWithOllama(studyData, userPreferences) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    const focusScore = this.calculateFocusScore(patterns);
    const consistencyScore = this.calculateConsistencyScore(patterns);
    
    const prompt = `Create a personalized focus optimization plan based on the following study patterns and user data.
The user has a focus score of ${focusScore}% and consistency score of ${consistencyScore}%.

Study Data:
${JSON.stringify(studyData, null, 2)}

User Preferences:
${JSON.stringify(userPreferences, null, 2)}

Structure the response as JSON with this exact format:
{
  "distractionAnalysis": {
    "commonDistractions": ["List of identified distractions"],
    "distractionImpact": "Analysis of how distractions affect focus",
    "peakDistractionTimes": ["Times when distractions are most common"]
  },
  "personalizedStrategies": [
    {
      "strategy": "Specific strategy to implement",
      "description": "Detailed explanation of how to implement this strategy",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedTime": "Time needed to implement"
    }
  ],
  "environmentOptimization": {
    "physicalSetup": ["Recommendations for physical study environment"],
    "digitalSetup": ["Recommendations for digital environment"],
    "routineSuggestions": ["Suggestions for establishing focus routines"]
  },
  "focusBuildingExercises": [
    {
      "exercise": "Name of the exercise",
      "description": "How to perform the exercise",
      "duration": "Recommended duration",
      "frequency": "How often to practice"
    }
  ],
  "progressTracking": {
    "keyMetrics": ["Metrics to track progress"],
    "milestones": ["Milestones to achieve"],
    "reviewSchedule": "How often to review progress"
  }
}

Requirements:
- Provide realistic and actionable recommendations
- Personalize strategies based on the user's focus and consistency scores
- Include 4-5 personalized strategies
- Include 3-4 environment optimization suggestions
- Include 3-4 focus building exercises
- Use encouraging and educational language`;

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
      const parsed = JSON.parse(result.response);
      return parsed;
    } catch (error) {
      console.log('Ollama focus optimization plan generation failed, falling back to template');
      return await this.generateFocusOptimizationPlanWithTemplate(studyData, userPreferences);
    }
  }

  // Template-based focus optimization plan generation (always available)
  async generateFocusOptimizationPlanWithTemplate(studyData, userPreferences) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    const focusScore = this.calculateFocusScore(patterns);
    const consistencyScore = this.calculateConsistencyScore(patterns);
    
    // Analyze distractions based on patterns
    const distractionAnalysis = this.analyzeDistractions(patterns, studyData);
    
    // Generate personalized strategies
    const personalizedStrategies = this.createFocusStrategies(focusScore, consistencyScore, distractionAnalysis);
    
    // Create environment optimization suggestions
    const environmentOptimization = this.createEnvironmentOptimizations(focusScore, consistencyScore);
    
    // Generate focus building exercises
    const focusBuildingExercises = this.createFocusExercises(focusScore);
    
    // Create progress tracking plan
    const progressTracking = this.createProgressTrackingPlan();
    
    return {
      distractionAnalysis,
      personalizedStrategies,
      environmentOptimization,
      focusBuildingExercises,
      progressTracking
    };
  }

  // Helper methods for template-based focus optimization
  analyzeDistractions(patterns, studyData) {
    const commonDistractions = [];
    
    // Analyze based on study patterns
    if (patterns.sessionDurations.length > 0) {
      const avgDuration = patterns.sessionDurations.reduce((sum, dur) => sum + dur, 0) / patterns.sessionDurations.length;
      if (avgDuration < 20) {
        commonDistractions.push("Short attention span");
      }
    }
    
    // Analyze based on completion rates
    if (patterns.completionRates.length > 0) {
      const avgCompletion = patterns.completionRates.reduce((sum, rate) => sum + rate, 0) / patterns.completionRates.length;
      if (avgCompletion < 70) {
        commonDistractions.push("Task switching", "Lack of motivation");
      }
    }
    
    // Add some default distractions
    if (commonDistractions.length === 0) {
      commonDistractions.push("Social media", "Phone notifications", "Multitasking");
    }
    
    return {
      commonDistractions,
      distractionImpact: "Distractions are reducing your focus quality and study efficiency",
      peakDistractionTimes: ["Morning (9-11 AM)", "Afternoon (2-4 PM)", "Evening (7-9 PM)"]
    };
  }

  createFocusStrategies(focusScore, consistencyScore, distractionAnalysis) {
    const strategies = [];
    
    // Strategy based on focus score
    if (focusScore < 70) {
      strategies.push({
        strategy: "Implement the Pomodoro Technique",
        description: "Work in focused 25-minute intervals with 5-minute breaks to build sustained attention",
        difficulty: "beginner",
        estimatedTime: "5 minutes to set up"
      });
      
      strategies.push({
        strategy: "Create a Distraction-Free Environment",
        description: "Remove or minimize common distractions like phones, social media, and noisy environments",
        difficulty: "beginner",
        estimatedTime: "15 minutes to organize"
      });
    } else {
      strategies.push({
        strategy: "Advanced Focus Stacking",
        description: "Combine multiple focus techniques like time-boxing and task batching for maximum efficiency",
        difficulty: "advanced",
        estimatedTime: "30 minutes to plan"
      });
    }
    
    // Strategy based on consistency score
    if (consistencyScore < 70) {
      strategies.push({
        strategy: "Establish a Daily Study Routine",
        description: "Set a fixed study time each day to build a consistent habit",
        difficulty: "beginner",
        estimatedTime: "5 minutes to schedule"
      });
    } else {
      strategies.push({
        strategy: "Optimize Your Peak Study Hours",
        description: "Schedule your most challenging work during your natural peak focus times",
        difficulty: "intermediate",
        estimatedTime: "10 minutes to plan"
      });
    }
    
    // Strategy based on distractions
    if (distractionAnalysis.commonDistractions.length > 0) {
      strategies.push({
        strategy: "Digital Wellness Management",
        description: "Use apps and tools to block distracting websites and track your digital habits",
        difficulty: "intermediate",
        estimatedTime: "20 minutes to set up"
      });
    }
    
    return strategies;
  }

  createEnvironmentOptimizations(focusScore, consistencyScore) {
    return {
      physicalSetup: [
        "Keep your study area clean and organized",
        "Ensure proper lighting to reduce eye strain",
        "Use a comfortable, ergonomic chair and desk setup"
      ],
      digitalSetup: [
        "Use website blockers during study sessions",
        "Enable 'Do Not Disturb' mode on all devices",
        "Organize your digital files and bookmarks for easy access"
      ],
      routineSuggestions: [
        "Start each study session with a 2-minute breathing exercise",
        "Take a 5-minute break every 25-30 minutes of focused work",
        "End each session by reviewing what you've accomplished"
      ]
    };
  }

  createFocusExercises(focusScore) {
    const exercises = [];
    
    if (focusScore < 70) {
      exercises.push({
        exercise: "Mindful Breathing",
        description: "Focus on your breath for 2 minutes, returning attention to breath when distracted",
        duration: "2 minutes",
        frequency: "Before each study session"
      });
      
      exercises.push({
        exercise: "Body Scan Meditation",
        description: "Systematically focus on different parts of your body to increase awareness",
        duration: "5 minutes",
        frequency: "Daily"
      });
    } else {
      exercises.push({
        exercise: "Focused Attention Training",
        description: "Choose an object and focus all attention on it for 10 minutes without distraction",
        duration: "10 minutes",
        frequency: "3 times per week"
      });
      
      exercises.push({
        exercise: "Dual N-Back Training",
        description: "Use a brain training app to improve working memory and focus",
        duration: "15 minutes",
        frequency: "4 times per week"
      });
    }
    
    exercises.push({
      exercise: "Progressive Focus Challenge",
      description: "Gradually increase your focused work time by 5 minutes each week",
      duration: "Variable",
      frequency: "Daily"
    });
    
    return exercises;
  }

  createProgressTrackingPlan() {
    return {
      keyMetrics: [
        "Session duration consistency",
        "Task completion rate",
        "Distraction frequency",
        "Subjective focus rating (1-10)"
      ],
      milestones: [
        "Complete 5 consecutive focused sessions",
        "Reduce average distractions by 50%",
        "Increase average session length to 30 minutes",
        "Maintain consistent study schedule for 2 weeks"
      ],
      reviewSchedule: "Weekly review every Sunday evening"
    };
  }

  // AI-powered adaptive learning paths
  async generateAdaptiveLearningPath(studyData, userPreferences = {}) {
    console.log(`🤖 Generating adaptive learning path`);
    
    if (this.isOllamaAvailable) {
      return await this.generateAdaptiveLearningPathWithOllama(studyData, userPreferences);
    } else {
      return await this.generateAdaptiveLearningPathWithTemplate(studyData, userPreferences);
    }
  }

  // Ollama-based adaptive learning path generation (when available)
  async generateAdaptiveLearningPathWithOllama(studyData, userPreferences) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    const focusScore = this.calculateFocusScore(patterns);
    const consistencyScore = this.calculateConsistencyScore(patterns);
    const progressScore = this.calculateProgressScore(studyData);
    
    const prompt = `Create an adaptive learning path based on the following study patterns and user data.
The user has a focus score of ${focusScore}%, consistency score of ${consistencyScore}%, and progress score of ${progressScore}%.

Study Data:
${JSON.stringify(studyData, null, 2)}

User Preferences:
${JSON.stringify(userPreferences, null, 2)}

Structure the response as JSON with this exact format:
{
  "learningPath": {
    "currentLevel": "beginner|intermediate|advanced",
    "nextSteps": [
      {
        "step": "Specific learning step",
        "description": "Detailed explanation of what to do",
        "estimatedTime": "Time needed to complete",
        "resources": ["List of recommended resources"],
        "difficulty": "beginner|intermediate|advanced"
      }
    ],
    "skillAssessment": {
      "strengths": ["List of user strengths"],
      "areasForImprovement": ["List of areas needing improvement"],
      "recommendedFocus": ["List of recommended focus areas"]
    },
    "adaptiveAdjustments": [
      {
        "trigger": "Condition that triggers adjustment",
        "adjustment": "How the learning path should adapt",
        "reasoning": "Why this adjustment is recommended"
      }
    ]
  }
}

Requirements:
- Provide realistic and actionable learning steps
- Personalize the path based on the user's scores
- Include 5-7 next steps
- Include 3-4 strengths and areas for improvement
- Include 2-3 adaptive adjustments
- Use encouraging and educational language`;

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
      const parsed = JSON.parse(result.response);
      return parsed;
    } catch (error) {
      console.log('Ollama adaptive learning path generation failed, falling back to template');
      return await this.generateAdaptiveLearningPathWithTemplate(studyData, userPreferences);
    }
  }

  // Template-based adaptive learning path generation (always available)
  async generateAdaptiveLearningPathWithTemplate(studyData, userPreferences) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    const focusScore = this.calculateFocusScore(patterns);
    const consistencyScore = this.calculateConsistencyScore(patterns);
    const progressScore = this.calculateProgressScore(studyData);
    
    // Determine current level
    const currentLevel = this.determineCurrentLevel(focusScore, consistencyScore, progressScore);
    
    // Generate next steps
    const nextSteps = this.createLearningSteps(currentLevel, focusScore, consistencyScore, progressScore);
    
    // Assess skills
    const skillAssessment = this.assessSkills(focusScore, consistencyScore, progressScore);
    
    // Create adaptive adjustments
    const adaptiveAdjustments = this.createAdaptiveAdjustments(currentLevel, focusScore, consistencyScore, progressScore);
    
    return {
      learningPath: {
        currentLevel,
        nextSteps,
        skillAssessment,
        adaptiveAdjustments
      }
    };
  }

  // Helper methods for template-based adaptive learning
  determineCurrentLevel(focusScore, consistencyScore, progressScore) {
    const avgScore = (focusScore + consistencyScore + progressScore) / 3;
    
    if (avgScore >= 80) return "advanced";
    if (avgScore >= 60) return "intermediate";
    return "beginner";
  }

  createLearningSteps(currentLevel, focusScore, consistencyScore, progressScore) {
    const steps = [];
    
    // Step based on current level
    if (currentLevel === "beginner") {
      steps.push({
        step: "Establish Core Study Habits",
        description: "Focus on building consistent daily study routines and basic time management skills",
        estimatedTime: "2 weeks",
        resources: ["Time Management Guide", "Habit Tracker Template"],
        difficulty: "beginner"
      });
      
      steps.push({
        step: "Master Active Recall Techniques",
        description: "Practice testing yourself regularly to improve long-term retention",
        estimatedTime: "1 week",
        resources: ["Active Recall Guide"],
        difficulty: "beginner"
      });
    } else if (currentLevel === "intermediate") {
      steps.push({
        step: "Refine Focus Strategies",
        description: "Implement advanced focus techniques like time-boxing and task batching",
        estimatedTime: "2 weeks",
        resources: ["Focus Techniques Guide"],
        difficulty: "intermediate"
      });
      
      steps.push({
        step: "Optimize Study Environment",
        description: "Create a distraction-free study space with proper lighting and minimal interruptions",
        estimatedTime: "1 week",
        resources: ["Study Environment Guide"],
        difficulty: "intermediate"
      });
    } else if (currentLevel === "advanced") {
      steps.push({
        step: "Advance to Complex Material",
        description: "Work on more challenging topics and develop expertise in chosen subjects",
        estimatedTime: "3 weeks",
        resources: ["Advanced Study Guide"],
        difficulty: "advanced"
      });
      
      steps.push({
        step: "Implement Spaced Repetition",
        description: "Use spaced repetition to dramatically improve information retention",
        estimatedTime: "1 week",
        resources: ["Spaced Repetition Guide"],
        difficulty: "advanced"
      });
    }
    
    // Additional steps based on specific scores
    if (focusScore < 70) {
      steps.push({
        step: "Focus Enhancement Program",
        description: "Implement targeted exercises to improve concentration and attention span",
        estimatedTime: "2 weeks",
        resources: ["Focus Building Exercises", "Mindfulness App"],
        difficulty: "beginner"
      });
    }
    
    if (consistencyScore < 70) {
      steps.push({
        step: "Consistency Building Challenge",
        description: "Follow a structured 21-day program to establish consistent study habits",
        estimatedTime: "3 weeks",
        resources: ["21-Day Habit Tracker", "Accountability Partner System"],
        difficulty: "beginner"
      });
    }
    
    if (progressScore < 70) {
      steps.push({
        step: "Progress Acceleration Strategies",
        description: "Apply proven techniques to increase learning efficiency and task completion rates",
        estimatedTime: "2 weeks",
        resources: ["Productivity Techniques Guide", "Task Management Workshop"],
        difficulty: "intermediate"
      });
    }
    
    // Add general steps
    steps.push({
      step: "Weekly Performance Review",
      description: "Conduct regular assessments of your progress and adjust strategies as needed",
      estimatedTime: "30 minutes per week",
      resources: ["Progress Review Template", "Reflection Journal"],
      difficulty: "beginner"
    });
    
    return steps.slice(0, 7); // Limit to 7 steps
  }

  assessSkills(focusScore, consistencyScore, progressScore) {
    const strengths = [];
    const areasForImprovement = [];
    const recommendedFocus = [];
    
    // Strengths based on scores
    if (focusScore >= 80) {
      strengths.push("Excellent Focus Ability");
    } else if (focusScore < 60) {
      areasForImprovement.push("Focus Quality");
      recommendedFocus.push("Focus Improvement");
    }
    
    if (consistencyScore >= 80) {
      strengths.push("Consistent Study Habits");
    } else if (consistencyScore < 60) {
      areasForImprovement.push("Study Consistency");
      recommendedFocus.push("Consistency Building");
    }
    
    if (progressScore >= 80) {
      strengths.push("High Progress Rate");
    } else if (progressScore < 60) {
      areasForImprovement.push("Progress Rate");
      recommendedFocus.push("Progress Acceleration");
    }
    
    return {
      strengths,
      areasForImprovement,
      recommendedFocus
    };
  }

  createAdaptiveAdjustments(currentLevel, focusScore, consistencyScore, progressScore) {
    const adjustments = [];
    
    // Adjustment based on focus score
    if (focusScore < 60) {
      adjustments.push({
        trigger: "Focus score drops below 60%",
        adjustment: "Increase break frequency and reduce session length",
        reasoning: "Shorter, more frequent sessions with regular breaks improve focus for users struggling with attention"
      });
    }
    
    // Adjustment based on consistency score
    if (consistencyScore < 60) {
      adjustments.push({
        trigger: "Consistency score drops below 60%",
        adjustment: "Implement daily check-ins and accountability measures",
        reasoning: "Regular monitoring and accountability help users who struggle with maintaining consistent study habits"
      });
    }
    
    // Adjustment based on progress score
    if (progressScore < 60) {
      adjustments.push({
        trigger: "Progress score drops below 60%",
        adjustment: "Break down tasks into smaller, more manageable chunks",
        reasoning: "Smaller tasks increase completion rates and build momentum for users struggling with progress"
      });
    }
    
    // Adjustment based on level progression
    adjustments.push({
      trigger: "User advances to next level",
      adjustment: "Increase complexity and challenge of learning materials",
      reasoning: "Progressive overload ensures continued growth and prevents plateauing"
    });
    
    return adjustments.slice(0, 3); // Limit to 3 adjustments
  }

  // AI-powered predictive analytics for study success
  async generatePredictiveAnalytics(studyData, userPreferences = {}) {
    console.log(`🤖 Generating predictive analytics for study success`);
    
    if (this.isOllamaAvailable) {
      return await this.generatePredictiveAnalyticsWithOllama(studyData, userPreferences);
    } else {
      return await this.generatePredictiveAnalyticsWithTemplate(studyData, userPreferences);
    }
  }

  // Ollama-based predictive analytics generation (when available)
  async generatePredictiveAnalyticsWithOllama(studyData, userPreferences) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    const focusScore = this.calculateFocusScore(patterns);
    const consistencyScore = this.calculateConsistencyScore(patterns);
    const progressScore = this.calculateProgressScore(studyData);
    
    const prompt = `Create predictive analytics for study success based on the following study patterns and user data.
The user has a focus score of ${focusScore}%, consistency score of ${consistencyScore}%, and progress score of ${progressScore}%.

Study Data:
${JSON.stringify(studyData, null, 2)}

User Preferences:
${JSON.stringify(userPreferences, null, 2)}

Structure the response as JSON with this exact format:
{
  "predictiveAnalytics": {
    "successProbability": 0-100,
    "riskFactors": [
      {
        "factor": "Specific risk factor",
        "impact": "high|medium|low",
        "description": "Explanation of the risk factor"
      }
    ],
    "successIndicators": [
      {
        "indicator": "Specific success indicator",
        "strength": "high|medium|low",
        "description": "Explanation of the success indicator"
      }
    ],
    "interventionSuggestions": [
      {
        "suggestion": "Specific intervention suggestion",
        "urgency": "high|medium|low",
        "implementation": "How to implement this suggestion",
        "expectedImpact": "Expected improvement from this intervention"
      }
    ],
    "timelineProjections": {
      "shortTerm": "1-2 weeks projection",
      "mediumTerm": "1-3 months projection",
      "longTerm": "6+ months projection"
    }
  }
}

Requirements:
- Provide realistic and actionable predictions
- Include 3-5 risk factors with impact levels
- Include 3-5 success indicators with strength levels
- Include 4-6 intervention suggestions with urgency levels
- Provide timeline projections for different periods
- Use encouraging and educational language`;

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
      const parsed = JSON.parse(result.response);
      return parsed;
    } catch (error) {
      console.log('Ollama predictive analytics generation failed, falling back to template');
      return await this.generatePredictiveAnalyticsWithTemplate(studyData, userPreferences);
    }
  }

  // Template-based predictive analytics generation (always available)
  async generatePredictiveAnalyticsWithTemplate(studyData, userPreferences) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    const focusScore = this.calculateFocusScore(patterns);
    const consistencyScore = this.calculateConsistencyScore(patterns);
    const progressScore = this.calculateProgressScore(studyData);
    
    // Calculate success probability
    const successProbability = this.calculateSuccessProbability(focusScore, consistencyScore, progressScore);
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(focusScore, consistencyScore, progressScore);
    
    // Identify success indicators
    const successIndicators = this.identifySuccessIndicators(focusScore, consistencyScore, progressScore);
    
    // Generate intervention suggestions
    const interventionSuggestions = this.createInterventionSuggestions(focusScore, consistencyScore, progressScore);
    
    // Create timeline projections
    const timelineProjections = this.createTimelineProjections(focusScore, consistencyScore, progressScore, successProbability);
    
    return {
      predictiveAnalytics: {
        successProbability,
        riskFactors,
        successIndicators,
        interventionSuggestions,
        timelineProjections
      }
    };
  }

  // Helper methods for template-based predictive analytics
  calculateSuccessProbability(focusScore, consistencyScore, progressScore) {
    // Weighted average with focus (30%), consistency (40%), progress (30%)
    const weightedScore = (focusScore * 0.3) + (consistencyScore * 0.4) + (progressScore * 0.3);
    
    // Add some randomness to make it more realistic
    const randomFactor = (Math.random() * 10) - 5; // -5 to +5
    const finalScore = Math.max(0, Math.min(100, weightedScore + randomFactor));
    
    return Math.round(finalScore);
  }

  identifyRiskFactors(focusScore, consistencyScore, progressScore) {
    const riskFactors = [];
    
    if (focusScore < 60) {
      riskFactors.push({
        factor: "Low Focus Quality",
        impact: "high",
        description: "Difficulty maintaining concentration during study sessions may reduce information retention"
      });
    }
    
    if (consistencyScore < 60) {
      riskFactors.push({
        factor: "Inconsistent Study Habits",
        impact: "high",
        description: "Irregular study patterns can lead to knowledge gaps and reduced momentum"
      });
    }
    
    if (progressScore < 60) {
      riskFactors.push({
        factor: "Slow Progress Rate",
        impact: "medium",
        description: "Lower task completion rates may indicate difficulty with material or study methods"
      });
    }
    
    if (focusScore < 70 && consistencyScore < 70) {
      riskFactors.push({
        factor: "Focus and Consistency Deficit",
        impact: "high",
        description: "Combination of poor focus and inconsistency creates significant learning challenges"
      });
    }
    
    // Add a general risk factor
    riskFactors.push({
      factor: "Procrastination Tendency",
      impact: "medium",
      description: "Delaying study sessions can create stress and reduce overall learning effectiveness"
    });
    
    return riskFactors.slice(0, 5); // Limit to 5 risk factors
  }

  identifySuccessIndicators(focusScore, consistencyScore, progressScore) {
    const successIndicators = [];
    
    if (focusScore >= 80) {
      successIndicators.push({
        indicator: "Excellent Focus Ability",
        strength: "high",
        description: "Strong concentration skills enable deep learning and better information retention"
      });
    }
    
    if (consistencyScore >= 80) {
      successIndicators.push({
        indicator: "Consistent Study Habits",
        strength: "high",
        description: "Regular study patterns build momentum and ensure steady progress"
      });
    }
    
    if (progressScore >= 80) {
      successIndicators.push({
        indicator: "High Progress Rate",
        strength: "high",
        description: "Effective task completion indicates good understanding and application of material"
      });
    }
    
    if (focusScore >= 70 && consistencyScore >= 70) {
      successIndicators.push({
        indicator: "Strong Foundation",
        strength: "high",
        description: "Good focus combined with consistency creates optimal learning conditions"
      });
    }
    
    // Add a general success indicator
    successIndicators.push({
      indicator: "Growth Mindset",
      strength: "medium",
      description: "Willingness to seek improvement and adapt strategies supports long-term success"
      });
    
    return successIndicators.slice(0, 5); // Limit to 5 success indicators
  }

  createInterventionSuggestions(focusScore, consistencyScore, progressScore) {
    const suggestions = [];
    
    // Focus improvement suggestions
    if (focusScore < 70) {
      suggestions.push({
        suggestion: "Implement Focus Building Exercises",
        urgency: "high",
        implementation: "Practice 5-minute mindful breathing before each study session and gradually increase focus time",
        expectedImpact: "15-25% improvement in focus quality within 2 weeks"
      });
      
      suggestions.push({
        suggestion: "Optimize Study Environment",
        urgency: "medium",
        implementation: "Create a distraction-free study space with proper lighting and minimal interruptions",
        expectedImpact: "10-20% improvement in focus quality"
      });
    }
    
    // Consistency improvement suggestions
    if (consistencyScore < 70) {
      suggestions.push({
        suggestion: "Establish Fixed Study Routine",
        urgency: "high",
        implementation: "Set a specific study time each day and treat it as an unbreakable appointment",
        expectedImpact: "20-30% improvement in consistency within 3 weeks"
      });
      
      suggestions.push({
        suggestion: "Use Habit Stacking",
        urgency: "medium",
        implementation: "Attach study sessions to existing daily habits like after breakfast or before dinner",
        expectedImpact: "15-25% improvement in consistency"
      });
    }
    
    // Progress improvement suggestions
    if (progressScore < 70) {
      suggestions.push({
        suggestion: "Break Down Large Tasks",
        urgency: "high",
        implementation: "Divide complex topics into smaller, manageable chunks with clear completion criteria",
        expectedImpact: "25-35% improvement in task completion rates"
      });
      
      suggestions.push({
        suggestion: "Implement Active Recall",
        urgency: "medium",
        implementation: "Test yourself regularly instead of just re-reading material to improve retention",
        expectedImpact: "20-30% improvement in learning effectiveness"
      });
    }
    
    // General suggestions
    suggestions.push({
      suggestion: "Regular Progress Reviews",
      urgency: "medium",
      implementation: "Conduct weekly self-assessments to track progress and adjust strategies as needed",
      expectedImpact: "10-15% improvement in overall learning efficiency"
    });
    
    suggestions.push({
      suggestion: "Seek Peer Support",
      urgency: "low",
      implementation: "Join or form study groups to maintain motivation and gain different perspectives",
      expectedImpact: "10-20% improvement in motivation and understanding"
    });
    
    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }

  createTimelineProjections(focusScore, consistencyScore, progressScore, successProbability) {
    // Short term (1-2 weeks)
    let shortTerm = "";
    if (successProbability >= 80) {
      shortTerm = "Continue current excellent progress with minor refinements for optimization";
    } else if (successProbability >= 60) {
      shortTerm = "Implement suggested interventions to accelerate progress and address minor challenges";
    } else {
      shortTerm = "Focus on foundational improvements in focus and consistency for immediate gains";
    }
    
    // Medium term (1-3 months)
    let mediumTerm = "";
    if (successProbability >= 70) {
      mediumTerm = "Advance to more complex material and develop expertise in chosen subjects";
    } else {
      mediumTerm = "Stabilize study habits and build consistent progress momentum";
    }
    
    // Long term (6+ months)
    let longTerm = "";
    if (successProbability >= 60) {
      longTerm = "Achieve mastery in core subjects and develop independent learning capabilities";
    } else {
      longTerm = "Establish sustainable study practices that support long-term academic success";
    }
    
    return {
      shortTerm,
      mediumTerm,
      longTerm
    };
  }

  assessSkills(focusScore, consistencyScore, progressScore) {
    const strengths = [];
    const areasForImprovement = [];
    const recommendedFocus = [];
    
    // Assess based on scores
    if (focusScore >= 80) {
      strengths.push("Excellent concentration and focus abilities");
      recommendedFocus.push("Advanced focus techniques");
    } else {
      areasForImprovement.push("Focus and concentration skills");
      recommendedFocus.push("Basic focus building exercises");
    }
    
    if (consistencyScore >= 80) {
      strengths.push("Strong habit formation and consistency");
      recommendedFocus.push("Optimization of existing routines");
    } else {
      areasForImprovement.push("Study routine consistency");
      recommendedFocus.push("Habit building strategies");
    }
    
    if (progressScore >= 80) {
      strengths.push("High task completion and progress rate");
      recommendedFocus.push("Advanced learning strategies");
    } else {
      areasForImprovement.push("Task completion efficiency");
      recommendedFocus.push("Productivity improvement techniques");
    }
    
    // Add some general assessments
    strengths.push("Commitment to self-improvement");
    areasForImprovement.push("Time management optimization");
    recommendedFocus.push("Personalized study planning");
    
    return {
      strengths: strengths.slice(0, 4),
      areasForImprovement: areasForImprovement.slice(0, 4),
      recommendedFocus: recommendedFocus.slice(0, 4)
    };
  }

  createAdaptiveAdjustments(currentLevel, focusScore, consistencyScore, progressScore) {
    const adjustments = [];
    
    // Adjustment based on focus score
    if (focusScore < 60) {
      adjustments.push({
        trigger: "Focus score drops below 60%",
        adjustment: "Increase break frequency and reduce session length",
        reasoning: "Shorter, more frequent sessions with regular breaks improve focus for users struggling with attention"
      });
    }
    
    // Adjustment based on consistency score
    if (consistencyScore < 60) {
      adjustments.push({
        trigger: "Consistency score drops below 60%",
        adjustment: "Implement daily check-ins and accountability measures",
        reasoning: "Regular monitoring and accountability help users who struggle with maintaining consistent study habits"
      });
    }
    
    // Adjustment based on progress score
    if (progressScore < 60) {
      adjustments.push({
        trigger: "Progress score drops below 60%",
        adjustment: "Break down tasks into smaller, more manageable chunks",
        reasoning: "Smaller tasks increase completion rates and build momentum for users struggling with progress"
      });
    }
    
    // Adjustment based on level progression
    adjustments.push({
        trigger: "User advances to next level",
        adjustment: "Increase complexity and challenge of learning materials",
        reasoning: "Progressive overload ensures continued growth and prevents plateauing"
      });
    
    return adjustments.slice(0, 3); // Limit to 3 adjustments
  }

  // AI-powered predictive analytics for study success
  async generatePredictiveAnalytics(studyData, userPreferences = {}) {
    console.log(`🤖 Generating predictive analytics for study success`);
    
    if (this.isOllamaAvailable) {
      return await this.generatePredictiveAnalyticsWithOllama(studyData, userPreferences);
    } else {
      return await this.generatePredictiveAnalyticsWithTemplate(studyData, userPreferences);
    }
  }

  // Ollama-based predictive analytics generation (when available)
  async generatePredictiveAnalyticsWithOllama(studyData, userPreferences) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    const focusScore = this.calculateFocusScore(patterns);
    const consistencyScore = this.calculateConsistencyScore(patterns);
    const progressScore = this.calculateProgressScore(studyData);
    
    const prompt = `Create predictive analytics for study success based on the following study patterns and user data.
The user has a focus score of ${focusScore}%, consistency score of ${consistencyScore}%, and progress score of ${progressScore}%.

Study Data:
${JSON.stringify(studyData, null, 2)}

User Preferences:
${JSON.stringify(userPreferences, null, 2)}

Structure the response as JSON with this exact format:
{
  "predictiveAnalytics": {
    "successProbability": 0-100,
    "riskFactors": [
      {
        "factor": "Specific risk factor",
        "impact": "high|medium|low",
        "description": "Explanation of the risk factor"
      }
    ],
    "successIndicators": [
      {
        "indicator": "Specific success indicator",
        "strength": "high|medium|low",
        "description": "Explanation of the success indicator"
      }
    ],
    "interventionSuggestions": [
      {
        "suggestion": "Specific intervention suggestion",
        "urgency": "high|medium|low",
        "implementation": "How to implement this suggestion",
        "expectedImpact": "Expected improvement from this intervention"
      }
    ],
    "timelineProjections": {
      "shortTerm": "1-2 weeks projection",
      "mediumTerm": "1-3 months projection",
      "longTerm": "6+ months projection"
    }
  }
}

Requirements:
- Provide realistic and actionable predictions
- Include 3-5 risk factors with impact levels
- Include 3-5 success indicators with strength levels
- Include 4-6 intervention suggestions with urgency levels
- Provide timeline projections for different periods
- Use encouraging and educational language`;

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
      const parsed = JSON.parse(result.response);
      return parsed;
    } catch (error) {
      console.log('Ollama predictive analytics generation failed, falling back to template');
      return await this.generatePredictiveAnalyticsWithTemplate(studyData, userPreferences);
    }
  }

  // Template-based predictive analytics generation (always available)
  async generatePredictiveAnalyticsWithTemplate(studyData, userPreferences) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    const focusScore = this.calculateFocusScore(patterns);
    const consistencyScore = this.calculateConsistencyScore(patterns);
    const progressScore = this.calculateProgressScore(studyData);
    
    // Calculate success probability
    const successProbability = this.calculateSuccessProbability(focusScore, consistencyScore, progressScore);
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(focusScore, consistencyScore, progressScore);
    
    // Identify success indicators
    const successIndicators = this.identifySuccessIndicators(focusScore, consistencyScore, progressScore);
    
    // Generate intervention suggestions
    const interventionSuggestions = this.createInterventionSuggestions(focusScore, consistencyScore, progressScore);
    
    // Create timeline projections
    const timelineProjections = this.createTimelineProjections(focusScore, consistencyScore, progressScore, successProbability);
    
    return {
      predictiveAnalytics: {
        successProbability,
        riskFactors,
        successIndicators,
        interventionSuggestions,
        timelineProjections
      }
    };
  }

  // Helper methods for template-based predictive analytics
  calculateSuccessProbability(focusScore, consistencyScore, progressScore) {
    // Weighted average with focus (30%), consistency (40%), progress (30%)
    const weightedScore = (focusScore * 0.3) + (consistencyScore * 0.4) + (progressScore * 0.3);
    
    // Add some randomness to make it more realistic
    const randomFactor = (Math.random() * 10) - 5; // -5 to +5
    const finalScore = Math.max(0, Math.min(100, weightedScore + randomFactor));
    
    return Math.round(finalScore);
  }

  identifyRiskFactors(focusScore, consistencyScore, progressScore) {
    const riskFactors = [];
    
    if (focusScore < 60) {
      riskFactors.push({
        factor: "Low Focus Quality",
        impact: "high",
        description: "Difficulty maintaining concentration during study sessions may reduce information retention"
      });
    }
    
    if (consistencyScore < 60) {
      riskFactors.push({
        factor: "Inconsistent Study Habits",
        impact: "high",
        description: "Irregular study patterns can lead to knowledge gaps and reduced momentum"
      });
    }
    
    if (progressScore < 60) {
      riskFactors.push({
        factor: "Slow Progress Rate",
        impact: "medium",
        description: "Lower task completion rates may indicate difficulty with material or study methods"
      });
    }
    
    if (focusScore < 70 && consistencyScore < 70) {
      riskFactors.push({
        factor: "Focus and Consistency Deficit",
        impact: "high",
        description: "Combination of poor focus and inconsistency creates significant learning challenges"
      });
    }
    
    // Add a general risk factor
    riskFactors.push({
      factor: "Procrastination Tendency",
      impact: "medium",
      description: "Delaying study sessions can create stress and reduce overall learning effectiveness"
    });
    
    return riskFactors.slice(0, 5); // Limit to 5 risk factors
  }

  identifySuccessIndicators(focusScore, consistencyScore, progressScore) {
    const successIndicators = [];
    
    if (focusScore >= 80) {
      successIndicators.push({
        indicator: "Excellent Focus Ability",
        strength: "high",
        description: "Strong concentration skills enable deep learning and better information retention"
      });
    }
    
    if (consistencyScore >= 80) {
      successIndicators.push({
        indicator: "Consistent Study Habits",
        strength: "high",
        description: "Regular study patterns build momentum and ensure steady progress"
      });
    }
    
    if (progressScore >= 80) {
      successIndicators.push({
        indicator: "High Progress Rate",
        strength: "high",
        description: "Effective task completion indicates good understanding and application of material"
      });
    }
    
    if (focusScore >= 70 && consistencyScore >= 70) {
      successIndicators.push({
        indicator: "Strong Foundation",
        strength: "high",
        description: "Good focus combined with consistency creates optimal learning conditions"
      });
    }
    
    // Add a general success indicator
    successIndicators.push({
      indicator: "Growth Mindset",
      strength: "medium",
      description: "Willingness to seek improvement and adapt strategies supports long-term success"
      });
    
    return successIndicators.slice(0, 5); // Limit to 5 success indicators
  }

  createInterventionSuggestions(focusScore, consistencyScore, progressScore) {
    const suggestions = [];
    
    // Focus improvement suggestions
    if (focusScore < 70) {
      suggestions.push({
        suggestion: "Implement Focus Building Exercises",
        urgency: "high",
        implementation: "Practice 5-minute mindful breathing before each study session and gradually increase focus time",
        expectedImpact: "15-25% improvement in focus quality within 2 weeks"
      });
      
      suggestions.push({
        suggestion: "Optimize Study Environment",
        urgency: "medium",
        implementation: "Create a distraction-free study space with proper lighting and minimal interruptions",
        expectedImpact: "10-20% improvement in focus quality"
      });
    }
    
    // Consistency improvement suggestions
    if (consistencyScore < 70) {
      suggestions.push({
        suggestion: "Establish Fixed Study Routine",
        urgency: "high",
        implementation: "Set a specific study time each day and treat it as an unbreakable appointment",
        expectedImpact: "20-30% improvement in consistency within 3 weeks"
      });
      
      suggestions.push({
        suggestion: "Use Habit Stacking",
        urgency: "medium",
        implementation: "Attach study sessions to existing daily habits like after breakfast or before dinner",
        expectedImpact: "15-25% improvement in consistency"
      });
    }
    
    // Progress improvement suggestions
    if (progressScore < 70) {
      suggestions.push({
        suggestion: "Break Down Large Tasks",
        urgency: "high",
        implementation: "Divide complex topics into smaller, manageable chunks with clear completion criteria",
        expectedImpact: "25-35% improvement in task completion rates"
      });
      
      suggestions.push({
        suggestion: "Implement Active Recall",
        urgency: "medium",
        implementation: "Test yourself regularly instead of just re-reading material to improve retention",
        expectedImpact: "20-30% improvement in learning effectiveness"
      });
    }
    
    // General suggestions
    suggestions.push({
      suggestion: "Regular Progress Reviews",
      urgency: "medium",
      implementation: "Conduct weekly self-assessments to track progress and adjust strategies as needed",
      expectedImpact: "10-15% improvement in overall learning efficiency"
    });
    
    suggestions.push({
      suggestion: "Seek Peer Support",
      urgency: "low",
      implementation: "Join or form study groups to maintain motivation and gain different perspectives",
      expectedImpact: "10-20% improvement in motivation and understanding"
    });
    
    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }

  createTimelineProjections(focusScore, consistencyScore, progressScore, successProbability) {
    // Short term (1-2 weeks)
    let shortTerm = "";
    if (successProbability >= 80) {
      shortTerm = "Continue current excellent progress with minor refinements for optimization";
    } else if (successProbability >= 60) {
      shortTerm = "Implement suggested interventions to accelerate progress and address minor challenges";
    } else {
      shortTerm = "Focus on foundational improvements in focus and consistency for immediate gains";
    }
    
    // Medium term (1-3 months)
    let mediumTerm = "";
    if (successProbability >= 70) {
      mediumTerm = "Advance to more complex material and develop expertise in chosen subjects";
    } else {
      mediumTerm = "Stabilize study habits and build consistent progress momentum";
    }
    
    // Long term (6+ months)
    let longTerm = "";
    if (successProbability >= 60) {
      longTerm = "Achieve mastery in core subjects and develop independent learning capabilities";
    } else {
      longTerm = "Establish sustainable study practices that support long-term academic success";
    }
    
    return {
      shortTerm,
      mediumTerm,
      longTerm
    };
  }

  // AI-powered predictive analytics for study success
  async generatePredictiveAnalytics(studyData, userPreferences = {}) {
    console.log(`🤖 Generating predictive analytics for study success`);
    
    if (this.isOllamaAvailable) {
      return await this.generatePredictiveAnalyticsWithOllama(studyData, userPreferences);
    } else {
      return await this.generatePredictiveAnalyticsWithTemplate(studyData, userPreferences);
    }
  }

  // Ollama-based predictive analytics generation (when available)
  async generatePredictiveAnalyticsWithOllama(studyData, userPreferences) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    const focusScore = this.calculateFocusScore(patterns);
    const consistencyScore = this.calculateConsistencyScore(patterns);
    const progressScore = this.calculateProgressScore(studyData);
    
    const prompt = `Create predictive analytics for study success based on the following study patterns and user data.
The user has a focus score of ${focusScore}%, consistency score of ${consistencyScore}%, and progress score of ${progressScore}%.

Study Data:
${JSON.stringify(studyData, null, 2)}

User Preferences:
${JSON.stringify(userPreferences, null, 2)}

Structure the response as JSON with this exact format:
{
  "predictiveAnalytics": {
    "successProbability": 0-100,
    "riskFactors": [
      {
        "factor": "Specific risk factor",
        "impact": "high|medium|low",
        "description": "Explanation of the risk factor"
      }
    ],
    "successIndicators": [
      {
        "indicator": "Specific success indicator",
        "strength": "high|medium|low",
        "description": "Explanation of the success indicator"
      }
    ],
    "interventionSuggestions": [
      {
        "suggestion": "Specific intervention suggestion",
        "urgency": "high|medium|low",
        "implementation": "How to implement this suggestion",
        "expectedImpact": "Expected improvement from this intervention"
      }
    ],
    "timelineProjections": {
      "shortTerm": "1-2 weeks projection",
      "mediumTerm": "1-3 months projection",
      "longTerm": "6+ months projection"
    }
  }
}

Requirements:
- Provide realistic and actionable predictions
- Include 3-5 risk factors with impact levels
- Include 3-5 success indicators with strength levels
- Include 4-6 intervention suggestions with urgency levels
- Provide timeline projections for different periods
- Use encouraging and educational language`;

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
      const parsed = JSON.parse(result.response);
      return parsed;
    } catch (error) {
      console.log('Ollama predictive analytics generation failed, falling back to template');
      return await this.generatePredictiveAnalyticsWithTemplate(studyData, userPreferences);
    }
  }

  // Template-based predictive analytics generation (always available)
  async generatePredictiveAnalyticsWithTemplate(studyData, userPreferences) {
    // Extract patterns from study data
    const patterns = this.extractStudyPatterns(studyData);
    const focusScore = this.calculateFocusScore(patterns);
    const consistencyScore = this.calculateConsistencyScore(patterns);
    const progressScore = this.calculateProgressScore(studyData);
    
    // Calculate success probability
    const successProbability = this.calculateSuccessProbability(focusScore, consistencyScore, progressScore);
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(focusScore, consistencyScore, progressScore);
    
    // Identify success indicators
    const successIndicators = this.identifySuccessIndicators(focusScore, consistencyScore, progressScore);
    
    // Generate intervention suggestions
    const interventionSuggestions = this.createInterventionSuggestions(focusScore, consistencyScore, progressScore);
    
    // Create timeline projections
    const timelineProjections = this.createTimelineProjections(focusScore, consistencyScore, progressScore, successProbability);
    
    return {
      predictiveAnalytics: {
        successProbability,
        riskFactors,
        successIndicators,
        interventionSuggestions,
        timelineProjections
      }
    };
  }

  // Helper methods for template-based predictive analytics
  calculateSuccessProbability(focusScore, consistencyScore, progressScore) {
    // Weighted average with focus (30%), consistency (40%), progress (30%)
    const weightedScore = (focusScore * 0.3) + (consistencyScore * 0.4) + (progressScore * 0.3);
    
    // Add some randomness to make it more realistic
    const randomFactor = (Math.random() * 10) - 5; // -5 to +5
    const finalScore = Math.max(0, Math.min(100, weightedScore + randomFactor));
    
    return Math.round(finalScore);
  }

  identifyRiskFactors(focusScore, consistencyScore, progressScore) {
    const riskFactors = [];
    
    if (focusScore < 60) {
      riskFactors.push({
        factor: "Low Focus Quality",
        impact: "high",
        description: "Difficulty maintaining concentration during study sessions may reduce information retention"
      });
    }
    
    if (consistencyScore < 60) {
      riskFactors.push({
        factor: "Inconsistent Study Habits",
        impact: "high",
        description: "Irregular study patterns can lead to knowledge gaps and reduced momentum"
      });
    }
    
    if (progressScore < 60) {
      riskFactors.push({
        factor: "Slow Progress Rate",
        impact: "medium",
        description: "Lower task completion rates may indicate difficulty with material or study methods"
      });
    }
    
    if (focusScore < 70 && consistencyScore < 70) {
      riskFactors.push({
        factor: "Focus and Consistency Deficit",
        impact: "high",
        description: "Combination of poor focus and inconsistency creates significant learning challenges"
      });
    }
    
    // Add a general risk factor
    riskFactors.push({
      factor: "Procrastination Tendency",
      impact: "medium",
      description: "Delaying study sessions can create stress and reduce overall learning effectiveness"
    });
    
    return riskFactors.slice(0, 5); // Limit to 5 risk factors
  }

  identifySuccessIndicators(focusScore, consistencyScore, progressScore) {
    const successIndicators = [];
    
    if (focusScore >= 80) {
      successIndicators.push({
        indicator: "Excellent Focus Ability",
        strength: "high",
        description: "Strong concentration skills enable deep learning and better information retention"
      });
    }
    
    if (consistencyScore >= 80) {
      successIndicators.push({
        indicator: "Consistent Study Habits",
        strength: "high",
        description: "Regular study patterns build momentum and ensure steady progress"
      });
    }
    
    if (progressScore >= 80) {
      successIndicators.push({
        indicator: "High Progress Rate",
        strength: "high",
        description: "Effective task completion indicates good understanding and application of material"
      });
    }
    
    if (focusScore >= 70 && consistencyScore >= 70) {
      successIndicators.push({
        indicator: "Strong Foundation",
        strength: "high",
        description: "Good focus combined with consistency creates optimal learning conditions"
      });
    }
    
    // Add a general success indicator
    successIndicators.push({
      indicator: "Growth Mindset",
      strength: "medium",
      description: "Willingness to seek improvement and adapt strategies supports long-term success"
      });
    
    return successIndicators.slice(0, 5); // Limit to 5 success indicators
  }

  createInterventionSuggestions(focusScore, consistencyScore, progressScore) {
    const suggestions = [];
    
    // Focus improvement suggestions
    if (focusScore < 70) {
      suggestions.push({
        suggestion: "Implement Focus Building Exercises",
        urgency: "high",
        implementation: "Practice 5-minute mindful breathing before each study session and gradually increase focus time",
        expectedImpact: "15-25% improvement in focus quality within 2 weeks"
      });
      
      suggestions.push({
        suggestion: "Optimize Study Environment",
        urgency: "medium",
        implementation: "Create a distraction-free study space with proper lighting and minimal interruptions",
        expectedImpact: "10-20% improvement in focus quality"
      });
    }
    
    // Consistency improvement suggestions
    if (consistencyScore < 70) {
      suggestions.push({
        suggestion: "Establish Fixed Study Routine",
        urgency: "high",
        implementation: "Set a specific study time each day and treat it as an unbreakable appointment",
        expectedImpact: "20-30% improvement in consistency within 3 weeks"
      });
      
      suggestions.push({
        suggestion: "Use Habit Stacking",
        urgency: "medium",
        implementation: "Attach study sessions to existing daily habits like after breakfast or before dinner",
        expectedImpact: "15-25% improvement in consistency"
      });
    }
    
    // Progress improvement suggestions
    if (progressScore < 70) {
      suggestions.push({
        suggestion: "Break Down Large Tasks",
        urgency: "high",
        implementation: "Divide complex topics into smaller, manageable chunks with clear completion criteria",
        expectedImpact: "25-35% improvement in task completion rates"
      });
      
      suggestions.push({
        suggestion: "Implement Active Recall",
        urgency: "medium",
        implementation: "Test yourself regularly instead of just re-reading material to improve retention",
        expectedImpact: "20-30% improvement in learning effectiveness"
      });
    }
    
    // General suggestions
    suggestions.push({
      suggestion: "Regular Progress Reviews",
      urgency: "medium",
      implementation: "Conduct weekly self-assessments to track progress and adjust strategies as needed",
      expectedImpact: "10-15% improvement in overall learning efficiency"
    });
    
    suggestions.push({
      suggestion: "Seek Peer Support",
      urgency: "low",
      implementation: "Join or form study groups to maintain motivation and gain different perspectives",
      expectedImpact: "10-20% improvement in motivation and understanding"
    });
    
    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }

  createTimelineProjections(focusScore, consistencyScore, progressScore, successProbability) {
    // Short term (1-2 weeks)
    let shortTerm = "";
    if (successProbability >= 80) {
      shortTerm = "Continue current excellent progress with minor refinements for optimization";
    } else if (successProbability >= 60) {
      shortTerm = "Implement suggested interventions to accelerate progress and address minor challenges";
    } else {
      shortTerm = "Focus on foundational improvements in focus and consistency for immediate gains";
    }
    
    // Medium term (1-3 months)
    let mediumTerm = "";
    if (successProbability >= 70) {
      mediumTerm = "Advance to more complex material and develop expertise in chosen subjects";
    } else {
      mediumTerm = "Stabilize study habits and build consistent progress momentum";
    }
    
    // Long term (6+ months)
    let longTerm = "";
    if (successProbability >= 60) {
      longTerm = "Achieve mastery in core subjects and develop independent learning capabilities";
    } else {
      longTerm = "Establish sustainable study practices that support long-term academic success";
    }
    
    return {
      shortTerm,
      mediumTerm,
      longTerm
    };
  }
}

// Export singleton instance
export const aiRoadmapService = new AIRoadmapService();