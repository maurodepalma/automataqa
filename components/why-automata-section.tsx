import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  { value: "2-4 Weeks", label: "Average ramp for embedded QA pods" },
  { value: "4-6 Hours", label: "Typical daily U.S. timezone overlap" },
  { value: "Playwright + Cypress + Appium", label: "Modern stack across web, API, and mobile" },
  { value: "CI/CD Friendly", label: "Pipeline-native quality gates and release checks" }
];

export function WhyAutomataSection() {
  return (
    <section id="why" className="py-16 md:py-20">
      <div className="container">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Why AutomataQA</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            A quality engineering partner focused on outcomes, not ticket volume.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {metrics.map((metric) => (
            <Card key={metric.label} className="transition-colors duration-300 hover:border-white/15">
              <CardContent className="space-y-3 p-6">
                <p className="text-2xl font-semibold leading-tight md:text-3xl">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
