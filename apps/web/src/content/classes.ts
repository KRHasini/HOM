/**
 * One entry per class. Taglines and benefits come from the studio's own posters;
 * descriptive copy is on-brand placeholder copy marked TODO(confirm).
 *
 * Schedules use `placeholder: true` until real batches are confirmed — the site then
 * shows "Timings shared on enquiry" instead of the illustrative slots.
 * `durationMinutes: null` hides the duration until it is confirmed.
 * Imagery marked `stock: true` is licensed stock standing in for studio photography.
 */
import type { z } from "zod";

import { classAccents } from "./brand.config";
import type { ClassSchema } from "./schema";

type ClassInput = z.input<typeof ClassSchema>;

const FOUNDER = "vignesh-k";
const PLACEHOLDER_SCHEDULE = {
  placeholder: true, // TODO(confirm): replace with real batches and set to false
  slots: [
    { days: "Mon · Wed · Fri", time: "Evening batch" },
    { days: "Sat · Sun", time: "Weekend batch" },
  ],
};
const FEES = "Fees on request"; // TODO(confirm): set real fees and enable features.showPrices

export const classes = [
  {
    slug: "bharatanatyam",
    name: "Bharatanatyam",
    tagline: "Begin your Bharatanatyam journey with us.",
    summary:
      "Master a timeless classical art — technique, posture and rhythmic precision, taught with patience and care.",
    description: [
      // TODO(confirm): placeholder copy
      "Bharatanatyam is one of India's oldest classical dance forms — a language of rhythm, expression and storytelling. Our classes honour that tradition while making it welcoming for first-time learners.",
      "Students build a strong foundation in adavus, posture and footwork, then grow into abhinaya and expressive storytelling at their own pace.",
    ],
    category: "traditional",
    audiences: ["kids", "teens", "adults"], // TODO(confirm)
    level: "Beginner friendly", // TODO(confirm)
    durationMinutes: null, // TODO(confirm)
    schedule: PLACEHOLDER_SCHEDULE,
    priceText: FEES,
    ...toAccent("bharatanatyam"),
    treatment: "warm-serif",
    motif: "mudra",
    benefits: [
      {
        title: "Learn tradition",
        text: "Master the timeless art, its repertoire and its stories.",
      },
      { title: "Develop skills", text: "Technique, posture and rhythmic precision." },
      { title: "Build confidence", text: "Expression, abhinaya and stage presence." },
      { title: "Cultivate discipline", text: "Commitment, focus and grace." },
    ],
    whoFor: [
      "Children beginning their first classical dance training",
      "Teens and adults returning to Bharatanatyam after a break",
      "Anyone drawn to Indian culture, rhythm and expressive storytelling",
    ],
    expect: [
      {
        title: "Namaskaram & warm-up",
        text: "Every class opens with the traditional salutation and body preparation.",
      },
      {
        title: "Adavus & rhythm",
        text: "Step sequences practised to the beat until they live in the body.",
      },
      {
        title: "Expression",
        text: "Abhinaya and short items that bring technique and emotion together.",
      },
    ],
    cover: {
      src: "/media/classes/bharatanatyam/cover.jpg",
      alt: "Bharatanatyam dancer in a red and gold costume holding a classical pose on a dark stage",
      focal: "50% 30%",
      motif: "mudra",
      stock: true,
    },
    gallery: [
      {
        src: "/media/classes/bharatanatyam/gallery-1.jpg",
        alt: "Dancer in a deep classical stance with hands in mudra",
        motif: "mudra",
        stock: true,
      },
      {
        src: "/media/classes/bharatanatyam/gallery-2.jpg",
        alt: "Bharatanatyam dancer mid-expression under a single spotlight",
        motif: "mudra",
        stock: true,
      },
      {
        src: "/media/classes/bharatanatyam/gallery-3.jpg",
        alt: "Classical dancer performing on a curtained stage",
        motif: "mudra",
        stock: true,
      },
    ],
    faqIds: ["bharatanatyam-attire", "bharatanatyam-experience", "trial-what-happens"],
    instructorIds: [FOUNDER],
    keywords: [
      "Bharatanatyam classes",
      "classical dance classes",
      "Indian classical dance for kids",
    ],
    sortOrder: 1,
  },
  {
    slug: "western-hip-hop",
    name: "Western Hip-Hop",
    tagline: "Groove. Style. Attitude.",
    summary: "High-energy street style — grooves, footwork and the confidence to own any floor.",
    description: [
      // TODO(confirm): placeholder copy
      "Hip-Hop at HOM is about feel before flash: bounce, groove and musicality first, then the choreography that makes a crowd move.",
      "Each class layers foundations, grooves and a sharp combination you can take to the stage, the battle circle or your next reel.",
    ],
    category: "dance",
    audiences: ["kids", "teens", "adults"], // TODO(confirm)
    level: "Beginner to advanced", // TODO(confirm)
    durationMinutes: null, // TODO(confirm)
    schedule: PLACEHOLDER_SCHEDULE,
    priceText: FEES,
    ...toAccent("western-hip-hop"),
    treatment: "monochrome",
    motif: "groove",
    benefits: [
      {
        title: "Groove & musicality",
        text: "Feel the beat, hit the accents and move with intention.",
      },
      { title: "Street style", text: "Grooves, footwork and freestyle foundations." },
      { title: "Attitude", text: "Presence and confidence that carry beyond the studio." },
      { title: "Stamina", text: "High-energy sessions that build serious fitness." },
    ],
    whoFor: [
      "Beginners who have always wanted to dance hip-hop",
      "Dancers who want cleaner grooves and sharper choreography",
      "Kids and teens with energy to burn",
    ],
    expect: [
      { title: "Bounce & groove", text: "A warm-up built on rhythm, rocks and bounces." },
      { title: "Learn the combo", text: "Break down a fresh piece of choreography step by step." },
      {
        title: "Perform & freestyle",
        text: "Run it full out, then find your own style in a cypher.",
      },
    ],
    cover: {
      src: "/media/classes/western-hip-hop/cover.jpg",
      alt: "Hip-hop dancer captured mid-air in a monochrome studio",
      focal: "50% 35%",
      motif: "groove",
      stock: true,
    },
    gallery: [
      {
        src: "/media/classes/western-hip-hop/gallery-1.jpg",
        alt: "Dancer hitting a sharp pose in a monochrome studio",
        motif: "groove",
        stock: true,
      },
      {
        src: "/media/classes/western-hip-hop/gallery-2.jpg",
        alt: "Dancer jumping with arms wide against a pale wall",
        motif: "groove",
        stock: true,
      },
      {
        src: "/media/classes/western-hip-hop/gallery-3.jpg",
        alt: "Breaker holding a freeze under red stage light",
        motif: "groove",
        stock: true,
      },
    ],
    faqIds: ["hip-hop-experience", "what-to-wear", "trial-what-happens"],
    instructorIds: [FOUNDER, "instructor-tba-dance"],
    keywords: ["Hip-Hop dance classes", "street dance classes", "Western dance classes"],
    sortOrder: 2,
  },
  {
    slug: "contemporary",
    name: "Contemporary",
    tagline: "Flow. Emotion. Expression.",
    summary: "Fluid, emotive movement that connects breath, body and story.",
    description: [
      // TODO(confirm): placeholder copy
      "Contemporary blends technique with freedom — floor work, release and lyrical lines that turn emotion into movement.",
      "Classes balance strength and softness, building control while giving you room to interpret music in your own way.",
    ],
    category: "dance",
    audiences: ["teens", "adults"], // TODO(confirm)
    level: "All levels", // TODO(confirm)
    durationMinutes: null, // TODO(confirm)
    schedule: PLACEHOLDER_SCHEDULE,
    priceText: FEES,
    ...toAccent("contemporary"),
    treatment: "default",
    motif: "flow",
    benefits: [
      { title: "Fluid control", text: "Strength and release working together in every line." },
      { title: "Emotional expression", text: "Turn music and feeling into honest movement." },
      { title: "Floor work", text: "Safe, beautiful transitions to and from the ground." },
      { title: "Body awareness", text: "Breath, alignment and a deeper sense of yourself." },
    ],
    whoFor: [
      "Dancers ready to explore beyond set styles",
      "Movers who love lyrical, emotive music",
      "Anyone who wants strength and grace in equal measure",
    ],
    expect: [
      { title: "Breath & release", text: "A grounding warm-up connecting breath with movement." },
      { title: "Across the floor", text: "Travelling sequences, turns and floor transitions." },
      { title: "Choreography", text: "A phrase you shape with your own interpretation." },
    ],
    cover: {
      src: "/media/classes/contemporary/cover.jpg",
      alt: "Contemporary dancer reaching upward through shafts of light",
      focal: "50% 30%",
      motif: "flow",
      stock: true,
    },
    gallery: [
      {
        src: "/media/classes/contemporary/gallery-1.jpg",
        alt: "Long-exposure blur of a dancer turning on stage",
        motif: "flow",
        stock: true,
      },
      {
        src: "/media/classes/contemporary/gallery-2.jpg",
        alt: "Two hands reaching into soft light",
        motif: "flow",
        stock: true,
      },
      {
        src: "/media/classes/contemporary/gallery-3.jpg",
        alt: "Dancer's skirt swirling in motion on a dark stage",
        motif: "flow",
        stock: true,
      },
    ],
    faqIds: ["what-to-wear", "trial-what-happens"],
    instructorIds: [FOUNDER],
    keywords: ["Contemporary dance classes", "lyrical dance classes"],
    sortOrder: 3,
  },
  {
    slug: "bollywood",
    name: "Bollywood",
    tagline: "Feel the Beat. Live the Drama.",
    summary: "Expressive, cinematic and celebratory — dance like the big screen is watching.",
    description: [
      // TODO(confirm): placeholder copy
      "Bollywood is pure celebration: big expressions, bold moves and the songs everyone knows by heart.",
      "Learn signature film choreography with the technique to perform it beautifully — for the stage, the sangeet or the sheer joy of it.",
    ],
    category: "dance",
    audiences: ["kids", "teens", "adults"], // TODO(confirm)
    level: "All levels", // TODO(confirm)
    durationMinutes: null, // TODO(confirm)
    schedule: PLACEHOLDER_SCHEDULE,
    priceText: FEES,
    ...toAccent("bollywood"),
    treatment: "default",
    motif: "twirl",
    benefits: [
      { title: "Expression", text: "Facial expression and storytelling that light up a room." },
      { title: "Choreography", text: "Iconic film-style routines, broken down clearly." },
      { title: "Confidence", text: "Perform with energy at events and on stage." },
      { title: "Joy & fitness", text: "A full-body workout that feels like a party." },
    ],
    whoFor: [
      "Anyone preparing for a wedding, sangeet or celebration",
      "Kids and families who love film music",
      "Beginners who want a fun, welcoming first dance class",
    ],
    expect: [
      { title: "Warm-up", text: "Energising moves set to music you will recognise." },
      { title: "Learn the song", text: "Section-by-section choreography with expressions." },
      { title: "Showtime", text: "Put it together and perform it full out." },
    ],
    cover: {
      src: "/media/classes/bollywood/cover.jpg",
      alt: "Dancers in flowing costumes captured in a vivid motion blur on stage",
      focal: "50% 40%",
      motif: "twirl",
      stock: true,
    },
    gallery: [
      {
        src: "/media/classes/bollywood/gallery-1.jpg",
        alt: "Two dancers performing a dramatic duet",
        motif: "twirl",
        stock: true,
      },
      {
        src: "/media/classes/bollywood/gallery-2.jpg",
        alt: "Dancers in red and gold costumes under green stage lights",
        motif: "twirl",
        stock: true,
      },
      {
        src: "/media/classes/bollywood/gallery-3.jpg",
        alt: "Three dancers in colourful traditional costumes performing together",
        motif: "twirl",
        stock: true,
      },
    ],
    faqIds: ["what-to-wear", "trial-what-happens"],
    instructorIds: [FOUNDER, "instructor-tba-dance"],
    keywords: ["Bollywood dance classes", "sangeet choreography", "Indian dance classes"],
    sortOrder: 4,
  },
  {
    slug: "free-style",
    name: "Free Style",
    tagline: "Be You. Be Free.",
    summary: "Expressive, individual style — discover how you move when nobody tells you how.",
    description: [
      // TODO(confirm): placeholder copy
      "Free Style is where technique meets personality. Explore improvisation, musicality and textures drawn from many dance styles.",
      "You will leave each class with new vocabulary — and a little more of your own voice as a dancer.",
    ],
    category: "dance",
    audiences: ["kids", "teens", "adults"], // TODO(confirm)
    level: "All levels", // TODO(confirm)
    durationMinutes: null, // TODO(confirm)
    schedule: PLACEHOLDER_SCHEDULE,
    priceText: FEES,
    ...toAccent("free-style"),
    treatment: "default",
    motif: "leap",
    benefits: [
      { title: "Personal style", text: "Find the movement that feels unmistakably yours." },
      { title: "Improvisation", text: "Respond to any music with confidence." },
      { title: "Musicality", text: "Hear more in a song — and show it." },
      { title: "Creative freedom", text: "A supportive space to experiment and play." },
    ],
    whoFor: [
      "Dancers who want to stop copying and start creating",
      "Shy movers building confidence step by step",
      "Anyone who loves to dance without rules",
    ],
    expect: [
      { title: "Explore", text: "Guided prompts that open up new ways to move." },
      { title: "Build vocabulary", text: "Short phrases drawn from different styles." },
      { title: "Freestyle circle", text: "Share your moves in a supportive circle." },
    ],
    cover: {
      src: "/media/classes/free-style/cover.jpg",
      alt: "Dancer in an expressive open pose under coloured stage light",
      focal: "50% 30%",
      motif: "leap",
      stock: true,
    },
    gallery: [
      {
        src: "/media/classes/free-style/gallery-1.jpg",
        alt: "Dancer moving freely under magenta light",
        motif: "leap",
        stock: true,
      },
      {
        src: "/media/classes/free-style/gallery-2.jpg",
        alt: "Performer with arms outstretched in a dramatic costume",
        motif: "leap",
        stock: true,
      },
      {
        src: "/media/classes/free-style/gallery-3.jpg",
        alt: "Lone dancer lit by a single light on a dark floor",
        motif: "leap",
        stock: true,
      },
    ],
    faqIds: ["what-to-wear", "trial-what-happens"],
    instructorIds: [FOUNDER],
    keywords: ["freestyle dance classes", "dance improvisation"],
    sortOrder: 5,
  },
  {
    slug: "gymnastics",
    name: "Gymnastics",
    tagline: "Strength. Flexibility. Discipline.",
    summary:
      "Build a powerful, flexible body and the focus to keep growing — safely and step by step.",
    description: [
      // TODO(confirm): placeholder copy
      "Our gymnastics classes develop strength, flexibility and body control through progressive, carefully supervised skills.",
      "From rolls and balances to handstands and beyond, students move up only when they are ready.",
    ],
    category: "fitness",
    audiences: ["kids", "teens"], // TODO(confirm)
    level: "Progressive levels", // TODO(confirm)
    durationMinutes: null, // TODO(confirm)
    schedule: PLACEHOLDER_SCHEDULE,
    priceText: FEES,
    ...toAccent("gymnastics"),
    treatment: "default",
    motif: "balance",
    benefits: [
      { title: "Strength", text: "Functional strength for sport, dance and life." },
      { title: "Flexibility", text: "Safe, progressive mobility work." },
      { title: "Discipline", text: "Focus, patience and the pride of earning each skill." },
      { title: "Body control", text: "Balance, coordination and spatial awareness." },
    ],
    whoFor: [
      "Children building strength, coordination and confidence",
      "Dancers who want more power and flexibility",
      "Young athletes looking for a strong foundation",
    ],
    expect: [
      { title: "Mobility warm-up", text: "Joint preparation and flexibility drills." },
      { title: "Skill stations", text: "Spotted, progressive skills matched to each level." },
      { title: "Conditioning", text: "Core and strength work that keeps every body safe." },
    ],
    cover: {
      src: "/media/classes/gymnastics/cover.jpg",
      alt: "Gymnast in a dark leotard mid-movement against a black background",
      focal: "50% 40%",
      motif: "balance",
      stock: true,
    },
    gallery: [
      {
        src: "/media/classes/gymnastics/gallery-1.jpg",
        alt: "Gymnast holding a graceful floor pose",
        motif: "balance",
        stock: true,
      },
      {
        src: "/media/classes/gymnastics/gallery-2.jpg",
        alt: "Athlete balancing on parallel bars",
        motif: "balance",
        stock: true,
      },
      {
        src: "/media/classes/gymnastics/gallery-3.jpg",
        alt: "Silhouette of a gymnast in a standing split at sunset",
        motif: "balance",
        stock: true,
      },
    ],
    faqIds: ["gymnastics-safety", "what-to-wear", "trial-what-happens"],
    instructorIds: [FOUNDER, "instructor-tba-fitness"],
    keywords: ["gymnastics classes for kids", "flexibility training"],
    sortOrder: 6,
  },
  {
    slug: "yoga",
    name: "Yoga",
    tagline: "Step into a journey of balance, strength and serenity.",
    summary: "Transform your body, calm your mind and elevate your life.",
    description: [
      // TODO(confirm): placeholder copy
      "Our yoga practice moves between steady strength and deep calm — mindful sequences, breath work and stillness.",
      "Every pose offers options, so whether you are new to the mat or deepening a long practice, you will find your edge safely.",
    ],
    category: "fitness",
    audiences: ["teens", "adults"], // TODO(confirm)
    level: "All levels", // TODO(confirm)
    durationMinutes: null, // TODO(confirm)
    schedule: PLACEHOLDER_SCHEDULE,
    priceText: FEES,
    ...toAccent("yoga"),
    treatment: "calm-cream",
    motif: "lotus",
    benefits: [
      { title: "Flexibility & mobility", text: "Improve range of motion, gently and steadily." },
      { title: "Less stress", text: "Reduce stress and anxiety through breath and stillness." },
      { title: "Strength & stamina", text: "Build strength that supports every day." },
      { title: "Focus", text: "Enhance focus and concentration." },
      { title: "Well-being", text: "Promote overall well-being, on and off the mat." },
    ],
    whoFor: [
      "Beginners looking for a calm, welcoming start",
      "Dancers and athletes who need mobility and recovery",
      "Anyone seeking balance in a busy life",
    ],
    expect: [
      { title: "Arrive & breathe", text: "Settle in with grounding breath work." },
      { title: "Flow & hold", text: "Mindful sequences balancing strength and stretch." },
      { title: "Rest", text: "Close in stillness and leave lighter than you came." },
    ],
    cover: {
      src: "/media/classes/yoga/cover.jpg",
      alt: "Person meditating in lotus pose facing warm evening light",
      focal: "50% 45%",
      motif: "lotus",
      stock: true,
    },
    gallery: [
      {
        src: "/media/classes/yoga/gallery-1.jpg",
        alt: "Seated yoga practice on a mat in a bright room",
        motif: "lotus",
        stock: true,
      },
      {
        src: "/media/classes/yoga/gallery-2.jpg",
        alt: "Downward-facing dog in soft monochrome light",
        motif: "lotus",
        stock: true,
      },
      {
        src: "/media/classes/yoga/gallery-3.jpg",
        alt: "Deep backbend stretch with arms extended",
        motif: "lotus",
        stock: true,
      },
    ],
    faqIds: ["yoga-experience", "what-to-wear", "trial-what-happens"],
    instructorIds: [FOUNDER, "instructor-tba-fitness"],
    keywords: ["yoga classes", "yoga for beginners", "stress relief yoga"],
    sortOrder: 7,
  },
  {
    slug: "zumba",
    name: "Zumba",
    tagline: "Dance it out. Feel the beat. Live the energy!",
    summary: "Get fit, have fun and feel unstoppable!",
    description: [
      // TODO(confirm): placeholder copy
      "Zumba turns fitness into a party — Latin and global rhythms, simple steps and an energy that carries the whole room.",
      "No dance experience needed. Just show up, follow the beat and leave smiling.",
    ],
    category: "fitness",
    audiences: ["teens", "adults"], // TODO(confirm)
    level: "All fitness levels", // TODO(confirm)
    durationMinutes: null, // TODO(confirm)
    schedule: PLACEHOLDER_SCHEDULE,
    priceText: FEES,
    ...toAccent("zumba"),
    treatment: "energetic",
    motif: "burst",
    benefits: [
      { title: "Burn calories", text: "High-energy intervals disguised as dancing." },
      { title: "Improve fitness", text: "Cardio, coordination and endurance." },
      { title: "Boost mood", text: "Music and movement that lift your day." },
      { title: "Social & fun", text: "Move with a crowd that cheers you on." },
      { title: "Increase energy", text: "Leave every session buzzing." },
    ],
    whoFor: [
      "Anyone who wants fitness that never feels like a chore",
      "Beginners — no dance background needed",
      "Friends and families who want to move together",
    ],
    expect: [
      { title: "Warm up", text: "Easy steps to get the heart going." },
      { title: "Peak tracks", text: "High-energy songs that build and drop." },
      { title: "Cool down", text: "Stretch and slow the breath." },
    ],
    cover: {
      src: "/media/classes/zumba/cover.jpg",
      alt: "Woman dancing joyfully with arms raised in a bright studio",
      focal: "50% 35%",
      motif: "burst",
      stock: true,
    },
    gallery: [
      {
        src: "/media/classes/zumba/gallery-1.jpg",
        alt: "Group dance fitness class in a studio with mirrors",
        motif: "burst",
        stock: true,
      },
      {
        src: "/media/classes/zumba/gallery-2.jpg",
        alt: "Crowd dancing outdoors with arms in the air",
        motif: "burst",
        stock: true,
      },
      {
        src: "/media/classes/zumba/gallery-3.jpg",
        alt: "Person dancing energetically with headphones on",
        motif: "burst",
        stock: true,
      },
    ],
    faqIds: ["zumba-fitness", "what-to-wear", "trial-what-happens"],
    instructorIds: [FOUNDER, "instructor-tba-fitness"],
    keywords: ["Zumba classes", "dance fitness classes"],
    sortOrder: 8,
  },
] satisfies ClassInput[];

function toAccent(slug: keyof typeof classAccents) {
  const { accent, contrast, onDark } = classAccents[slug];
  return { accent, accentContrast: contrast, accentOnDark: onDark };
}
