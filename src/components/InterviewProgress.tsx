/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from "react";
import styles from "./InterviewProgress.module.scss";
import {
  Interviewer,
  InterviewProgress,
  ScheduledInterview,
  VisitedInterviewStage
} from "../types";
import { DateTime } from "luxon";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { FocusContext } from "../App";

export const isCurrentFocusStage = (enteredAtIso, leftAtIso) => {
  return enteredAtIso && leftAtIso === undefined;
};

export function InterviewProgressView(data: { data: InterviewProgress }) {
  /* UX optimization */
  // We should Reverse the order of "visitedStages" to provide a quicker
  // glance at the recent progression of the interview process
  const reversed = data.data.visitedStages.slice();
  const isFocusMode = React.useContext(FocusContext);

  return (
    <>
      <section className={styles.container}>
        {reversed.map((s) => (
          <VisitedStageView key={s.id} data={s} isFocusMode={isFocusMode} />
        ))}
      </section>
      <section className={`${styles.container} ${styles.currentStage}`}>
        {data.data.nextStage && <NextStageView data={data.data.nextStage} />}
      </section>
    </>
  );
}

/** Visited Stage Components */

export function VisitedStageView(props: {
  data: VisitedInterviewStage;
  isFocusMode: boolean;
}) {
  const enteredAt = DateTime.fromISO(props.data.enteredAtIso);
  const leftAt = props.data.leftAtIso
    ? DateTime.fromISO(props.data.leftAtIso)
    : DateTime.now();

  return (
    <StageChrome
      className={
        `${styles.visited} ` +
        (props.isFocusMode &&
          !isCurrentFocusStage(props.data.enteredAtIso, props.data.leftAtIso) &&
          `${styles.outOfFocus}`)
      }
    >
      <StageHeader>
        <h2>{props.data.interviewStage.title}</h2>
        <div className={styles.timingWrapper}>
          <div className={styles.entered}>
            Entered: {timeAgo.format(enteredAt.toJSDate())}
          </div>
          <div className={styles.time}>
            Time in stage: {Math.round(leftAt.diff(enteredAt).as("days"))} days
          </div>
        </div>
      </StageHeader>
      {props.data.interviews &&
        props.data.interviews.map((i) => (
          <ScheduledInterviewView data={i} key={i.id} />
        ))}
    </StageChrome>
  );
}

export function ScheduledInterviewView({ data }: { data: ScheduledInterview }) {
  const startAt = DateTime.fromISO(data.startIso);
  const endAt = DateTime.fromISO(data.endIso);
  const isFuture = DateTime.now() < startAt;
  return (
    <InterviewChrome key={data.id} className={styles.scheduled}>
      <div className={styles.interviewTitleDateGroup}>
        <InterviewTitle>{data.interview.title}</InterviewTitle>
        <div className={styles.interviewDate}>
          {startAt.toLocaleString(DateTime.DATETIME_MED)} -{" "}
          {endAt.toLocaleString(DateTime.TIME_SIMPLE)}
        </div>
      </div>
      <div className={styles.interviewerWrapper}>
        {data.interviewers.map((i) => (
          <InterviewerView key={i.id} data={i} isFuture={isFuture} />
        ))}
      </div>
    </InterviewChrome>
  );
}

export function InterviewerView({
  data,
  isFuture
}: {
  data: Interviewer;
  isFuture: boolean;
}) {
  return (
    <div className={styles.interviewer}>
      <div className={styles.avatarPlaceholder}></div>
      <div className={data.rsvpStatus}>{data.user.name}</div>
      {isFuture ? (
        <Rsvp rsvpStatus={data.rsvpStatus} />
      ) : (
        <Score score={data.score} />
      )}
    </div>
  );
}

export function Rsvp({
  rsvpStatus
}: {
  rsvpStatus: Interviewer["rsvpStatus"];
}) {
  let className = styles.unknown;
  let node = <span>No response</span>;

  switch (rsvpStatus) {
    case "accepted":
      className = styles.positive;
      node = <span>Accepted</span>;
      break;
    case "declined":
      className = styles.negative;
      node = <span>Declined</span>;
      break;
    case "tenative":
      className = styles.warning;
      node = <span>Tentative</span>;
      break;
  }

  return <div className={[styles.rsvp, className].join(" ")}>{node}</div>;
}

export function Score({ score }: { score: Interviewer["score"] }) {
  let className = styles.unknown;
  let node: React.ReactNode = score;

  switch (score) {
    case 4:
      className = styles.positive;
      break;
    case 3:
      className = styles.negative;
      break;
    case 2:
      className = styles.warning;
      break;
    case 1:
      className = styles.warning;
      break;
    default:
      node = <span>N/A</span>;
  }

  return (
    <div className={[styles.score, className].join(" ")}>Score: {node}</div>
  );
}

/** Next Stage Components */

export function NextStageView({
  data
}: {
  data: NonNullable<InterviewProgress["nextStage"]>;
}) {
  const isFocusMode = React.useContext(FocusContext);

  return (
    <div className={(isFocusMode ? `${styles.outOfFocus}` : '')}>
      <StageChrome>
        <StageHeader>
          <StageTitle>{data.interviewStage.title}</StageTitle>
        </StageHeader>
        {data.interviewSchedule &&
          data.interviewSchedule.map((interview) => (
            <InterviewChrome key={interview.id}>
              <InterviewTitle>{interview.title}</InterviewTitle>
            </InterviewChrome>
          ))}
      </StageChrome>
    </div>
  );
}

/** Layout Components */

export function StageChrome({
  className,
  children
}: ChildrenProps & ClassNameProps) {
  return <div className={[styles.stage, className].join(" ")}>{children}</div>;
}

export function StageHeader({
  className,
  children
}: ChildrenProps & ClassNameProps) {
  return (
    <div className={[styles.stageHeader, className].join(" ")}>{children}</div>
  );
}

export function StageTitle({ children }: ChildrenProps) {
  return <h2 className={styles.stageTitle}>{children}</h2>;
}

export function InterviewChrome({
  className,
  children
}: ChildrenProps & ClassNameProps) {
  return (
    <div className={[styles.interview, className].join(" ")}>{children}</div>
  );
}

export function InterviewTitle({ children }: ChildrenProps) {
  return <h3 className={styles.interviewTitle}>{children}</h3>;
}

/** Utilities */

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

type ChildrenProps = { children?: React.ReactNode };
type ClassNameProps = { className?: string };
