import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 text-center md:flex-row md:text-left">
        <div className="text-sm text-ink/70">
          © {new Date().getFullYear()} Mombasa Light Transport. All rights reserved.
        </div>
        <div className="text-sm text-ink/70">
          Hours: 6:30am–9:00pm • Mon–Sat • Till: <b>XXXXXX</b>
        </div>
      </Container>
    </footer>
  );
}
