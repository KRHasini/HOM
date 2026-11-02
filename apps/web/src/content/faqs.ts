/**
 * FAQs grouped by topic. Answers avoid unconfirmed facts (fees, exact ages, timings)
 * and point visitors to an enquiry instead. TODO(confirm) once details are final.
 */
import type { z } from "zod";

import type { FaqGroupSchema } from "./schema";

type FaqGroupInput = z.input<typeof FaqGroupSchema>;

export const faqs = [
  {
    id: "age-groups",
    title: "Age groups",
    items: [
      {
        id: "age-groups-who",
        question: "Who can join House of Movements?",
        answer:
          "We run batches for kids, teens and adults. Exact age bands vary by class — tell us who the class is for and we will suggest the right batch.", // TODO(confirm)
      },
      {
        id: "age-groups-beginners",
        question: "Do I need any dance experience?",
        answer:
          "Not at all. Every class welcomes beginners, and our instructors adjust each session so you can progress at your own pace.",
      },
    ],
  },
  {
    id: "what-to-wear",
    title: "What to wear",
    items: [
      {
        id: "what-to-wear",
        question: "What should I wear to class?",
        answer:
          "Comfortable clothes you can move freely in and a water bottle. For dance styles, clean indoor shoes or bare feet as advised by your instructor.",
      },
      {
        id: "bharatanatyam-attire",
        question: "What do I wear for Bharatanatyam?",
        answer:
          "A comfortable salwar or practice saree is ideal. Bharatanatyam is practised barefoot. We will guide you on practice attire after your trial.",
      },
    ],
  },
  {
    id: "trial-class",
    title: "Trial class",
    items: [
      {
        id: "trial-what-happens",
        question: "How does the free trial class work?",
        answer:
          "Book a trial online or on WhatsApp. We will call you to understand your goals, match you with the right batch and confirm a slot. Just arrive a few minutes early and enjoy the class.",
      },
      {
        id: "trial-parents",
        question: "Can parents watch a children's trial?",
        answer:
          "Please ask when we call to confirm your trial — we will share how parents can be involved for that batch.", // TODO(confirm)
      },
    ],
  },
  {
    id: "fees",
    title: "Fees",
    items: [
      {
        id: "fees-how-much",
        question: "How much are the classes?",
        answer:
          "Fees depend on the class and batch. Send us an enquiry or WhatsApp us and we will share the current fee details.", // TODO(confirm)
      },
    ],
  },
  {
    id: "batches",
    title: "Batches",
    items: [
      {
        id: "batches-timings",
        question: "What are the batch timings?",
        answer:
          "Timings are shared on enquiry so we can place you in a batch that fits your schedule and level.", // TODO(confirm)
      },
      {
        id: "batches-multiple",
        question: "Can I join more than one class?",
        answer:
          "Yes. Many students combine a dance style with Yoga or Zumba. We will help you plan a schedule that works.",
      },
    ],
  },
  {
    id: "classes",
    title: "About specific classes",
    items: [
      {
        id: "bharatanatyam-experience",
        question: "Can adults start Bharatanatyam as complete beginners?",
        answer:
          "Absolutely. Adults begin with the same foundations as every student — adavus, posture and rhythm — in a supportive, unhurried setting.",
      },
      {
        id: "hip-hop-experience",
        question: "I have never danced. Is Hip-Hop right for me?",
        answer:
          "Yes. Classes start with grooves and simple footwork before building choreography, so beginners feel comfortable from day one.",
      },
      {
        id: "gymnastics-safety",
        question: "How do you keep gymnastics safe?",
        answer:
          "Skills are taught progressively with proper warm-ups and spotting. Students move to the next skill only once they are strong and ready.",
      },
      {
        id: "yoga-experience",
        question: "Is yoga suitable if I am not flexible?",
        answer:
          "Yoga is how you become more flexible. Every pose has options, and your instructor will help you find the right variation.",
      },
      {
        id: "zumba-fitness",
        question: "Do I need to be fit to do Zumba?",
        answer:
          "No. Zumba works for every fitness level — move at your own intensity and build stamina over time.",
      },
    ],
  },
] satisfies FaqGroupInput[];
