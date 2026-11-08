import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { OtpInput } from "@libraries/react-otp-input";
import { createApp } from "vue";
import VueOtpDemo from "./VueOtpDemo.vue";

import "./styles.css";

function ReactDemo() {
  const [code, setCode] = useState("");
  const [complete, setComplete] = useState<string | null>(null);

  return (
    <section className="demo-section">
      <h2>React</h2>
      <OtpInput
        length={6}
        value={code}
        onChange={setCode}
        onComplete={setComplete}
        label="Verification code"
        autoFocus
      />
      <p className="demo-meta">
        Value: <code>{code || "—"}</code>
        {complete ? (
          <>
            {" "}
            · Complete: <code>{complete}</code>
          </>
        ) : null}
      </p>
    </section>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactDemo />
  </StrictMode>
);

createApp(VueOtpDemo).mount("#vue-root");
