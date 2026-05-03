import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const OG_INVITATION_SIZE = { width: 1200, height: 630 };
export const OG_INVITATION_CONTENT_TYPE = "image/png";

export function renderInvitationOG() {
  const logoPath = path.join(process.cwd(), "public/images/se-logo.png");
  const logoData = `data:image/png;base64,${fs
    .readFileSync(logoPath)
    .toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#f2e4bc",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundColor: "#898834",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 30px 80px -30px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 22,
              left: 22,
              right: 22,
              bottom: 22,
              borderWidth: 6,
              borderStyle: "double",
              borderColor: "rgba(242,228,188,0.5)",
            }}
          />
          <img src={logoData} width={210} height={287} alt="" />
        </div>
      </div>
    ),
    OG_INVITATION_SIZE
  );
}
