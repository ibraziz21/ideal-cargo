import { Container } from "./Container";

export function Reviews() {
  return (
    <section className="bg-white py-12 md:py-16">
      <Container>
        <h2 className="font-display text-2xl font-bold text-ink">Client Reviews</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <blockquote className="rounded-lg bg-sand p-5">
            <p className="text-ink">“Booked at 8am — materials delivered by 11am. Smooth, on time.”</p>
            <footer className="mt-2 text-sm text-ink/70">— Hassan, Tudor</footer>
          </blockquote>
          <blockquote className="rounded-lg bg-sand p-5">
            <p className="text-ink">“Perfect for our Airbnb moves. Polite, careful, fast.”</p>
            <footer className="mt-2 text-sm text-ink/70">— Cynthia, Nyali</footer>
          </blockquote>
        </div>
      </Container>
    </section>
  );
}
