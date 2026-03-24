import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "AutomataQA became part of our product squads in under a month. Their automation coverage reduced release anxiety almost immediately.",
    name: "Director of Engineering",
    company: "U.S. B2B SaaS"
  },
  {
    quote:
      "They balanced exploratory depth and automation execution better than any previous vendor we used.",
    name: "Head of Product",
    company: "FinTech Platform"
  },
  {
    quote:
      "Strong communication, real ownership, and practical QA strategy. Our mobile release quality improved in the first quarter.",
    name: "VP of Technology",
    company: "Consumer App Company"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">What teams say</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.quote} className="transition-colors duration-300 hover:border-white/15">
              <CardContent className="space-y-5 p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">“{item.quote}”</p>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
