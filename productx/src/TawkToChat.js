import React, { useEffect } from "react";

const TawkToChat = () => {
  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Tawk.to 配置
    window.Tawk_API.customStyle = {
      visibility: {
        desktop: {
          position: 'bl', // bottom left
          xOffset: 20,
          yOffset: 20
        },
        mobile: {
          position: 'bl',
          xOffset: 20,
          yOffset: 20
        }
      },
      button: {
        width: 32,
        height: 32,
        padding: 6
      },
      popup: {
        width: 280,
        height: 360
      }
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/673f24af2480f5b4f5a1c13d/1id7aejps";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default TawkToChat;
