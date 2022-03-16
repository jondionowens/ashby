/* eslint-disable @typescript-eslint/no-use-before-define */
import faker from "faker";
import {
  Interview,
  InterviewProgress,
  InterviewStage,
  ScheduledInterview,
  VisitedInterviewStage
} from "./types";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import {
  INTERVIEW_TITLES,
  NEXT_STAGE_INDEX,
  ORDERED_INTERVIEW_PLAN,
  VISITED_STAGES
} from "./data";
import uniqueRandomArray from "unique-random-array";

export function generateInterviewProgress(): InterviewProgress {
  const randomInterviewTitle = uniqueRandomArray(INTERVIEW_TITLES);
  const visitedStages = [];
  var lastDate: DateTime | undefined;

  for (var i = VISITED_STAGES.length - 1; i >= 0; i--) {
    const interviewStage = VISITED_STAGES[i];

    const [visitedStage, enteredAt] = generateVisitedStage(
      interviewStage,
      lastDate
    );
    lastDate = enteredAt;

    visitedStages.push(visitedStage);
  }

  return {
    visitedStages: visitedStages.reverse(),
    nextStage: {
      interviewStage: ORDERED_INTERVIEW_PLAN[NEXT_STAGE_INDEX],
      interviewSchedule: [
        generateInterview(randomInterviewTitle()),
        generateInterview(randomInterviewTitle()),
        generateInterview(randomInterviewTitle())
      ]
    }
  };
}

const RANDOM_RSVP_STATUS = uniqueRandomArray([
  "accepted",
  "tentative",
  "declined"
]);
const RANDOM_SCORE = uniqueRandomArray([1, 2, 3, 4, "submitted"]);

export function generateVisitedStage(
  interviewStage: InterviewStage,
  leftAt?: DateTime
): [VisitedInterviewStage, DateTime] {
  const enteredAtDaysAgo = faker.helpers.randomize([3, 5, 7, 14]);
  const enteredAt = (leftAt != null ? leftAt : DateTime.now()).minus({
    days: enteredAtDaysAgo
  });

  let nextInterviewStart = (leftAt != null
    ? leftAt.minus({ days: 1 })
    : DateTime.now().plus({ days: 2 })
  )
    .startOf("day")
    .set({ hour: 10 });
  const interviewCount = leftAt != null ? faker.helpers.randomize([0, 1]) : 4;
  const randomInterviewTitle = uniqueRandomArray(INTERVIEW_TITLES);
  const interviews: ScheduledInterview[] = [];

  for (var i = 0; i < interviewCount; i++) {
    const interviewLength = faker.helpers.randomize([30, 45, 60, 90]);
    const interviewerCount = faker.helpers.randomize([1, 2]);

    const start = nextInterviewStart;
    const end = start.plus({ minutes: interviewLength });

    const interviewers = [];
    for (var j = 0; j < interviewerCount; j++) {
      interviewers.push({
        id: uuid(),
        user: {
          id: uuid(),
          name: faker.name.findName(),
          profilePhotoUrl: faker.image.avatar()
        },
        rsvpStatus: RANDOM_RSVP_STATUS(),
        score: leftAt != null ? RANDOM_SCORE() : "unsubmitted"
      });
    }

    interviews.push({
      id: uuid(),
      interview: generateInterview(randomInterviewTitle()),
      startIso: start.toISO(),
      endIso: end.toISO(),
      interviewers
    });
    nextInterviewStart = end;
  }

  return [
    {
      id: uuid(),
      interviewStage,
      enteredAtIso: enteredAt.toISO(),
      leftAtIso: leftAt && leftAt.toISO(),
      interviews
    },
    enteredAt
  ];
}

export function generateInterview(title: string): Interview {
  return {
    id: uuid(),
    title
  };
}
