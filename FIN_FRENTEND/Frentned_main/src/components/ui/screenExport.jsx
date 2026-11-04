import React from "react";

/**
 * Screen export - puts Download and Print in every screen's header.
 *
 * A screen's report (its main DataTable, or what a custom screen hands over
 * with useScreenExport) is registered here; the screen header (ScreenHeader /
 * ReportToolbar with a title / PageHeader with a title) shows Download + Print
 * for it. The table then drops its own copy, so each screen has exactly one
 * Download and one Print, always in the same place.
 *
 * Which report the header prints: whatever a screen registered itself
 * (priority "screen") wins; otherwise the first table on the screen.
 * Without the provider (a dialog outside the app shell, a preview page)
 * nothing registers and every table keeps its own buttons.
 */

const ScreenExportContext = React.createContext(null);

function createStore() {
  const entries = new Map();
  const listeners = new Set();
  let headers = 0;
  let snapshot = { primaryId: null, primary: null, hasHeader: false };

  const publish = () => {
    let primaryId = null;
    let primary = null;
    for (const [id, payload] of entries) {
      if (payload.priority === "screen") {
        primaryId = id;
        primary = payload;
        break;
      }
    }
    if (!primary) {
      const first = entries.entries().next().value;
      if (first) [primaryId, primary] = first;
    }
    snapshot = { primaryId, primary, hasHeader: headers > 0 };
    listeners.forEach((listener) => listener());
  };

  return {
    // Map.set keeps an existing id where it was, so a table that refreshes its
    // rows does not lose its place to one further down the screen.
    set(id, payload) {
      entries.set(id, payload);
      publish();
    },
    remove(id) {
      if (entries.delete(id)) publish();
    },
    addHeader() {
      headers += 1;
      publish();
      return () => {
        headers -= 1;
        publish();
      };
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
  };
}

export function ScreenExportProvider({ children }) {
  const [store] = React.useState(createStore);
  return <ScreenExportContext.Provider value={store}>{children}</ScreenExportContext.Provider>;
}

const NO_SNAPSHOT = { primaryId: null, primary: null, hasHeader: false };
const noop = () => () => {};

/** The report the header should offer, re-rendering when it changes. */
export function useScreenExportSnapshot() {
  const store = React.useContext(ScreenExportContext);
  return React.useSyncExternalStore(
    store ? store.subscribe : noop,
    store ? store.getSnapshot : () => NO_SNAPSHOT
  );
}

/** Marks a header as present while it is mounted (and offering exports). */
export function useExportHeader(enabled = true) {
  const store = React.useContext(ScreenExportContext);
  React.useEffect(() => (store && enabled ? store.addHeader() : undefined), [store, enabled]);
  return Boolean(store && enabled);
}

/**
 * Register what this screen downloads / prints.
 *
 * @param {object|null} payload { rows, columns, fileName, reportOptions } -
 *   the same arguments TableExportMenu / printReport take. null unregisters.
 * @param {object} options { priority: "screen" | "table" }
 * @returns {boolean} true while the screen header is showing this report's
 *   Download / Print - the caller then leaves its own buttons out.
 */
export function useScreenExport(payload, { priority = "screen" } = {}) {
  const store = React.useContext(ScreenExportContext);
  const id = React.useId();

  React.useEffect(() => {
    if (!store) return;
    if (payload) store.set(id, { ...payload, priority });
    else store.remove(id);
  });

  React.useEffect(() => () => store?.remove(id), [store, id]);

  // Only a yes/no is read here, so a screen does not re-render every time
  // some report on it refreshes.
  return React.useSyncExternalStore(
    store ? store.subscribe : noop,
    () => {
      if (!store) return false;
      const snapshot = store.getSnapshot();
      return snapshot.hasHeader && snapshot.primaryId === id;
    }
  );
}
