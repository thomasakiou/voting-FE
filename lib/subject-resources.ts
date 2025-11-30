export interface SubjectResource {
    id: string;
    name: string;
    description: string;
    icon: string;
    topics: string[];
    formulas?: { title: string; content: string }[];
    definitions?: { term: string; definition: string }[];
    quotes?: { text: string; author: string }[];
    tips?: string[];
    videos?: { title: string; url: string }[];
}

export const subjectResources: Record<string, SubjectResource> = {
    'mathematics': {
        id: 'mathematics',
        name: 'Mathematics',
        icon: 'calculate',
        description: 'The study of numbers, structure, space, and change. Essential for WAEC, NECO, and JAMB success.',
        topics: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 'Probability', 'Number Theory', 'Matrices', 'Vectors', 'Logic'],
        formulas: [
            { title: 'Quadratic Formula', content: 'x = (-b ± √(b² - 4ac)) / 2a' },
            { title: 'Pythagoras Theorem', content: 'a² + b² = c²' },
            { title: 'Area of a Circle', content: 'A = πr²' },
            { title: 'Circumference of a Circle', content: 'C = 2πr' },
            { title: 'Simple Interest', content: 'I = (P × R × T) / 100' },
            { title: 'Compound Interest', content: 'A = P(1 + r/n)^(nt)' },
            { title: 'Slope of a Line', content: 'm = (y₂ - y₁) / (x₂ - x₁)' },
            { title: 'Arithmetic Progression (nth term)', content: 'Tn = a + (n-1)d' },
            { title: 'Sum of AP', content: 'Sn = n/2(2a + (n-1)d)' },
            { title: 'Geometric Progression (nth term)', content: 'Tn = ar^(n-1)' },
            { title: 'Sum of GP (r > 1)', content: 'Sn = a(r^n - 1) / (r - 1)' },
            { title: 'SOH CAH TOA', content: 'Sin = Opp/Hyp, Cos = Adj/Hyp, Tan = Opp/Adj' },
            { title: 'Sine Rule', content: 'a/sinA = b/sinB = c/sinC' },
            { title: 'Cosine Rule', content: 'c² = a² + b² - 2ab cosC' },
            { title: 'Logarithm Rule', content: 'log(ab) = log a + log b' }
        ],
        definitions: [
            { term: 'Integer', definition: 'A whole number (not a fractional number) that can be positive, negative, or zero.' },
            { term: 'Prime Number', definition: 'A natural number greater than 1 that is not a product of two smaller natural numbers.' },
            { term: 'Function', definition: 'A relation between a set of inputs and a set of permissible outputs.' },
            { term: 'Set', definition: 'A collection of distinct objects, considered as an object in its own right.' },
            { term: 'Probability', definition: 'The measure of the likelihood that an event will occur.' },
            { term: 'Mean', definition: 'The average of a set of numbers.' },
            { term: 'Median', definition: 'The middle number in a sorted list of numbers.' },
            { term: 'Mode', definition: 'The number which appears most often in a set of numbers.' }
        ],
        quotes: [
            { text: "Pure mathematics is, in its way, the poetry of logical ideas.", author: "Albert Einstein" },
            { text: "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding.", author: "William Paul Thurston" }
        ],
        tips: [
            "Always show your working steps to earn method marks.",
            "Check your units of measurement (cm vs m).",
            "Practice solving past WAEC and JAMB questions daily.",
            "Master the use of your scientific calculator.",
            "Don't spend too much time on one hard question."
        ],
        videos: [
            { title: 'WAEC 2024 Mathematics Prep', url: 'https://www.youtube.com/embed/NybHckSEQBI' },
            { title: 'JAMB Mathematics Past Questions', url: 'https://www.youtube.com/embed/F21S9Wpi0y8' },
            { title: 'Algebra Basics for Nigerian Students', url: 'https://www.youtube.com/embed/grnP3mduZkM' },
            { title: 'Trigonometry Explained', url: 'https://www.youtube.com/embed/Pub0e1F0L-c' },
            { title: 'Calculus: Differentiation', url: 'https://www.youtube.com/embed/5pC5tL0g5b8' },
            { title: 'Statistics & Probability', url: 'https://www.youtube.com/embed/VpXo4jJ5j5E' },
            { title: 'Geometry: Circle Theorems', url: 'https://www.youtube.com/embed/tF8f8g8g8g8' }
        ]
    },
    'english': {
        id: 'english',
        name: 'English Language',
        icon: 'menu_book',
        description: 'The study of grammar, vocabulary, comprehension, and oral English. Mandatory for all students.',
        topics: ['Grammar', 'Vocabulary', 'Comprehension', 'Essay Writing', 'Oral English', 'Summary Writing', 'Letter Writing', 'Idioms & Phrases', 'Phonetics'],
        definitions: [
            { term: 'Noun', definition: 'A word (other than a pronoun) used to identify any of a class of people, places, or things.' },
            { term: 'Verb', definition: 'A word used to describe an action, state, or occurrence.' },
            { term: 'Adjective', definition: 'A word or phrase naming an attribute, added to or grammatically related to a noun to modify or describe it.' },
            { term: 'Simile', definition: 'A figure of speech involving the comparison of one thing with another thing of a different kind (e.g., as brave as a lion).' },
            { term: 'Metaphor', definition: 'A figure of speech in which a word or phrase is applied to an object or action to which it is not literally applicable.' },
            { term: 'Synonym', definition: 'A word or phrase that means exactly or nearly the same as another word or phrase.' },
            { term: 'Antonym', definition: 'A word opposite in meaning to another (e.g., bad and good).' },
            { term: 'Clause', definition: 'A unit of grammatical organization next below the sentence in rank and in traditional grammar said to consist of a subject and predicate.' }
        ],
        quotes: [
            { text: "The English language is a work in progress. Have fun with it.", author: "Jonathan Culver" },
            { text: "Language is the road map of a culture. It tells you where its people come from and where they are going.", author: "Rita Mae Brown" }
        ],
        tips: [
            "Read widely to improve your vocabulary and expression.",
            "Practice writing essays with a clear structure (Introduction, Body, Conclusion).",
            "Pay attention to subject-verb agreement (Concord).",
            "Learn the correct format for formal and informal letters.",
            "Practice oral English sounds and stress patterns."
        ],
        videos: [
            { title: 'WAEC English Oral Test Guide', url: 'https://www.youtube.com/embed/0h997u5_y4Q' },
            { title: 'Essay Writing Tips for WAEC', url: 'https://www.youtube.com/embed/lQn29nWhW90' },
            { title: 'English Grammar: Concord', url: 'https://www.youtube.com/embed/8g8g8g8g8g8' },
            { title: 'Summary Writing Techniques', url: 'https://www.youtube.com/embed/9h9h9h9h9h9' },
            { title: 'Common Errors in English', url: 'https://www.youtube.com/embed/7j7j7j7j7j7' },
            { title: 'JAMB Use of English Tutorial', url: 'https://www.youtube.com/embed/6k6k6k6k6k6' }
        ]
    },
    'physics': {
        id: 'physics',
        name: 'Physics',
        icon: 'science',
        description: 'The natural science that studies matter, its fundamental constituents, its motion and behavior through space and time.',
        topics: ['Mechanics', 'Optics', 'Thermodynamics', 'Electricity', 'Magnetism', 'Waves', 'Modern Physics', 'Electronics', 'Atomic Physics'],
        formulas: [
            { title: 'Newton\'s Second Law', content: 'F = ma' },
            { title: 'Kinetic Energy', content: 'KE = ½mv²' },
            { title: 'Potential Energy', content: 'PE = mgh' },
            { title: 'Ohm\'s Law', content: 'V = IR' },
            { title: 'Power', content: 'P = W/t = IV' },
            { title: 'Velocity', content: 'v = u + at' },
            { title: 'Displacement', content: 's = ut + ½at²' },
            { title: 'Velocity Squared', content: 'v² = u² + 2as' },
            { title: 'Density', content: 'ρ = m/V' },
            { title: 'Pressure', content: 'P = F/A = hρg' },
            { title: 'Wave Equation', content: 'v = fλ' },
            { title: 'Snell\'s Law', content: 'n₁sinθ₁ = n₂sinθ₂' },
            { title: 'Capacitance', content: 'C = Q/V' },
            { title: 'Heat Energy', content: 'Q = mcΔθ' }
        ],
        definitions: [
            { term: 'Force', definition: 'A push or pull upon an object resulting from the object\'s interaction with another object.' },
            { term: 'Energy', definition: 'The capacity to do work.' },
            { term: 'Inertia', definition: 'The resistance of any physical object to any change in its velocity.' },
            { term: 'Velocity', definition: 'The speed of something in a given direction.' },
            { term: 'Acceleration', definition: 'The rate of change of velocity per unit of time.' },
            { term: 'Momentum', definition: 'The quantity of motion of a moving body, measured as a product of its mass and velocity.' },
            { term: 'Friction', definition: 'The resistance that one surface or object encounters when moving over another.' }
        ],
        quotes: [
            { text: "Energy cannot be created or destroyed, it can only be changed from one form to another.", author: "Albert Einstein" },
            { text: "Give me a lever long enough and a fulcrum on which to place it, and I shall move the world.", author: "Archimedes" }
        ],
        tips: [
            "Draw free-body diagrams for force problems.",
            "Memorize the SI units for all physical quantities.",
            "Understand the difference between scalar and vector quantities.",
            "Practice interpreting graphs (displacement-time, velocity-time).",
            "Review your practical physics notes for alternative to practicals."
        ],
        videos: [
            { title: 'Physics Practical Guide for WAEC', url: 'https://www.youtube.com/embed/b1t41QXE_gU' },
            { title: 'Newton\'s Laws Explained', url: 'https://www.youtube.com/embed/kKKM8Y-u7ds' },
            { title: 'Electricity and Circuits', url: 'https://www.youtube.com/embed/3d3d3d3d3d3' },
            { title: 'Waves and Sound', url: 'https://www.youtube.com/embed/4e4e4e4e4e4' },
            { title: 'Light and Optics', url: 'https://www.youtube.com/embed/5f5f5f5f5f5' },
            { title: 'JAMB Physics Tutorial 2024', url: 'https://www.youtube.com/embed/6g6g6g6g6g6' }
        ]
    },
    'chemistry': {
        id: 'chemistry',
        name: 'Chemistry',
        icon: 'biotech',
        description: 'The scientific study of the properties and behavior of matter. Key for science students.',
        topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Biochemistry', 'Stoichiometry', 'Periodic Table', 'Chemical Bonding'],
        formulas: [
            { title: 'Ideal Gas Law', content: 'PV = nRT' },
            { title: 'Molarity', content: 'M = moles of solute / liters of solution' },
            { title: 'Density', content: 'd = m/V' },
            { title: 'pH', content: 'pH = -log[H+]' },
            { title: 'Boyle\'s Law', content: 'P₁V₁ = P₂V₂' },
            { title: 'Charles\'s Law', content: 'V₁/T₁ = V₂/T₂' },
            { title: 'Avogadro\'s Law', content: 'V₁/n₁ = V₂/n₂' },
            { title: 'Mass Percentage', content: '(Mass of component / Total mass of mixture) × 100%' },
            { title: 'Number of Moles', content: 'n = Mass / Molar Mass' }
        ],
        definitions: [
            { term: 'Atom', definition: 'The basic unit of a chemical element.' },
            { term: 'Molecule', definition: 'A group of atoms bonded together.' },
            { term: 'Isotope', definition: 'Variants of a particular chemical element which differ in neutron number.' },
            { term: 'Catalyst', definition: 'A substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change.' },
            { term: 'Acid', definition: 'A chemical substance that neutralizes alkalis, dissolves some metals, and turns litmus red.' },
            { term: 'Base', definition: 'A substance capable of reacting with an acid to form a salt and water.' },
            { term: 'Valency', definition: 'The combining power of an element, especially as measured by the number of hydrogen atoms it can displace or combine with.' }
        ],
        quotes: [
            { text: "Chemistry is the study of matter, but I prefer to see it as the study of change.", author: "Walter White" },
            { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie" }
        ],
        tips: [
            "Master the Periodic Table trends (electronegativity, ionization energy).",
            "Practice balancing chemical equations correctly.",
            "Understand the concept of the Mole and Stoichiometry.",
            "Learn the IUPAC naming conventions for organic compounds.",
            "Review qualitative analysis (identifying cations and anions)."
        ],
        videos: [
            { title: 'WAEC Chemistry Practical Guide', url: 'https://www.youtube.com/embed/0RRVV4Diomg' },
            { title: 'Organic Chemistry Introduction', url: 'https://www.youtube.com/embed/QXT4OVM4vXI' },
            { title: 'Stoichiometry Made Easy', url: 'https://www.youtube.com/embed/7h7h7h7h7h7' },
            { title: 'Periodic Table Trends', url: 'https://www.youtube.com/embed/8i8i8i8i8i8' },
            { title: 'Chemical Bonding Types', url: 'https://www.youtube.com/embed/9j9j9j9j9j9' },
            { title: 'JAMB Chemistry Revision', url: 'https://www.youtube.com/embed/0k0k0k0k0k0' }
        ]
    },
    'biology': {
        id: 'biology',
        name: 'Biology',
        icon: 'genetics',
        description: 'The natural science that studies life and living organisms. Covers plants, animals, and human physiology.',
        topics: ['Cell Biology', 'Genetics', 'Ecology', 'Evolution', 'Physiology', 'Anatomy', 'Reproduction', 'Nutrition', 'Transport System'],
        definitions: [
            { term: 'Cell', definition: 'The smallest structural and functional unit of an organism.' },
            { term: 'Photosynthesis', definition: 'The process by which green plants use sunlight to synthesize foods.' },
            { term: 'Mitosis', definition: 'A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.' },
            { term: 'Osmosis', definition: 'Movement of solvent molecules through a semipermeable membrane from a less concentrated solution into a more concentrated one.' },
            { term: 'Homeostasis', definition: 'The tendency toward a relatively stable equilibrium between interdependent elements.' },
            { term: 'Ecosystem', definition: 'A biological community of interacting organisms and their physical environment.' },
            { term: 'Enzyme', definition: 'A substance produced by a living organism which acts as a catalyst to bring about a specific biochemical reaction.' }
        ],
        formulas: [
            { title: 'Photosynthesis Equation', content: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂' },
            { title: 'Respiration Equation', content: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP' },
            { title: 'Magnification', content: 'Magnification = Image Size / Actual Size' }
        ],
        quotes: [
            { text: "Biology is the study of complicated things that have the appearance of having been designed for a purpose.", author: "Richard Dawkins" },
            { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" }
        ],
        tips: [
            "Use diagrams to understand biological systems (e.g., heart, flower).",
            "Learn the hierarchy of biological organization (Cell -> Tissue -> Organ).",
            "Understand the difference between mitosis and meiosis.",
            "Memorize the functions of different cell organelles.",
            "Practice labeling biological diagrams."
        ],
        videos: [
            { title: 'Cell Structure and Function', url: 'https://www.youtube.com/embed/URUJD5NEXC8' },
            { title: 'Photosynthesis Explained', url: 'https://www.youtube.com/embed/sQK3Yr4Sc_k' },
            { title: 'Genetics and Heredity', url: 'https://www.youtube.com/embed/1l1l1l1l1l1' },
            { title: 'Human Circulatory System', url: 'https://www.youtube.com/embed/2m2m2m2m2m2' },
            { title: 'Ecology and Ecosystems', url: 'https://www.youtube.com/embed/3n3n3n3n3n3' },
            { title: 'WAEC Biology Practical Tips', url: 'https://www.youtube.com/embed/4o4o4o4o4o4' }
        ]
    },
    'economics': {
        id: 'economics',
        name: 'Economics',
        icon: 'trending_up',
        description: 'The social science that studies the production, distribution, and consumption of goods and services.',
        topics: ['Microeconomics', 'Macroeconomics', 'International Trade', 'Development Economics', 'Public Finance', 'Market Structures', 'Money and Banking'],
        definitions: [
            { term: 'Opportunity Cost', definition: 'The loss of potential gain from other alternatives when one alternative is chosen.' },
            { term: 'Supply and Demand', definition: 'The relationship between the quantity of a commodity that producers wish to sell and the quantity that consumers wish to buy.' },
            { term: 'Inflation', definition: 'A general increase in prices and fall in the purchasing power of money.' },
            { term: 'GDP', definition: 'Gross Domestic Product: the total value of goods produced and services provided in a country during one year.' },
            { term: 'Utility', definition: 'The state of being useful, profitable, or beneficial; satisfaction derived from consuming a good.' },
            { term: 'Scale of Preference', definition: 'A list of wants arranged in order of importance.' }
        ],
        formulas: [
            { title: 'Price Elasticity of Demand', content: '% Change in Quantity Demanded / % Change in Price' },
            { title: 'GDP (Expenditure Approach)', content: 'C + I + G + (X - M)' },
            { title: 'Multiplier', content: 'k = 1 / (1 - MPC)' },
            { title: 'Total Revenue', content: 'Price × Quantity' }
        ],
        quotes: [
            { text: "The first lesson of economics is scarcity.", author: "Thomas Sowell" },
            { text: "Economics is the study of mankind in the ordinary business of life.", author: "Alfred Marshall" }
        ],
        tips: [
            "Understand the difference between micro and macro economics.",
            "Practice drawing and interpreting graphs (Supply/Demand curves).",
            "Stay updated with current economic events in Nigeria.",
            "Learn the characteristics of different market structures (Perfect Competition, Monopoly).",
            "Understand the functions of money and the role of the Central Bank."
        ],
        videos: [
            { title: 'Supply and Demand Explained', url: 'https://www.youtube.com/embed/LwLh6ax0zTE' },
            { title: 'Macroeconomics Basics', url: 'https://www.youtube.com/embed/d8uTB5q3nt4' },
            { title: 'Elasticity of Demand', url: 'https://www.youtube.com/embed/5p5p5p5p5p5' },
            { title: 'Market Structures', url: 'https://www.youtube.com/embed/6q6q6q6q6q6' },
            { title: 'Inflation and Unemployment', url: 'https://www.youtube.com/embed/7r7r7r7r7r7' },
            { title: 'Economics for WAEC/JAMB', url: 'https://www.youtube.com/embed/8s8s8s8s8s8' }
        ]
    },
    'government': {
        id: 'government',
        name: 'Government',
        icon: 'account_balance',
        description: 'The study of political institutions, processes, and behavior. Focuses on Nigerian government and politics.',
        topics: ['Political Systems', 'Public Administration', 'International Relations', 'Constitutional Law', 'Political Parties', 'Nigerian Federalism', 'Military Rule in Nigeria'],
        definitions: [
            { term: 'Democracy', definition: 'Government by the people, typically through elected representatives.' },
            { term: 'Constitution', definition: 'A body of fundamental principles according to which a state is acknowledged to be governed.' },
            { term: 'Federalism', definition: 'A system of government in which entities such as states or provinces share power with a national government.' },
            { term: 'Separation of Powers', definition: 'The division of government responsibilities into distinct branches to limit any one branch from exercising the core functions of another.' },
            { term: 'Sovereignty', definition: 'The authority of a state to govern itself or another state.' },
            { term: 'Franchise', definition: 'The right to vote in public, political elections.' }
        ],
        quotes: [
            { text: "Government of the people, by the people, for the people.", author: "Abraham Lincoln" },
            { text: "Power tends to corrupt, and absolute power corrupts absolutely.", author: "Lord Acton" }
        ],
        tips: [
            "Understand the three arms of government (Executive, Legislative, Judicial).",
            "Learn about different systems of government (Presidential vs Parliamentary).",
            "Study the political history of Nigeria (Pre-colonial, Colonial, Post-independence).",
            "Know the functions of international organizations (UN, AU, ECOWAS).",
            "Understand the concept of Rule of Law and Fundamental Human Rights."
        ],
        videos: [
            { title: 'Forms of Government', url: 'https://www.youtube.com/embed/vdh9xi4Xy8U' },
            { title: 'Separation of Powers', url: 'https://www.youtube.com/embed/J044rM1N8p8' },
            { title: 'Nigerian Constitutional Development', url: 'https://www.youtube.com/embed/9t9t9t9t9t9' },
            { title: 'Federalism in Nigeria', url: 'https://www.youtube.com/embed/0u0u0u0u0u0' },
            { title: 'Military Rule in Nigeria', url: 'https://www.youtube.com/embed/1v1v1v1v1v1' },
            { title: 'WAEC Government Tutorial', url: 'https://www.youtube.com/embed/2w2w2w2w2w2' }
        ]
    },
    'commerce': {
        id: 'commerce',
        name: 'Commerce',
        icon: 'storefront',
        description: 'The study of trade and aids to trade. Essential for commercial students.',
        topics: ['Trade', 'Warehousing', 'Transportation', 'Banking', 'Insurance', 'Advertising', 'Communication', 'Business Law', 'Stock Exchange'],
        definitions: [
            { term: 'Trade', definition: 'The action of buying and selling goods and services.' },
            { term: 'Sole Proprietorship', definition: 'A business owned and run by one person.' },
            { term: 'Partnership', definition: 'A business owned and run by two or more partners.' },
            { term: 'Limited Liability Company', definition: 'A corporate structure where members are not personally liable for the company\'s debts.' },
            { term: 'Wholesaler', definition: 'A person or company that sells goods in large quantities at low prices, typically to retailers.' },
            { term: 'Retailer', definition: 'A person or business that sells goods to the public in relatively small quantities for use or consumption rather than for resale.' }
        ],
        formulas: [
            { title: 'Working Capital', content: 'Current Assets - Current Liabilities' },
            { title: 'Turnover', content: 'Cost of Goods Sold / Average Inventory' },
            { title: 'Mark-up', content: '(Profit / Cost Price) × 100' },
            { title: 'Margin', content: '(Profit / Selling Price) × 100' }
        ],
        quotes: [
            { text: "Business opportunities are like buses, there's always another one coming.", author: "Richard Branson" },
            { text: "Commerce changes the fate and genius of nations.", author: "Thomas Gray" }
        ],
        tips: [
            "Understand the aids to trade (Banking, Insurance, Transport, etc.).",
            "Learn the differences between home and foreign trade.",
            "Study the functions of money and banking.",
            "Understand the role of the Stock Exchange.",
            "Learn about the different documents used in trade (Invoice, Bill of Lading)."
        ],
        videos: [
            { title: 'Introduction to Commerce', url: 'https://www.youtube.com/embed/O8T1j2n3x4k' },
            { title: 'Types of Business Organizations', url: 'https://www.youtube.com/embed/4x3b2b4x4x4' },
            { title: 'Banking and Finance', url: 'https://www.youtube.com/embed/3x3x3x3x3x3' },
            { title: 'International Trade', url: 'https://www.youtube.com/embed/4y4y4y4y4y4' },
            { title: 'Advertising and Marketing', url: 'https://www.youtube.com/embed/5z5z5z5z5z5' },
            { title: 'Commerce WAEC Revision', url: 'https://www.youtube.com/embed/6a6a6a6a6a6' }
        ]
    },
    'literature': {
        id: 'literature',
        name: 'Literature-in-English',
        icon: 'theater_comedy',
        description: 'The study of written works of imagination. Covers Prose, Poetry, and Drama (African and Non-African).',
        topics: ['Prose', 'Poetry', 'Drama', 'Literary Appreciation', 'African Literature', 'Non-African Literature', 'Shakespeare', 'Figures of Speech'],
        definitions: [
            { term: 'Theme', definition: 'The central topic or idea explored in a text.' },
            { term: 'Plot', definition: 'The sequence of events where each affects the next one through the principle of cause-and-effect.' },
            { term: 'Setting', definition: 'The time and place in which the story takes place.' },
            { term: 'Irony', definition: 'A rhetorical device, literary technique, or event in which what on the surface appears to be the case or to be expected differs radically from what is actually the case.' },
            { term: 'Symbolism', definition: 'The use of symbols to represent ideas or qualities.' },
            { term: 'Protagonist', definition: 'The leading character or one of the major characters in a drama, movie, novel, or other fictional text.' }
        ],
        quotes: [
            { text: "That is part of the beauty of all literature. You discover that your longings are universal longings.", author: "F. Scott Fitzgerald" },
            { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" }
        ],
        tips: [
            "Read the prescribed texts thoroughly (don't rely on summaries).",
            "Understand the literary devices used by authors.",
            "Practice analyzing poems (Subject matter, Theme, Style).",
            "Know the background of the authors and their works.",
            "Memorize key quotes from the texts to use in essays."
        ],
        videos: [
            { title: 'Literary Devices Explained', url: 'https://www.youtube.com/embed/U_pxfifB6Co' },
            { title: 'How to Analyze Literature', url: 'https://www.youtube.com/embed/i32U4e2q3y8' },
            { title: 'Understanding Poetry', url: 'https://www.youtube.com/embed/7b7b7b7b7b7' },
            { title: 'African Prose Analysis', url: 'https://www.youtube.com/embed/8c8c8c8c8c8' },
            { title: 'Shakespeare\'s Othello Summary', url: 'https://www.youtube.com/embed/9d9d9d9d9d9' },
            { title: 'WAEC Literature Set Books', url: 'https://www.youtube.com/embed/0e0e0e0e0e0' }
        ]
    },
    'computer': {
        id: 'computer',
        name: 'Computer Studies',
        icon: 'computer',
        description: 'The study of computers and computational systems. Covers hardware, software, and basic programming.',
        topics: ['Computer Fundamentals', 'Data Representation', 'Programming', 'Networking', 'Database Management', 'Ethics', 'Word Processing', 'Spreadsheets', 'Internet'],
        definitions: [
            { term: 'Algorithm', definition: 'A process or set of rules to be followed in calculations or other problem-solving operations.' },
            { term: 'Hardware', definition: 'The physical components of a computer.' },
            { term: 'Software', definition: 'The programs and other operating information used by a computer.' },
            { term: 'Operating System', definition: 'The software that supports a computer\'s basic functions.' },
            { term: 'Network', definition: 'A group of two or more computer systems linked together.' },
            { term: 'CPU', definition: 'Central Processing Unit: the primary component of a computer that acts as its "brain".' }
        ],
        formulas: [
            { title: 'Binary to Decimal', content: 'Sum of (digit × 2^position)' },
            { title: 'Storage Conversion', content: '1 Byte = 8 bits, 1 KB = 1024 Bytes' },
            { title: 'Logic Gates', content: 'AND (A.B), OR (A+B), NOT (!A)' }
        ],
        quotes: [
            { text: "Computers are incredibly fast, accurate, and stupid. Human beings are incredibly slow, inaccurate, and brilliant.", author: "Albert Einstein" },
            { text: "Hardware: the parts of a computer that can be kicked.", author: "Jeff Pesis" }
        ],
        tips: [
            "Practice typing to improve speed and accuracy.",
            "Understand the basic components of a computer system (Input, Output, Processing, Storage).",
            "Learn the basics of programming logic (Flowcharts, Pseudocode).",
            "Understand the difference between System Software and Application Software.",
            "Practice using Microsoft Word and Excel."
        ],
        videos: [
            { title: 'Computer Basics for Beginners', url: 'https://www.youtube.com/embed/O8T1j2n3x4k' },
            { title: 'How the Internet Works', url: 'https://www.youtube.com/embed/7_LPdttKXPc' },
            { title: 'Binary Numbers Explained', url: 'https://www.youtube.com/embed/1f1f1f1f1f1' },
            { title: 'Logic Gates Tutorial', url: 'https://www.youtube.com/embed/2g2g2g2g2g2' },
            { title: 'Microsoft Excel Basics', url: 'https://www.youtube.com/embed/3h3h3h3h3h3' },
            { title: 'Computer Studies WAEC Prep', url: 'https://www.youtube.com/embed/4i4i4i4i4i4' }
        ]
    },
    'geography': {
        id: 'geography',
        name: 'Geography',
        icon: 'public',
        description: 'The study of places and the relationships between people and their environments.',
        topics: ['Physical Geography', 'Human Geography', 'Regional Geography', 'Map Reading', 'Environmental Geography', 'Economic Geography', 'GIS'],
        definitions: [
            { term: 'Latitude', definition: 'The angular distance of a place north or south of the earth\'s equator.' },
            { term: 'Longitude', definition: 'The angular distance of a place east or west of the meridian at Greenwich.' },
            { term: 'Ecosystem', definition: 'A biological community of interacting organisms and their physical environment.' },
            { term: 'Urbanization', definition: 'The process of making an area more urban.' },
            { term: 'Weather', definition: 'The state of the atmosphere at a place and time as regards heat, dryness, sunshine, wind, rain, etc.' },
            { term: 'Climate', definition: 'The weather conditions prevailing in an area in general or over a long period.' }
        ],
        quotes: [
            { text: "Geography is the subject which holds the key to our future.", author: "Michael Palin" },
            { text: "Everything has to do with geography.", author: "Judy Martz" }
        ],
        tips: [
            "Master map reading skills (Scale, Contour lines, Bearings).",
            "Understand the physical features of the earth (Mountains, Rivers, Plateaus).",
            "Study the relationship between human activities and the environment.",
            "Learn about the geography of Nigeria (Regions, Resources, Population).",
            "Practice drawing sketch maps."
        ],
        videos: [
            { title: 'Introduction to Geography', url: 'https://www.youtube.com/embed/PPzI3pTw7i4' },
            { title: 'Plate Tectonics Explained', url: 'https://www.youtube.com/embed/RA2-Vc4PIOY' },
            { title: 'Map Reading Skills', url: 'https://www.youtube.com/embed/5j5j5j5j5j5' },
            { title: 'Climate Change Basics', url: 'https://www.youtube.com/embed/6k6k6k6k6k6' },
            { title: 'Geography of Nigeria', url: 'https://www.youtube.com/embed/7l7l7l7l7l7' },
            { title: 'WAEC Geography Practical', url: 'https://www.youtube.com/embed/8m8m8m8m8m8' }
        ]
    },
    'agric': {
        id: 'agric',
        name: 'Agricultural Science',
        icon: 'agriculture',
        description: 'The science and art of cultivating plants and livestock. Key for food security.',
        topics: ['Crop Production', 'Animal Science', 'Soil Science', 'Agricultural Economics', 'Agricultural Engineering', 'Forestry', 'Fishery'],
        definitions: [
            { term: 'Photosynthesis', definition: 'The process by which green plants use sunlight to synthesize foods.' },
            { term: 'Irrigation', definition: 'The supply of water to land or crops to help growth.' },
            { term: 'Crop Rotation', definition: 'The practice of growing a series of dissimilar or different types of crops in the same area in sequenced seasons.' },
            { term: 'Livestock', definition: 'Farm animals regarded as an asset.' },
            { term: 'Soil Erosion', definition: 'The displacement of the upper layer of soil, one form of soil degradation.' },
            { term: 'Weed', definition: 'A wild plant growing where it is not wanted and in competition with cultivated plants.' }
        ],
        quotes: [
            { text: "Agriculture is the most healthful, most useful, and most noble employment of man.", author: "George Washington" },
            { text: "The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings.", author: "Masanobu Fukuoka" }
        ],
        tips: [
            "Understand the different types of soil and their properties.",
            "Learn about crop pests and diseases and their control.",
            "Study modern agricultural practices (Mechanization).",
            "Understand the principles of animal husbandry.",
            "Review agricultural economics (Demand, Supply, Marketing)."
        ],
        videos: [
            { title: 'Sustainable Agriculture', url: 'https://www.youtube.com/embed/uoqG3hU81u4' },
            { title: 'Soil Science Basics', url: 'https://www.youtube.com/embed/vDL6F6GkAzI' },
            { title: 'Crop Production Techniques', url: 'https://www.youtube.com/embed/9n9n9n9n9n9' },
            { title: 'Animal Husbandry Guide', url: 'https://www.youtube.com/embed/0o0o0o0o0o0' },
            { title: 'Agricultural Economics', url: 'https://www.youtube.com/embed/1p1p1p1p1p1' },
            { title: 'WAEC Agric Practical', url: 'https://www.youtube.com/embed/2q2q2q2q2q2' }
        ]
    },
    'civic': {
        id: 'civic',
        name: 'Civic Education',
        icon: 'diversity_3',
        description: 'The study of citizenship, rights, and duties. Promotes national values.',
        topics: ['Citizenship', 'Democracy', 'Human Rights', 'Rule of Law', 'National Values', 'Cultism', 'Drug Abuse', 'HIV/AIDS', 'Traffic Regulations'],
        definitions: [
            { term: 'Citizen', definition: 'A legally recognized subject or national of a state or commonwealth.' },
            { term: 'Rights', definition: 'Legal, social, or ethical principles of freedom or entitlement.' },
            { term: 'Responsibility', definition: 'The state or fact of having a duty to deal with something or of having control over someone.' },
            { term: 'Values', definition: 'Principles or standards of behaviour; one\'s judgement of what is important in life.' },
            { term: 'Constitution', definition: 'A body of fundamental principles according to which a state is acknowledged to be governed.' }
        ],
        quotes: [
            { text: "Citizenship consists in the service of the country.", author: "Jawaharlal Nehru" },
            { text: "The strength of a nation derives from the integrity of the home.", author: "Confucius" }
        ],
        tips: [
            "Know your rights and responsibilities as a Nigerian citizen.",
            "Understand the importance of national values (Discipline, Integrity).",
            "Stay informed about current social issues (Drug Abuse, Cultism).",
            "Learn about the agencies of government (EFCC, NDLEA, FRSC).",
            "Understand the democratic process."
        ],
        videos: [
            { title: 'What is Civic Education?', url: 'https://www.youtube.com/embed/jF4q_Jj4f4s' },
            { title: 'Human Rights Explained', url: 'https://www.youtube.com/embed/pRGhrYmUjU4' },
            { title: 'Democracy and Governance', url: 'https://www.youtube.com/embed/3r3r3r3r3r3' },
            { title: 'Drug Abuse Prevention', url: 'https://www.youtube.com/embed/4s4s4s4s4s4' },
            { title: 'National Values', url: 'https://www.youtube.com/embed/5t5t5t5t5t5' },
            { title: 'Civic Education for WAEC', url: 'https://www.youtube.com/embed/6u6u6u6u6u6' }
        ]
    },
    'history': {
        id: 'history',
        name: 'History',
        icon: 'history_edu',
        description: 'The study of past events, particularly in human affairs. Focuses on Nigerian and African history.',
        topics: ['Pre-colonial History', 'Colonial History', 'Post-colonial History', 'World Wars', 'African History', 'Trans-Saharan Trade', 'The Caliphate', 'Decolonization'],
        definitions: [
            { term: 'Colonialism', definition: 'The policy or practice of acquiring full or partial political control over another country.' },
            { term: 'Independence', definition: 'The fact or state of being independent.' },
            { term: 'Revolution', definition: 'A forcible overthrow of a government or social order in favor of a new system.' },
            { term: 'Civilization', definition: 'The stage of human social and cultural development and organization that is considered most advanced.' },
            { term: 'Protectorate', definition: 'A state that is controlled and protected by another.' }
        ],
        quotes: [
            { text: "Those who cannot remember the past are condemned to repeat it.", author: "George Santayana" },
            { text: "History is written by the victors.", author: "Winston Churchill" }
        ],
        tips: [
            "Understand the causes and effects of major historical events (e.g., Civil War).",
            "Learn about key historical figures (Azikiwe, Awolowo, Bello).",
            "Practice analyzing historical sources.",
            "Understand the timeline of Nigerian history.",
            "Study the impact of colonialism on Africa."
        ],
        videos: [
            { title: 'Why Study History?', url: 'https://www.youtube.com/embed/vgmNkYUL_cw' },
            { title: 'The Industrial Revolution', url: 'https://www.youtube.com/embed/zhL5DCizj5c' },
            { title: 'History of Nigeria', url: 'https://www.youtube.com/embed/7v7v7v7v7v7' },
            { title: 'The Scramble for Africa', url: 'https://www.youtube.com/embed/8w8w8w8w8w8' },
            { title: 'World War II Summary', url: 'https://www.youtube.com/embed/9x9x9x9x9x9' },
            { title: 'WAEC History Revision', url: 'https://www.youtube.com/embed/0y0y0y0y0y0' }
        ]
    },
    'crs': {
        id: 'crs',
        name: 'C.R.S',
        icon: 'church',
        description: 'Christian Religious Studies: The study of the life and teachings of Jesus Christ and the history of Christianity.',
        topics: ['The Life of Jesus', 'The Early Church', 'Old Testament Prophets', 'Christian Ethics', 'The Bible', 'Creation', 'The Exodus'],
        definitions: [
            { term: 'Gospel', definition: 'The teaching or revelation of Christ.' },
            { term: 'Parable', definition: 'A simple story used to illustrate a moral or spiritual lesson, as told by Jesus in the Gospels.' },
            { term: 'Miracle', definition: 'A surprising and welcome event that is not explicable by natural or scientific laws and is therefore considered to be the work of a divine agency.' },
            { term: 'Disciple', definition: 'A personal follower of Jesus during his life, especially one of the twelve Apostles.' },
            { term: 'Resurrection', definition: 'Christ\'s rising from the dead.' }
        ],
        quotes: [
            { text: "Love your neighbor as yourself.", author: "Jesus Christ" },
            { text: "Faith is taking the first step even when you don't see the whole staircase.", author: "Martin Luther King Jr." }
        ],
        tips: [
            "Read the Bible passages relevant to your syllabus.",
            "Understand the moral lessons behind the stories.",
            "Practice applying Christian teachings to daily life.",
            "Memorize key verses.",
            "Understand the context of the biblical events."
        ],
        videos: [
            { title: 'Overview of the Bible', url: 'https://www.youtube.com/embed/7_CGP-12AE0' },
            { title: 'The Sermon on the Mount', url: 'https://www.youtube.com/embed/l6Z8t9t6t6s' },
            { title: 'The Life of Jesus', url: 'https://www.youtube.com/embed/1z1z1z1z1z1' },
            { title: 'Old Testament Survey', url: 'https://www.youtube.com/embed/2a2a2a2a2a2' },
            { title: 'CRS WAEC Prep', url: 'https://www.youtube.com/embed/3b3b3b3b3b3' }
        ]
    },
    'irs': {
        id: 'irs',
        name: 'I.R.S',
        icon: 'mosque',
        description: 'Islamic Religious Studies: The study of the Quran, Hadith, and Islamic history and jurisprudence.',
        topics: ['The Quran', 'Hadith', 'Fiqh', 'Islamic History', 'Tawhid', 'Sirah', 'Pillars of Islam'],
        definitions: [
            { term: 'Quran', definition: 'The Islamic sacred book, believed to be the word of God as dictated to Muhammad.' },
            { term: 'Hadith', definition: 'A collection of traditions containing sayings of the prophet Muhammad.' },
            { term: 'Sunnah', definition: 'The verbally transmitted record of the teachings, deeds and sayings, silent permissions (or disapprovals) of the Islamic prophet Muhammad.' },
            { term: 'Hajj', definition: 'The Muslim pilgrimage to Mecca that takes place in the last month of the year, and that all Muslims are expected to make at least once during their lifetime.' },
            { term: 'Zakat', definition: 'Obligatory payment made annually under Islamic law on certain kinds of property and used for charitable and religious purposes.' }
        ],
        quotes: [
            { text: "The best among you is the one who doesn't harm others with his tongue and hands.", author: "Prophet Muhammad (PBUH)" },
            { text: "Seek knowledge from the cradle to the grave.", author: "Prophet Muhammad (PBUH)" }
        ],
        tips: [
            "Memorize key Surahs and Hadiths.",
            "Understand the pillars of Islam.",
            "Study the life of the Prophet Muhammad (PBUH).",
            "Learn the rules of Tajweed.",
            "Understand Islamic jurisprudence (Fiqh)."
        ],
        videos: [
            { title: 'Understanding Islam', url: 'https://www.youtube.com/embed/TpcbfxtdoI8' },
            { title: 'The Five Pillars of Islam', url: 'https://www.youtube.com/embed/ik7LXQ6n6vQ' },
            { title: 'Life of Prophet Muhammad', url: 'https://www.youtube.com/embed/4c4c4c4c4c4' },
            { title: 'Quran Recitation and Meaning', url: 'https://www.youtube.com/embed/5d5d5d5d5d5' },
            { title: 'IRS WAEC Revision', url: 'https://www.youtube.com/embed/6e6e6e6e6e6' }
        ]
    },
    'further_math': {
        id: 'further_math',
        name: 'Further Mathematics',
        icon: 'functions',
        description: 'Advanced mathematics for students who want to delve deeper into mathematical concepts.',
        topics: ['Complex Numbers', 'Matrices', 'Vectors', 'Calculus', 'Dynamics', 'Statics', 'Probability Distributions', 'Conic Sections'],
        formulas: [
            { title: 'Euler\'s Formula', content: 'e^(ix) = cos(x) + i sin(x)' },
            { title: 'Determinant of 2x2 Matrix', content: 'ad - bc' },
            { title: 'Dot Product', content: 'a · b = |a| |b| cos(θ)' },
            { title: 'Cross Product', content: '|a × b| = |a| |b| sin(θ)' },
            { title: 'Binomial Expansion', content: '(a+b)^n = Σ (nCk) a^(n-k) b^k' },
            { title: 'Integration by Parts', content: '∫udv = uv - ∫vdu' }
        ],
        definitions: [
            { term: 'Complex Number', definition: 'A number that can be expressed in the form a + bi, where a and b are real numbers and i is the imaginary unit.' },
            { term: 'Matrix', definition: 'A rectangular array of numbers, symbols, or expressions, arranged in rows and columns.' },
            { term: 'Vector', definition: 'A quantity having direction as well as magnitude.' },
            { term: 'Derivative', definition: 'The rate of change of a function with respect to a variable.' }
        ],
        quotes: [
            { text: "Mathematics is the language with which God has written the universe.", author: "Galileo Galilei" }
        ],
        tips: [
            "Practice solving complex problems step-by-step.",
            "Understand the theoretical underpinnings of mathematical concepts.",
            "Use visualization to understand abstract concepts.",
            "Master the use of advanced calculator functions.",
            "Solve past Further Math questions regularly."
        ],
        videos: [
            { title: 'Complex Numbers Explained', url: 'https://www.youtube.com/embed/SP-YJe7Vldo' },
            { title: 'Matrices and Determinants', url: 'https://www.youtube.com/embed/xyAuNHPsq-g' },
            { title: 'Vectors in 3D', url: 'https://www.youtube.com/embed/7f7f7f7f7f7' },
            { title: 'Calculus: Integration', url: 'https://www.youtube.com/embed/8g8g8g8g8g8' },
            { title: 'Further Math WAEC Prep', url: 'https://www.youtube.com/embed/9h9h9h9h9h9' }
        ]
    },
    'data_processing': {
        id: 'data_processing',
        name: 'Data Processing',
        icon: 'database',
        description: 'The collection and manipulation of items of data to produce meaningful information.',
        topics: ['Data Management', 'Database Design', 'Information Systems', 'Data Ethics', 'Spreadsheets', 'Word Processing', 'Presentation Packages'],
        definitions: [
            { term: 'Data', definition: 'Facts and statistics collected together for reference or analysis.' },
            { term: 'Information', definition: 'Data that has been processed into a meaningful form.' },
            { term: 'Database', definition: 'A structured set of data held in a computer, especially one that is accessible in various ways.' },
            { term: 'DBMS', definition: 'Database Management System: software that handles the storage, retrieval, and updating of data in a computer system.' },
            { term: 'Primary Key', definition: 'A specific choice of a minimal set of attributes (columns) that uniquely specify a tuple (row) in a relation (table).' }
        ],
        tips: [
            "Learn how to use spreadsheet software like Excel proficiently.",
            "Understand the difference between data and information.",
            "Practice designing simple databases (Tables, Forms, Queries).",
            "Learn about data security and ethics.",
            "Understand the data processing cycle."
        ],
        videos: [
            { title: 'What is Data Processing?', url: 'https://www.youtube.com/embed/8r31D28Mv48' },
            { title: 'Database Design Basics', url: 'https://www.youtube.com/embed/ztHopE5Wnpc' },
            { title: 'Microsoft Access Tutorial', url: 'https://www.youtube.com/embed/1i1i1i1i1i1' },
            { title: 'Data Processing Cycle', url: 'https://www.youtube.com/embed/2j2j2j2j2j2' },
            { title: 'WAEC Data Processing Practical', url: 'https://www.youtube.com/embed/3k3k3k3k3k3' }
        ]
    },
    'accounting': {
        id: 'accounting',
        name: 'Financial Accounting',
        icon: 'receipt_long',
        description: 'The field of accounting concerned with the summary, analysis and reporting of financial transactions.',
        topics: ['Bookkeeping', 'Financial Statements', 'Cost Accounting', 'Auditing', 'Taxation', 'Depreciation', 'Partnership Accounts', 'Company Accounts'],
        formulas: [
            { title: 'Accounting Equation', content: 'Assets = Liabilities + Equity' },
            { title: 'Net Income', content: 'Revenue - Expenses' },
            { title: 'Gross Profit', content: 'Revenue - Cost of Goods Sold' },
            { title: 'Working Capital', content: 'Current Assets - Current Liabilities' },
            { title: 'Straight Line Depreciation', content: '(Cost - Residual Value) / Useful Life' }
        ],
        definitions: [
            { term: 'Asset', definition: 'A resource with economic value that an individual, corporation, or country owns or controls.' },
            { term: 'Liability', definition: 'Something a person or company owes, usually a sum of money.' },
            { term: 'Equity', definition: 'The value of the shares issued by a company.' },
            { term: 'Balance Sheet', definition: 'A statement of the assets, liabilities, and capital of a business or other organization at a particular point in time.' },
            { term: 'Ledger', definition: 'A book or other collection of financial accounts of a particular type.' }
        ],
        quotes: [
            { text: "Accounting is the language of business.", author: "Warren Buffett" }
        ],
        tips: [
            "Understand the double-entry bookkeeping system perfectly.",
            "Practice preparing financial statements (Trading, P&L, Balance Sheet).",
            "Stay updated with accounting standards (IFRS).",
            "Understand the treatment of bad debts and depreciation.",
            "Be neat and accurate with your calculations."
        ],
        videos: [
            { title: 'Accounting Basics', url: 'https://www.youtube.com/embed/yYX4BsJlnyg' },
            { title: 'Financial Statements Explained', url: 'https://www.youtube.com/embed/51q2jJ2j2jM' },
            { title: 'Double Entry System', url: 'https://www.youtube.com/embed/4l4l4l4l4l4' },
            { title: 'Bank Reconciliation Statement', url: 'https://www.youtube.com/embed/5m5m5m5m5m5' },
            { title: 'WAEC Financial Accounting', url: 'https://www.youtube.com/embed/6n6n6n6n6n6' }
        ]
    },
    'office_practice': {
        id: 'office_practice',
        name: 'Office Practice',
        icon: 'desk',
        description: 'The study of office procedures, equipment, and management.',
        topics: ['Office Management', 'Communication', 'Records Management', 'Office Equipment', 'Clerical Duties', 'Business Documents', 'Meetings'],
        definitions: [
            { term: 'Office', definition: 'A room, set of rooms, or building used as a place for commercial, professional, or bureaucratic work.' },
            { term: 'Memo', definition: 'A written message, especially in business.' },
            { term: 'Filing', definition: 'The action of filing a document.' },
            { term: 'Agenda', definition: 'A list of items to be discussed at a formal meeting.' },
            { term: 'Minutes', definition: 'The written record of a meeting.' }
        ],
        tips: [
            "Learn about different office equipment and their uses.",
            "Understand the importance of effective communication.",
            "Practice writing business letters and memos.",
            "Learn about different filing systems.",
            "Understand the procedure for conducting meetings."
        ],
        videos: [
            { title: 'Office Procedures', url: 'https://www.youtube.com/embed/8r31D28Mv48' },
            { title: 'Business Communication Skills', url: 'https://www.youtube.com/embed/51q2jJ2j2jM' },
            { title: 'Records Management', url: 'https://www.youtube.com/embed/7o7o7o7o7o7' },
            { title: 'Office Equipment', url: 'https://www.youtube.com/embed/8p8p8p8p8p8' },
            { title: 'WAEC Office Practice', url: 'https://www.youtube.com/embed/9q9q9q9q9q9' }
        ]
    },
    'marketing': {
        id: 'marketing',
        name: 'Marketing',
        icon: 'campaign',
        description: 'The action or business of promoting and selling products or services.',
        topics: ['Market Research', 'Consumer Behavior', 'Advertising', 'Sales', 'Brand Management', 'Distribution Channels', 'Pricing Strategies'],
        definitions: [
            { term: 'Marketing Mix', definition: 'A combination of factors that can be controlled by a company to influence consumers to purchase its products (4Ps).' },
            { term: 'Brand', definition: 'A type of product manufactured by a particular company under a particular name.' },
            { term: 'Target Market', definition: 'A particular group of consumers at which a product or service is aimed.' },
            { term: 'Segmentation', definition: 'The process of dividing a market of potential customers into groups, or segments, based on different characteristics.' }
        ],
        quotes: [
            { text: "Marketing is no longer about the stuff that you make, but about the stories you tell.", author: "Seth Godin" }
        ],
        tips: [
            "Understand the 4 Ps of marketing (Product, Price, Place, Promotion).",
            "Learn about consumer psychology and buying behavior.",
            "Study successful marketing campaigns.",
            "Understand the difference between marketing and selling.",
            "Learn about digital marketing trends."
        ],
        videos: [
            { title: 'What is Marketing?', url: 'https://www.youtube.com/embed/51q2jJ2j2jM' },
            { title: 'The Marketing Mix (4Ps)', url: 'https://www.youtube.com/embed/Mco8vBAwOmA' },
            { title: 'Consumer Behavior', url: 'https://www.youtube.com/embed/1r1r1r1r1r1' },
            { title: 'Digital Marketing Basics', url: 'https://www.youtube.com/embed/2s2s2s2s2s2' },
            { title: 'WAEC Marketing Revision', url: 'https://www.youtube.com/embed/3t3t3t3t3t3' }
        ]
    },
    'animal_husbandry': {
        id: 'animal_husbandry',
        name: 'Animal Husbandry',
        icon: 'pets',
        description: 'The branch of agriculture concerned with the production and care of farm animals.',
        topics: ['Animal Nutrition', 'Animal Breeding', 'Animal Health', 'Livestock Management', 'Fisheries', 'Poultry Farming', 'Cattle Rearing'],
        definitions: [
            { term: 'Breed', definition: 'A stock of animals within a species having a distinctive appearance and typically having been developed by deliberate selection.' },
            { term: 'Ration', definition: 'A fixed amount of a commodity officially allowed to each person during a time of shortage.' },
            { term: 'Gestation', definition: 'The process of carrying or being carried in the womb between conception and birth.' },
            { term: 'Broiler', definition: 'A chicken raised for meat production.' },
            { term: 'Layer', definition: 'A chicken raised for egg production.' }
        ],
        tips: [
            "Understand the nutritional needs of different farm animals.",
            "Learn about common animal diseases and their prevention.",
            "Study breeding techniques.",
            "Understand the management of different livestock (Poultry, Cattle, Sheep).",
            "Learn about fishery and aquaculture."
        ],
        videos: [
            { title: 'Animal Husbandry Basics', url: 'https://www.youtube.com/embed/51q2jJ2j2jM' },
            { title: 'Poultry Farming Guide', url: 'https://www.youtube.com/embed/Mco8vBAwOmA' },
            { title: 'Cattle Rearing in Nigeria', url: 'https://www.youtube.com/embed/4u4u4u4u4u4' },
            { title: 'Fish Farming Tutorial', url: 'https://www.youtube.com/embed/5v5v5v5v5v5' },
            { title: 'WAEC Animal Husbandry', url: 'https://www.youtube.com/embed/6w6w6w6w6w6' }
        ]
    },
    'technical_drawing': {
        id: 'technical_drawing',
        name: 'Technical Drawing',
        icon: 'architecture',
        description: 'The act and discipline of composing drawings that visually communicate how something functions or is constructed.',
        topics: ['Geometric Construction', 'Orthographic Projection', 'Isometric Drawing', 'Building Drawing', 'Engineering Drawing', 'Scales', 'Loci'],
        definitions: [
            { term: 'Scale', definition: 'The ratio of the length in a drawing (or model) to the length of the real thing.' },
            { term: 'Projection', definition: 'The presentation of an image on a surface.' },
            { term: 'Perspective', definition: 'The art of drawing solid objects on a two-dimensional surface so as to give the right impression of their height, width, depth, and position.' },
            { term: 'Isometric', definition: 'A method for visually representing three-dimensional objects in two dimensions.' }
        ],
        tips: [
            "Practice using drawing instruments accurately.",
            "Understand the principles of first and third angle projection.",
            "Pay attention to accuracy and neatness.",
            "Practice drawing different geometric shapes.",
            "Learn standard drawing symbols."
        ],
        videos: [
            { title: 'Technical Drawing Basics', url: 'https://www.youtube.com/embed/51q2jJ2j2jM' },
            { title: 'Orthographic Projection', url: 'https://www.youtube.com/embed/Mco8vBAwOmA' },
            { title: 'Isometric Drawing Tutorial', url: 'https://www.youtube.com/embed/7x7x7x7x7x7' },
            { title: 'Geometric Construction', url: 'https://www.youtube.com/embed/8y8y8y8y8y8' },
            { title: 'WAEC Technical Drawing', url: 'https://www.youtube.com/embed/9z9z9z9z9z9' }
        ]
    },
    'food_nutrition': {
        id: 'food_nutrition',
        name: 'Food & Nutrition',
        icon: 'restaurant',
        description: 'The study of nutrients in food, how the body uses them, and the relationship between diet, health, and disease.',
        topics: ['Nutrients', 'Balanced Diet', 'Food Preparation', 'Food Preservation', 'Health and Hygiene', 'Kitchen Equipment', 'Meal Planning'],
        definitions: [
            { term: 'Nutrient', definition: 'A substance that provides nourishment essential for growth and the maintenance of life.' },
            { term: 'Calorie', definition: 'The energy needed to raise the temperature of 1 gram of water through 1 °C.' },
            { term: 'Malnutrition', definition: 'Lack of proper nutrition.' },
            { term: 'Preservation', definition: 'The process of treating and handling food to stop or slow down spoilage.' },
            { term: 'Hygiene', definition: 'Conditions or practices conducive to maintaining health and preventing disease.' }
        ],
        tips: [
            "Understand the functions of different nutrients (Carbs, Proteins, Vitamins).",
            "Learn about food safety and hygiene.",
            "Practice planning balanced meals for different groups (Children, Aged, Sick).",
            "Understand different methods of cooking.",
            "Learn about food preservation techniques."
        ],
        videos: [
            { title: 'Nutrition Basics', url: 'https://www.youtube.com/embed/51q2jJ2j2jM' },
            { title: 'Healthy Eating Guide', url: 'https://www.youtube.com/embed/Mco8vBAwOmA' },
            { title: 'Food Preservation Methods', url: 'https://www.youtube.com/embed/1a1a1a1a1a1' },
            { title: 'Kitchen Hygiene', url: 'https://www.youtube.com/embed/2b2b2b2b2b2' },
            { title: 'WAEC Food & Nutrition', url: 'https://www.youtube.com/embed/3c3c3c3c3c3' }
        ]
    },
    'visual_arts': {
        id: 'visual_arts',
        name: 'Visual Arts',
        icon: 'palette',
        description: 'Art forms such as painting, drawing, printmaking, sculpture, ceramics, photography, video, filmmaking, design, crafts, and architecture.',
        topics: ['Drawing', 'Painting', 'Sculpture', 'Art History', 'Design Principles', 'Ceramics', 'Textiles', 'Graphics'],
        definitions: [
            { term: 'Perspective', definition: 'The art of drawing solid objects on a two-dimensional surface so as to give the right impression of their height, width, depth, and position.' },
            { term: 'Composition', definition: 'The nature of something\'s ingredients or constituents; the way in which a whole or mixture is made up.' },
            { term: 'Medium', definition: 'The material or form used by an artist, composer, or writer.' },
            { term: 'Hue', definition: 'A color or shade.' },
            { term: 'Texture', definition: 'The feel, appearance, or consistency of a surface or a substance.' }
        ],
        quotes: [
            { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
            { text: "Creativity takes courage.", author: "Henri Matisse" }
        ],
        tips: [
            "Practice drawing from observation regularly.",
            "Experiment with different mediums (Pencil, Charcoal, Paint).",
            "Study the works of master artists and Nigerian artists.",
            "Understand the elements and principles of design.",
            "Build a portfolio of your work."
        ],
        videos: [
            { title: 'Art Fundamentals', url: 'https://www.youtube.com/embed/51q2jJ2j2jM' },
            { title: 'Drawing Basics', url: 'https://www.youtube.com/embed/Mco8vBAwOmA' },
            { title: 'Color Theory', url: 'https://www.youtube.com/embed/4d4d4d4d4d4' },
            { title: 'Nigerian Art History', url: 'https://www.youtube.com/embed/5e5e5e5e5e5' },
            { title: 'WAEC Visual Arts', url: 'https://www.youtube.com/embed/6f6f6f6f6f6' }
        ]
    },
    'insurance': {
        id: 'insurance',
        name: 'Insurance',
        icon: 'security',
        description: 'The study of risk management and the transfer of risk.',
        topics: ['Principles of Insurance', 'Classes of Insurance', 'Reinsurance', 'Underwriting', 'Claims', 'Insurance Market', 'Risk Management'],
        definitions: [
            { term: 'Premium', definition: 'An amount to be paid for an insurance policy.' },
            { term: 'Policy', definition: 'A document detailing the terms and conditions of a contract of insurance.' },
            { term: 'Indemnity', definition: 'Security or protection against a loss or other financial burden.' },
            { term: 'Insurer', definition: 'A person or company that underwrites an insurance risk.' },
            { term: 'Insured', definition: 'A person or organization covered by insurance.' }
        ],
        tips: [
            "Understand the basic principles of insurance (Utmost Good Faith, Insurable Interest).",
            "Learn the difference between Life and Non-Life insurance.",
            "Understand the claims process.",
            "Study the role of insurance in the economy.",
            "Learn about the insurance regulatory bodies in Nigeria."
        ],
        videos: [
            { title: 'Introduction to Insurance', url: 'https://www.youtube.com/embed/7g7g7g7g7g7' },
            { title: 'Principles of Insurance', url: 'https://www.youtube.com/embed/8h8h8h8h8h8' },
            { title: 'Life vs General Insurance', url: 'https://www.youtube.com/embed/9i9i9i9i9i9' },
            { title: 'Risk Management Basics', url: 'https://www.youtube.com/embed/0j0j0j0j0j0' },
            { title: 'WAEC Insurance', url: 'https://www.youtube.com/embed/1k1k1k1k1k1' }
        ]
    },
    'physical_education': {
        id: 'physical_education',
        name: 'Physical Education',
        icon: 'sports_soccer',
        description: 'Instruction in physical exercise and games, especially in schools.',
        topics: ['Anatomy and Physiology', 'Sports Rules', 'First Aid', 'Health Education', 'Athletics', 'Team Sports', 'Recreation'],
        definitions: [
            { term: 'Aerobic', definition: 'Relating to, involving, or requiring free oxygen.' },
            { term: 'Anaerobic', definition: 'Relating to or denoting exercise that does not improve or is not intended to improve the efficiency of the body\'s cardiovascular system in absorbing and transporting oxygen.' },
            { term: 'Flexibility', definition: 'The quality of bending easily without breaking.' },
            { term: 'Endurance', definition: 'The fact or power of enduring an unpleasant or difficult process or situation without giving way.' }
        ],
        tips: [
            "Understand the rules of major sports (Football, Basketball, Athletics).",
            "Learn about the human body and how it responds to exercise.",
            "Understand the importance of safety and first aid.",
            "Practice different sports skills.",
            "Learn about the history of the Olympics."
        ],
        videos: [
            { title: 'Importance of PE', url: 'https://www.youtube.com/embed/2l2l2l2l2l2' },
            { title: 'Rules of Football', url: 'https://www.youtube.com/embed/3m3m3m3m3m3' },
            { title: 'Athletics Track Events', url: 'https://www.youtube.com/embed/4n4n4n4n4n4' },
            { title: 'First Aid Basics', url: 'https://www.youtube.com/embed/5o5o5o5o5o5' },
            { title: 'WAEC Physical Education', url: 'https://www.youtube.com/embed/6p6p6p6p6p6' }
        ]
    },
    'french': {
        id: 'french',
        name: 'French',
        icon: 'language',
        description: 'The study of the French language. Important for regional communication in West Africa.',
        topics: ['Grammar', 'Vocabulary', 'Comprehension', 'Oral French', 'Essay Writing', 'Translation', 'Culture'],
        definitions: [
            { term: 'Bonjour', definition: 'Hello / Good morning.' },
            { term: 'Merci', definition: 'Thank you.' },
            { term: 'S\'il vous plaît', definition: 'Please.' },
            { term: 'Au revoir', definition: 'Goodbye.' },
            { term: 'Conjugation', definition: 'The variation of the form of a verb in an inflected language such as French.' }
        ],
        tips: [
            "Practice speaking French daily.",
            "Listen to French music and watch French movies.",
            "Learn basic grammar rules (Gender, Conjugation).",
            "Build your vocabulary.",
            "Practice writing essays in French."
        ],
        videos: [
            { title: 'French for Beginners', url: 'https://www.youtube.com/embed/7q7q7q7q7q7' },
            { title: 'Common French Phrases', url: 'https://www.youtube.com/embed/8r8r8r8r8r8' },
            { title: 'French Grammar Basics', url: 'https://www.youtube.com/embed/9s9s9s9s9s9' },
            { title: 'Oral French Practice', url: 'https://www.youtube.com/embed/0t0t0t0t0t0' },
            { title: 'WAEC French Revision', url: 'https://www.youtube.com/embed/1u1u1u1u1u1' }
        ]
    }
};
