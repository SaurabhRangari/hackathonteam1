// ./pages/index.js
import Controls from "@/components/Controls";
import Messages from "@/components/Messages";
import { fetchAccessToken } from "@humeai/voice";
import { VoiceProvider } from "@humeai/voice-react";

export const getServerSideProps = async () => {
  const accessToken = await fetchAccessToken({
    apiKey: process.env.HUME_API_KEY,
    secretKey: process.env.HUME_SECRET_KEY,
  });

  if (!accessToken) {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }

  return {
    props: {
      accessToken,
    },
  };
};

export default function Page({ accessToken }) {
  return (
    <VoiceProvider auth={{ type: "accessToken", value: accessToken }}>
      <Messages />
      <Controls />
    </VoiceProvider>
  );
}
