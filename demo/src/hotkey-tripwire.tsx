import { useEffect, useState } from "react";

const HOTKEY = "e";

// Stands in for a host app that binds a bare-letter hotkey on window. An edit
// session must swallow keystrokes so this counter never moves while typing.
export const HotkeyTripwire = () => {
  const [pressCount, setPressCount] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== HOTKEY) return;
      setPressCount((previous) => previous + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <p className="meta">
      Host hotkey <kbd>e</kbd> fired <span data-testid="hotkey-count">{pressCount}</span> times
    </p>
  );
};
