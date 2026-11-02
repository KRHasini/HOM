/** Labels, options and messages for the trial and contact forms. */
import type { z } from "zod";

import type { FormsCopySchema } from "./schema";
import { site } from "./site.config";

type FormsCopyInput = z.input<typeof FormsCopySchema>;

export const forms = {
  fields: {
    name: "Full name",
    phone: "Phone number",
    phoneHint: "We will call or WhatsApp you on this number.",
    email: "Email",
    message: "Anything we should know?",
    classInterest: "Class of interest",
    classPlaceholder: "Choose a class",
    age: "Age",
    ageHintSelf: "Your age helps us pick the right batch.",
    ageHintChild: "Your child's age helps us pick the right batch.",
  },
  links: { privacy: "Privacy policy", whatsapp: "Chat on WhatsApp" },
  quickTrial: {
    submit: "Book my free trial",
    fullFormLink: "Prefer to tell us more? Use the full form",
  },
  contact: {
    submit: "Send enquiry",
    successTitle: "Thank you — message received.",
    successText: site.trial.responseTime,
  },
  trial: {
    steps: [
      { title: "Who is it for?", description: "Tell us who will be dancing." },
      { title: "Class & timing", description: "Pick a class and when suits you." },
      { title: "Your details", description: "So we can confirm your trial." },
    ],
    audienceQuestion: "Who is the trial class for?",
    audienceOptions: [
      { value: "self", label: "Me", hint: "I want to join" },
      { value: "child", label: "My child", hint: "Booking for my son or daughter" },
    ],
    daysQuestion: "Preferred days",
    dayOptions: [
      { value: "mon", label: "Mon" },
      { value: "tue", label: "Tue" },
      { value: "wed", label: "Wed" },
      { value: "thu", label: "Thu" },
      { value: "fri", label: "Fri" },
      { value: "sat", label: "Sat" },
      { value: "sun", label: "Sun" },
    ],
    timeQuestion: "Preferred time",
    timeOptions: [
      { value: "morning", label: "Morning" },
      { value: "afternoon", label: "Afternoon" },
      { value: "evening", label: "Evening" },
      { value: "flexible", label: "Flexible" },
    ],
    back: "Back",
    next: "Continue",
    submit: "Book free trial",
    stepLabel: "Step",
    success: {
      eyebrow: "Request received",
      title: "See you on the floor",
      summaryTitle: "Your request",
      nextStepsTitle: "What happens next",
      whatsappCta: "Message us on WhatsApp",
      homeCta: "Back to home",
      summaryLabels: { for: "For", class: "Class", days: "Days", time: "Time", phone: "Phone" },
    },
  },
} satisfies FormsCopyInput;
