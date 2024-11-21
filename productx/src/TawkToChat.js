import React, { useEffect } from "react";

const TawkToChat = () => {
  useEffect(() => {
    // Tawk.to script
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/673f24af2480f5b4f5a1c13d/1id7aejps";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      // 清理脚本
      document.body.removeChild(script);
    };
  }, []);

  return null; // 该组件不需要渲染任何内容
};

export default TawkToChat;
