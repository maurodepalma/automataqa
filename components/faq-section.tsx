import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do you integrate with our existing team and workflow?",
    answer:
      "We embed directly into your team using your tools (Slack, Jira, GitHub) and align with your sprint cycles. Our QA engineers operate as part of your team, not as an external layer."
  },
  {
    question: "How quickly can we get started?",
    answer:
      "Typically within days. We match you with pre-vetted QA engineers who can ramp up quickly and start contributing almost immediately."
  },
  {
    question: "Can we scale QA resources as our product grows?",
    answer:
      "Yes. You can easily scale QA capacity up or down depending on your roadmap, releases, or funding stage, without the overhead of hiring."
  },
  {
    question: "What types of testing do you cover?",
    answer:
      "We provide end-to-end QA including manual testing, test automation (Playwright, Cypress), mobile testing, API testing, and regression coverage."
  },
  {
    question: "Do you build and maintain automated tests?",
    answer:
      "Yes. We design, implement, and maintain scalable test automation that integrates into your CI/CD pipeline and grows with your product."
  },
  {
    question: "Why LATAM QA engineers?",
    answer:
      "LATAM engineers provide strong technical expertise, excellent communication, and real-time collaboration with U.S. teams at a more efficient cost."
  },
  {
    question: "Are your QA engineers dedicated to our team?",
    answer:
      "Yes. Your QA engineer is fully dedicated, ensuring deep product understanding, consistency, and long-term impact."
  },
  {
    question: "What if the engineer is not the right fit?",
    answer:
      "We quickly replace them at no additional cost to ensure you always have the right match."
  }
];

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
          <div className="mb-8 text-center">
            <Badge variant="default" className="bg-white/6 px-3 py-1">
              FAQ
            </Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
              FAQs for Engineering Leaders
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              How we integrate fast, scale QA capacity, and deliver reliable automation without
              adding operational overhead.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="rounded-xl border-0 bg-background/55 px-5 transition-colors duration-200 hover:bg-background/70"
              >
                <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
