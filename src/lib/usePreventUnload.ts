import { useEffect } from "react";

function usePreventUnload(shouldPrevent: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldPrevent) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    console.log("added");
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldPrevent]);
}

export default usePreventUnload;
