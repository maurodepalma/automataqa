"use client";
import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Matias Gonzalez",
    designation: "QA Automation Lead (Argentina)",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: 2,
    name: "Diego Herrera",
    designation: "Senior SDET (Colombia)",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Camila Rojas",
    designation: "Mobile QA Engineer (Chile)",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 4,
    name: "Gabriela Costa",
    designation: "API QA Engineer (Brazil)",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 5,
    name: "Nicolas Mendoza",
    designation: "Performance QA Engineer (Peru)",
    image: "https://randomuser.me/api/portraits/men/51.jpg",
  },
  {
    id: 6,
    name: "Sofia Paredes",
    designation: "QA TestOps Engineer (Uruguay)",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
  },
];

export default function AnimatedTooltipPreview() {
  return (
    <div className="flex w-full flex-row items-center justify-center">
      <AnimatedTooltip items={people} />
    </div>
  );
}
