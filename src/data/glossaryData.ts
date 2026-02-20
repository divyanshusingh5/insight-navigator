export interface SqlPattern {
  id: string;
  label: string;
  query: string;
}

export interface ChangelogEntry {
  id: string;
  timestamp: string;
  field: string;
  oldValue: string;
  newValue: string;
  user: string;
}

export interface GlossaryMetric {
  id: string;
  name: string;
  description: string;
  category: string;
  dataset: string;
  synonyms: string[];
  sqlPatterns: SqlPattern[];
  sampleQuestion: string;
  relatedMetricIds: string[];
  changelog: ChangelogEntry[];
}

export const CATEGORIES = [
  "All",
  "Calculated",
  "Core Entity",
  "Customer",
  "Financial",
  "Marketing",
  "Metric",
  "Product",
  "Segment",
  "Status",
  "Treatment Type",
] as const;

export const DATASETS = [
  "All Datasets",
  "Sales",
  "Marketing",
  "Finance",
  "Operations",
  "Customer",
  "Product",
] as const;

export const SAMPLE_METRICS: GlossaryMetric[] = [
  {
    id: "1",
    name: "Invoice",
    description: "A bill or financial record for services provided during a patient visit",
    category: "Financial",
    dataset: "Finance",
    synonyms: ["Bill", "Statement", "Charge"],
    sqlPatterns: [
      { id: "s1", label: "Total Invoices", query: "SELECT COUNT(*) FROM invoices WHERE status = 'active'" },
      { id: "s2", label: "Unpaid Invoices", query: "SELECT * FROM invoices WHERE paid = false" },
    ],
    sampleQuestion: "Show me all unpaid invoices",
    relatedMetricIds: ["3", "12"],
    changelog: [
      { id: "c1", timestamp: "2025-12-15T10:30:00Z", field: "description", oldValue: "A financial record", newValue: "A bill or financial record for services provided during a patient visit", user: "Admin" },
    ],
  },
  {
    id: "2",
    name: "GMV",
    description: "Gross Merchandise Value - total value of merchandise sold",
    category: "Financial",
    dataset: "Sales",
    synonyms: ["gross sales", "gross revenue"],
    sqlPatterns: [
      { id: "s3", label: "Monthly GMV", query: "SELECT SUM(amount) FROM orders GROUP BY month" },
    ],
    sampleQuestion: "What is the GMV for last month?",
    relatedMetricIds: ["3", "4"],
    changelog: [],
  },
  {
    id: "3",
    name: "Revenue",
    description: "Total money collected or billed for medical services",
    category: "Financial",
    dataset: "Finance",
    synonyms: ["Income", "Earnings", "Sales"],
    sqlPatterns: [
      { id: "s4", label: "Total Revenue", query: "SELECT SUM(revenue) FROM transactions" },
      { id: "s5", label: "Revenue by Region", query: "SELECT region, SUM(revenue) FROM transactions GROUP BY region" },
    ],
    sampleQuestion: "What's our total revenue?",
    relatedMetricIds: ["1", "2", "12", "11"],
    changelog: [
      { id: "c2", timestamp: "2026-01-10T14:00:00Z", field: "synonyms", oldValue: "Income, Earnings", newValue: "Income, Earnings, Sales", user: "Admin" },
    ],
  },
  {
    id: "4",
    name: "AOV",
    description: "Average Order Value - mean value per order",
    category: "Financial",
    dataset: "Sales",
    synonyms: ["average basket", "avg order"],
    sqlPatterns: [
      { id: "s6", label: "AOV Calculation", query: "SELECT AVG(order_total) FROM orders" },
    ],
    sampleQuestion: "Show AOV trend by month",
    relatedMetricIds: ["2", "3"],
    changelog: [],
  },
  {
    id: "5",
    name: "CAC",
    description: "Customer Acquisition Cost - total cost to acquire a new customer",
    category: "Marketing",
    dataset: "Marketing",
    synonyms: ["acquisition cost", "cost per customer"],
    sqlPatterns: [
      { id: "s7", label: "CAC by Channel", query: "SELECT channel, SUM(spend)/COUNT(new_customers) FROM marketing GROUP BY channel" },
    ],
    sampleQuestion: "What is our CAC by channel?",
    relatedMetricIds: ["6", "8"],
    changelog: [],
  },
  {
    id: "6",
    name: "LTV",
    description: "Lifetime Value - predicted net profit from entire customer relationship",
    category: "Customer",
    dataset: "Customer",
    synonyms: ["CLV", "customer lifetime value", "lifetime revenue"],
    sqlPatterns: [
      { id: "s8", label: "Average LTV", query: "SELECT AVG(lifetime_value) FROM customers" },
    ],
    sampleQuestion: "What is the average customer LTV?",
    relatedMetricIds: ["5", "7", "3"],
    changelog: [],
  },
  {
    id: "7",
    name: "Churn Rate",
    description: "Percentage of customers who stop using the service in a given period",
    category: "Customer",
    dataset: "Customer",
    synonyms: ["attrition rate", "customer loss rate"],
    sqlPatterns: [
      { id: "s9", label: "Monthly Churn", query: "SELECT month, churned/total AS churn_rate FROM customer_stats" },
    ],
    sampleQuestion: "What is our monthly churn rate?",
    relatedMetricIds: ["6", "10"],
    changelog: [],
  },
  {
    id: "8",
    name: "Conversion Rate",
    description: "Percentage of visitors who complete a desired action",
    category: "Marketing",
    dataset: "Marketing",
    synonyms: ["CVR", "conversion percentage"],
    sqlPatterns: [
      { id: "s10", label: "Overall CVR", query: "SELECT conversions/visits AS cvr FROM funnel_data" },
    ],
    sampleQuestion: "What is our conversion rate this quarter?",
    relatedMetricIds: ["5", "9"],
    changelog: [],
  },
  {
    id: "9",
    name: "DAU",
    description: "Daily Active Users - unique users engaging with the product daily",
    category: "Product",
    dataset: "Product",
    synonyms: ["daily users", "active users"],
    sqlPatterns: [
      { id: "s11", label: "DAU Trend", query: "SELECT date, COUNT(DISTINCT user_id) FROM events GROUP BY date" },
    ],
    sampleQuestion: "Show DAU for the past 30 days",
    relatedMetricIds: ["8", "11"],
    changelog: [],
  },
  {
    id: "10",
    name: "NPS",
    description: "Net Promoter Score - measures customer loyalty and satisfaction",
    category: "Customer",
    dataset: "Customer",
    synonyms: ["promoter score", "satisfaction score"],
    sqlPatterns: [
      { id: "s12", label: "Current NPS", query: "SELECT (promoters - detractors) / total * 100 FROM surveys" },
    ],
    sampleQuestion: "What is our current NPS?",
    relatedMetricIds: ["7", "6"],
    changelog: [],
  },
  {
    id: "11",
    name: "ARPU",
    description: "Average Revenue Per User - mean revenue generated per active user",
    category: "Metric",
    dataset: "Finance",
    synonyms: ["revenue per user", "per-user revenue"],
    sqlPatterns: [
      { id: "s13", label: "Monthly ARPU", query: "SELECT month, SUM(revenue)/COUNT(DISTINCT user_id) FROM transactions GROUP BY month" },
    ],
    sampleQuestion: "What is ARPU this month?",
    relatedMetricIds: ["3", "9"],
    changelog: [],
  },
  {
    id: "12",
    name: "MRR",
    description: "Monthly Recurring Revenue - predictable revenue earned each month",
    category: "Financial",
    dataset: "Finance",
    synonyms: ["monthly revenue", "recurring revenue"],
    sqlPatterns: [
      { id: "s14", label: "MRR Growth", query: "SELECT month, SUM(subscription_amount) FROM subscriptions WHERE active = true GROUP BY month" },
    ],
    sampleQuestion: "What is our MRR trend?",
    relatedMetricIds: ["3", "1"],
    changelog: [],
  },
];
