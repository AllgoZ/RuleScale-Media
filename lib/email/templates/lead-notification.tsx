import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

const INK = "#201e1d";
const PAPER = "#f3f2f2";
const ACCENT = "#ec3013";
const INK_SOFT = "#6f6b68";

type LeadNotificationEmailProps = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  budget: string;
  servicesInterested: string[];
  message: string;
  source: string;
};

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <Text style={{ color: INK_SOFT, fontSize: 14, margin: "4px 0" }}>
      <strong style={{ color: INK }}>{label}:</strong> {value}
    </Text>
  );
}

export function LeadNotificationEmail(props: LeadNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New lead: {props.name}</Preview>
      <Body style={{ backgroundColor: PAPER, fontFamily: "Arial, sans-serif", padding: "32px 0" }}>
        <Container
          style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 32, maxWidth: 560 }}
        >
          <Heading style={{ color: INK, fontSize: 20, margin: "0 0 16px" }}>
            New lead: {props.name}
          </Heading>
          <Section>
            <Row label="Email" value={props.email} />
            <Row label="Phone" value={props.phone} />
            <Row label="Company" value={props.company} />
            <Row label="Website" value={props.website} />
            <Row label="Budget" value={props.budget} />
            <Row label="Services interested" value={props.servicesInterested.join(", ")} />
            <Row label="Source" value={props.source} />
          </Section>
          {props.message ? (
            <>
              <Hr style={{ borderColor: "rgba(32,30,29,0.1)", margin: "20px 0" }} />
              <Text style={{ color: INK, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                Message
              </Text>
              <Text style={{ color: INK_SOFT, fontSize: 14, lineHeight: "22px" }}>
                {props.message}
              </Text>
            </>
          ) : null}
          <Text style={{ color: ACCENT, fontSize: 12, fontWeight: 700, marginTop: 24 }}>
            View and assign this lead in /admin.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
