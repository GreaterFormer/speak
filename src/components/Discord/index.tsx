import React from "react";

interface DiscordProps {}

const Discord: React.FC<DiscordProps> = () => {
  return (
    <iframe
      src="https://discord.com/widget?id=1230635479192567909&theme=dark"
      width="350"
      height="500"
      frameBorder="0"
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    ></iframe>
  );
};

export default Discord;
