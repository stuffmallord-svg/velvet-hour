"use client";

import { FormEvent, useState } from "react";
import EditorialShell from "../components/EditorialShell";
import styles from "../components/editorial-shell.module.css";

const values = ["£100", "£250", "£500", "CUSTOM"];

export default function GiftCardsPage() {
  const [value, setValue] = useState("£250");
  const [sent, setSent] = useState(false);
  const [recipient, setRecipient] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <EditorialShell
      section="01"
      eyebrow="Gift Cards"
      variant="object"
      heroImage="/images/velvet/gallery-02.jpg"
      title={<>Give<br /><em>the night.</em></>}
      intro="A table, a bottle, a late one. Give someone an evening with no fixed ending."
    >
      <section className={styles.section}>
        {sent ? (
          <div className={styles.confirmation}>
            <span className={styles.sectionLabel}>02 / READY TO SEND</span>
            <h2>The night<br /><em>is theirs.</em></h2>
            <p>Your {value} gift for {recipient || "someone special"} is ready to be arranged. This is a frontend preview; payment and delivery will connect here later.</p>
            <button type="button" className={styles.cta} onClick={() => setSent(false)}>MAKE ANOTHER GIFT <span className={styles.arrow} aria-hidden="true" /></button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>02 / CHOOSE THE MOMENT</span>
              <div><h2>Send<br /><em>something good.</em></h2><p>Choose the value, leave a note and decide when the night should arrive.</p></div>
            </div>
            <div className={styles.ruleGrid}>
              {values.map((item) => <button type="button" key={item} className={styles.ruleCell} onClick={() => setValue(item)} aria-pressed={value === item}><span>{value === item ? "SELECTED" : "GIFT VALUE"}</span><h3>{item}</h3><p>{item === "CUSTOM" ? "Choose your own amount for a night worth remembering." : "For food, drinks and the hours after."}</p></button>)}
            </div>
            <div className={styles.fieldGrid} style={{ marginTop: 70 }}>
              <div className={styles.field}><label htmlFor="recipient">Recipient</label><input id="recipient" required placeholder="Their name" value={recipient} onChange={(event) => setRecipient(event.target.value)} /></div>
              <div className={styles.field}><label htmlFor="sender">From</label><input id="sender" required placeholder="Your name" /></div>
              <div className={`${styles.field} ${styles.full}`}><label htmlFor="message">Message</label><textarea id="message" placeholder="A few words for the evening" /></div>
              <div className={styles.field}><label htmlFor="delivery">Delivery date</label><input id="delivery" type="date" required /></div>
              <div className={styles.field}><label htmlFor="deliveryEmail">Delivery email</label><input id="deliveryEmail" type="email" required placeholder="you@example.com" /></div>
            </div>
            <div className={styles.formFooter}><span>Gift cards are currently a concept experience. No payment is taken.</span><button type="submit" className={styles.cta}>GIFT THE NIGHT <span className={styles.arrow} aria-hidden="true" /></button></div>
          </form>
        )}
      </section>
      <section className={styles.statement}><div className={styles.statementInner}><span className={styles.sectionLabel}>03 / A GOOD EXCUSE</span><h2>Some nights<br /><em>are better given.</em></h2></div></section>
    </EditorialShell>
  );
}
