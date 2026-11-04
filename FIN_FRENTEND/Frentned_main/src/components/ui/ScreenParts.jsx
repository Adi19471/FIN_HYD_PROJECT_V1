import React from "react";
import { HeaderExportButtons } from "./DataTable";

/**
 * Building blocks of a working screen - the entry screens under Transactions
 * are made of these, so they share one look (styles: the "scr-" rules in
 * src/css/style.css) and follow the theme together.
 *
 *   ScreenHeader   what the screen is, one line on what it is for, its actions
 *   SectionCard    a titled card
 *   FactGrid/Fact  read-only details as label over value - not as input boxes,
 *                  so what can be typed in stands apart from what is only shown
 *   StatTile       one running figure (a count, a total)
 *   EmptyState     what to do when there is nothing to show yet
 */

// Download and Print sit at the end of every header's actions, for the
// screen's report (screenExport.jsx). `exports={false}` leaves them out.
export const ScreenHeader = ({ icon: Icon, title, subtitle, tone, exports = true, children }) => (
  <header className={`scr-head ${tone ? `scr-tone-${tone}` : ""}`}>
    {Icon && (
      <span className="scr-head-icon" aria-hidden="true">
        <Icon />
      </span>
    )}
    <div className="scr-head-text">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    <div className="scr-head-actions">
      {children}
      <HeaderExportButtons enabled={exports} />
    </div>
  </header>
);

export const SectionCard = ({ icon: Icon, title, hint, action, className = "", children }) => (
  <section className={`scr-card ${className}`}>
    {(title || action) && (
      <div className="scr-card-head">
        {Icon && (
          <span className="scr-card-icon" aria-hidden="true">
            <Icon />
          </span>
        )}
        <div className="scr-card-heading">
          <h2>{title}</h2>
          {hint && <p>{hint}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

export const FactGrid = ({ children }) => <dl className="scr-facts">{children}</dl>;

export const Fact = ({ label, value }) => (
  <div className="scr-fact">
    <dt>{label}</dt>
    <dd>{value === undefined || value === null || value === "" ? "-" : value}</dd>
  </div>
);

export const StatTile = ({ label, value, tone }) => (
  <div className={`scr-stat ${tone ? `scr-tone-${tone}` : ""}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export const EmptyState = ({ icon: Icon, title, children }) => (
  <div className="scr-empty">
    {Icon && (
      <span className="scr-empty-icon" aria-hidden="true">
        <Icon />
      </span>
    )}
    <strong>{title}</strong>
    {children && <p>{children}</p>}
  </div>
);
