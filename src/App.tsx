import { InterviewProgressView } from "./components/InterviewProgress";
import styles from "./App.module.scss";
import { generateInterviewProgress } from "./generate";
import Switch from "react-switch";
import { useState, useEffect, createContext } from "react";

export const FocusContext = createContext(false);

export function App() {
  /* Note */
  // I'm mostly saving interviewProgress in state to avoid
  // a re-render when the "Focus" toggle is used. Setting this
  // in useEffect now.
  const [interviewProgress, setInterviewProgress] = useState(null);
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    const interviewData = generateInterviewProgress();
    setInterviewProgress(interviewData);
  }, []);

  function setFocusMode() {
    setIsFocusMode(!isFocusMode);
  }

  if (interviewProgress) {
    return (
      <FocusContext.Provider value={isFocusMode}>
        <div className={styles.app}>
          <div className={styles.center}>
            <div className={styles.interviewTop}>
              <h1>Interview Progress</h1>
              <div className={styles.focusGroup}>
                <div>Focused:</div>
                <Switch
                  onChange={setFocusMode}
                  checked={isFocusMode}
                  onColor="#29b458"
                  offColor="#7d8699"
                />
              </div>
            </div>
            <InterviewProgressView
              data={interviewProgress}
            />
          </div>
        </div>
      </FocusContext.Provider>
    );
  } else {
    return <div>Loading</div>;
  }
}
