import { Body, Container, Head, Heading, Hr, Html, Preview, Text } from "@react-email/components";

const INK = "#201e1d";
const PAPER = "#f3f2f2";
const ACCENT = "#ec3013";
const INK_SOFT = "#6f6b68";

export function LeadConfirmationEmail({ name, siteName }: { name: string; siteName: string }) {
  const firstName = name.split(" ")[0] || name;

  return (
    <Html>
      <Head />
      <Preview>Thanks for reaching out to {siteName}</Preview>
      <Body style={{ backgroundColor: PAPER, fontFamily: "Arial, sans-serif", padding: "32px 0" }}>
        <Container
          style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 32, maxWidth: 480 }}
        >
          <Heading style={{ color: INK, fontSize: 22, margin: "0 0 16px" }}>
            Thanks, {firstName}.
          </Heading>
          <Text style={{ color: INK_SOFT, fontSize: 15, lineHeight: "24px" }}>
            We&apos;ve got your message and someone from the {siteName} team will be in touch
            within one business day.
          </Text>
          <Hr style={{ borderColor: "rgba(32,30,29,0.1)", margin: "24px 0" }} />
          <Text style={{ color: INK_SOFT, fontSize: 13 }}>
            In the meantime, feel free to reply directly to this email with anything else that
            would be useful context.
          </Text>
          <Text style={{ color: ACCENT, fontSize: 13, fontWeight: 700, marginTop: 24 }}>
            — The {siteName} team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
