export const careerPaths = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'Design, develop and test software applications',
    icon: '💻',
    color: 'from-blue-500 to-cyan-500',
    roadmap: [
      {
        phase: 'Foundation',
        duration: '3-6 months',
        skills: ['Programming Basics', 'Data Structures & Algorithms', 'Version Control (Git)', 'Web Development Fundamentals'],
        resources: [
          { title: 'freeCodeCamp', type: 'Course', link: 'https://www.freecodecamp.org/' },
          { title: 'CS50', type: 'Course', link: 'https://cs50.harvard.edu/' },
          { title: 'The Odin Project', type: 'Course', link: 'https://www.theodinproject.com/' }
        ]
      },
      {
        phase: 'Specialization',
        duration: '6-12 months',
        skills: ['Frontend/Backend Frameworks', 'Databases', 'APIs', 'Testing'],
        resources: [
          { title: 'React Documentation', type: 'Resource', link: 'https://reactjs.org/' },
          { title: 'Node.js Guide', type: 'Resource', link: 'https://nodejs.org/en/guides/' },
          { title: 'MDN Web Docs', type: 'Resource', link: 'https://developer.mozilla.org/' }
        ]
      },
      {
        phase: 'Professional Development',
        duration: '1-2 years',
        skills: ['System Design', 'DevOps', 'Cloud Platforms', 'Team Collaboration'],
        resources: [
          { title: 'Designing Data-Intensive Applications', type: 'Book', link: '#' },
          { title: 'AWS Certified Developer', type: 'Certification', link: 'https://aws.amazon.com/certification/' },
          { title: 'System Design Primer', type: 'Resource', link: 'https://github.com/donnemartin/system-design-primer' }
        ]
      }
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Analyze complex data to help organizations make decisions',
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
    roadmap: [
      {
        phase: 'Mathematics & Statistics',
        duration: '3-6 months',
        skills: ['Linear Algebra', 'Calculus', 'Probability & Statistics', 'Python/R Programming'],
        resources: [
          { title: 'Khan Academy', type: 'Course', link: 'https://www.khanacademy.org/' },
          { title: 'Python for Everybody', type: 'Course', link: 'https://www.py4e.com/' },
          { title: 'Statistics with Python', type: 'Course', link: 'https://www.coursera.org/specializations/statistics-with-python' }
        ]
      },
      {
        phase: 'Data Analysis & Machine Learning',
        duration: '6-12 months',
        skills: ['Data Visualization', 'Pandas & NumPy', 'Machine Learning Algorithms', 'SQL'],
        resources: [
          { title: 'DataCamp', type: 'Platform', link: 'https://www.datacamp.com/' },
          { title: 'Kaggle Learn', type: 'Platform', link: 'https://www.kaggle.com/learn' },
          { title: 'Hands-On Machine Learning', type: 'Book', link: '#' }
        ]
      },
      {
        phase: 'Advanced Topics & Specialization',
        duration: '1-2 years',
        skills: ['Deep Learning', 'Big Data Technologies', 'Data Engineering', 'Business Acumen'],
        resources: [
          { title: 'Deep Learning Specialization', type: 'Course', link: 'https://www.coursera.org/specializations/deep-learning' },
          { title: 'Apache Spark Documentation', type: 'Resource', link: 'https://spark.apache.org/docs/' },
          { title: 'Fast.ai', type: 'Course', link: 'https://www.fast.ai/' }
        ]
      }
    ]
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    description: 'Create meaningful and relevant experiences for users',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    roadmap: [
      {
        phase: 'Design Fundamentals',
        duration: '3-6 months',
        skills: ['Design Principles', 'User Research', 'Wireframing', 'Prototyping'],
        resources: [
          { title: 'Google UX Design Certificate', type: 'Certificate', link: 'https://grow.google/certificates/ux-design/' },
          { title: 'Figma Learn', type: 'Resource', link: 'https://www.figma.com/resources/learn-design/' },
          { title: 'Interaction Design Foundation', type: 'Platform', link: 'https://www.interaction-design.org/' }
        ]
      },
      {
        phase: 'UX Process & Tools',
        duration: '6-12 months',
        skills: ['User Testing', 'Information Architecture', 'Design Systems', 'Accessibility'],
        resources: [
          { title: 'Design Systems Handbook', type: 'Book', link: 'https://www.designsystems.com/' },
          { title: 'Usability.gov', type: 'Resource', link: 'https://www.usability.gov/' },
          { title: 'Figma Community', type: 'Resource', link: 'https://www.figma.com/community' }
        ]
      },
      {
        phase: 'Advanced UX & Strategy',
        duration: '1-2 years',
        skills: ['UX Strategy', 'Service Design', 'Design Leadership', 'Business Impact'],
        resources: [
          { title: 'The Design of Everyday Things', type: 'Book', link: '#' },
          { title: 'NN/g Nielsen Norman Group', type: 'Resource', link: 'https://www.nngroup.com/' },
          { title: 'UX Strategy', type: 'Book', link: '#' }
        ]
      }
    ]
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Guide product development from conception to launch',
    icon: '📈',
    color: 'from-green-500 to-emerald-500',
    roadmap: [
      {
        phase: 'Product Fundamentals',
        duration: '3-6 months',
        skills: ['Product Lifecycle', 'Market Research', 'User Stories', 'Agile Methodologies'],
        resources: [
          { title: 'Product School Certificates', type: 'Certificate', link: 'https://productschool.com/' },
          { title: 'Inspired: How to Create Tech Products', type: 'Book', link: '#' },
          { title: 'Scrum.org', type: 'Resource', link: 'https://www.scrum.org/' }
        ]
      },
      {
        phase: 'Product Development',
        duration: '6-12 months',
        skills: ['Product Analytics', 'A/B Testing', 'Roadmapping', 'Stakeholder Management'],
        resources: [
          { title: 'Product Management Certificate', type: 'Certificate', link: 'https://www.productschool.com/product-management-certificate/' },
          { title: 'Amplitude Academy', type: 'Resource', link: 'https://amplitude.com/academy' },
          { title: 'Product Management articles', type: 'Resource', link: 'https://medium.com/topic/product-management' }
        ]
      },
      {
        phase: 'Strategic Product Leadership',
        duration: '1-2 years',
        skills: ['Product Strategy', 'Go-to-Market', 'Monetization', 'Team Leadership'],
        resources: [
          { title: 'Escaping the Build Trap', type: 'Book', link: '#' },
          { title: 'Product Management courses', type: 'Course', link: 'https://www.coursera.org/professional-certificates/google-product-management' },
          { title: 'Mind the Product', type: 'Community', link: 'https://www.mindtheproduct.com/' }
        ]
      }
    ]
  }
];