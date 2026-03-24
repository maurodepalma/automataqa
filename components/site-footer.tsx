import { Footer2 } from "@/components/footer2";

const COMPANY_EMAIL = "hello@automataqa.com";
const CAREERS_EMAIL = "careers@automataqa.com";
const LINKEDIN_URL = "https://www.linkedin.com/company/automataqa";

const menuItems = [
  {
    title: "Navigation",
    links: [
      { text: "How We Work", url: "#how-we-work" },
      { text: "QA Services", url: "#qa-services" },
      { text: "AI-Powered QA", url: "#ai-powered-qa" },
      { text: "LATAM QA Engineers", url: "#latam-qa-engineers" },
      { text: "Careers", url: "#careers" },
      { text: "FAQ", url: "#faq" }
    ]
  },
  {
    title: "Contact",
    links: [
      { text: `Contact Us (${COMPANY_EMAIL})`, url: `mailto:${COMPANY_EMAIL}` },
      { text: `Careers (${CAREERS_EMAIL})`, url: `mailto:${CAREERS_EMAIL}` },
      { text: "LinkedIn", url: LINKEDIN_URL }
    ]
  }
];

export function SiteFooter() {
  return (
    <Footer2
      className="py-16 md:py-20"
      logo={{
        src: "automata-qa-logo.svg",
        alt: "AutomataQA",
        title: "",
        url: "#top"
      }}
      tagline="Scale Quality. Accelerate Releases. Reduce Risk."
      menuItems={menuItems}
      copyright={`© ${new Date().getFullYear()} AutomataQA. All rights reserved.`}
      bottomLinks={[]}
    />
  );
}
