/* MortgagePage.ca: featured rates shown on the home page.
   To update: change the rate (a number such as 4.44, or null to show a dash), the lender name,
   the logo file (put logo images in assets/lenders/) and the Inquire link, then set "updated"
   to the date and time of the update (Eastern time, ISO format). */
window.MP_RATES = {
  updated: null,   // e.g. "2026-11-23T10:30:00-05:00"
  prime: 4.70,     // Canadian prime rate, shown above the rates table and used for the HELOC rate
  fixed: [
    { term: "6-month",  rate: null, lender: "", logo: "", inquire: "" },
    { term: "2-year",   rate: null, lender: "", logo: "", inquire: "" },
    { term: "3-year",   rate: null, lender: "", logo: "", inquire: "" },
    { term: "4-year",   rate: null, lender: "", logo: "", inquire: "" },
    { term: "5-year",   rate: null, lender: "", logo: "", inquire: "" },
    { term: "7-year",   rate: null, lender: "", logo: "", inquire: "" },
    { term: "10-year",  rate: null, lender: "", logo: "", inquire: "" }
  ],
  variable: [
    { term: "3-year",   rate: null, lender: "", logo: "", inquire: "" },
    { term: "5-year",   rate: null, lender: "", logo: "", inquire: "" }
  ],
  // HELOC: shown as Prime + spread (e.g. 0.50 means Prime + 0.50%). Set "rate" to a number to override.
  heloc: { spread: 0.50, rate: null, lender: "", logo: "", inquire: "" }
};
