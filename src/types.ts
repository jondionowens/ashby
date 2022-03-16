/** An interview stage in an interview plan */
export interface InterviewStage {
  id: string;
  title: string;
}

/** An interview that can be scheduled */
export interface Interview {
  id: string;
  title: string;
}

/** A schedule of interviews that can be scheduled */
export interface InterviewSchedule {
  id: string;
  title: string;
  interviewsInOrder: Interview[];
}

/** A user */
export interface User {
  id: string;
  name: string;
  profilePhotoUrl: string;
}

/**
 * Historical score given by an interviewer
 */
export interface Interviewer {
  id: string;
  user: User;
  /** The user's RSVP status from their calendar. Undefined if no response yet. */
  rsvpStatus?: "accepted" | "tenative" | "declined";
  score?: 1 | 2 | 3 | 4 | "unsubmitted";
}

/** An interview that already happened */
export interface ScheduledInterview {
  id: string;
  interview: Interview;
  startIso: string;
  endIso: string;
  interviewers: Interviewer[];
}

/** An interview stage that was visted by a candidate */
export interface VisitedInterviewStage {
  id: string;
  interviewStage: InterviewStage;
  enteredAtIso: string;
  leftAtIso?: string;
  interviews: ScheduledInterview[];
}

export interface InterviewProgress {
  /** Interview stages that the candidate has been through */
  visitedStages: VisitedInterviewStage[];
  /** The next stage the candidate is expected move to. They may not. */
  nextStage?: {
    interviewStage: InterviewStage;
    /** Potential interview schedules that need to be scheduled. Can be empty. */
    interviewSchedule?: Interview[];
  };
}
