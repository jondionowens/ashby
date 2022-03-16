import { InterviewStage } from "./types";
import { v4 as uuid } from "uuid";

export const ORDERED_INTERVIEW_PLAN: InterviewStage[] = [
  {
    id: uuid(),
    title: "New Lead"
  },
  {
    id: uuid(),
    title: "Reached Out"
  },
  {
    id: uuid(),
    title: "Responded"
  },
  {
    id: uuid(),
    title: "Recruiter Screen"
  },
  {
    id: uuid(),
    title: "Founder Screen"
  },
  {
    id: uuid(),
    title: "Onsite 1"
  },
  {
    id: uuid(),
    title: "Onsite 2"
  },
  {
    id: uuid(),
    title: "Offer"
  },
  {
    id: uuid(),
    title: "Hired"
  },
  {
    id: uuid(),
    title: "Archived"
  }
];

export const NEXT_STAGE_INDEX = 6;
export const VISITED_STAGES = ORDERED_INTERVIEW_PLAN.slice(0, NEXT_STAGE_INDEX);

export const INTERVIEW_TITLES = [
  "Technical Screen",
  "Culture Screen",
  "Past Projects Deep Drive",
  "Pair Programming",
  "Review Take Home",
  "Presentation"
];
