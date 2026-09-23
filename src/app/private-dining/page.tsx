import Image from "next/image";
import Link from "next/link";
import EditorialShell from "../components/EditorialShell";
import styles from "../components/editorial-shell.module.css";

const rooms = [
  {
    number: "01",
    name: "The Red Room",
    capacity: "8—14 GUESTS",
    description: "A low-lit room behind the bar for dinners that begin quietly and loosen with the bottle.",
    image: "/images/velvet/noir.jpg",
  },
  {
    number: "02",
    name: "The Cellar",
    capacity: "16—28 GUESTS",
    description: "Below the noise, a long table, old records and a private pour chosen for the night.",
    image: "/images/velvet/after-dark.jpg",
  },
  {
    number: "03",
    name: "The Salon",
    capacity: "30—50 GUESTS",
    description: "The whole room after hours. Dinner becomes a party without anyone having to leave.",
    image: "/images/velvet/velvet.jpg",
  },
];

export default function PrivateDiningPage() {
  return (
    <EditorialShell
      section="01"
      eyebrow="Private Dining"
      variant="silence"
      heroImage="/images/velvet/noir.jpg"
      title={<>Private<br /><em>Dining.</em></>}
      intro="Intimate dinners, private celebrations and nights that do not belong to everyone."
    >
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>02 / BEHIND THE ROOM</span>
          <div>
            <h2>A night<br /><em>of your own.</em></h2>
            <p>There is another side to VELVET HOUR. A room reserved for the people at your table, the music you choose and the kind of evening that is better kept between friends.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>03 / PRIVATE SPACES</span>
          <div>
            <h2>Choose<br /><em>the room.</em></h2>
            <p>Each space has its own temperature. Tell us what the night needs and we will make the room around it.</p>
          </div>
        </div>
        <div className={styles.ruleGrid}>
          {rooms.map((room) => (
            <article className={styles.ruleCell} key={room.name}>
              <span>{room.number} / {room.capacity}</span>
              <h3>{room.name}</h3>
              <p>{room.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.imageBand}>
          <div className={styles.imageBandMedia}>
            <Image src="/images/velvet/gallery-01.jpg" alt="A private night at Velvet Hour" fill sizes="(max-width: 760px) 100vw, 60vw" />
          </div>
          <div className={styles.imageBandCopy}>
            <div>
              <span className={styles.sectionLabel}>04 / THE ATMOSPHERE</span>
              <h3>Keep the<br /><em>night close.</em></h3>
            </div>
            <p>Long tables, low light, a soundtrack that moves with the room. We look after the details so you can stay inside the evening.</p>
            <div className={styles.meta}><span>FOOD / WINE / MUSIC</span><span>LONDON / SOHO</span></div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>05 / OCCASIONS</span>
          <div>
            <h2>For the<br /><em>right reason.</em></h2>
            <p>Birthdays after midnight. A dinner before the show. The team that deserves a better table. Or no reason at all.</p>
          </div>
        </div>
        <div className={styles.ruleGrid}>
          {[
            ["01", "The long dinner", "A considered menu, generous pours and time left open at the end."],
            ["02", "The celebration", "A room with a little more volume and a reason to stay for one more."],
            ["03", "The after hours", "A private gathering that starts when the restaurant starts to change."],
          ].map(([number, title, copy]) => (
            <article className={styles.ruleCell} key={number}>
              <span>{number}</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.statement}>
        <div className={styles.statementInner}>
          <span className={styles.sectionLabel}>06 / PRIVATE DINING ENQUIRY</span>
          <h2>Make the room<br /><em>yours.</em></h2>
          <p>Tell us the date, the occasion and how late you would like to stay. We will come back with the right room.</p>
          <div className={styles.ctaRow}>
            <span>THE SECRET SIDE OF VELVET HOUR</span>
            <Link className={styles.cta} href="/reservations?type=private">START AN ENQUIRY <span className={styles.arrow} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </EditorialShell>
  );
}
