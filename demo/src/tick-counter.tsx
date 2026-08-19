import { useEffect, useState } from "react";

const TICK_INTERVAL_MS = 1000;

// Own state so its re-renders stay out of the rest of the page — useful for
// watching how react-grab's update freeze and an edit session interleave.
export const TickCounter = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, TICK_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <p className="meta" data-testid="tick-counter">
      Live for {seconds}s
    </p>
  );
};
