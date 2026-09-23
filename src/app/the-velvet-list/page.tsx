import Link from "next/link";
import EditorialShell from "../components/EditorialShell";
import styles from "../components/editorial-shell.module.css";

const privileges = [
  ["01", "Priority tables", "A better chance of the table you wanted, especially when the hour gets late."],
  ["02", "Private invitations", "First word on dinners, listening sessions and nights that do not make the public calendar."],
  ["03", "The next visit", "A place to keep the nights you are coming back for, with the room already expecting you."],
];

export default function VelvetListPage() {
  return (
    <EditorialShell
      section="01"
      eyebrow="The Velvet List"
      variant="secret"
      heroImage="/images/velvet/after-dark.jpg"
      title={<>The<br /><em>Velvet List.</em></>}
      intro="For those who stay after midnight."
    >
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>02 / AN INVITATION</span>
          <div><h2>Not an account.<br /><em>A place to return.</em></h2><p>The Velvet List is a quiet line into the room. No dashboard, no points, no noise. Just better access to the nights worth making time for.</p></div>
        </div>
        <div className={styles.ruleGrid}>
          {privileges.map(([number, title, copy]) => <article className={styles.ruleCell} key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>
      <section className={styles.statement}>
        <div className={styles.statementInner}><span className={styles.sectionLabel}>03 / AFTER HOURS</span><h2>Leave your<br /><em>name at the door.</em></h2><p>Join the list for occasional notes from the room: new dates, private dinners and the nights that are better shared first.</p><div className={styles.ctaRow}><span>VELVET HOUR / SOHO</span><Link href="mailto:hello@velvethour.london" className={styles.cta}>REQUEST AN INVITATION <span className={styles.arrow} aria-hidden="true" /></Link></div></div>
      </section>
      <section className={styles.section}><div className={styles.imageBand}><div className={styles.imageBandCopy}><div><span className={styles.sectionLabel}>04 / MEMBERS ONLY</span><h3>Somewhere<br /><em>after dinner.</em></h3></div><p>The room changes when the list starts to arrive. Come for the table. Stay because someone knows your name.</p><div className={styles.meta}><span>PRIVATE NIGHTS</span><span>NO FIXED ENDING</span></div></div><div className={styles.imageBandMedia}><div style={{ height: "100%", background: "linear-gradient(135deg, #240b11, #8e2634 50%, #10090b)" }} /></div></div></section>
    </EditorialShell>
  );
}
