import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import styles from "@/styles/Zoom.module.css";
import router from "next/router";

function ZoomPage() {
  const searchParams = useSearchParams();
  useEffect(() => {
    return async () => {
      new Promise(async (resolve, reject) => {
        const zoomEmbed = await (
          await import("@zoomus/websdk/embedded")
        ).default;

        resolve(zoomEmbed.createClient());
      })
        .then(async (client) => {
          let meetingSDKElement = document.getElementById("meetingSDKElement");

          client.init({
            language: "en-US",
            zoomAppRoot: meetingSDKElement,
          });
          const payload = router.query;
          console.log("payload", payload);
          const { data } = await axios
            .post("/api/zoom", payload)
            .then((res) => {
              return res;
            })
            .catch((err) =>
              console.log("error while generating signature", err)
            );

          client.join({
            meetingNumber: payload.meetingNumber,
            signature: data.signature,
            sdkKey: data.sdkKey,
            userName: payload.userName,
            password: payload.password,
            tk: "",
          });
        })
        .catch((err) => {
          console.log("error inside client useeffect", err);
        });
    };
  }, []);
  return (
    <div className={styles.container}>
      <div id="meetingSDKElement">Meeting SDK Element</div>
    </div>
  );
}

export default ZoomPage;
