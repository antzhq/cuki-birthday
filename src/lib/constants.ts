export const TOTAL_CANDLES = 18;
export const TOTAL_PHOTOS = 13;

// WHY: Photo filenames match what Santiago named them: CumpleCuki1..13
export const PHOTO_FILES = Array.from(
  { length: 13 },
  (_, i) => `/photos/CumpleCuki${i + 1}.jpg`
);

// WHY: Placeholder captions — Santiago will fill these in with personal ones
export const PHOTO_CAPTIONS: string[] = [
  "Caption 1",
  "Caption 2",
  "Caption 3",
  "Caption 4",
  "Caption 5",
  "Caption 6",
  "Caption 7",
  "Caption 8",
  "Caption 9",
  "Caption 10",
  "Caption 11",
  "Caption 12",
  "Caption 13",
];

// WHY: Memory match uses paired icons — themed around cookies/baking/celebration
export const MEMORY_ICONS = [
  "🍪", "🎂", "🎁", "🎈",
  "🌸", "⭐", "🦋", "💖",
];

// WHY: Trivia questions — Santiago fills with insider knowledge
export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "What is Cuki's real name?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
  },
  {
    question: "What year was Cuki born?",
    options: ["2006", "2007", "2008", "2009"],
    correctIndex: 2,
  },
  {
    question: "What's Cuki's favorite food?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
  },
  {
    question: "What does Cuki want to study?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
  },
  {
    question: "What's Cuki's hidden talent?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
  },
];

// WHY: Guess-the-year game — birth year to current year
export const BIRTH_YEAR = 2008;
export const CURRENT_YEAR = 2026;

// WHY: The correct year for the guess-the-year game photo
export const GUESS_YEAR_ANSWER = 2015;
