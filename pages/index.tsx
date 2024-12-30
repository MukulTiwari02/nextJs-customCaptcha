import { useEffect, useState } from "react";
import Capcha from "./../components/Capcha";
import { withIronSessionSsr } from "iron-session/next";
import { newCaptchaImages } from "./api/captcha-image";
export default function Home({ defaultCaptchaKey }) {
  const [message, setMessage] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [captchaKey, setCaptchaKey] = useState(defaultCaptchaKey);
  function send() {
    if (!message) {
      alert("The message is required");
      return;
    }
    fetch("/api/execute", {
      method: "POST",
      body: JSON.stringify({
        message,
        selectedIndexes,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      response.json().then((json) => {
        if (json.sent) {
          setCaptchaKey(new Date().getTime());
          alert("Message sent");
          setMessage("");
        }
        if (!json.captchaIsOk) {
          setCaptchaKey(new Date().getTime());
          alert("wrong captcha. try again");
        }
      });
    });
  }

  return (
    <div className="mt-32 flex flex-col items-center">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Enter any text"
        className="bg-gray-300 placeholder-slate-500 text-black px-5 py-3 rounded-md w-[300px]"
      />
      <div className="w-[300px] my-7">
        <Capcha captchaKey={captchaKey} onChange={setSelectedIndexes} />
      </div>
      <button
        onClick={send}
        className="w-[300px] bg-green-300 py-3 rounded-md text-gray-600"
      >
        Send
      </button>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    {
      if (!req.session.captchaImages) {
        req.session.captchaImages = newCaptchaImages();
        await req.session.save();
      }
      return {
        props: {
          defaultCaptchaKey: new Date().getTime(),
        },
      };
    }
  },
  {
    cookieName: "session",
    password: process.env.SESSION_SECRET,
  }
);
