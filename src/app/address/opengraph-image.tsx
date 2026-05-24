import {
  OG_INVITATION_CONTENT_TYPE,
  OG_INVITATION_SIZE,
  renderInvitationOG,
} from "@/lib/og-invitation";

export const size = OG_INVITATION_SIZE;
export const contentType = OG_INVITATION_CONTENT_TYPE;
export const alt = "Emily & Sam — Mailing Address";

export default function OpengraphImage() {
  return renderInvitationOG();
}
