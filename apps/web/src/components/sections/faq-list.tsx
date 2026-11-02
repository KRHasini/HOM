import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/content/schema";

/** Keyboard-accessible FAQ accordion (Radix). */
export function FaqList({ items, defaultOpen }: { items: FaqItem[]; defaultOpen?: string }) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen}
      className="border-t border-hairline"
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
